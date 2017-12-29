const async = require('./middleware/async');
const render = require('./middleware/render');
const xhrProxy = require('./middleware/express/xhrProxy');
const xhrLocal = require('./middleware/express/xhrLocal');
const { log } = require('./lib/utils')

class Moky{
    constructor(options){
        this.frame = options.frame || 'koa';
        this.name = options.name || '';
        this.through = () => {
            return (ctx, next) => next();
        }
    }
    middleware(){
        return this.dispatch()
    }

    dispatch(){
        switch(this.name){
        case 'async':
            if(this.frame == 'express'){
                log.red(`can't find express middleware named 'async'`);
            }
            return async;
        case 'render': 
            if(this.frame == 'express'){
                log.red(`can't find express middleware named 'render'`);
            }
            return render;
        case 'xhrProxy': 
            if(this.frame == 'express'){
                return xhrProxy;
            }
            return e2k(xhrProxy);
        case 'xhrLocal': 
            if(this.frame == 'express'){
                return xhrLocal;
            }
            return e2k(xhrLocal);
        default: 
            if(this.frame == 'express'){
                return this.through;
            }
            return e2k(this.through);
        }
    }

    //express to koa
    e2k(middleware){
        return (ctx, next) => {
            middleware(ctx.req, ctx.res, nex);
        }
    }
}

module.exports = Moky;