const path = require('path');

const resourcePrefix = '';
const rootDir = path.resolve(__dirname, '..');
const nodeModulesDir = path.resolve(__dirname, '..', 'node_modules');
const cacheDir = path.resolve(__dirname, '..', 'node_modules', '.cache');
const aliases = {
  '~app': path.resolve(rootDir, 'app'),
  '~src': path.resolve(rootDir, 'app', 'src'),
  '~actions': path.resolve(rootDir, 'app', 'src', 'actions'),
  '~components': path.resolve(rootDir, 'app', 'src', 'components'),
  '~forms': path.resolve(rootDir, 'app', 'src', 'components', 'forms'),
  '~hooks': path.resolve(rootDir, 'app', 'src', 'hooks'),
  '~model': path.resolve(rootDir, 'app', 'src', 'model'),
  '~const': path.resolve(rootDir, 'app', 'src', 'model', 'constants'),
  '~dictionaries': path.resolve(rootDir, 'app', 'src', 'model', 'dictionaries'),
  '~enums': path.resolve(rootDir, 'app', 'src', 'model', 'enums'),
  '~exceptions': path.resolve(rootDir, 'app', 'src', 'model', 'exceptions'),
  '~types': path.resolve(rootDir, 'app', 'src', 'model', 'types'),
  '~reducers': path.resolve(rootDir, 'app', 'src', 'reducers'),
  '~utils': path.resolve(rootDir, 'app', 'src', 'utils'),
  '~rest': path.resolve(rootDir, 'rest-server', 'app', 'routes', 'mock')
};
const threadLoader = {
  // the number of spawned workers, defaults to (number of cpus - 1) or
  // fallback to 1 when require('os').cpus() is undefined
  workers: 2,

  // number of jobs a worker processes in parallel
  // defaults to 20
  workerParallelJobs: 50,

  // additional node.js arguments
  workerNodeArgs: ['--max-old-space-size=1024'],

  // Allow to respawn a dead worker pool
  // respawning slows down the entire compilation
  // and should be set to false for development
  poolRespawn: false,

  // timeout for killing the worker processes when idle
  // defaults to 500 (ms)
  // can be set to Infinity for watching builds to keep workers alive
  poolTimeout: 2000,

  // number of jobs the poll distributes to the workers
  // defaults to 200
  // decrease of less efficient but more fair distribution
  poolParallelJobs: 50
};
const htmlPlugin = {
  inject: false,
  hash: true,
  template: './app/src/index.html',
  filename: 'index.html',
  favicon: './app/resources/favicon.ico'
};

module.exports = { resourcePrefix, rootDir, cacheDir, nodeModulesDir, aliases, threadLoader, htmlPlugin };
