const settings = require('./settings');

const getCacheLoader = (cacheDirectory) => ({
  loader: 'cache-loader',
  options: {
    cacheDirectory
  }
});

const getThreadLoader = (name) => ({
  loader: 'thread-loader',
  options: {
    workers: settings.threadLoader.workers,
    workerParallelJobs: settings.threadLoader.workerParallelJobs,
    workerNodeArgs: settings.threadLoader.workerNodeArgs,
    poolRespawn: settings.threadLoader.poolRespawn,
    poolTimeout: settings.threadLoader.poolTimeout,
    poolParallelJobs: settings.threadLoader.poolParallelJobs,
    name
  }
});

module.exports = { getCacheLoader, getThreadLoader };
