const path = require('path')

const bin = path.join(__dirname, '..', 'bin')

const trimLines = stdout =>
  stdout.trim().split('\n').map(line => line.trim())

module.exports = { bin, trimLines }
