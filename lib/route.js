var pathtoRegexp = require('path-to-regexp');

// Expose
module.exports = Route;

/**
 * Initialize `Route` with the given HTTP `path`.
 *
 * @param {String} path
 * @param {Object} options.
 * @api private
 */

function Route(path) {
    if (!(this instanceof Route))
        return new Route(path);

    this.path = path;
    this.keys = [];

    this.wares  = [];

    this.regexp = pathtoRegexp(path, this.keys);

    return this;
}


/**
 * Add middlewares.
 *
 * @param  {Function} fn
 * @return {Route}
 * @api public
 */

Route.prototype.use = function(fn) {
    var wares = this.wares,
        fns   = [].slice.call(arguments);

    while (fn = fns.shift())
        wares.push(fn);

    return this;
};


/**
 * Dispatch.
 *
 * First argument is Context,
 * optionally followed by other arguments.
 * Last one is "complete" callback.
 *
 * @param  {Context} ctx
 * @param  {..Mixed} arguments
 * @param  {Function} done
 * @return {Route}
 * @api private
 */

Route.prototype.dispatch = function(ctx) {
    this.populate(ctx.path, ctx.params);

    var args = [].slice.call(arguments),
        done = args.pop();

    var wares = this.wares,
        index = 0, fn;

    function next() {
        if (fn = wares[index++]) {
            args.push(next);
            fn.apply(null, args);
            args.pop();
        }
        else done();
    }

    next();

    return this;
};


/**
 * Check if this route matches `path`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Route.prototype.match = function(path){
    // ignore querystring
    path = path.split('?').shift();
    // sanitize to url-safe
    path = decodeURIComponent(path);

    return this.regexp.test(path);
};


/**
 * Check if this route matches `path`. if so
 * populate `params`.
 *
 * @param {String} path
 * @param {Array} params
 * @return {Boolean}
 * @api private
 */

Route.prototype.populate = function(path, params){

    // ignore querystring
    path = path.split('?').shift();

    var keys    = this.keys,
        matches = this.regexp.exec(decodeURIComponent(path));

    if (!matches) return false;

    var match, i = 1;

    while (match = matches[i++]) {
        var key = keys[i - 2];

        if (typeof match == 'string')
            match = decodeURIComponent(match);

        if (!key) {
            params.push(match);
            continue;
        }

        if (params[key.name] === void 0)
            params[key.name] = match;
    }

    return true;
};
