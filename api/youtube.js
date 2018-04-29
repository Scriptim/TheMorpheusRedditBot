const {google} = require('googleapis')

const fs = require('fs')

let logger
let config // parsed youtube.json

module.exports = {
  getApi: (auth, loggerObj, callback) => {
    logger = loggerObj
    logger.debug('Reading configuration from "api/youtube.json"')
    try {
      config = JSON.parse(fs.readFileSync('./api/youtube.json'))
    } catch(err) {
      logger.error(err)
    }
    
    logger.info('Authorizing')
    authorize(auth, oauth2Client => {
      google.options({
        auth: oauth2Client // set global authorization client
      })
      callback(google.youtube('v3'))
    })    
  }
}

function authorize(auth, callback) {
  logger.debug('Setting up OAuth2 client')
  const oauth2Client = new google.auth.OAuth2(auth.id, auth.secret, config.REDIRECT)

  // read tokens from file if possible
  logger.debug('Reading token from "' + config.TOKEN_FILE + '"')
  let token
  try {
    token = fs.readFileSync(config.TOKEN_FILE, { encoding: 'utf-8' })
    token = JSON.parse(token)
    logger.debug('Got token from file')
    oauth2Client.setCredentials(token)
    callback(oauth2Client)
  } catch (err) {
    logger.error(err)
    token = retrieveToken(oauth2Client, token => {
      logger.debug('Got new token')
      oauth2Client.setCredentials(token)
      callback(oauth2Client)
    })
  }
}

// prompts user to enter code manually
function retrieveToken(auth, callback) {
  logger.info('Retrieving new token')
  authUrl = auth.generateAuthUrl({
    access_type: 'offline', // 'offline' to get refresh token
    scope: config.SCOPES // https://developers.google.com/identity/protocols/googlescopes
  })
  logger.debug('Generated authUrl "' + authUrl + '"')

  logger.debug('Requesting code from user')
  console.log(authUrl)
  // website will prompt user to log in using google account
  // and redirect to localhost with code as query parameter

  const code = require('readline-sync').question('Redirected to http://localhost?code=')
  logger.debug('User entered authorization code')

  logger.debug('Getting token from code')
  auth.getToken(code, (err, token) => { // asynchronous -> need of callback functions
    if (err) {
      logger.error(err)
    } else {
      logger.debug('Saving token to "' + config.TOKEN_FILE + '"')
      try {
        // save token for future uses
        fs.writeFileSync(config.TOKEN_FILE, JSON.stringify(token), { encoding: 'utf-8' })
      } catch(err) {
        logger.error(err)
      }
      callback(token)
    }
  })
}
