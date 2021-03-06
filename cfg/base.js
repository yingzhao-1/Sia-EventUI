const path = require('path')
const webpack = require('webpack')

const env = process.env.REACT_WEBPACK_ENV

let constants
try {
  constants = require(`./${env}.const`)
} catch (ex) { // TODO: Catch only file not found.
  console.log(`${env}.const not found.`, ex)
  constants = require('./defaultConstants')
}

const srcPath = path.join(__dirname, '/../src')
const publicPath = '/assets/'

const config = {
  entry: {
    app: ['babel-polyfill'],
    appInsights: path.join(srcPath, 'appInsights')
  },
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    publicPath: publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      actions: `${srcPath}/actions/`,
      sources: `${srcPath}/sources/`,
      stores: `${srcPath}/stores/`,
      styles: `${srcPath}/styles/`,
      config: `${srcPath}/config/`,
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(mp4|ogg|svg|eot|ttf)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
      'constants': JSON.stringify(constants)
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /de/)
  ]
}

module.exports = config
