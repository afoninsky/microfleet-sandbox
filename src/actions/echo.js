const { ActionTransport } = require('@microfleet/core')

const logHeaders = ['x-request-id', 'x-b3-traceid']

const proxyHeaders = [
  'x-request-id',
  'x-b3-traceid',
  'x-b3-spanid',
  'x-b3-parentspanid',
  'x-b3-sampled',
  'x-b3-flags',
  'x-ot-span-context'
]

async function handler(request) {
  const { headers, transportRequest } = request
  const response = transportRequest.generateResponse('hello world')

  // proxy headers request -> response
  proxyHeaders.forEach(headerName => {
    if (headerName in headers) {
      response.header(headerName, headers[headerName])
    }
  })

  // log something including debug ids
  const traces = {}
  logHeaders.forEach(headerName => {
    if (headerName in headers) {
      traces[headerName] = headers[headerName]
    }
  })
  const log = this.log.child(traces)
  log.info('hello world')

  return response
}

handler.transports = [ActionTransport.http]

module.exports = handler
