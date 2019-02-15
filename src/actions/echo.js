const { ActionTransport } = require('@microfleet/core')

async function handler(request) {
  const { headers } = request
  // request.transportRequest - hapi request goes here
  console.log('incoming request, headers:')
  console.log(headers)
  return headers
}

handler.transports = [ActionTransport.http]

module.exports = handler
