const path = require('path')

module.exports = relativePath => {
  return path.resolve(path.join(__dirname, relativePath))
}
