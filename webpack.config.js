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
          filename: `./index.html`,
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

console.log(getEntry());

module.exports = {
  mode: 'development',

  entry: getEntry(),

  output: {
    publicPath: '/',
    filename: 'js/[name]_[chunkhash].js',
    // chunkFilename: 'js/[name]_[chunkhash].min.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
        // use: [
        //   {
        //     loader: 'babel-loader',
        //     // options: {
        //     //   presets: ['@babel/preset-env']
        //     // }
        //   }
        // ]
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
      // {
      //   test: /\.(gif|png|jpe?g|eot|woff|ttf|pdf)$/,
      //   loader: "file-loader"
      // },
      // 图片
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'common/img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      // 媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/,
        use: [
          {
            loader: 'usr-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'common/media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      // 字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'common/font/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    ...htmlPluginArray,

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css'
    }),

    new CleanWebpackPlugin,

    new CssMinimizerPlugin
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
  }
};
