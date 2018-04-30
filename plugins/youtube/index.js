let post

module.exports = {
  name: 'YouTube',
  author: 'Scriptim',
  description: 'Display some information about "The Morpheus Tutorials" YouTube Channel',
  interval: 300,
  setup: (api, logger) => {
    const postId = '8g2uyv'
    logger.debug('Getting submission by id ' + postId)
    post = api.reddit.getSubmission(postId)
  },
  run: (api, logger) => {
    
  }
}
