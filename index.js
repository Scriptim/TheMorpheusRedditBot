const credentials = require('./credentials.js')

const snoowrap = require('snoowrap')

const reddit = new snoowrap({
  userAgent: credentials.REDDIT_USER_AGENT,
  clientId: credentials.REDDIT_ID,
  clientSecret: credentials.REDDIT_SECRET,
  username: credentials.REDDIT_USER,
  password: credentials.REDDIT_PASS
})

const subreddit = reddit.getSubreddit(credentials.REDDIT_SUBREDDIT)

const api = {
  reddit: subreddit
}

const fs = require('fs')
const path = require('path')

let items
try {
  items = fs.readdirSync('./plugins')
} catch (ex) {
  console.error('An error occured while reading the plugins directory')
  process.exit(1)
}

let plugins = []
for (let item of items) {
  let pluginEntry = path.resolve(path.join('./plugins', item, 'index.js'))
  let plugin

  try {
    plugin = require(pluginEntry)
    console.log('Loaded plugin \'' + plugin.name
      + '\' by \'' + plugin.author
      + '\' [' + plugin.interval + ']')
  } catch (err) {
    console.error('Could not load plugin from "' + pluginEntry + '"')
    continue
  }

  try {
    plugin.setup(api)
  } catch (err) {
    console.error('Setup failed for plugin \'' + plugin.name + '\'')
    continue
  }

  plugins.push(plugin)
}

for (let plugin of plugins) {
  setInterval(() => {
    try {
      plugin.run(api)
    } catch(ex) {
      console.error('An error occured while running \'' + plugin.name + '\'')
    }
  }, plugin.interval * 1000)
}
