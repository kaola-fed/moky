const path = require('path')
const Moky = require('./moky')
const app = require('./app')
const { init, parseConfig } = require('./lib/utils')

const builder = {
  e: {
    alias: 'env',
    default: false,
    describe: 'Proxy env, see <proxyMaps> in configure file'
  },
  i: {
    alias: 'init',
    default: false,
    describe: 'Create a config file in current directofy'
  },
  c: {
    alias: 'config',
    default: 'moky.config.js',
    describe: 'Configure file path'
  },
  r: {
    alias: 'rewrite',
    default: 0,
    describe: 'Write proxy data to mock file (1-write if not exist, 2-write even if exist)'
  },
  V: {
    alias: 'verbose',
    default: false,
    describe: 'Show detail logs'
  }
}

const handler = async (argv) => {
  if (argv.init) {
    // custom name for config file
    const name = typeof argv.init === 'string' ? argv.init : ''
    return init(name)
  }

  const { env, verbose, rewrite } = argv
  const options = parseConfig(path.resolve(argv.config))
  Object.assign(options, { env, verbose, rewrite })

  app(options)
}

/*
 * options
 * {
 * ** frame: 'koa'|'express'
 * ** moky: 'async'|'render'|'proxy'
 * }
 */
const middleware = (options) => {
  const moky = new Moky(options);
  return moky.middleware();
}

module.exports = { builder, handler, middleware }
