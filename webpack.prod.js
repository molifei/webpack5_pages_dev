const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

// html处理
const HtmlWebpackPlugin = require('html-webpack-plugin');

// css处理
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 拆分css
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 清除dist文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlPluginArray = [];

// html-webpack-plugin插件minify配置
const minifyConfig = {
  // 去除空格
  collapseWhitespace: true,
  // 去除注释
  removeComments: true,
  // 压缩文件内css
  minifyCSS: true,
  // 压缩文件内js
  minifyJS: true
};

const getEntry = () => {
  const entry = {};
  // src目录下所有的页面获取
  glob.sync('./src/pages/*/index.js')
    .forEach(item => {
      let name = item.match(/\/pages\/(.+)\/index.js/);
      name = name[1];
      entry[name] = item;

      // 添加htmlWebpackPlugin插件
      if (name === 'index') {
        htmlPluginArray.push(new HtmlWebpackPlugin({
          filename: './index.html',
          template: `./src/pages/${name}/index.html`,
          chunks: [name],
          minify: minifyConfig
        }));
      } else {
        htmlPluginArray.push(new HtmlWebpackPlugin({
          filename: `./pages/${name}/index.html`,
          template: `./src/pages/${name}/index.html`,
          chunks: [name],
          minify: minifyConfig
        }));
      }

    });

  return entry;
};

console.log(getEntry(), process);

module.exports = {
  mode: 'production',

  entry: getEntry(),

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name]_[chunkhash].min.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },

      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },

      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
          'less-loader'
        ]
      },

      // 图片
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2 * 1024,
              esModule: false,
              name: 'assets/img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        // 处理html文件中的img图片（负责引入img，从而能被url-loader进行处理）
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          esModule: false,
        }
      },

      // 媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },

      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          // limit: 10000,
          // 定义打包完成后最终导出的文件路径
          outputPath: 'assets/fonts/',
          // 文件的最终名称
          name: '[name].[hash:3].[ext]'
        }
      },

    ]
  },

  plugins: [
    ...htmlPluginArray,

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css'
    }),

    new CleanWebpackPlugin,

    new CssMinimizerPlugin,

    new webpack.HotModuleReplacementPlugin(),
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
    }
  },

  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, '/src/common/'),
    //   '+': path.resolve(__dirname, '/src/pages/'),
    // }
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    port: 2500,
    hot: true,
    hotOnly: true,
    open: true,
    inline: true,
  }
};
