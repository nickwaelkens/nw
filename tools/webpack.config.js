/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var time = require('./lib/time');

const DEBUG = process.argv.indexOf('--release') === -1;
const VERBOSE = process.argv.indexOf('--verbose') !== -1;

console.log('[' + time.format(new Date()) + '] Starting a', DEBUG ? 'debug' : 'release', 'run');

var config = {
  entry: './src/js/index.js',

  output: {
    path    : path.join(__dirname, '../build'),
    filename: 'bundle.js',
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

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  resolve: {
    extensions: ['', '.js', '.json'],
  },

  plugins: DEBUG ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
      },
    }),
  ],

  module: {
    preLoaders: [{
      test   : /\.js$/,
      loader : 'eslint-loader',
      include: [
        path.resolve(__dirname, '../src/js'),
      ],
    }],
    loaders   : [{
      test   : /\.js$/,
      loader : 'babel-loader',
      include: [
        path.resolve(__dirname, '../src/js'),
      ],
      query  : {
        presets: ['es2015', 'stage-0'],
      },
    }],
  },
};

module.exports = config;