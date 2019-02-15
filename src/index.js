const { Microfleet, ActionTransport } = require('@microfleet/core')

const config = require('config').util.toObject()

class TraceService extends Microfleet {
  constructor() {
    config.router.routes.transports = [ActionTransport.http]
    // console.log('>>>')
    // console.log(config)
    // console.log('>>>')
    super(config)
  }
}

module.exports = TraceService
