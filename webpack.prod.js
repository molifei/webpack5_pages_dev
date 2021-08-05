const { merge } = require('webpack-merge');

const base = require('./webpack.config.js');

const webpack = require('webpack');

// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',

  plugins: [

    new CssMinimizerPlugin,

    new webpack.DefinePlugin({
      DEV: JSON.stringify('production')
    })
  ]

});
