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

  }
}
