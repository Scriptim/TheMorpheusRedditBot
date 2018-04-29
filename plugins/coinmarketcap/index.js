let post

module.exports = {
  name: 'Coinmarketcap',
  author: 'Scriptim',
  description: 'Update a post with the current market cap of several crypto currencies',
  interval: 60,
  setup: (api, logger) => {
    const postId = '8fugur'
    logger.debug('Getting submission by id ' + postId)
    post = api.reddit.getSubmission(postId)
  },
  run: (api, logger) => {
    
  }
}
