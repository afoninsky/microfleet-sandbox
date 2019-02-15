const { ActionTransport } = require('@microfleet/core')

async function handler() {
  console.log(123)
  // console.log(...arguments)
  return {
    qwe: 'asd'
  }
}

handler.transports = [ActionTransport.http]
handler.transportOptions = {
  [ActionTransport.http]: {
    methods: ['get']
  }
}
handler.schema = 'echo'

module.exports = handler
