/*
 * @frame: express
 * @note: only proxy xhr to remote
 */
const fs = require('fs');
const httpProxyMiddleware = require('http-proxy-middleware');

const u = require('../../lib/utils')
const path = require('path');
const config = require(path.resolve(process.cwd(), 'moky.config.js'));

const load = async (name) => {
    return await fs.readFile(name, 'utf8');
}

module.exports = function(options){
    const proxy = options.proxy;
    const proxyMaps = config.proxyMaps;
    const target = proxyMaps[proxy] || proxy;
    return (req, res, next) => {
        if(!req.xhr){
            return next();
        }
        res.set('Content-Type', 'application/json');
        u.log.yellow(`Proxy: ${req.path} to ${target}`);
        httpProxyMiddleware({target: target})(req, res, next);
    }
}