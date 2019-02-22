/**
 * Admin UI
 */
const config = require('config').get('tests')
const assert = require('assert')
const superagent = require('superagent')
const cheerio = require('cheerio')

const { createURL } = require('./fixtures/helpers')

describe('ensures dashboard is alive', () => {
  it.skip('tests redirect', async () => {
    const url = createURL(config.hosts.dashboard)
    const targetUrl = createURL(config.hosts.dashboard, { protocol: 'https:' })
    const res = await superagent
      .get(url.toString())
      .redirects(0)
      .ok(res => res.status == 301)
    assert.equal(res.headers.location, targetUrl)
  })

  it('validates page content', async () => {
    const url = createURL(config.hosts.dashboard, { protocol: 'https:' })
    const res = await superagent.get(url)
    const $ = cheerio.load(res.text)
    const title = $('title').text()
    assert.equal(title, 'StreamLayer Dashboard')
  })
})
