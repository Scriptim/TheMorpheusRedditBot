const request = require('request')
let post

function prepenPlusIfPositive(percentage) {
  // prepends '+' if percentage is not negative
  if (percentage[0] !== '-') {
    percentage = '+' + percentage
  }
  return percentage
}

module.exports = {
  name: 'Coinmarketcap',
  author: 'Scriptim',
  description: 'Update a post with the current market cap of several crypto currencies',
  interval: 3600,
  setup: (api, logger) => {
    const postId = '8fugur'
    logger.debug('Getting submission by id ' + postId)
    post = api.reddit.getSubmission(postId)
  },
  run: (api, logger) => {
    logger.debug('Requesting comments')
    // Receive top 50 cryptocurrency market capitalizations
    request('https://api.coinmarketcap.com/v1/ticker/?limit=50&convert=EUR', (err, res, body) => {
      if (err) {
        logger.error(err)
      }

      if (res) {
        logger.debug('Received response with status code ' + res.statusCode)
      } else {
        logger.error(new Error('No response received'))
        return
      }

      const coins = JSON.parse(body)
      const coinStrings = []
      for (let coin of coins) {
        let coinString = ''
        coinString += coin.rank + '. '
        coinString += '**' + coin.name + '** (' + coin.symbol + ')  \n'
        coinString += '**' + coin.price_eur + '&euro;** '
        coinString += '(' + prepenPlusIfPositive(coin.percent_change_1h) + '%/Stunde, '
        coinString += prepenPlusIfPositive(coin.percent_change_24h) + '%/Tag, '
        coinString += prepenPlusIfPositive(coin.percent_change_7d) + '%/Woche)'

        coinStrings.push(coinString)
      }

      logger.debug('Editing post')
      post.edit(coinStrings.join('\n'))
    })
  }
}
