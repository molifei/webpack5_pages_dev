const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

// html处理
const HtmlWebpackPlugin = require('html-webpack-plugin');

// css处理
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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

console.log(getEntry());

module.exports = {

  entry: getEntry(),

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name]_[chunkhash].min.js',
  },

  module: {
    // noParse: /jquery/,

    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader',
          'happypack/loader?id=happyBabel'
        ]
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

      {
        // 处理html文件中的img图片（负责引入img，从而能被url-loader进行处理）
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          esModule: false,
        }
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

      // 媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100 * 1024,
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

    new CleanWebpackPlugin,

    new webpack.HotModuleReplacementPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css'
    }),

    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env']
          ],
          cacheDirectory: true
        }
      }],
      threadPool: happyThreadPool
    }),

    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./vendor-manifest.json')
    // }),
    //
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, './public/vendor'),
    //       to: path.resolve(__dirname, './dist/vendor'),
    //     }
    //   ]
    // }),
    //
    // new AddAssetHtmlPlugin({
    //   // dll文件位置
    //   filepath: path.resolve(__dirname, '/vendor/*.js'),
    //   // dll 引用路径
    //   publicPath: '/vendor',
    //   // dll最终输出的目录
    //   outputPath: '/vendor'
    // }),

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

  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, '/src/common/'),
    //   '+': path.resolve(__dirname, '/src/pages/'),
    // }
  },
};
