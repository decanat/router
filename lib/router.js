/**
 * Dependencies.
 */

var Emitter = require('component-emitter');

var inherit = require('yiwn-inherit'),
    extend  = require('yiwn-extend');

// local
var Context = require('./context.js'),
    Route   = require('./route.js');


/**
 * Expose `Router`.
 */

module.exports = Router;

/**
 * Expose modules.
 */

module.exports.Route = Route;
module.exports.Context = Context;


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

    this.initialize();

    return this;
}

/**
 * Setup inherit method.
 */

Router.extend = inherit.bind(null, Router);

/**
 * Make it `Emitter`.
 */

extend(Router.prototype, Emitter.prototype);


/**
 * Initialize Router with default values,
 * and apply `delegate` and `configure`.
 *
 * @return {Router}
 * @api public
 */

Router.prototype.initialize = function() {
    this.running = false;

    this.routes = [];

    this.mntPath = '';
    this.parent  = null;
    this.nodes   = [];

    delegate(this);
    configure(this);

    return this;
};


/**
 * Delegate events on initialization.
 *
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
            router.show(path, e.state, true);
        }
    }
}


/**
 * Define "dynamic" properties.
 *
 * @param {Router} router
 * @api private
 */

function configure(router) {
    // absolute mount path
    Object.defineProperty(router, 'base', {
        get: function() {
            var parent  = this.parent,
                mntPath = this.mntPath;

            if (!parent)
                return mntPath;

            return parent.base + mntPath;
        }
    });

    // top-most instance in hierarchy
    Object.defineProperty(router, 'root', {
        get: function(){
            if (!this.parent)
                return this;

            return this.parent.root;
        }
    });
}

/**
 * Plugin interface.
 *
 * @param  {Function|Object} mx
 * @return {Router}
 * @api public
 */

Router.prototype.use = function(mx) {
    if (typeof mx == 'function')
        mx.call(this);
    return extend(this, mx);
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

    // remove trailing slash, add leading
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
 * Boot the router.
 *
 * @param  {Boolean} dispatch [optional]
 * @return {Router}
 */

Router.prototype.listen = function(dispatch) {
    if (this.running)
        return this;

    if (this.root !== this) {
        this.root.listen(dispatch);
        return this;
    }

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
 *
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
    if (path.charAt(0) != '/')
        path = '/' + path;

    // start dispatching from top
    if (this != this.root) {
        path = this.base + path;
        this.root.show(path, state, replace);
        return this;
    }

    var ctx  = Context(path, state, this),
        args = this.supply(path, state);

    args.unshift(ctx);

    this.dispatch.apply(this, args);

    //
    replace
        ? ctx.save()
        : ctx.pushState();

    return this;
};


/**
 * Placeholder for generating arguments array,
 * to supply to middleware.
 *
 * Is being invoked with `path` as first argument.
 *
 * @return {Array}
 * @api private
 */

Router.prototype.supply = function() {
    return [];
};


/**
 * Dispatch given context to routes.
 * Propogate to node routers.
 *
 * @param  {Context} ctx
 * @param  {Request} req
 * @return {Router}
 * @api private
 */

Router.prototype.dispatch = function(ctx) {
    // refresh ctx
    ctx.adapt(this);

    var args = [].slice.call(arguments);

    // filter routes
    var routes = this.grep(ctx.path, ctx.state),
        route, i = 0;

    // evaluate middleware
    function next() {
        if (route = routes[i++])
            route.dispatch(args, next);
    }

    next();

    // spread through the tree
    this.propogate(ctx.path, args);

    return this;
};


/**
 * Invoke `dispatch` on child nodes.
 *
 * @param  {String} path
 * @param  {Array} args
 * @return {Router}
 */

Router.prototype.propogate = function(path, args) {
    var nodes = this.nodes,
        node, i = 0;

    while (node = nodes[i++])
        // exclude nodes with obviously inappropriate `mntPath`
        if (!path.indexOf(node.mntPath))
            node.dispatch.apply(node, args);

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

