/**
 * Checks grpc proxy gateway
 */
const config = require('config').get('tests')
const assert = require('assert')
const path = require('path')
const grpc = require('@grpc/grpc-js')

const { loadDefinitions } = require('./fixtures/helpers')

describe('check if grpc proxy service is available', () => {
  const def = loadDefinitions({
    health: path.resolve(__dirname, 'fixtures/health.proto')
  })
  const healthClient = new def.health.grpc.health.v1.Health(
    `${config.hosts.proxy}:${config.securePort}`,
    grpc.credentials.createSsl()
  )

  it('health check', done => {
    healthClient.Check({}, (err, res) => {
      assert.equal(res.status, 1, 'expects health to return SERVING status')
      done(err)
    })
  })
})
