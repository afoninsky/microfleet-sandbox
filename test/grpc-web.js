/**
 * Checks if grpc-web gateway is alive
 */
const config = require('config').get('tests')
const assert = require('assert')
const superagent = require('superagent')

const { createURL } = require('./fixtures/helpers')

describe('test liveness of grpc-web gateway', () => {
  it('pings open port', async () => {
    throw new Error('failed')
    const url = createURL(config.hosts.web, { protocol: 'https:' })
    const res = await superagent.get(url).ok(res => res.status == 500)
    assert.equal(res.text.trim(), 'gRPC requires HTTP/2')
  })
})
