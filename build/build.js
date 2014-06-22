/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~emitter@1.1.3", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("component~type@1.0.0", function (exports, module) {

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});

require.register("decanat~querystring@1.3.2", function (exports, module) {

/**
 * Module dependencies.
 */

var encode = encodeURIComponent;
var decode = decodeURIComponent;
var type = require("component~type@1.0.0");

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = str.trim();

  if ('' == str) return {};
  if ('?' == str.charAt(0)) str = str.slice(1);

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    var key = decode(parts[0]);
    var m;

    if (m = /(\w+)\[(\d+)\]/.exec(key)) {
      obj[m[1]] = obj[m[1]] || [];
      obj[m[1]][m[2]] = decode(parts[1]);
      continue;
    }

    obj[parts[0]] = null == parts[1]
      ? ''
      : decode(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];

  for (var key in obj) {
    var value = obj[key];

    if ('array' == type(value)) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
      }
      continue;
    }

    pairs.push(encode(key) + '=' + encode(obj[key]));
  }

  return pairs.join('&');
};

});

require.register("yiwn~extend@0.0.1", function (exports, module) {
module.exports = require("yiwn~extend@0.0.1/lib/extend.js");

});

require.register("yiwn~extend@0.0.1/lib/extend.js", function (exports, module) {
/**
 * Expose
 */

module.exports = extend;


/**
 * Setup prototype chain from subclasses.
 *
 * @param  {Class} Parent
 * @param  {Object} extension
 * @param  {Function} constructor [optional]
 * @return {Class}
 */

function extend (Parent, extension, constructor) {
    var next = constructor || function () {
            Parent.apply(this, arguments);
        };

    next.prototype = Object.create(Parent.prototype);
    next.prototype.constructor = next;

    // static `.extend` to child class
    next.extend = extend.bind(null, next);

    for (var i in extension)
        next.prototype[i] = extension[i];

    return next;
}

});

require.register("yiwn~merge@0.0.1", function (exports, module) {
module.exports = require("yiwn~merge@0.0.1/lib/merge.js");

});

require.register("yiwn~merge@0.0.1/lib/merge.js", function (exports, module) {
/**
 * Load dependencies
 */

var type = require("component~type@1.0.0");

/**
 * Expose `merge`
 */

module.exports = merge;


/**
 * Merge one object with another,
 * optionally keeping attributes on first.
 *
 * @param  {Object} target
 * @param  {Object} source
 * @param  {Boolean} force [optional]
 * @return {Object}
 */

function merge(target, source, force) {
    if (!source || type(source) != 'object')
        return target;

    for (var attr in source)
        if (type(target[attr]) == 'undefined' || force)
            target[attr] = source[attr];

    return target;
}

});

require.register("router", function (exports, module) {
module.exports = require("router/lib/router.js");

});

require.register("router/lib/router.js", function (exports, module) {
// Load dependencies
var Emitter = require("component~emitter@1.1.3");

var extend  = require("yiwn~extend@0.0.1"),
    merge   = require("yiwn~merge@0.0.1");

// local
var Context = require("router/lib/context.js"),
    Route   = require("router/lib/route.js");

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

});

require.register("router/lib/route.js", function (exports, module) {
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

});

require.register("router/lib/context.js", function (exports, module) {
// Load dependencies
var qs = require("decanat~querystring@1.3.2");

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

    var base = (router && router.base()) || '';

    if ('/' == path[0] && 0 !== path.indexOf(base))
        path = base + path;

    this.router = router;

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

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

    var i = path.indexOf('?');

    this.pathname = ~i ? path.slice(0, i) : path;

    this.querystring = ~i ? path.slice(i + 1) : '';
    this.query = qs.parse(this.querystring);

    this.params = [];

    // fragment
    this.hash = '';

    //
    if (!~this.path.indexOf('#'))
        return this;

    var parts = this.path.split('#');
    this.path = parts[0];
    this.hash = parts[1] || '';

    this.querystring = this.querystring.split('#')[0];
    this.query = qs.parse(this.querystring);

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
    var base = router.base(),
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

});

require("router")
