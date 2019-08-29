const { ActionTransport } = require('@microfleet/core')

async function handler(request) {
  this.log.info('amqp route triggered')
  // const { transportRequest } = request
  // const response = transportRequest.generateResponse('hello world')

  // // const res = await this.amqp.publishAndWait(`${prefix}.generic.health`, {
  // //   some: 'data'
  // // })
  // // console.log(res)

  // // // log something including debug ids
  // const traces = {}
  // const log = this.log.child(traces)
  // log.info('hello world')

  // throw new Error('test')

  return { amqp: 'triggered' }
}

handler.transports = [ActionTransport.amqp]
handler.readonly = true

module.exports = handler
