// Obsolete browser notification
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ObsoleteWebpackPlugin = require('obsolete-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

// Sentry integration into webapck
// const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IconFontPlugin = require('icon-font-loader').Plugin

const ManifestPlugin = require('webpack-manifest-plugin')

const path = require('path')
const _devMode = process.env.NODE_ENV === 'development'
const _watchMode = process.argv.includes('--watch')

const _eslint = []
const _prodCssRules = []
const _prodOptimizationMinimizer = []

console.log(process.env.NODE_ENV === 'development', process.env.NODE_ENV)

if (_devMode) {
  _eslint.push({
    enforce: 'pre',
    test: /\.js$/,
    exclude: [
      /node_modules/,
      /theadmin/,
      /libs/
    ],
    loader: 'eslint-loader',
    options: {
      fix: true
    }
  })
}
if (!_devMode) {
  _prodOptimizationMinimizer.push(
    new TerserPlugin()
  )
  _prodCssRules.push({
    loader: 'postcss-loader',
    options: {
      sourceMap: false
    }
  })
}
let config = {
  context: path.resolve(__dirname, ''),
  entry: {
    common: ['./templates/common/js/bootstrap.js', './templates/common/js/app.js']
  },
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, './public/templates/'),
    publicPath: 'public/templates/',
    filename: _devMode ? '[name]/js/app.js' : '[name]/js/[contenthash].js',
    chunkFilename: _devMode ? 'chunkfiles/js/[id].app.js' : 'chunkfiles/js/[id].[contenthash].js'
  },
  devtool: _devMode ? 'inline-source-map' : '(none)',
  watchOptions: {
    ignored: [/node_modules/, /pages/, /vendor/]
  },
  module: {
    rules: [{
      test: /\.(css)$/,
      use: [{
        loader: _devMode && _watchMode ? 'style-loader' : MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader', // translates CSS into CommonJS modules
        options: {
          sourceMap: _devMode
        }
      }, {
        loader: 'icon-font-loader'
      },
      ..._prodCssRules
      ]
    },
    {
      test: /\.(sa|sc)ss$/,
      use: [{
        loader: _devMode && _watchMode ? 'style-loader' : MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader', // translates CSS into CommonJS modules
        options: {
          sourceMap: _devMode
        }
      }, {
        loader: 'icon-font-loader'
      },
      ..._prodCssRules,
      {
        loader: 'sass-loader', // compiles Sass to CSS
        options: {
          prependData: '$env: ' + process.env.NODE_ENV + ';',
          sourceMap: _devMode,
          implementation: require('dart-sass'),
          sassOptions: {
            fiber: false
          }
        }
      }
      ]
    },
    {
      test: /\.(pdf)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name (file) {
            if (_devMode) {
              if (file.split('/')[file.split('/').length - 2] === 'pdf') {
                return '[name].[ext]'
              }
              return '[folder]/[name].[ext]'
            }
            if (file.split('/')[file.split('/').length - 2] === 'pdf') {
              return '[name].[ext]?[hash:7]'
            }
            return '[folder]/[name].[ext]?[hash:7]'
          },
          // name: _devMode ? '[folder]/[name].[ext]' : '[folder]/[name].[ext]?[hash:7]',
          publicPath: '/public/templates/common/pdf',
          outputPath: 'common/pdf',
          context: '/public/templates',
          emitFile: true
        }
      }]
    },
    {
      test: /\.(woff(2)?|eot|ttf|otf|)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name (file) {
            if (_devMode) {
              if (file.split('/')[file.split('/').length - 2] === 'fonts') {
                return '[name].[ext]'
              }
              return '[folder]/[name].[ext]'
            }
            if (file.split('/')[file.split('/').length - 2] === 'fonts') {
              return '[name].[ext]?[hash:7]'
            }
            return '[folder]/[name].[ext]?[hash:7]'
          },
          // name: _devMode ? '[folder]/[name].[ext]' : '[folder]/[name].[ext]?[hash:7]',
          publicPath: '/public/templates/common/fonts',
          outputPath: 'common/fonts',
          context: '/public/templates',
          emitFile: true
        }
      }]
    },
    {
      test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name (file) {
            if (_devMode) {
              if (file.split('/')[file.split('/').length - 2] === 'images') {
                return '[name].[ext]'
              }
              return '[folder]/[name].[ext]'
            }
            if (file.split('/')[file.split('/').length - 2] === 'images') {
              return '[name].[ext]?[hash:7]'
            }
            return '[folder]/[name].[ext]?[hash:7]'
          },
          // name: _devMode ? '[folder]/[name].[ext]' : '[folder]/[name].[ext]?[hash:7]',
          publicPath: '/public/templates/common/images',
          outputPath: 'common/images',
          context: '/public/templates',
          emitFile: true
        }
      }]
    },
    ..._eslint,
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
    ]
  },
  plugins: [
    // new SentryWebpackPlugin({
    //   include: '.',
    //   ignoreFile: '.sentrycliignore',
    //   ignore: ['node_modules', 'all.config.js'],
    //   configFile: 'sentry.properties'
    // }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), 'public/templates/admin/js/**/*'),
        path.join(process.cwd(), 'public/templates/admin/css/**/*'),
        path.join(process.cwd(), 'public/templates/default/js/**/*'),
        path.join(process.cwd(), 'public/templates/default/css/**/*'),

        path.join(process.cwd(), 'public/templates/common/js/**/*'),
        path.join(process.cwd(), 'public/templates/common/css/**/*'),
        path.join(process.cwd(), 'public/templates/common/fonts/**/*'),
        path.join(process.cwd(), 'public/templates/common/images/**/*'),
        path.join(process.cwd(), 'public/templates/custom/**/*'),
        path.join(process.cwd(), 'public/templates/chunkfiles/**/*')
      ],
      cleanAfterEveryBuildPatterns: [],
      dangerouslyAllowCleanPatternsOutsideProject: true
    }),
    // TODO : Voir https://github.com/jeerbl/webfonts-loader
    new IconFontPlugin({
      fontName: 'custom-font',
      filename: _devMode ? 'custom/fonts/[name].[ext]' : 'custom/fonts/[hash].[ext]',
      publicPath: '/public/templates/'
    }),
    new ManifestPlugin({
      fileName: './../manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: _devMode ? '[name]/css/app.css' : '[name]/css/[contenthash].css',
      chunkFilename: _devMode ? '[name]/css/[id].app.css' : '[name]/css/[id].[contenthash].css'
    }),
    new HtmlWebpackPlugin(),
    new ObsoleteWebpackPlugin({
      name: 'obsolete',
      template: '<div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>'
    }),
    new ScriptExtHtmlWebpackPlugin({
      async: 'obsolete'
    })
  ]
}
if (!_devMode) {
  config = Object.assign({
    optimization: {
      minimize: true,
      minimizer: [
        ..._prodOptimizationMinimizer
      ]
    }
  }, config)
}

module.exports = config
