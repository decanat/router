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
require.register("component~emitter@1.1.3", Function("exports, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
\n\
//# sourceURL=components/component/emitter/1.1.3/index.js"
));

require.modules["component-emitter"] = require.modules["component~emitter@1.1.3"];
require.modules["component~emitter"] = require.modules["component~emitter@1.1.3"];
require.modules["emitter"] = require.modules["component~emitter@1.1.3"];


require.register("component~type@1.0.0", Function("exports, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
\n\
//# sourceURL=components/component/type/1.0.0/index.js"
));

require.modules["component-type"] = require.modules["component~type@1.0.0"];
require.modules["component~type"] = require.modules["component~type@1.0.0"];
require.modules["type"] = require.modules["component~type@1.0.0"];


require.register("decanat~querystring@1.3.2", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var encode = encodeURIComponent;\n\
var decode = decodeURIComponent;\n\
var type = require(\"component~type@1.0.0\");\n\
\n\
/**\n\
 * Parse the given query `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(str){\n\
  if ('string' != typeof str) return {};\n\
\n\
  str = str.trim();\n\
\n\
  if ('' == str) return {};\n\
  if ('?' == str.charAt(0)) str = str.slice(1);\n\
\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  for (var i = 0; i < pairs.length; i++) {\n\
    var parts = pairs[i].split('=');\n\
    var key = decode(parts[0]);\n\
    var m;\n\
\n\
    if (m = /(\\w+)\\[(\\d+)\\]/.exec(key)) {\n\
      obj[m[1]] = obj[m[1]] || [];\n\
      obj[m[1]][m[2]] = decode(parts[1]);\n\
      continue;\n\
    }\n\
\n\
    obj[parts[0]] = null == parts[1]\n\
      ? ''\n\
      : decode(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
};\n\
\n\
/**\n\
 * Stringify the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
exports.stringify = function(obj){\n\
  if (!obj) return '';\n\
  var pairs = [];\n\
\n\
  for (var key in obj) {\n\
    var value = obj[key];\n\
\n\
    if ('array' == type(value)) {\n\
      for (var i = 0; i < value.length; ++i) {\n\
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));\n\
      }\n\
      continue;\n\
    }\n\
\n\
    pairs.push(encode(key) + '=' + encode(obj[key]));\n\
  }\n\
\n\
  return pairs.join('&');\n\
};\n\
\n\
//# sourceURL=components/decanat/querystring/1.3.2/index.js"
));

require.modules["decanat-querystring"] = require.modules["decanat~querystring@1.3.2"];
require.modules["decanat~querystring"] = require.modules["decanat~querystring@1.3.2"];
require.modules["querystring"] = require.modules["decanat~querystring@1.3.2"];


require.register("yiwn~extend@0.0.1", Function("exports, module",
"module.exports = require(\"yiwn~extend@0.0.1/lib/extend.js\");\n\
\n\
//# sourceURL=components/yiwn/extend/0.0.1/index.js"
));

require.register("yiwn~extend@0.0.1/lib/extend.js", Function("exports, module",
"/**\n\
 * Expose\n\
 */\n\
\n\
module.exports = extend;\n\
\n\
\n\
/**\n\
 * Setup prototype chain from subclasses.\n\
 *\n\
 * @param  {Class} Parent\n\
 * @param  {Object} extension\n\
 * @param  {Function} constructor [optional]\n\
 * @return {Class}\n\
 */\n\
\n\
function extend (Parent, extension, constructor) {\n\
    var next = constructor || function () {\n\
            Parent.apply(this, arguments);\n\
        };\n\
\n\
    next.prototype = Object.create(Parent.prototype);\n\
    next.prototype.constructor = next;\n\
\n\
    // static `.extend` to child class\n\
    next.extend = extend.bind(null, next);\n\
\n\
    for (var i in extension)\n\
        next.prototype[i] = extension[i];\n\
\n\
    return next;\n\
}\n\
\n\
//# sourceURL=components/yiwn/extend/0.0.1/lib/extend.js"
));

require.modules["yiwn-extend"] = require.modules["yiwn~extend@0.0.1"];
require.modules["yiwn~extend"] = require.modules["yiwn~extend@0.0.1"];
require.modules["extend"] = require.modules["yiwn~extend@0.0.1"];


