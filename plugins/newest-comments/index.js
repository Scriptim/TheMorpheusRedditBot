const request = require('request')
let post

module.exports = {
  name: 'Newest Comments',
  author: 'Scriptim',
  description: 'Update a post containing the most recent comments on the subreddit',
  interval: 5,
  setup: (api, logger) => {
    const postId = '8ft5jv'
    logger.debug('Getting submission by id ' + postId)
    post = api.reddit.getSubmission(postId)
  },
  run: (api, logger) => {
    logger.debug('Requesting comments')
    // Receive the 10 most recent comments, no need for api request
    request('https://www.reddit.com/r/TheMorpheusTuts/comments.json?limit=10', (err, res, body) => {
      if (err) {
        logger.error(err)
      }

      if (res) {
        logger.debug('Received response with status code ' + res.statusCode)
      } else {
        logger.error(new Error('No response received'))
        return
      }

      const comments = JSON.parse(body).data
    })
  }
}
