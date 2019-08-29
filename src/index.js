const { Microfleet, ActionTransport } = require('@microfleet/core')
const config = require('config').util.toObject()

const {
  default: metricObservability
} = require('@microfleet/core/lib/plugins/router/extensions/audit/metrics')

class TraceService extends Microfleet {
  constructor() {
    config.router.routes.transports = [ActionTransport.http, ActionTransport.amqp]

    config.router.extensions = {
      enabled: ['preRequest', 'postResponse'],
      register: [metricObservability()]
    }
    super(config)
  }
}

module.exports = TraceService
