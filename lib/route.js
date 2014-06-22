// Shim
var slice = [].slice;

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
 * Add middleware
 *
 * @param  {Function} fn
 * @return {Route}
 * @api public
 */

Route.prototype.use = function(fn) {
    var wares = this.wares,
        fns   = slice.call(arguments);

    while (fn = fns.shift())
        wares.push(fn);

    return this;
};


/**
 * Dispatch
 * @param  {Context} ctx
 * @param  {Request|Null} req
 * @param  {Function} done
 * @return {Route}
 * @api private
 */

Route.prototype.dispatch = function(ctx, req, done) {
    this.populate(ctx.path, ctx.params);

    var wares = this.wares,
        index = 0, fn;

    function next() {
        if (fn = wares[index++])
            return fn(ctx, req, next);
        done();
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


/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @return {RegExp}
 * @api private
 */

function pathtoRegexp(path, keys) {
    if (path instanceof RegExp) return path;

    if (path instanceof Array)
        path = '(' + path.join('|') + ')';

    path = path
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, replace)
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');

    function replace(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
            + (optional || '');
    }

    return new RegExp('^' + path + '$', 'i');
}
