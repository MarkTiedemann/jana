const { exec } = require('child_process')
const test = require('ava').cb
const { bin } = require('../helpers')

test(assert => {
  exec(`node ${bin} --no-update-notifier`, { cwd: __dirname }, (err, stdout, stderr) => {
    assert.truthy(err)
    assert.is(stderr.trim(), '[error] no package.json found')
    assert.end()
  })
})