require.register("yiwn~merge@0.0.1", Function("exports, module",
"module.exports = require(\"yiwn~merge@0.0.1/lib/merge.js\");\n\
\n\
//# sourceURL=components/yiwn/merge/0.0.1/index.js"
));

require.register("yiwn~merge@0.0.1/lib/merge.js", Function("exports, module",
"/**\n\
 * Load dependencies\n\
 */\n\
\n\
var type = require(\"component~type@1.0.0\");\n\
\n\
/**\n\
 * Expose `merge`\n\
 */\n\
\n\
module.exports = merge;\n\
\n\
\n\
/**\n\
 * Merge one object with another,\n\
 * optionally keeping attributes on first.\n\
 *\n\
 * @param  {Object} target\n\
 * @param  {Object} source\n\
 * @param  {Boolean} force [optional]\n\
 * @return {Object}\n\
 */\n\
\n\
function merge(target, source, force) {\n\
    if (!source || type(source) != 'object')\n\
        return target;\n\
\n\
    for (var attr in source)\n\
        if (type(target[attr]) == 'undefined' || force)\n\
            target[attr] = source[attr];\n\
\n\
    return target;\n\
}\n\
\n\
//# sourceURL=components/yiwn/merge/0.0.1/lib/merge.js"
));

require.modules["yiwn-merge"] = require.modules["yiwn~merge@0.0.1"];
require.modules["yiwn~merge"] = require.modules["yiwn~merge@0.0.1"];
require.modules["merge"] = require.modules["yiwn~merge@0.0.1"];


require.register("router", Function("exports, module",
"module.exports = require(\"router/lib/router.js\");\n\
\n\
//# sourceURL=index.js"
));

