const path = require('path');

module.exports = {
  entry: './frontend/src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'frontend/dist')
  }
};
