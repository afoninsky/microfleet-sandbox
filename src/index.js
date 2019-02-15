const { Microfleet } = require('@microfleet/core')
const customConfig = require('config')

class TraceService extends Microfleet {
  constructor(defaultConfig = {}) {
    const config = Object.assign(defaultConfig, customConfig)
    super(config)
  }
}

module.exports = TraceService
