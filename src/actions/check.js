const { ActionTransport } = require('@microfleet/core')
const { resolve, join } = require('path')
const Mocha = require('mocha')
const fs = require('fs')

// extract all @... unique keywords from the tests and its parents
function extractTags(suite, prevTags = []) {
  const currentTags = (suite.title || '').match(/@[a-z_-]+/gi) || []
  const tags = [...new Set([...prevTags, ...currentTags])]
  return suite.parent ? extractTags(suite.parent, tags) : tags
}

// http request trigger
async function httpTestsTrigger(request) {
  return {}
}

httpTestsTrigger.transports = [ActionTransport.http]

module.exports = httpTestsTrigger

// ++++++

performTests().then(console.log)

async function performTests() {
  const mocha = new Mocha({
    timeout: 10000,
    bail: false
  })

  const testDir = resolve(__dirname, '..', '..', 'test')
  fs.readdirSync(testDir)
    .filter(file => file.substr(-3) === '.js')
    .forEach(file => mocha.addFile(join(testDir, file)))

  return new Promise(resolve => mocha.reporter('json').run(resolve))
}
