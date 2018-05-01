let post
const channelId = 'UCLGY6_j7kZfA1dmmjR1J_7w'

function humanReadableDateDiff(timestamp) {
  // difference in seconds
  const diff = Math.floor((new Date() - new Date(timestamp)) / 1000)

  const units = {
    'Jahr': [31536000, 'e'],
    'Monat': [2592000, 'e'],
    'Tag': [86400, 'en'],
    'Stunde': [3600, 'n'],
    'Minute': [60, 'n']
  }

  for (let unit in units) {
    let n = Math.floor(diff / units[unit][0])
    if (n == 1) {
      return 'vor ' + n + ' ' + unit
    } else if (n > 1) {
      return 'vor ' + n + ' ' + unit + units[unit][1] // append plural letter(s)
    }
  }

  return 'gerade eben' // less than 1 minute
}

module.exports = {
  name: 'YouTube',
  author: 'Scriptim',
  description: 'Display some information about "The Morpheus Tutorials" YouTube Channel',
  interval: 100,
  setup: (api, logger) => {
    const postId = '8g2uyv'
    logger.debug('Getting submission by id ' + postId)
    post = api.reddit.getSubmission(postId)
  },
  run: (api, logger) => {
    let text = ''

    // searching for videos as youtube data api does not provide
    // a convenient way for getting most recent video
    logger.debug('Requesting search results')
    api.youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      maxResults: 1,
      order: 'date',
      type: 'video'
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

      const video = res.data.items[0]

      // most recent video
      text += '# Neuestes Video\n'
      text += '[**' + video.snippet.title + '**]'
      text += '(https://www.youtube.com/watch?v=' + video.id.videoId + ')  \n'
      text += '*' + humanReadableDateDiff(video.snippet.publishedAt) + '*  \n'
      text += '>' + video.snippet.description.replace(/\n/g, '  \n').split('\n').join('\n>')
      text += '\n'

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

        // statistics
        const stats = channel.statistics
        text += '# Statistiken\n'
        text += '**' + stats.subscriberCount + '** Abonnenten  \n'
        text += '**' + stats.viewCount + '** Views  \n'
        text += '**' + stats.videoCount + '** Videos\n\n'

        logger.debug('Editing post')
        post.edit(text)
      })
    })
  }
}
