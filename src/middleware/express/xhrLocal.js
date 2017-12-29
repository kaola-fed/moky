/*
 * @frame: express
 * @note: only proxy xhr to local
 */
const fs = require('fs');

const u = require('../../lib/utils')
const path = require('path');
const config = require(path.resolve(process.cwd(), 'moky.config.js'));

const load = async (name) => {
    return await fs.readFile(name, 'utf8');
}

module.exports = function(options){
    return (req, res, next) => {
        //static, send to pacel middleware
        if(!req.xhr){
            return next();
        }
        res.set('Content-Type', 'application/json');
        const mockPath = config.asyncMockPath;
        const mockUrl = path.join(mockPath, `${req.path}.json`);
        u.log.yellow(`Mock: ${req.path} to ${mockUrl}`); 

        if(!fs.existsSync(mockUrl)){
            u.log.red(`File doesn't exist: ${mockUrl}`)
            u.log.yellow(`return defaultMock`);
            res.json(config.defaultMock || {code: 200, message: 'ok'});
            return;
        }
        const data = require(mockUrl);
        res.json(data);
    }
}