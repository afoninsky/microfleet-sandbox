/**
 * Test route which triggers amqp handler and return its result
 */
const config = require('config')
const { ActionTransport } = require('@microfleet/core')

const { prefix } = config.router.routes

async function handler(request) {
  this.log.info('echo route triggered')
  // const route = `${prefix}.amqp`
  // // transportRequest.generateResponse('hello world')
  // const response = await this.amqp.publishAndWait(route, {
  //   some: 'data'
  // })
  // const route = 'mailer.predefined'
  // const response = await this.amqp.publishAndWait(route, {
  //   account: 'support@mail.streamlayer.io',
  //   email: {
  //     to: 'vkfont@gmail.com',
  //     from: 'test mailer <support@mail.streamlayer.io>',
  //     subject: 'test letter',
  //     text: 'somedata in the letter'
  //   }
  // })

  // return response

  return { some: 'data' }
}

handler.transports = [ActionTransport.http]
handler.readonly = true

module.exports = handler
