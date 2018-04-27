const fs = require('fs')
const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'))
module.exports = credentials
