const path = require('path');

const webpack = require('webpack');

const DllPlugin = webpack.DllPlugin;

module.exports = {
  // 打包的模块
  entry: {
    vendor: ['jquery', 'dayjs']
  },

  output: {
    // 打包输出的位置
    path: path.resolve(__dirname, 'public/vendor/'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },

  plugins: [
    new DllPlugin({
      path: path.resolve(__dirname, '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]

};
