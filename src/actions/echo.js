const config = require('config')
const { ActionTransport } = require('@microfleet/core')

// const logHeaders = ['x-request-id', 'x-b3-traceid']

// const proxyHeaders = [
//   'x-request-id',
//   'x-b3-traceid',
//   'x-b3-spanid',
//   'x-b3-parentspanid',
//   'x-b3-sampled',
//   'x-b3-flags',
//   'x-ot-span-context'
// ]

const { prefix } = config.router.routes

async function handler(request) {
  const { transportRequest } = request
  const response = transportRequest.generateResponse('hello world')

  // const res = await this.amqp.publishAndWait(`${prefix}.generic.health`, {
  //   some: 'data'
  // })
  // console.log(res)

  // // log something including debug ids
  const traces = {}
  const log = this.log.child(traces)
  log.info('hello world')

  return response
}

handler.transports = [ActionTransport.http]

module.exports = handler
