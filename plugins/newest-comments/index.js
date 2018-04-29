const request = require('request')
let post

function humanReadableDateDiff(timestamp) {
  // difference in seconds
  const diff = Math.floor((new Date() - new Date(timestamp * 1000)) / 1000)

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
      return n + ' ' + unit
    } else if (n > 1) {
      return n + ' ' + unit + units[unit][1] // append plural letter(s)
    }
  }

  return 'gerade eben' // less than 1 minute
}

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
      const childStrings = []

      // format comments
      for (let child of comments.children) {
        child = child.data
        let childStr = ''
        childStr += '**[Kommentar](' + child.permalink + ')'
        childStr += ' von u/' + child.author
        childStr += ' unter [' + child.link_title + '](' + child.link_permalink + ')**'
        childStr += '  \n>' + child.body.replace(/\n/g, '\n>') + '  \n\n'
        // &#183; = middle dot for separation
        childStr += '**&nbsp;&#11137; ' + child.score + '&nbsp;&#183;&nbsp;' // up/down arrows
        childStr += 'vor ' + humanReadableDateDiff(child.created_utc) + '&nbsp;&#183;&nbsp;'
        childStr += child.edited ? '&#128393;&nbsp;&nbsp;' : '' // pencil
        childStr += child.stickied ? '&#128204;&nbsp;&nbsp;' : '' // pushpin
        childStr += child.approved ? '&#10003;&nbsp;&nbsp;' : '' // tick
        childStr += child.removed ? '&#128465;&nbsp;&nbsp;' : '' // wastebasket
        childStr += '**'

        childStrings.push(childStr)
      }

      const commentsString = childStrings.join('\n\n---\n\n')

      logger.debug('Editing post')
      post.edit(commentsString)
    })
  }
}
