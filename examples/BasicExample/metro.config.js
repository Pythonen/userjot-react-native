const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the library source so changes are picked up immediately
config.watchFolders = [workspaceRoot];

// Only use the example's own node_modules for resolution.
// Do NOT include workspaceRoot/node_modules — it has older
// devDependency versions of react-native (0.72) that conflict.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Block the library root's node_modules copies of peer deps so that
// standard node resolution (which walks up from ../../src/) cannot
// reach them. Metro will then fall through to extraNodeModules below.
const rootModules = path.resolve(workspaceRoot, 'node_modules');
config.resolver.blockList = [
  new RegExp(`^${escape(rootModules)}/react/.*$`),
  new RegExp(`^${escape(rootModules)}/react-native/.*$`),
  new RegExp(`^${escape(rootModules)}/react-native-webview/.*$`),
];

// Provide the correct copies of peer deps from the example's node_modules.
const exampleModules = path.resolve(projectRoot, 'node_modules');
config.resolver.extraNodeModules = {
  react: path.resolve(exampleModules, 'react'),
  'react-native': path.resolve(exampleModules, 'react-native'),
  'react-native-webview': path.resolve(exampleModules, 'react-native-webview'),
};

// Escape special regex characters in a path string
function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = config;
