const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {};

module.exports = getConfig(
  {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['react-native-worklets-core/plugin'],
      ['react-native-worklets/plugin', workletsPluginOptions],
    ],
  },
  { root, pkg }
);
