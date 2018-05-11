const fs = require('fs')
const filepath = require('./filepath.js')
const credentials = JSON.parse(fs.readFileSync(filepath('credentials.json'), 'utf-8'))
module.exports = credentials
