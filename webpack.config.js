const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    scripts: './src'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.dist.js',
    publicPath: '/build',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }, {
      test: /\.css$/,
      exclude: /patterns/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    extensions: ['', '.js', '.css'],
    root: [path.join(__dirname, './src')]
  }
};
