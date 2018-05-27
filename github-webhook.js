const http = require('http')
const githubWebhookHandler = require('github-webhook-handler')

function start(secret, port, logger) {
  logger.debug('Creating handler')
  const handler = githubWebhookHandler({
    path: '/themorpheusredditbot',
    secret: secret
  })
  
  logger.debug('Listening on port ' + port)
  http.createServer((req, res) => {
    logger.debug('Received request')
    handler(req, res, err => {
      if (err) {
        res.statusCode = 400
        logger.error(err)
      }
      res.end()
    })
  }).listen(port)
  
  handler.on('error', err => {
    logger.error(err)
  })
  
  handler.on('push', event => {
    logger.debug('Received push event from GitHub')
  })
}
module.exports = start
