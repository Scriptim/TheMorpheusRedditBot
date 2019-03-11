const log4js = require('./logger.js') // exports preconfigured log4js module
const logger = log4js.getLogger() // logger with default category

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
// prevent frequent use of getSubreddit()
reddit.subreddit = reddit.getSubreddit(credentials.REDDIT_SUBREDDIT)

const api = {} // api wrapper passed to setup() and run()
api.reddit = reddit

function loadYouTubeApi() {
  logger.debug('Creating youtube api object')
  const youtube = require('./api/youtube.js')
  youtube.getApi({
    id: credentials.YOUTUBE_ID,
    secret: credentials.YOUTUBE_SECRET
  }, log4js.getLogger('youtube'), youtubeService => {
    api.youtube = youtubeService
    logger.debug('Loading plugins')
    loadPlugins()
  })
}
loadYouTubeApi()

function loadPlugins() {
  const fs = require('fs')
  const path = require('path')
  const filepath = require('./filepath.js')

  logger.debug('Reading plugins directory')
  let items
  try {
    items = fs.readdirSync(filepath('plugins'))
  } catch (err) {
    logger.fatal(err) // bot does not work without plugins
    process.exit(1)
  }

  logger.debug('Loading plugins')
  let plugins = [] // will contain all successfully set up plugins
  for (let item of items) {
    let pluginEntry = filepath(path.join('plugins', item, 'index.js'))
    let plugin

    logger.debug('Loading plugin \'' + item + '\' from "' + pluginEntry + '"')
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
      // create logger with custom category for every plugin
      plugin.setup(api, log4js.getLogger(plugin.name))
    } catch (err) {
      logger.error(err)
      continue
    }

    plugins.push(plugin)
  }

  logger.debug('Starting run intervals')
  for (let plugin of plugins) {
    if (plugin.interval <= 0) {
      logger.debug('Not setting interval for \"' + plugin.name + '\"')
      continue
    }
    logger.debug('Setting interval for \'' + plugin.name + '\'')
    setInterval(() => {
      try {
        logger.debug('Running \'' + plugin.name + '\'')
        plugin.run(api, log4js.getLogger(plugin.name))
      } catch(err) {
        logger.error(err)
      }
    }, plugin.interval * 1000) // plugin.interval is in seconds
  }
}

// Uncomment to enable automatic updates (potential security risk):
// logger.debug('Starting webhook for GitHub')
// const githubWebhook = require('./github-webhook.js')
// githubWebhook(credentials.WEBHOOK_SECRET, 8080, log4js.getLogger('gh-webhook'))
