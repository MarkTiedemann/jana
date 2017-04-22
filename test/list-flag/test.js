const { exec } = require('child_process')
const test = require('ava').cb
const { bin, trimLines } = require('../helpers')

test(assert => {
  exec(`node ${bin} --list --no-update-notifier`, { cwd: __dirname }, (err, stdout, stderr) => {
    assert.falsy(err)
    const [a, b] = trimLines(stdout)
    assert.is(a, 'a: 1')
    assert.is(b, 'b: 2')
    assert.end()
  })
})
