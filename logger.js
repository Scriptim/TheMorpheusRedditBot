const logToFile = false // set this to true to enable logging to file

const filepath = require('./filepath.js')
const log4js = require('log4js')
log4js.configure({
  appenders: {
    console: { type: 'console' }, // console.log()
    // flag 'w' to clear file if it already exists
    file: { type: 'file', filename: filepath('themorpheusbot.log'), flags: 'w' },
    errfile: { type: 'file', filename: filepath('themorpheusbot.error.log') },
    errfilter: { type: 'logLevelFilter', appender: 'errfile', level: 'error' }
  },
  categories: {
    default: { appenders: logToFile ?
      ['console', 'file', 'errfilter'] : ['console', 'errfilter'], level: 'all' },
  }
})
module.exports = log4js

// shutdown logger on exit to close all files etc.
function handleSignal(signal) {
  log4js.getLogger().info('Received ' + signal)
  log4js.shutdown(process.exit.bind(137))
}

process.on('SIGHUP', handleSignal)
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
