/**
 * Validates SSL certificates for various services
 */
const config = require('config').get('tests')

const { validateSSL } = require('./fixtures/helpers')

describe('check if SSL is valid and not expiring', () => {
  Object.values(config.hosts).forEach(host => {
    it(host, () => {
      return validateSSL(host)
    })
  })
})
