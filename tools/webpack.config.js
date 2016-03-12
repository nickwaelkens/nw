/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var time = require('./lib/time');

const DEBUG = process.argv.indexOf('--release') === -1;
const VERBOSE = process.argv.indexOf('--verbose') !== -1;

console.log('[' + time.format(new Date()) + '] Starting a', DEBUG ? 'debug' : 'release', 'run');

var defaultPlugins = [new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')];
var releasePlugins = [new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true } })];

var config = {
  entry : {
    app   : './src/js/index.js',
    vendor: ['lodash', 'pixi.js']
  },
  node  : {
    fs: 'empty'
  },
  output: {
    path    : path.join(__dirname, '../build'),
    filename: '[name].bundle.js',
  },

  stats: {
    colors      : true,
    reasons     : DEBUG,
    hash        : VERBOSE,
    version     : VERBOSE,
    timings     : true,
    chunks      : VERBOSE,
    chunkModules: VERBOSE,
    cached      : VERBOSE,
    cachedAssets: VERBOSE,
  },

  debug: DEBUG,

  devtool: DEBUG ? 'source-map' : false,

  resolve: {
    extensions: ['', '.js', '.json'],
  },

  plugins: DEBUG ? defaultPlugins : defaultPlugins.concat(releasePlugins),

  module: {
    preLoaders: [{
      test   : /\.js$/,
      loader : 'eslint-loader',
      include: [
        path.resolve(__dirname, '../src/js'),
      ],
      exclude: /node_modules/,
    }],
    loaders   : [
      {
        test  : /\.json$/,
        loader: 'json'
      },
      {
        test   : /\.js$/,
        loader : 'babel-loader',
        include: [
          path.resolve(__dirname, '../src/js'),
        ],
        query  : {
          presets: ['es2015', 'stage-0'],
        },
      }],
    postLoaders: [
      {
        include: path.resolve(__dirname, '..', 'node_modules/pixi.js'),
        loader : 'transform?brfs'
      }
    ],
  },
};

module.exports = config;