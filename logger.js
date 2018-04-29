const logToFile = true // set this to false to disable loggin to file

const log4js = require('log4js')
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: './themorpheusbot.log', flags: 'w' }
  },
  categories: {
    default: { appenders: logToFile ? ['console', 'file'] : ['console'], level: 'all' },
  }
})
module.exports = log4js

function handleSignal(signal) {
  log4js.getLogger().info('Received ' + signal)
  log4js.shutdown(process.exit.bind(137))
}

process.on('SIGHUP', handleSignal)
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
