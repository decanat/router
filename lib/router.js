// Load dependencies
var Emitter = require('component-emitter');

var extend  = require('yiwn-extend'),
    merge   = require('yiwn-merge');

// local
var Context = require('./context.js'),
    Route   = require('./route.js');

// Expose
module.exports = Router;


// Initial properties
var defaults = {
        // router
        running : false,
        // mount
        mntPath : '',
        parent  : null
    };


/**
 * Instantiate a new Router
 *
 * @constructor
 * @return {Router}
 * @api public
 */

function Router(){
    // permit use without `new`
    if (!(this instanceof Router))
        return new Router();

    this.nodes  = [];
    this.routes = [];

    merge(this, defaults);

    delegate(this);

    return this;
}


Router.extend = extend.bind(null, Router);

Emitter(Router.prototype);


/**
 * Delegate events on initialization.
 * @param  {Router} router
 * @return {Router}
 * @api private
 */

function delegate(router) {

    router.on('start', function(){
        window.addEventListener('popstate', onpopstate, false);
    });

    router.on('stop', function(){
        window.removeEventListener('popstate', onpopstate, false);
    });

    router.on('mount', function(){
        this.stopListening();
    });

    function onpopstate (e) {

        if (e.state) {
            var path = e.state.path;
            console.log(path, router);
            router.show(path, e.state, true);
        }
    }
}


// Placeholder for `#request`, should be overriden
Router.prototype.request = function(){};


// Router
// ------

/**
 * Boot the router.
 *
 * @param  {Boolean} dispatch [optional]
 * @return {Router}
 */

Router.prototype.listen = function(dispatch) {
    if (this.running)
        return this;

    this.running = true;
    this.emit('start');

    if (dispatch === false)
        return this;

    var url = location.pathname
            + location.search
            + location.hash;

    this.show(url, null, true);

    return this;
};


/**
 * Turn of the router.
 *
 * @return {Router}
 */

Router.prototype.stopListening = function() {
    if (!this.running)
        return this;

    this.running = false;
    this.emit('stop');

    return this;
};


/**
 * Register a route with given pattern,
 * and add it to Router's routes collection.
 * @param  {String|RegExp} pattern
 * @return {Route}
 * @api public
 */

Router.prototype.route = function(path){
    var route = new Route(path);

    this.routes.push(route);

    return route;
};


/**
 * Show give path.
 *
 * @param  {String} path
 * @param  {Object} state [optional]
 * @param  {Boolean} replace [optional]
 * @return {Router}
 * @api public
 */

Router.prototype.show = function(path, state, replace) {
    var root = this.root();

    if (path.charAt(0) != '/')
        path = '/' + path;

    // start dispatching from top
    if (this != root) {
        path = this.base() + path;
        root.show(path, state, replace);
        return this;
    }

    var ctx = Context(path, state),
        req = this.request(path);

    this.dispatch(ctx, req);

    //
    replace
        ? ctx.save()
        : ctx.pushState();

    return this;
};


/**
 * Dispatch given context to routes.
 *
 * @param  {Context} ctx
 * @param  {Request} req
 * @return {Router}
 * @api private
 */

Router.prototype.dispatch = function(ctx, req) {
    // refresh ctx
    ctx.adapt(this);

    // filter routes
    var routes = this.grep(ctx.path, ctx.state),
        route, i = 0;

    // evaluate middleware
    function next() {
        if (route = routes[i++])
            route.dispatch(ctx, req, next);
    }

    next();

    // propogate
    this.each(function(node){
        node.dispatch(ctx, req);
    });

    return this;
};


/**
 * Get array of Routes which satisfy given input.
 *
 * @param  {String} path
 * @param  {Object} params
 * @return {Array}
 * @api private
 */

Router.prototype.grep = function(path, params) {
    return this.routes.filter(function(route){
        return route.match(path, params);
    });
};



// Mount
// -----

/**
 * Get absolute mount point
 * @return {String}
 * @api private
 */

Router.prototype.base = function(){
    var parent  = this.parent,
        mntPath = this.mntPath;

    if (!parent)
        return mntPath;

    return parent.base() + mntPath;
};


/**
 * Get top-most instance in hierarchy.
 *
 * @return {Router}
 * @api private
 */

Router.prototype.root = function() {
    if (!this.parent)
        return this;

    return this.parent.root();
};


/**
 * Mount another `Router` instance at specifies path.
 *
 * @param  {String} path
 * @param  {Router} router
 * @return {Router}
 * @api public
 */

Router.prototype.mount = function(path, router) {
    this.nodes.push(router);

    path = path.replace(/^(\/?)(.*?)(\/?)$/, normalize);

    router.parent  = this;
    router.mntPath = path;

    router.emit('mount', path);

    function normalize(p, s, b) {
        return '/' + b;
    }

    return this;
};


/**
 * Iterate over node routers performing given function.
 *
 * @param  {Function} fn
 * @return {Mounter}
 * @api private
 */

Router.prototype.each = function(fn) {
    var routers = this.nodes;

    if (!routers.length)
        return this;

    var router, i = 0;

    while (router = routers[i++])
        fn.call(this, router, router.base());

    return this;
};
