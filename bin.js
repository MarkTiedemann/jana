#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')
const minimist = require('minimist')
const chalk = require('chalk')
const clear = require('cross-clear')
const inquirer = require('inquirer')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')

const flags = minimist(process.argv.slice(2), {
  alias: { help: 'h', version: 'v' }
})

const help = `
Usage:
  $ jana [options]

  --clear  clear the screen
  --hooks  show npm lifecycle hooks
  --list   only list scripts, don't prompt
  
  --help, -h
  --version, -v
`

if (flags.help) {
  console.log(help)
  process.exit(0)
}

if (flags.version) {
  console.log(pkg.version)
  process.exit(0)
}

// '--clear' flag: clears the screen
// this is disabled by default
if (flags.clear) {
  clear()
}

updateNotifier({ pkg }).notify()

try {
  var packageJson = require(path.join(process.cwd(), 'package.json'))
} catch (e) {
  console.error(chalk.red('[error]') + ' no package.json found')
  process.exit(1)
}

const exitNoScriptsFound = () => {
  console.warn(chalk.yellow('[warn]') + ' no scripts found in package.json')
  process.exit(0)
}

if (!packageJson.scripts) {
  exitNoScriptsFound()
}

let scripts = Object.entries(packageJson.scripts)

const isNoHook = ([script]) =>
  !script.startsWith('pre') && !script.startsWith('post')

// '--hooks' flag: show npm lifecyle hooks
// remove them by default
if (!flags.hooks) {
  scripts = scripts.filter(isNoHook)
}

if (scripts.length === 0) {
  exitNoScriptsFound()
}

const stringify = ([script, command]) =>
  isNoHook([script])
    ? `${chalk.cyan(script)}: ${command}`
    // as a distinction, print hooks in grey
    : chalk.grey(`${script}: ${command}`)

// '--list' flag: only list scripts, but don't prompt
// this flag is especially useful for testing
if (flags.list) {
  scripts.map(stringify).forEach(script => console.log(script))
  process.exit(0)
}

// finally prompt for which script to run
inquirer.prompt([{
  type: 'list',
  name: 'choice',
  message: 'Which script do you want to run?',
  choices: scripts.map(stringify)
}])
.then(({ choice }) => {
  const [script] = scripts.find(script => stringify(script) === choice)

  // workaround for 'spawn npm ENOENT' on windows
  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  // spawned npm child process inherits from this process
  // so stdin, stdout, and stderr are piped automatically
  const npmProc = spawn(npmBin, ['run', script], { stdio: 'inherit' })

  // exit with same exit code as npm child
  npmProc.on('close', process.exit)
})
