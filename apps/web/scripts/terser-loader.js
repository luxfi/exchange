<<<<<<< HEAD
/* eslint-env node */

const { minify } = require('terser')

// eslint-disable-next-line max-params
=======
const { minify } = require('terser')

// oxlint-disable-next-line max-params
>>>>>>> upstream/main
module.exports = async function terserLoader(source, map, meta) {
  const callback = this.async()
  const options = this.getOptions()
  try {
    const data = await minify(source, options)
    const { code } = data || {}
    callback(null, code, map, meta)
  } catch (e) {
    callback(e)
  }
}
