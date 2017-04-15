const { exec } = require('child_process')
const test = require('ava').cb
const { bin } = require('../helpers')

test(assert => {
  exec(`node ${bin}`, { cwd: __dirname }, (err, stdout, stderr) => {
    assert.falsy(err)
    assert.is(stderr.trim(), '[warn] no scripts found in package.json')
    assert.end()
  })
})
