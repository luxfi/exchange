
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./v4-sdk.cjs.production.min.js')
} else {
  module.exports = require('./v4-sdk.cjs.development.js')
}
