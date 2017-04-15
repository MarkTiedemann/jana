#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')
const minimist = require('minimist')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { version } = require('./package.json')

const flags = minimist(process.argv.slice(2), {
  alias: { help: 'h', version: 'v' }
})

const help = `
Usage:
  $ jana [options]

  --hooks  remove npm lifecycle hooks
  --list   only list scripts, don't prompt
  
  --help, -h
  --version, -v
`

if (flags.help) {
  console.log(help)
  process.exit(0)
}

if (flags.version) {
  console.log(version)
  process.exit(0)
}

try {
  var packageJson = require(path.join(process.cwd(), 'package.json'))
} catch (e) {
  console.error(chalk.red('[error]') + ' no package.json found')
  process.exit(1)
}

const scripts = packageJson.scripts

const exitNoScriptsFound = () => {
  console.error(chalk.yellow('[warn]') + ' no scripts found in package.json')
  process.exit(0)
}

if (!scripts) {
  exitNoScriptsFound()
}

// '--hooks' flag: remove npm lifecyle hooks
if (!flags.hooks) {
  Object.keys(scripts)
  .filter(key => key.startsWith('pre') || key.startsWith('post'))
  .forEach(key => delete scripts[key])
}

if (Object.keys(scripts).length === 0) {
  exitNoScriptsFound()
}

const stringify = ([script, command]) =>
  `${chalk.cyan(script)}: ${command}`

// '--list' flag: only list scripts, but don't prompt
// this flag is especially useful for testing
if (flags.list) {
  Object.entries(scripts).map(stringify)
  .forEach(script => console.log('  ' + script))
  process.exit(0)
}

// finally prompt for which script to run
inquirer.prompt([{
  type: 'list',
  name: 'choice',
  message: 'Which script do you want to run?',
  choices: Object.entries(scripts).map(stringify)
}])
.then(({ choice }) => {
  const [script] = Object.entries(scripts)
    .find(script => stringify(script) === choice)

  // workaround for 'spawn npm ENOENT' on windows
  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  // spawned npm child process inherits from this process
  // so stdin, stdout, and stderr are piped automatically
  const npmProc = spawn(npmBin, ['run', script], { stdio: 'inherit' })

  // exit with same exit code as npm child
  npmProc.on('close', process.exit)
})
