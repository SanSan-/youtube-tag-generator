const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const loaders = require('./loaders');
const settings: { resourcePrefix: string, htmlPlugin: Record<string, unknown> } = require('./settings');

module.exports = {
  mode: 'production',
  context: settings.rootDir,
  entry: {
    app: path.resolve(settings.rootDir, 'app', 'src', 'index.tsx')
  },
  output: {
    filename: `./js/[name].bundle${settings.resourcePrefix}.js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      __DEBUG__: JSON.stringify(false),
      __TEST__: JSON.stringify(false),
      SERVER_MODULE_NAME: JSON.stringify('new-begining'),
      SERVER_PATH: JSON.stringify('../api')
    }),
    new MiniCssExtractPlugin({
      filename: `./css/[name].bundle${settings.resourcePrefix}.css`
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  optimization: {
    minimizer: [
      new TerserJsPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true
        }
      },
      chunks: 'all'
    }
  }
};
