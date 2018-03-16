const path = require('path')

module.exports = {
  entry: {
    'index.html': './frontend/src/main.js',
    'room.html': './frontend/src/room.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'frontend/dist')
  }
}
