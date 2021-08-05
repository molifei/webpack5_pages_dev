const merge = require('webpack-merge')
const common = require('./webpack.base')

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '/dist/index'),
    publicPath: "/",
    port: 2500,
    hot: true,
    open: true
  }
}
