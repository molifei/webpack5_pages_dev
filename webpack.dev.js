const path = require('path');

// 引入webpack-merge插件进行合并
const { merge } = require('webpack-merge');

// 引入webpack.config.js文件
const base = require('./webpack.config.js');

// 引入webpack
const webpack = require('webpack');

module.exports = merge(base, {
  // 模块参数
  mode: 'development',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    port: 2500,
    hot: true,
    hotOnly: true,
    open: true,
    inline: true,
  },
  // 启用source-map方便调试
  devtool: 'source-map',
  plugins: [
    // 定义全局变量
    new webpack.DefinePlugin({
      // 这里必须要解析成字符串进行判断，不然将会被识别为一个变量
      DEV: JSON.stringify('dev')
    })
  ]
});
