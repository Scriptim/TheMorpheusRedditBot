const {google} = require('googleapis')

const fs = require('fs')

let logger
let config

module.exports = {
  getApi: (auth, loggerObj, callback) => {
    logger = loggerObj
    logger.debug('Reading youtube api configuration from "api/youtube.json"')
    try {
      config = JSON.parse(fs.readFileSync('./api/youtube.json'))
    } catch(err) {
      logger.error(err)
    }
    
    logger.info('Authorizing youtube api')
    authorize(auth, oauth2Client => {
      google.options({
        auth: oauth2Client
      })
      callback(google.youtube('v3'))
    })    
  }
}

function authorize(auth, callback) {
  logger.debug('Setting up OAuth2 client for youtube api')
  const oauth2Client = new google.auth.OAuth2(auth.id, auth.secret, config.REDIRECT)

  logger.debug('Reading youtube api token from "' + config.TOKEN_FILE + '"')
  let token
  try {
    token = fs.readFileSync(config.TOKEN_FILE, { encoding: 'utf-8' })
    token = JSON.parse(token)
    logger.debug('Got youtube api token from file')
    oauth2Client.setCredentials(token)
    callback(oauth2Client)
  } catch (err) {
    logger.error(err)
    token = retrieveToken(oauth2Client, token => {
      logger.debug('Got new youtube api token')
      oauth2Client.setCredentials(token)
      callback(oauth2Client)
    })
  }
}

function retrieveToken(auth, callback) {
  logger.info('Retrieving new youtube api token')
  authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope: config.SCOPES
  })
  logger.debug('Generated youtube api authUrl "' + authUrl + '"')

  logger.debug('Requesting youtube api code from user')
  console.log(authUrl)

  const code = require('readline-sync').question('Redirected to http://localhost?code=')
  logger.debug('User entered youtube api authorization code')

  logger.debug('Getting youtube api token from code')
  auth.getToken(code, (err, token) => {
    if (err) {
      logger.error(err)
    } else {
      logger.debug('Saving youtube api token to "' + config.TOKEN_FILE + '"')
      try {
        fs.writeFileSync(config.TOKEN_FILE, JSON.stringify(token), { encoding: 'utf-8' })
      } catch(err) {
        logger.error(err)
      }
      callback(token)
    }
  })
}
