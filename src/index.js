const { Microfleet, ActionTransport } = require('@microfleet/core')

const config = require('config').util.toObject()

class TraceService extends Microfleet {
  constructor() {
    config.router.routes.transports = [ActionTransport.http]
    super(config)
  }
}

module.exports = TraceService
