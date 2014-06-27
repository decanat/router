// Load dependencies
var url = require('decanat-url');

var merge = require('yiwn-merge');

// Expose
module.exports = Context;


/**
 * Initialize a new "request" `Context`
 * with the given `path` and optional initial `state`
 *
 * Given `path` is "canonical" path,
 * which internally transforms based on mounted path.
 *
 * @constructor
 * @param {String} path
 * @param {Object} state [optional]
 * @param {Router} router
 * @return {Context}
 * @api public
 */

function Context(path, state, router) {
    if (! (this instanceof Context))
        return new Context(path, state, router);

    this.canonicalPath = path;

    this.adapt(router);

    return this.populate(path, state);
}


/**
 * Populate params.
 *
 * @param  {String} path
 * @param  {Object} state [optional]
 * @return {Context}
 * @api private
 */

Context.prototype.populate = function(path, state){
    this.title = document.title;

    this.state = state || {};
    this.state.path = path;

    this.params = [];

    merge(this, url.parse(path, true), true);

    return this;
};


/**
 * Setup itself relative to `router`.
 *
 * @param  {Router} router
 * @return {Context}
 * @api private
 */

Context.prototype.adapt = function(router) {
    var base = router.base,
        path = this.canonicalPath;

    if (path.indexOf(base) === 0)
        this.path = path.replace(base, '');

    this.router = router;

    return this;
};

/**
 * Push state.
 *
 * @api private
 */

Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
    return this;
};


/**
 * Save the context state.
 *
 * @api public
 */

Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
    return this;
};
