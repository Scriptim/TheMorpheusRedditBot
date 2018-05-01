let post
const channelId = 'UCLGY6_j7kZfA1dmmjR1J_7w'

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
    logger.debug('Requesting statistics')
    api.youtube.channels.list({
      part: 'statistics',
      id: channelId,
      maxResults: 1
    }, (err, res) => {
      if (err) {
        logger.error(err)
        return
      }

      if (res) {
        logger.debug('Received response with status code ' + res.status)
      } else {
        logger.error(new Error('No response received'))
        return
      }

      const channel = res.data.items[0]

      let text = ''

      // statistics
      const stats = channel.statistics
      text += '# Statistiken\n'
      text += '**' + stats.subscriberCount + '** Abonnenten  \n'
      text += '**' + stats.viewCount + '** Views  \n'
      text += '**' + stats.videoCount + '** Videos\n\n'

      logger.debug('Editing post')
      post.edit(text)
    })
  }
}
