const path = require('path');
const webpack = require('webpack');

/* VERSION (from git tags), BRANCH and COMMIT to files header */
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const loaders = require('./loaders');
const settings: { resourcePrefix: string, htmlPlugin: Record<string, unknown> } = require('./settings');

module.exports = {
  context: settings.rootDir,
  entry: {
    app: path.resolve(settings.rootDir, 'app', 'src', 'index.tsx')
  },
  mode: 'development',
  output: {
    filename: `./js/[name].[chunkhash]${settings.resourcePrefix}.js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          loaders.getCacheLoader(path.resolve(settings.cacheDir, 'css')),
          loaders.getThreadLoader('css'),
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          loaders.getCacheLoader(path.resolve(settings.cacheDir, 'css')),
          loaders.getThreadLoader('css'),
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[contenthash].[ext]'
        }
      },
      {
        test: /\.(svg|woff|woff2|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: `fonts/[contenthash].[ext]?${Date.now()}`
        }
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          loaders.getCacheLoader(path.resolve(settings.cacheDir, 'js')),
          loaders.getThreadLoader('js'),
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.resolve(settings.cacheDir, 'babel')
            }
          }
        ]
      }
    ]
  },
  externals: {},
  target: 'web',
  resolve: {
    alias: settings.aliases,
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new AntdDayjsWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['ts', 'tsx']
    }),
    new HtmlWebpackPlugin(settings.htmlPlugin),
    new webpack.DefinePlugin({
      __DEBUG__: JSON.stringify(true),
      __TEST__: JSON.stringify(false),
      SERVER_MODULE_NAME: JSON.stringify('new-begin'),
      SERVER_PATH: JSON.stringify('../api')
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      },
      chunks: 'all'
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    client: {
      logging: 'info'
    },
    compress: false,
    historyApiFallback: {
      index: 'index.html'
    },
    open: false,
    port: 9090,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        secure: false
      }
    },
    devMiddleware: {
      stats: {
        colors: true
      }
    },
    watchFiles: 'dist'
  }
};
