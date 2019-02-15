const { ActionTransport } = require('@microfleet/core')

async function handler() {
  console.log(...arguments)
}

handler.transports = [ActionTransport]
handler.schema = 'echo'

module.exports = handler
