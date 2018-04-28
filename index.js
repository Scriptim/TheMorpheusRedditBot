const logger = require('./logger')

logger.debug('Loading credentials from "credentials.json"')
const credentials = require('./credentials.js')

const snoowrap = require('snoowrap')

logger.debug('Creating snoowrap reddit api wrapper object')
const reddit = new snoowrap({
  userAgent: credentials.REDDIT_USER_AGENT,
  clientId: credentials.REDDIT_ID,
  clientSecret: credentials.REDDIT_SECRET,
  username: credentials.REDDIT_USER,
  password: credentials.REDDIT_PASS
})

logger.debug('Getting subreddit')
const subreddit = reddit.getSubreddit(credentials.REDDIT_SUBREDDIT)

const api = {
  reddit: subreddit
}

const fs = require('fs')
const path = require('path')

logger.debug('Reading plugins directory')
let items
try {
  items = fs.readdirSync('./plugins')
} catch (err) {
  logger.fatal(err)
  process.exit(1)
}

logger.debug('Loading plugins')
let plugins = []
for (let item of items) {
  let pluginEntry = path.resolve(path.join('./plugins', item, 'index.js'))
  let plugin

  logger.debug('Loading plugin \'' + item + '\' from"' + pluginEntry + '"')
  try {
    plugin = require(pluginEntry)
    logger.info('Loaded plugin \'' + plugin.name
      + '\' by \'' + plugin.author
      + '\' [' + plugin.interval + ']')
  } catch (err) {
    logger.error(err)
    continue
  }

  logger.debug('Setting up \'' + plugin.name + '\'')
  try {
    plugin.setup(api, logger)
  } catch (err) {
    logger.error(err)
    continue
  }

  plugins.push(plugin)
}

logger.debug('Starting run intervals')
for (let plugin of plugins) {
  logger.debug('Setting interval for \'' + plugin.name + '\'')
  setInterval(() => {
    try {
      logger.debug('Running \'' + plugin.name + '\'')
      plugin.run(api, logger)
    } catch(err) {
      logger.error(err)
    }
  }, plugin.interval * 1000)
}
