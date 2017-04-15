const { exec } = require('child_process')
const test = require('ava').cb
const { bin, trimLines } = require('../helpers')

test('test with flag', assert => {
  exec(`node ${bin} --list --hooks`, { cwd: __dirname }, (err, stdout, stderr) => {
    assert.falsy(err)
    const [prea, a, posta] = trimLines(stdout)
    assert.is(prea, 'prea: 0')
    assert.is(a, 'a: 1')
    assert.is(posta, 'posta: 2')
    assert.end()
  })
})

test('test without flag', assert => {
  exec(`node ${bin} --list`, { cwd: __dirname }, (err, stdout, stderr) => {
    assert.falsy(err)
    const [a] = trimLines(stdout)
    assert.is(a, 'a: 1')
    assert.end()
  })
})
