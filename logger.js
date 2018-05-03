const logToFile = true // set this to false to disable logging to file

const log4js = require('log4js')
log4js.configure({
  appenders: {
    console: { type: 'console' }, // console.log()
    // flag 'w' to clear file if it already exists
    file: { type: 'file', filename: './themorpheusbot.log', flags: 'w' },
    errfile: { type: 'file', filename: './themorpheusbot.error.log' },
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
