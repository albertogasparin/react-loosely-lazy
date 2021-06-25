// Enable importing ReactLooselyLazyPlugin directly from source
require('@babel/register')({
  extensions: ['.jsx', '.js', '.ts', '.tsx'],
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
});

const { lstatSync, readdirSync } = require('fs');
const { resolve, basename } = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

const { ReactLooselyLazyPlugin } = require('./packages/plugins/webpack/src');

// This function generates configuration for files in the
// ./src/examples/ folder
const generateExampleEntries = function () {
  const src = './examples';

  // Get all subdirectories in the ./src/apps,
  // so we can just add a new folder there and
  // have automatically the entry points updated

  const getDirectories = source =>
    readdirSync(source)
      .map(name => resolve(source, name))
      .filter(s => lstatSync(s).isDirectory());

  const exampleDirs = getDirectories(src);

  return exampleDirs.reduce((entry, dir) => {
    entry['./' + basename(dir) + '/bundle'] = `${dir}/index`;

    return entry;
  }, {});
};

module.exports = {
  entry: generateExampleEntries(),

  mode: 'development',

  output: {
    path: resolve(__dirname, 'dist'),

    // [name] here will be used from the "entry" object.
    // As each key in "entry" object forms a file path,
    // Webpack will create a matching folder structure
    // on build.
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: { chrome: '60' } }],
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  },

  plugins: [
    new ReactLooselyLazyPlugin({
      filename: './examples/playground/manifest.json',
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()],
  },

  devServer: {
    contentBase: resolve(__dirname, 'examples'),
    publicPath: '/',
    // hot: true,
  },
};