require.register("router/lib/router.js", Function("exports, module",
"// Load dependencies\n\
var Emitter = require(\"component~emitter@1.1.3\");\n\
\n\
var extend  = require(\"yiwn~extend@0.0.1\"),\n\
    merge   = require(\"yiwn~merge@0.0.1\");\n\
\n\
// local\n\
var Context = require(\"router/lib/context.js\"),\n\
    Route   = require(\"router/lib/route.js\");\n\
\n\
// Expose\n\
module.exports = Router;\n\
\n\
\n\
// Initial properties\n\
var defaults = {\n\
        // router\n\
        running : false,\n\
        // mount\n\
        mntPath : '',\n\
        parent  : null\n\
    };\n\
\n\
\n\
/**\n\
 * Instantiate a new Router\n\
 *\n\
 * @constructor\n\
 * @return {Router}\n\
 * @api public\n\
 */\n\
\n\
function Router(){\n\
    // permit use without `new`\n\
    if (!(this instanceof Router))\n\
        return new Router();\n\
\n\
    this.nodes  = [];\n\
    this.routes = [];\n\
\n\
    merge(this, defaults);\n\
\n\
    delegate(this);\n\
\n\
    return this;\n\
}\n\
\n\
\n\
Router.extend = extend.bind(null, Router);\n\
\n\
Emitter(Router.prototype);\n\
\n\
\n\
/**\n\
 * Delegate events on initialization.\n\
 * @param  {Router} router\n\
 * @return {Router}\n\
 * @api private\n\
 */\n\
\n\
function delegate(router) {\n\
\n\
    router.on('start', function(){\n\
        window.addEventListener('popstate', onpopstate, false);\n\
    });\n\
\n\
    router.on('stop', function(){\n\
        window.removeEventListener('popstate', onpopstate, false);\n\
    });\n\
\n\
    router.on('mount', function(){\n\
        this.stopListening();\n\
    });\n\
\n\
    function onpopstate (e) {\n\
\n\
        if (e.state) {\n\
            var path = e.state.path;\n\
            console.log(path, router);\n\
            router.show(path, e.state, true);\n\
        }\n\
    }\n\
}\n\
\n\
\n\
// Placeholder for `#request`, should be overriden\n\
Router.prototype.request = function(){};\n\
\n\
\n\
// Router\n\
// ------\n\
\n\
/**\n\
 * Boot the router.\n\
 *\n\
 * @param  {Boolean} dispatch [optional]\n\
 * @return {Router}\n\
 */\n\
\n\
Router.prototype.listen = function(dispatch) {\n\
    if (this.running)\n\
        return this;\n\
\n\
    this.running = true;\n\
    this.emit('start');\n\
\n\
    if (dispatch === false)\n\
        return this;\n\
\n\
    var url = location.pathname\n\
            + location.search\n\
            + location.hash;\n\
\n\
    this.show(url, null, true);\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Turn of the router.\n\
 *\n\
 * @return {Router}\n\
 */\n\
\n\
Router.prototype.stopListening = function() {\n\
    if (!this.running)\n\
        return this;\n\
\n\
    this.running = false;\n\
    this.emit('stop');\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Register a route with given pattern,\n\
 * and add it to Router's routes collection.\n\
 * @param  {String|RegExp} pattern\n\
 * @return {Route}\n\
 * @api public\n\
 */\n\
\n\
Router.prototype.route = function(path){\n\
    var route = new Route(path);\n\
\n\
    this.routes.push(route);\n\
\n\
    return route;\n\
};\n\
\n\
\n\
/**\n\
 * Show give path.\n\
 *\n\
 * @param  {String} path\n\
 * @param  {Object} state [optional]\n\
 * @param  {Boolean} replace [optional]\n\
 * @return {Router}\n\
 * @api public\n\
 */\n\
\n\
Router.prototype.show = function(path, state, replace) {\n\
    var root = this.root();\n\
\n\
    if (path.charAt(0) != '/')\n\
        path = '/' + path;\n\
\n\
    // start dispatching from top\n\
    if (this != root) {\n\
        path = this.base() + path;\n\
        root.show(path, state, replace);\n\
        return this;\n\
    }\n\
\n\
    var ctx = Context(path, state),\n\
        req = this.request(path);\n\
\n\
    this.dispatch(ctx, req);\n\
\n\
    //\n\
    replace\n\
        ? ctx.save()\n\
        : ctx.pushState();\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Dispatch given context to routes.\n\
 *\n\
 * @param  {Context} ctx\n\
 * @param  {Request} req\n\
 * @return {Router}\n\
 * @api private\n\
 */\n\
\n\
Router.prototype.dispatch = function(ctx, req) {\n\
    // refresh ctx\n\
    ctx.adapt(this);\n\
\n\
    // filter routes\n\
    var routes = this.grep(ctx.path, ctx.state),\n\
        route, i = 0;\n\
\n\
    // evaluate middleware\n\
    function next() {\n\
        if (route = routes[i++])\n\
            route.dispatch(ctx, req, next);\n\
    }\n\
\n\
    next();\n\
\n\
    // propogate\n\
    this.each(function(node){\n\
        node.dispatch(ctx, req);\n\
    });\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Get array of Routes which satisfy given input.\n\
 *\n\
 * @param  {String} path\n\
 * @param  {Object} params\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
Router.prototype.grep = function(path, params) {\n\
    return this.routes.filter(function(route){\n\
        return route.match(path, params);\n\
    });\n\
};\n\
\n\
\n\
\n\
// Mount\n\
// -----\n\
\n\
/**\n\
 * Get absolute mount point\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
Router.prototype.base = function(){\n\
    var parent  = this.parent,\n\
        mntPath = this.mntPath;\n\
\n\
    if (!parent)\n\
        return mntPath;\n\
\n\
    return parent.base() + mntPath;\n\
};\n\
\n\
\n\
/**\n\
 * Get top-most instance in hierarchy.\n\
 *\n\
 * @return {Router}\n\
 * @api private\n\
 */\n\
\n\
Router.prototype.root = function() {\n\
    if (!this.parent)\n\
        return this;\n\
\n\
    return this.parent.root();\n\
};\n\
\n\
\n\
/**\n\
 * Mount another `Router` instance at specifies path.\n\
 *\n\
 * @param  {String} path\n\
 * @param  {Router} router\n\
 * @return {Router}\n\
 * @api public\n\
 */\n\
\n\
Router.prototype.mount = function(path, router) {\n\
    this.nodes.push(router);\n\
\n\
    path = path.replace(/^(\\/?)(.*?)(\\/?)$/, normalize);\n\
\n\
    router.parent  = this;\n\
    router.mntPath = path;\n\
\n\
    router.emit('mount', path);\n\
\n\
    function normalize(p, s, b) {\n\
        return '/' + b;\n\
    }\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Iterate over node routers performing given function.\n\
 *\n\
 * @param  {Function} fn\n\
 * @return {Mounter}\n\
 * @api private\n\
 */\n\
\n\
Router.prototype.each = function(fn) {\n\
    var routers = this.nodes;\n\
\n\
    if (!routers.length)\n\
        return this;\n\
\n\
    var router, i = 0;\n\
\n\
    while (router = routers[i++])\n\
        fn.call(this, router, router.base());\n\
\n\
    return this;\n\
};\n\
\n\
//# sourceURL=lib/router.js"
));

require.register("router/lib/route.js", Function("exports, module",
"// Shim\n\
var slice = [].slice;\n\
\n\
// Expose\n\
module.exports = Route;\n\
\n\
/**\n\
 * Initialize `Route` with the given HTTP `path`.\n\
 *\n\
 * @param {String} path\n\
 * @param {Object} options.\n\
 * @api private\n\
 */\n\
\n\
function Route(path) {\n\
    if (!(this instanceof Route))\n\
        return new Route(path);\n\
\n\
    this.path = path;\n\
    this.keys = [];\n\
\n\
    this.wares  = [];\n\
\n\
    this.regexp = pathtoRegexp(path, this.keys);\n\
\n\
    return this;\n\
}\n\
\n\
\n\
/**\n\
 * Add middleware\n\
 *\n\
 * @param  {Function} fn\n\
 * @return {Route}\n\
 * @api public\n\
 */\n\
\n\
Route.prototype.use = function(fn) {\n\
    var wares = this.wares,\n\
        fns   = slice.call(arguments);\n\
\n\
    while (fn = fns.shift())\n\
        wares.push(fn);\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Dispatch\n\
 * @param  {Context} ctx\n\
 * @param  {Request|Null} req\n\
 * @param  {Function} done\n\
 * @return {Route}\n\
 * @api private\n\
 */\n\
\n\
Route.prototype.dispatch = function(ctx, req, done) {\n\
    this.populate(ctx.path, ctx.params);\n\
\n\
    var wares = this.wares,\n\
        index = 0, fn;\n\
\n\
    function next() {\n\
        if (fn = wares[index++])\n\
            return fn(ctx, req, next);\n\
        done();\n\
    }\n\
\n\
    next();\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Check if this route matches `path`.\n\
 *\n\
 * @param {String} path\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
Route.prototype.match = function(path){\n\
    // ignore querystring\n\
    path = path.split('?').shift();\n\
    // sanitize to url-safe\n\
    path = decodeURIComponent(path);\n\
\n\
    return this.regexp.test(path);\n\
};\n\
\n\
\n\
/**\n\
 * Check if this route matches `path`. if so\n\
 * populate `params`.\n\
 *\n\
 * @param {String} path\n\
 * @param {Array} params\n\
 * @return {Boolean}\n\
 * @api private\n\
 */\n\
\n\
Route.prototype.populate = function(path, params){\n\
\n\
    // ignore querystring\n\
    path = path.split('?').shift();\n\
\n\
    var keys    = this.keys,\n\
        matches = this.regexp.exec(decodeURIComponent(path));\n\
\n\
    if (!matches) return false;\n\
\n\
    var match, i = 1;\n\
\n\
    while (match = matches[i++]) {\n\
        var key = keys[i - 2];\n\
\n\
        if (typeof match == 'string')\n\
            match = decodeURIComponent(match);\n\
\n\
        if (!key) {\n\
            params.push(match);\n\
            continue;\n\
        }\n\
\n\
        if (params[key.name] === void 0)\n\
            params[key.name] = match;\n\
    }\n\
\n\
    return true;\n\
};\n\
\n\
\n\
/**\n\
 * Normalize the given path string,\n\
 * returning a regular expression.\n\
 *\n\
 * An empty array should be passed,\n\
 * which will contain the placeholder\n\
 * key names. For example \"/user/:id\" will\n\
 * then contain [\"id\"].\n\
 *\n\
 * @param  {String|RegExp|Array} path\n\
 * @param  {Array} keys\n\
 * @return {RegExp}\n\
 * @api private\n\
 */\n\
\n\
function pathtoRegexp(path, keys) {\n\
    if (path instanceof RegExp) return path;\n\
\n\
    if (path instanceof Array)\n\
        path = '(' + path.join('|') + ')';\n\
\n\
    path = path\n\
        .concat('/?')\n\
        .replace(/\\/\\(/g, '(?:/')\n\
        .replace(/(\\/)?(\\.)?:(\\w+)(?:(\\(.*?\\)))?(\\?)?/g, replace)\n\
        .replace(/([\\/.])/g, '\\\\$1')\n\
        .replace(/\\*/g, '(.*)');\n\
\n\
    function replace(_, slash, format, key, capture, optional){\n\
        keys.push({ name: key, optional: !! optional });\n\
        slash = slash || '';\n\
        return ''\n\
            + (optional ? '' : slash)\n\
            + '(?:'\n\
            + (optional ? slash : '')\n\
            + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'\n\
            + (optional || '');\n\
    }\n\
\n\
    return new RegExp('^' + path + '$', 'i');\n\
}\n\
\n\
//# sourceURL=lib/route.js"
));

require.register("router/lib/context.js", Function("exports, module",
"// Load dependencies\n\
var qs = require(\"decanat~querystring@1.3.2\");\n\
\n\
// Expose\n\
module.exports = Context;\n\
\n\
\n\
/**\n\
 * Initialize a new \"request\" `Context`\n\
 * with the given `path` and optional initial `state`\n\
 *\n\
 * Given `path` is \"canonical\" path,\n\
 * which internally transforms based on mounted path.\n\
 *\n\
 * @constructor\n\
 * @param {String} path\n\
 * @param {Object} state [optional]\n\
 * @param {Router} router\n\
 * @return {Context}\n\
 * @api public\n\
 */\n\
\n\
function Context(path, state, router) {\n\
    if (! (this instanceof Context))\n\
        return new Context(path, state, router);\n\
\n\
    var base = (router && router.base()) || '';\n\
\n\
    if ('/' == path[0] && 0 !== path.indexOf(base))\n\
        path = base + path;\n\
\n\
    this.router = router;\n\
\n\
    this.canonicalPath = path;\n\
    this.path = path.replace(base, '') || '/';\n\
\n\
    return this.populate(path, state);\n\
}\n\
\n\
\n\
/**\n\
 * Populate params.\n\
 *\n\
 * @param  {String} path\n\
 * @param  {Object} state [optional]\n\
 * @return {Context}\n\
 * @api private\n\
 */\n\
\n\
Context.prototype.populate = function(path, state){\n\
    this.title = document.title;\n\
\n\
    this.state = state || {};\n\
    this.state.path = path;\n\
\n\
    var i = path.indexOf('?');\n\
\n\
    this.pathname = ~i ? path.slice(0, i) : path;\n\
\n\
    this.querystring = ~i ? path.slice(i + 1) : '';\n\
    this.query = qs.parse(this.querystring);\n\
\n\
    this.params = [];\n\
\n\
    // fragment\n\
    this.hash = '';\n\
\n\
    //\n\
    if (!~this.path.indexOf('#'))\n\
        return this;\n\
\n\
    var parts = this.path.split('#');\n\
    this.path = parts[0];\n\
    this.hash = parts[1] || '';\n\
\n\
    this.querystring = this.querystring.split('#')[0];\n\
    this.query = qs.parse(this.querystring);\n\
\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Setup itself relative to `router`.\n\
 *\n\
 * @param  {Router} router\n\
 * @return {Context}\n\
 * @api private\n\
 */\n\
\n\
Context.prototype.adapt = function(router) {\n\
    var base = router.base(),\n\
        path = this.canonicalPath;\n\
\n\
    if (path.indexOf(base) === 0)\n\
        this.path = path.replace(base, '');\n\
\n\
    this.router = router;\n\
\n\
    return this;\n\
};\n\
\n\
/**\n\
 * Push state.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Context.prototype.pushState = function(){\n\
    history.pushState(this.state, this.title, this.canonicalPath);\n\
    return this;\n\
};\n\
\n\
\n\
/**\n\
 * Save the context state.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
Context.prototype.save = function(){\n\
    history.replaceState(this.state, this.title, this.canonicalPath);\n\
    return this;\n\
};\n\
\n\
//# sourceURL=lib/context.js"
));

require.modules["router"] = require.modules["router"];


require("router")
