const assert = require('assert')
const { parse, subDays, isFuture } = require('date-fns')
const https = require('https')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

module.exports = {
  validateSSL,
  createURL,
  loadDefinitions,
  timeoutAsync,
  randomID,
  sendAndWait
}

function randomID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10)
}

/**
 * Load protofiles into definitions
 */
function loadDefinitions(map) {
  return Object.entries(map).reduce((acc, pair) => {
    const [name, path] = pair
    const definition = protoLoader.loadSync(path)
    acc[name] = grpc.loadPackageDefinition(definition)
    return acc
  }, {})
}

/**
 * Creates url from host name
 */
function createURL(host, params = {}) {
  const url = new URL(`http://${host}`)
  Object.assign(url, params)
  return url.toString()
}

/**
 * Ensures valid SSL is returned, and it wouldn't expire in the closes future
 */
async function validateSSL(host) {
  const url = createURL(host, { protocol: 'https:' })
  return new Promise((resolve, reject) => {
    const req = https
      .get(url, res => {
        assert(res.socket.authorized, 'valid tls certificate is expected')
        const certificate = res.socket.getPeerCertificate()

        // check expire date
        const expireDate = parse(certificate.valid_to)
        assert(isFuture(subDays(expireDate, 2)), 'certificate will end in 2 days')

        resolve(res)
      })
      .end()
    req.on('error', err => reject(err))
  })
}

/**
 * Resolves on timeout
 */
async function timeoutAsync(ms, data) {
  return new Promise(resolve => setTimeout(resolve, ms, data))
}

const validResponseStates = {
  default: 200,
  hi: 201,
  pub: 202
}

const append = (storage, key, value) => {
  storage[key] = storage[key] || []
  storage[key].push(value)
}

/**
 * sends message to established stream and wait for responsec either `rcvTimeoutMs` or `rcvMessagesQtt`
 *
 * `rcvMessagesQtt`:
 *  = null - ignore incoming mesages counter and exit on rcvTimeoutMs
 * = 1 (default) - exit on {ctrl} receive
 * > 1 - wait till N messages (including ctrl) will come
 *
 * returns object with received messages by type
 */
async function sendAndWait(stream, type, data, rcvMessagesQtt = 1, rcvTimeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    let messagesLeft = rcvMessagesQtt
    const id = data.id || randomID()
    const message = { [type]: { id, ...data } }
    const output = {}

    const onError = err => handleAnswer(err)
    const onData = data => {
      const [firstProp] = Object.entries(data)
      const [respType, response] = firstProp

      if (respType === 'ctrl') {
        if (response.id !== id) {
          // skip event as it does not belong to our request
          return
        }
        // handle response and throw on invalid one
        const expectedResponse = validResponseStates[type] || validResponseStates.default
        if (expectedResponse !== response.code) {
          return handleAnswer(
            new Error(response.text || `unknown error with code ${response.code}`)
          )
        }
        output.ctrl = response
      } else {
        // TODO: handle id of the meta too
        // push incoming event to returning array
        append(output, respType, response)
      }

      if (rcvMessagesQtt !== null && --messagesLeft <= 0) {
        handleAnswer()
      }
    }

    const handleAnswer = err => {
      clearTimeout(timer)
      stream.removeListener('error', onError)
      stream.removeListener('data', onData)

      // error is thrown
      if (err) {
        return reject(err)
      }
      return resolve(output)
    }
    stream.on('error', onError)
    stream.on('data', onData)
    const timer = setTimeout(handleAnswer, rcvTimeoutMs)

    // console.log('[>>>>')
    // console.log(JSON.stringify(message))
    // console.log('>>>>]')
    stream.write(message)
  })
}
