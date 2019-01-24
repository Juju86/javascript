const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path')
const _devMode = process.argv.includes('--DEV_MODE')
const _prodPlugins = []
const _devPlugins = []
const _prodCssRules = []
const _eslint = []
const _polyfill = []
const _prodOptimizationMinimizer = []
if (_devMode) {
  _eslint.push({
    enforce: 'pre',
    test: /\.js$/,
    exclude: [
      /node_modules/,
      /theadmin/
    ],
    loader: 'eslint-loader'
  })
  _devPlugins.push(
  )
}
if (!_devMode) {
  _polyfill.push(
    '@babel/polyfill'
  )
  _prodPlugins.push(
  )
  _prodOptimizationMinimizer.push(
    new TerserPlugin()
    // new UglifyJsPlugin()
  )
  _prodCssRules.push({
    loader: 'postcss-loader',
    options: {
      sourceMap: false
    }
  })
}
let config = {
  context: path.resolve(__dirname, './'),
  entry: {
    default: [..._polyfill, './templates/default/js/app.js']
  },
  output: {
    path: path.resolve(__dirname, './public/templates'),
    publicPath: '/templates/',
    filename: _devMode ? '[name]/js/core.min.js' : '[name]/js/core.min.[chunkhash:7].js',
    chunkFilename: _devMode ? 'chunkfiles/js/app.[id].js' : 'chunkfiles/js/app.[id].[chunkhash:7].js'
  },
  watchOptions: {
    poll: true
  },
  mode: _devMode ? 'development' : 'production',
  devtool: _devMode ? 'source-map' : '(none)',
  resolve: {
    alias: {
      vue: _devMode ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [{
          loader: _devMode ? 'style-loader' : MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
          options: {
            sourceMap: _devMode
          }
        },
        ..._prodCssRules,
        {
          loader: 'sass-loader', // compiles Sass to CSS
          options: {
            data: _devMode ? '$env: development;' : '$env: production;',
            sourceMap: _devMode
          }
        }]
      },
      {
        test: /\.(pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: _devMode ? '[name].[ext]' : '[name].[ext]?[hash:7]',
              publicPath: '/templates/common/pdf',
              outputPath: 'common/pdf',
              context: '/public/templates'
            }
          }
        ]
      },
      {
        test: /\.(woff|svg|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: _devMode ? '[name].[ext]' : '[name].[ext]?[hash:7]',
              publicPath: '/templates/common/fonts',
              outputPath: 'common/fonts',
              context: '/public/templates'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: _devMode ? '[name].[ext]' : '[name].[ext]?[hash:7]',
              publicPath: '/templates/common/images',
              outputPath: 'common/images',
              context: '/public/templates'
            }
          }
        ]
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
    ..._prodPlugins,
    ..._devPlugins,
    new CleanWebpackPlugin(
      [
        'public/templates/admin/js',
        'public/templates/admin/css',
        'public/templates/default/js',
        'public/templates/default/css',
        'public/templates/common/fonts',
        'public/templates/common/images',
        'public/templates/chunkfiles'
      ],
      {
        root: path.resolve(__dirname, './'),
        verbose: true,
        allowExternal: true
      }
    ),
    new ManifestPlugin({
      fileName: './../manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: _devMode ? '[name]/css/app.css' : '[name]/css/app.[chunkhash:7].css',
      chunkFilename: _devMode ? '[name]/css/app.[id].css' : '[name]/css/app.[id].[chunkhash:7].css'
    })
  ]
}
if (!_devMode) {
  config = Object.assign({
    optimization: {
      minimizer: [
        ..._prodOptimizationMinimizer
      ]
    }
  }, config)
}

module.exports = config
