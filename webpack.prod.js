const { merge } = require('webpack-merge');

const base = require('./webpack.config.js');

const webpack = require('webpack');

// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 打包内容分析
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = merge(base, {
  mode: 'production',

  plugins: [

    new CssMinimizerPlugin,

    new webpack.DefinePlugin({
      DEV: JSON.stringify('production')
    }),

    new BundleAnalyzerPlugin({
      analyzerHost: '127.0.0.1',
      analyzerPort: '8888'
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          priority: 2,
          minChunks: 2
        },
        common: {
          test: /.js$/,
          name: 'common',
          chunks: 'initial',
          priority: 1,
          minChunks: 2
        }
      }
    },
    minimizer: [
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            // 是否保留代码中的注释
            comments: false,
            // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: false,
            reduce_vars: true
          }
        }
      })
    ]
  },

});
