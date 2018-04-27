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
