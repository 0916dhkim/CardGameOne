const path = require('path')

module.exports = {
  entry: {
    'index.html': './src/front/main.js',
    'room.html': './src/front/room.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
