/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.8, @license MIT */

;(function(window, undefined) {
  'use strict';
var riot = { version: 'v2.6.8', settings: {} },
  // be aware, internal usage
  // ATTENTION: prefix the global dynamic variables with `__`

  // counter to give a unique id to all the Tag instances
  __uid = 0,
  // tags instances cache
  __virtualDom = [],
  // tags implementation cache
  __tagImpl = {},

  /**
   * Const
   */
  GLOBAL_MIXIN = '__global_mixin',

  // riot specific prefixes
  RIOT_PREFIX = 'riot-',
  RIOT_TAG = RIOT_PREFIX + 'tag',
  RIOT_TAG_IS = 'data-is',

  // for typeof == '' comparisons
  T_STRING = 'string',
  T_OBJECT = 'object',
  T_UNDEF  = 'undefined',
  T_FUNCTION = 'function',
  XLINK_NS = 'http://www.w3.org/1999/xlink',
  XLINK_REGEX = /^xlink:(\w+)/,
  // special native tags that cannot be treated like the others
  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],

  // version# for IE 8-11, 0 for others
  IE_VERSION = (window && window.document || {}).documentMode | 0,

  // detect firefox to fix #1374
  FIREFOX = window && !!window.InstallTrigger
/* istanbul ignore next */
riot.observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice

  /**
   * Private Methods
   */

  /**
   * Helper function needed to get and loop all the events in a string
   * @param   { String }   e - event string
   * @param   {Function}   fn - callback
   */
  function onEachEvent(e, fn) {
    var es = e.split(' '), l = es.length, i = 0
    for (; i < l; i++) {
      var name = es[i]
      if (name) fn(name, i)
    }
  }

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(events, fn) {
        if (events == '*' && !fn) callbacks = {}
        else {
          onEachEvent(events, function(name, pos) {
            if (fn) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn) arr.splice(i--, 1)
              }
            } else delete callbacks[name]
          })
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(events, fn) {
        function on() {
          el.off(events, on)
          fn.apply(el, arguments)
        }
        return el.on(events, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
    trigger: {
      value: function(events) {

        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns

        for (var i = 0; i < arglen; i++) {
          args[i] = arguments[i + 1] // skip first argument
        }

        onEachEvent(events, function(name, pos) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) continue
            fn.busy = 1
            fn.apply(el, fn.typed ? [name].concat(args) : args)
            if (fns[i] !== fn) { i-- }
            fn.busy = 0
          }

          if (callbacks['*'] && name != '*')
            el.trigger.apply(el, ['*', name].concat(args))

        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  })

  return el

}
/* istanbul ignore next */
;(function(riot) {

/**
 * Simple client-side router
 * @module riot-route
 */


var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
  EVENT_LISTENER = 'EventListener',
  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
  HAS_ATTRIBUTE = 'hasAttribute',
  REPLACE = 'replace',
  POPSTATE = 'popstate',
  HASHCHANGE = 'hashchange',
  TRIGGER = 'trigger',
  MAX_EMIT_STACK_LEVEL = 3,
  win = typeof window != 'undefined' && window,
  doc = typeof document != 'undefined' && document,
  hist = win && history,
  loc = win && (hist.location || win.location), // see html5-history-api
  prot = Router.prototype, // to minify more
  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
  started = false,
  central = riot.observable(),
  routeFound = false,
  debouncedEmit,
  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
function DEFAULT_PARSER(path) {
  return path.split(/[/?#]/)
}

/**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
function DEFAULT_SECOND_PARSER(path, filter) {
  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
    args = path.match(re)

  if (args) return args.slice(1)
}

/**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
function debounce(fn, delay) {
  var t
  return function () {
    clearTimeout(t)
    t = setTimeout(fn, delay)
  }
}

/**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
function start(autoExec) {
  debouncedEmit = debounce(emit, 1)
  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
  doc[ADD_EVENT_LISTENER](clickEvent, click)
  if (autoExec) emit(true)
}

/**
 * Router class
 */
function Router() {
  this.$ = []
  riot.observable(this) // make it observable
  central.on('stop', this.s.bind(this))
  central.on('emit', this.e.bind(this))
}

function normalize(path) {
  return path[REPLACE](/^\/|\/$/, '')
}

function isString(str) {
  return typeof str == 'string'
}

/**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
function getPathFromRoot(href) {
  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
}

/**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
function getPathFromBase(href) {
  return base[0] == '#'
    ? (href || loc.href || '').split(base)[1] || ''
    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
}

function emit(force) {
  // the stack is needed for redirections
  var isRoot = emitStackLevel == 0, first
  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

  emitStackLevel++
  emitStack.push(function() {
    var path = getPathFromBase()
    if (force || path != current) {
      central[TRIGGER]('emit', path)
      current = path
    }
  })
  if (isRoot) {
    while (first = emitStack.shift()) first() // stack increses within this call
    emitStackLevel = 0
  }
}

function click(e) {
  if (
    e.which != 1 // not left click
    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
    || e.defaultPrevented // or default prevented
  ) return

  var el = e.target
  while (el && el.nodeName != 'A') el = el.parentNode

  if (
    !el || el.nodeName != 'A' // not A tag
    || el[HAS_ATTRIBUTE]('download') // has download attr
    || !el[HAS_ATTRIBUTE]('href') // has no href attr
    || el.target && el.target != '_self' // another window or frame
    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
  ) return

  if (el.href != loc.href
    && (
      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
    )) return

  e.preventDefault()
}

/**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @param {boolean} shouldReplace - use replaceState or pushState
 * @returns {boolean} - route not found flag
 */
function go(path, title, shouldReplace) {
  // Server-side usage: directly execute handlers for the path
  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

  path = base + normalize(path)
  title = title || doc.title
  // browsers ignores the second parameter `title`
  shouldReplace
    ? hist.replaceState(null, title, path)
    : hist.pushState(null, title, path)
  // so we need to set it manually
  doc.title = title
  routeFound = false
  emit()
  return routeFound
}

/**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * two strings and boolean:        replace history with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 * @param {boolean} third - replace flag
 */
prot.m = function(first, second, third) {
  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
  else if (second) this.r(first, second)
  else this.r('@', first)
}

/**
 * Stop routing
 */
prot.s = function() {
  this.off('*')
  this.$ = []
}

/**
 * Emit
 * @param {string} path - path
 */
prot.e = function(path) {
  this.$.concat('@').some(function(filter) {
    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
    if (typeof args != 'undefined') {
      this[TRIGGER].apply(null, [filter].concat(args))
      return routeFound = true // exit from loop
    }
  }, this)
}

/**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
prot.r = function(filter, action) {
  if (filter != '@') {
    filter = '/' + normalize(filter)
    this.$.push(filter)
  }
  this.on(filter, action)
}

var mainRouter = new Router()
var route = mainRouter.m.bind(mainRouter)

/**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
route.create = function() {
  var newSubRouter = new Router()
  // assign sub-router's main method
  var router = newSubRouter.m.bind(newSubRouter)
  // stop only this sub-router
  router.stop = newSubRouter.s.bind(newSubRouter)
  return router
}

/**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
route.base = function(arg) {
  base = arg || '#'
  current = getPathFromBase() // recalculate current path
}

/** Exec routing right now **/
route.exec = function() {
  emit(true)
}

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
route.parser = function(fn, fn2) {
  if (!fn && !fn2) {
    // reset parser for testing...
    parser = DEFAULT_PARSER
    secondParser = DEFAULT_SECOND_PARSER
  }
  if (fn) parser = fn
  if (fn2) secondParser = fn2
}

/**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
route.query = function() {
  var q = {}
  var href = loc.href || current
  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
  return q
}

/** Stop routing **/
route.stop = function () {
  if (started) {
    if (win) {
      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
    }
    central[TRIGGER]('stop')
    started = false
  }
}

/**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
route.start = function (autoExec) {
  if (!started) {
    if (win) {
      if (document.readyState == 'complete') start(autoExec)
      // the timeout is needed to solve
      // a weird safari bug https://github.com/riot/route/issues/33
      else win[ADD_EVENT_LISTENER]('load', function() {
        setTimeout(function() { start(autoExec) }, 1)
      })
    }
    started = true
  }
}

/** Prepare the router **/
route.base()
route.parser()

riot.route = route
})(riot)
/* istanbul ignore next */

/**
 * The riot template engine
 * @version v2.4.2
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
    },

    DEFAULT = '{ }'

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ]

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) bp = _cache
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) return _pairs

    var arr = pair.split(' ')

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
    arr[6] = _rewrite(_pairs[6], arr)
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
    arr[8] = pair
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) _bp = _cache

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6]

    isexpr = start = re.lastIndex = 0

    while ((match = re.exec(str))) {

      pos = match.index

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
          continue
        }
        if (!match[3]) {
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos))
        start = re.lastIndex
        re = _bp[6 + (isexpr ^= 1)]
        re.lastIndex = start
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start))
    }

    return parts

    function unescapeStr (s) {
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'))
      } else {
        parts.push(s)
      }
    }

    function skipBraces (s, ch, ix) {
      var
        match,
        recch = FINDBRACES[ch]

      recch.lastIndex = ix
      ix = 1
      while ((match = recch.exec(s))) {
        if (match[1] &&
          !(match[1] === ch ? ++ix : --ix)) break
      }
      return ix ? s.length : recch.lastIndex
    }
  }

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  }

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9])

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  }

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  }

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair)
      _regex = pair === DEFAULT ? _loopback : _rewrite
      _cache[9] = _regex(_pairs[9])
    }
    cachedBrackets = pair
  }

  function _setSettings (o) {
    var b

    o = o || {}
    b = o.brackets
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    })
    _settings = o
    _reset(b)
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  })

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
  _brackets.set = _reset

  _brackets.R_STRINGS = R_STRINGS
  _brackets.R_MLCOMMS = R_MLCOMMS
  _brackets.S_QBLOCKS = S_QBLOCKS

  return _brackets

})()

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

var tmpl = (function () {

  var _cache = {}

  function _tmpl (str, data) {
    if (!str) return str

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.haveRaw = brackets.hasRaw

  _tmpl.hasExpr = brackets.hasExpr

  _tmpl.loopKeys = brackets.loopKeys

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {} }

  _tmpl.errorHandler = null

  function _logErr (err, ctx) {

    if (_tmpl.errorHandler) {

      err.riotData = {
        tagName: ctx && ctx.root && ctx.root.tagName,
        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
      }
      _tmpl.errorHandler(err)
    }
  }

  function _create (str) {
    var expr = _getTmpl(str)

    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var
    CH_IDEXPR = String.fromCharCode(0x2057),
    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g

  function _getTmpl (str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)

    if (parts.length > 2 || parts[0]) {
      var i, j, list = []

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i]

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) list[j++] = expr

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")'

    } else {

      expr = _parseExpr(parts[1], 0, qstr)
    }

    if (qstr[0]) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      })
    }
    return expr
  }

  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    }

  function _parseExpr (expr, asText, qstr) {

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

    if (expr) {
      var
        list = [],
        cnt = 0,
        match

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g

        expr = RegExp.rightContext
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

        jsb  = expr.slice(0, match.index)
        expr = RegExp.rightContext

        list[cnt++] = _wrapExpr(jsb, 1, key)
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch]

      ir.lastIndex = re.lastIndex
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) ++lv
        else if (!--lv) break
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/

  function _wrapExpr (expr, asText, key) {
    var tb

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar
          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos))
        }
      }
      return match
    })

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""'

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)'
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v2.4.2'

  return _tmpl

})()

/*
  lib/browser/tag/mkdom.js

  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/
var mkdom = (function _mkdom() {
  var
    reHasYield  = /<yield\b/i,
    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
  var
    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
    tblTags = IE_VERSION && IE_VERSION < 10
      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/

  /**
   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
   *
   * @param   { String } templ  - The template coming from the custom tag definition
   * @param   { String } [html] - HTML content that comes from the DOM element where you
   *           will mount the tag, mostly the original tag in the page
   * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
   */
  function _mkdom(templ, html, checkSvg) {
    var
      match   = templ && templ.match(/^\s*<([-\w]+)/),
      tagName = match && match[1].toLowerCase(),
      el = mkEl('div', checkSvg && isSVGTag(tagName))

    // replace all the yield tags with the tag inner html
    templ = replaceYield(templ, html)

    /* istanbul ignore next */
    if (tblTags.test(tagName))
      el = specialTags(el, templ, tagName)
    else
      setInnerHTML(el, templ)

    el.stub = true

    return el
  }

  /*
    Creates the root element for table or select child elements:
    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
  */
  function specialTags(el, templ, tagName) {
    var
      select = tagName[0] === 'o',
      parent = select ? 'select>' : 'table>'

    // trim() is important here, this ensures we don't have artifacts,
    // so we can check if we have only one element inside the parent
    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
    parent = el.firstChild

    // returns the immediate parent if tr/th/td/col is the only element, if not
    // returns the whole tree, as this can include additional elements
    if (select) {
      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
    } else {
      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
      var tname = rootEls[tagName]
      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
    }
    return parent
  }

  /*
    Replace the yield tag from any tag template with the innerHTML of the
    original tag in the page
  */
  function replaceYield(templ, html) {
    // do nothing if no yield
    if (!reHasYield.test(templ)) return templ

    // be careful with #1343 - string on the source having `$1`
    var src = {}

    html = html && html.replace(reYieldSrc, function (_, ref, text) {
      src[ref] = src[ref] || text   // preserve first definition
      return ''
    }).trim()

    return templ
      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
        return src[ref] || def || ''
      })
      .replace(reYieldAll, function (_, def) {        // yield without any "from"
        return html || def || ''
      })
  }

  return _mkdom

})()

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val) {
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {

  var i = tags.length,
    j = items.length,
    t

  while (i > j) {
    t = tags[--i]
    tags.splice(i, 1)
    t.unmount()
  }
}

/**
 * Move the nested custom tags in non custom loop tags
 * @param   { Object } child - non custom loop tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(child, i) {
  Object.keys(child.tags).forEach(function(tagName) {
    var tag = child.tags[tagName]
    if (isArray(tag))
      each(tag, function (t) {
        moveChildTag(t, tagName, i)
      })
    else
      moveChildTag(tag, tagName, i)
  })
}

/**
 * Adds the elements for a virtual tag
 * @param { Tag } tag - the tag whose root's children will be inserted or appended
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function addVirtual(tag, src, target) {
  var el = tag._root, sib
  tag._virts = []
  while (el) {
    sib = el.nextSibling
    if (target)
      src.insertBefore(el, target._root)
    else
      src.appendChild(el)

    tag._virts.push(el) // hold for unmounting
    el = sib
  }
}

/**
 * Move virtual tag and all child nodes
 * @param { Tag } tag - first child reference used to start move
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 * @param { Number } len - how many child nodes to move
 */
function moveVirtual(tag, src, target, len) {
  var el = tag._root, sib, i = 0
  for (; i < len; i++) {
    sib = el.nextSibling
    src.insertBefore(el, target._root)
    el = sib
  }
}

/**
 * Insert a new tag avoiding the insert for the conditional tags
 * @param   {Boolean} isVirtual [description]
 * @param   { Tag }  prevTag - tag instance used as reference to prepend our new tag
 * @param   { Tag }  newTag - new tag to be inserted
 * @param   { HTMLElement }  root - loop parent node
 * @param   { Array }  tags - array containing the current tags list
 * @param   { Function }  virtualFn - callback needed to move or insert virtual DOM
 * @param   { Object } dom - DOM node we need to loop
 */
function insertTag(isVirtual, prevTag, newTag, root, tags, virtualFn, dom) {
  if (isInStub(prevTag.root)) return
  if (isVirtual) virtualFn(prevTag, root, newTag, dom.childNodes.length)
  else root.insertBefore(prevTag.root, newTag.root) // #1374 some browsers reset selected here
}


/**
 * Manage tags having the 'each'
 * @param   { Object } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, 'each')

  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
    tagName = getTagName(dom),
    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
    root = dom.parentNode,
    ref = document.createTextNode(''),
    child = getTag(dom),
    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
    tags = [],
    oldItems = [],
    hasKeys,
    isVirtual = dom.tagName == 'VIRTUAL'

  // parse the each expression
  expr = tmpl.loopKeys(expr)

  // insert a marked where the loop tags will be injected
  root.insertBefore(ref, dom)

  // clean template code
  parent.one('before-mount', function () {

    // remove the original DOM node
    dom.parentNode.removeChild(dom)
    if (root.stub) root = parent.root

  }).on('update', function () {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      // create a fragment to hold the new DOM nodes to inject in the parent tag
      frag = document.createDocumentFragment()

    // object loop. any changes cause full redraw
    if (!isArray(items)) {
      hasKeys = items || false
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, key, items[key])
        }) : []
    }

    // loop all the new items
    var i = 0,
      itemsLength = items.length

    for (; i < itemsLength; i++) {
      // reorder only if the items are objects
      var
        item = items[i],
        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        pos = ~oldPos && _mustReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos]

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item

      // new tag
      if (
        !_mustReorder && !tag // with no-reorder we just update the old tags
        ||
        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
      ) {

        tag = new Tag(impl, {
          parent: parent,
          isLoop: true,
          hasImpl: !!__tagImpl[tagName],
          root: useRoot ? root : dom.cloneNode(),
          item: item
        }, dom.innerHTML)

        tag.mount()

        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
        // this tag must be appended
        if (i == tags.length || !tags[i]) { // fix 1581
          if (isVirtual)
            addVirtual(tag, frag)
          else frag.appendChild(tag.root)
        }
        // this tag must be insert
        else {
          insertTag(isVirtual, tag, tags[i], root, tags, addVirtual, dom)
          oldItems.splice(i, 0, item)
        }

        tags.splice(i, 0, tag)
        pos = i // handled here so no move
      } else tag.update(item, true)

      // reorder the tag if it's not located in its previous position
      if (
        pos !== i && _mustReorder &&
        tags[i] // fix 1581 unable to reproduce it in a test!
      ) {
        // #closes 2040 PLEASE DON'T REMOVE IT!
        // there are no tests for this feature
        if (contains(items, oldItems[i]))
          insertTag(isVirtual, tag, tags[i], root, tags, moveVirtual, dom)

        // update the position attribute if it exists
        if (expr.pos)
          tag[expr.pos] = i
        // move the old tag instance
        tags.splice(i, 0, tags.splice(pos, 1)[0])
        // move the old item
        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) moveNestedTags(tag, i)
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag._item = item
      // cache the real parent tag internally
      defineProperty(tag, '_parent', parent)
    }

    // remove the redundant tags
    unmountRedundant(items, tags)

    // insert the new nodes
    root.insertBefore(frag, ref)
    if (isOption) {

      // #1374 FireFox bug in <option selected={expression}>
      if (FIREFOX && !root.multiple) {
        for (var n = 0; n < root.length; n++) {
          if (root[n].__riot1374) {
            root.selectedIndex = n  // clear other options
            delete root[n].__riot1374
            break
          }
        }
      }
    }

    // set the 'tags' property of the parent tag
    // if child is 'undefined' it means that we don't need to set this property
    // for example:
    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
    if (child) parent.tags[tagName] = tags

    // clone the items array
    oldItems = items.slice()

  })

}
/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = (function(_riot) {

  if (!window) return { // skip injection on the server
    add: function () {},
    inject: function () {}
  }

  var styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style')
    setAttr(newNode, 'type', 'text/css')

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]')
    if (userNode) {
      if (userNode.id) newNode.id = userNode.id
      userNode.parentNode.replaceChild(newNode, userNode)
    }
    else document.getElementsByTagName('head')[0].appendChild(newNode)

    return newNode
  })()

  // Create cache and shortcut to the correct property
  var cssTextProp = styleNode.styleSheet,
    stylesToInject = ''

  // Expose the style node in a non-modificable property
  Object.defineProperty(_riot, 'styleNode', {
    value: styleNode,
    writable: true
  })

  /**
   * Public api
   */
  return {
    /**
     * Save a tag style to be later injected into DOM
     * @param   { String } css [description]
     */
    add: function(css) {
      stylesToInject += css
    },
    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     */
    inject: function() {
      if (stylesToInject) {
        if (cssTextProp) cssTextProp.cssText += stylesToInject
        else styleNode.innerHTML += stylesToInject
        stylesToInject = ''
      }
    }
  }

})(riot)


function parseNamedElements(root, tag, childTags, forceParsingNamed) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = dom.isLoop ||
                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
                    ? 1 : 0

      // custom child tag
      if (childTags) {
        var child = getTag(dom)

        if (child && !dom.isLoop)
          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
      }

      if (!dom.isLoop || forceParsingNamed)
        setNamed(dom, tag, [])
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (tmpl.hasExpr(val)) {
      expressions.push(extend({ dom: dom, expr: val }, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType,
      attr

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    attr = getAttr(dom, 'each')

    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
    opts = inherit(conf.opts) || {},
    parent = conf.parent,
    isLoop = conf.isLoop,
    hasImpl = conf.hasImpl,
    item = cleanUpData(conf.item),
    expressions = [],
    childTags = [],
    root = conf.root,
    tagName = root.tagName.toLowerCase(),
    attr = {},
    propsInSyncWithParent = [],
    dom

  // only call unmount if we have a valid __tagImpl (has name property)
  if (impl.name && root._tag) root._tag.unmount(true)

  // not yet mounted
  this.isMounted = false
  root.isLoop = isLoop

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

  extend(this, { parent: parent, root: root, opts: opts}, item)
  // protect the "tags" property from being overridden
  defineProperty(this, 'tags', {})

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (tmpl.hasExpr(val)) attr[el.name] = val
  })

  dom = mkdom(impl.tmpl, innerHTML, isLoop)

  // options
  function updateOpts() {
    var ctx = hasImpl && isLoop ? self : parent || self

    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      if (el.name in attr) return
      var val = el.value
      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[toCamel(name)] = tmpl(attr[name], ctx)
    })
  }

  function normalizeData(data) {
    for (var key in item) {
      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
        self[key] = data[key]
    }
  }

  function inheritFrom(target) {
    each(Object.keys(target), function(k) {
      // some properties must be always in sync with the parent tag
      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)

      if (typeof self[k] === T_UNDEF || mustSync) {
        // track the property to keep in sync
        // so we can keep it updated
        if (!mustSync) propsInSyncWithParent.push(k)
        self[k] = target[k]
      }
    })
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @param   { Boolean } isInherited - is this update coming from a parent tag?
   * @returns { self }
   */
  defineProperty(this, 'update', function(data, isInherited) {

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data)
    // inherit properties from the parent in loop
    if (isLoop) {
      inheritFrom(self.parent)
    }
    // normalize the tag properties in case an item object was initially passed
    if (data && isObject(item)) {
      normalizeData(data)
      item = data
    }
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self)

    // the updated event will be triggered
    // once the DOM will be ready and all the re-flows are completed
    // this is useful if you want to get the "real" root properties
    // 4 ex: root.offsetWidth ...
    if (isInherited && self.parent)
      // closes #1599
      self.parent.one('updated', function() { self.trigger('updated') })
    else rAF(function() { self.trigger('updated') })

    return this
  })

  defineProperty(this, 'mixin', function() {
    each(arguments, function(mix) {
      var instance,
        props = [],
        obj

      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix()
      } else instance = mix

      var proto = Object.getPrototypeOf(instance)

      // build multilevel prototype inheritance chain property list
      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function(key) {
        // bind methods to self
        // allow mixins to override other properties/parent mixins
        if (key != 'init') {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)

          // apply method only if it does not already exist on the instance
          if (!self.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(self, key, descriptor)
          } else {
            self[key] = isFunction(instance[key]) ?
              instance[key].bind(self) :
              instance[key]
          }
        }
      })

      // init method will be called automatically
      if (instance.init) instance.init.bind(self)()
    })
    return this
  })

  defineProperty(this, 'mount', function() {

    updateOpts()

    // add global mixins
    var globalMixin = riot.mixin(GLOBAL_MIXIN)

    if (globalMixin)
      for (var i in globalMixin)
        if (globalMixin.hasOwnProperty(i))
          self.mixin(globalMixin[i])

    // children in loop should inherit from true parent
    if (self._parent && self._parent.root.isLoop) {
      inheritFrom(self._parent)
    }

    // initialiation
    if (impl.fn) impl.fn.call(self, opts)

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    // mount the child tags
    toggle(true)

    // update the root adding custom attributes coming from the compiler
    // it fixes also #1087
    if (impl.attrs)
      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
    if (impl.attrs || hasImpl)
      parseExpressions(self.root, self, expressions)

    if (!self.parent || isLoop) self.update(item)

    // internal use only, fixes #403
    self.trigger('before-mount')

    if (isLoop && !hasImpl) {
      // update the root attribute for the looped elements
      root = dom.firstChild
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) root = parent.root
    }

    defineProperty(self, 'root', root)

    // parse the named dom nodes in the looped child
    // adding them to the parent as well
    if (isLoop)
      parseNamedElements(self.root, self.parent, null, true)

    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  })


  defineProperty(this, 'unmount', function(keepRootTag) {
    var el = root,
      p = el.parentNode,
      ptag,
      tagIndex = __virtualDom.indexOf(self)

    self.trigger('before-unmount')

    // remove this tag instance from the global virtualDom variable
    if (~tagIndex)
      __virtualDom.splice(tagIndex, 1)

    if (p) {

      if (parent) {
        ptag = getImmediateCustomParentTag(parent)
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(ptag.tags[tagName]))
          each(ptag.tags[tagName], function(tag, i) {
            if (tag._riot_id == self._riot_id)
              ptag.tags[tagName].splice(i, 1)
          })
        else
          // otherwise just delete the tag instance
          ptag.tags[tagName] = undefined
      }

      else
        while (el.firstChild) el.removeChild(el.firstChild)

      if (!keepRootTag)
        p.removeChild(el)
      else {
        // the riot-tag and the data-is attributes aren't needed anymore, remove them
        remAttr(p, RIOT_TAG_IS)
        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
      }

    }

    if (this._virts) {
      each(this._virts, function(v) {
        if (v.parentNode) v.parentNode.removeChild(v)
      })
    }

    self.trigger('unmount')
    toggle()
    self.off('*')
    self.isMounted = false
    delete root._tag

  })

  // proxy function to bind updates
  // dispatched from a parent tag
  function onChildUpdate(data) { self.update(data, true) }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (!parent) return
    var evt = isMount ? 'on' : 'off'

    // the loop tags will be always in sync with the parent automatically
    if (isLoop)
      parent[evt]('unmount', self.unmount)
    else {
      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
    }
  }


  // named elements available for fn
  parseNamedElements(dom, this, childTags)

}
/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {

  dom[name] = function(e) {

    var ptag = tag._parent,
      item = tag._item,
      el

    if (!item)
      while (ptag && !item) {
        item = ptag._item
        ptag = ptag._parent
      }

    // cross browser event fix
    e = e || window.event

    // override the event properties
    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
    if (isWritable(e, 'target')) e.target = e.srcElement
    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

    e.item = item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      el = item ? getImmediateCustomParentTag(ptag) : tag
      el.update()
    }

  }

}


/**
 * Insert a DOM node replacing another one (used by if- attribute)
 * @param   { Object } root - parent node
 * @param   { Object } node - node replaced
 * @param   { Object } before - node added
 */
function insertTo(root, node, before) {
  if (!root) return
  root.insertBefore(before, node)
  root.removeChild(node)
}

/**
 * Update the expressions in a Tag instance
 * @param   { Array } expressions - expression that must be re evaluated
 * @param   { Tag } tag - tag instance
 */
function update(expressions, tag) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
      attrName = expr.attr,
      value = tmpl(expr.expr, tag),
      parent = expr.parent || expr.dom.parentNode

    if (expr.bool) {
      value = !!value
    } else if (value == null) {
      value = ''
    }

    // #1638: regression of #1612, update the dom only if the value of the
    // expression was changed
    if (expr.value === value) {
      return
    }
    expr.value = value

    // textarea and text nodes has no attribute name
    if (!attrName) {
      // about #815 w/o replace: the browser converts the value to a string,
      // the comparison by "==" does too, but not in the server
      value += ''
      // test for parent avoids error with invalid assignment to nodeValue
      if (parent) {
        // cache the parent node because somehow it will become null on IE
        // on the next iteration
        expr.parent = parent
        if (parent.tagName === 'TEXTAREA') {
          parent.value = value                    // #1113
          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
        }                                         // will be available on 'updated'
        else dom.nodeValue = value
      }
      return
    }

    // ~~#1612: look for changes in dom.value when updating the value~~
    if (attrName === 'value') {
      if (dom.value !== value) {
        dom.value = value
        setAttr(dom, attrName, value)
      }
      return
    } else {
      // remove original attribute
      remAttr(dom, attrName)
    }

    // event handler
    if (isFunction(value)) {
      setEventHandler(attrName, value, dom, tag)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub,
        add = function() { insertTo(stub.parentNode, stub, dom) },
        remove = function() { insertTo(dom.parentNode, dom, stub) }

      // add to DOM
      if (value) {
        if (stub) {
          add()
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted)
                el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        // if the parentNode is defined we can easily replace the tag
        if (dom.parentNode)
          remove()
        // otherwise we need to wait the updated event
        else (tag.parent || tag).one('updated', remove)

        dom.inStub = true
      }
    // show / hide
    } else if (attrName === 'show') {
      dom.style.display = value ? '' : 'none'

    } else if (attrName === 'hide') {
      dom.style.display = value ? 'none' : ''

    } else if (expr.bool) {
      dom[attrName] = value
      if (value) setAttr(dom, attrName, attrName)
      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
        dom.__riot1374 = value   // #1374
      }

    } else if (value === 0 || value && typeof value !== T_OBJECT) {
      // <img src="{ expr }">
      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
        attrName = attrName.slice(RIOT_PREFIX.length)
      }
      setAttr(dom, attrName, value)
    }

  })

}
/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } els - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(els, fn) {
  var len = els ? els.length : 0

  for (var i = 0, el; i < len; i++) {
    el = els[i]
    // return false -> current item was removed by fn during the loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isFunction(v) {
  return typeof v === T_FUNCTION || false   // avoid IE problems
}

/**
 * Get the outer html of any DOM node SVGs included
 * @param   { Object } el - DOM node to parse
 * @returns { String } el.outerHTML
 */
function getOuterHTML(el) {
  if (el.outerHTML) return el.outerHTML
  // some browsers do not support outerHTML on the SVGs tags
  else {
    var container = mkEl('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we will inject the new html
 * @param { String } html - html to inject
 */
function setInnerHTML(container, html) {
  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
  // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml')
    container.appendChild(
      container.ownerDocument.importNode(doc.documentElement, true)
    )
  }
}

/**
 * Checks wether a DOM node must be considered part of an svg document
 * @param   { String }  name - tag name
 * @returns { Boolean } -
 */
function isSVGTag(name) {
  return ~SVG_TAGS_LIST.indexOf(name)
}

/**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isObject(v) {
  return v && typeof v === T_OBJECT         // typeof null is 'object'
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name)
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } string - input string
 * @returns { String } my-string -> myString
 */
function toCamel(string) {
  return string.replace(/-(\w)/g, function(_, c) {
    return c.toUpperCase()
  })
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM/SVG attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name)
  if (xlink && xlink[1])
    dom.setAttributeNS(XLINK_NS, xlink[1], val)
  else
    dom.setAttribute(name, val)
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
}
/**
 * Add a child tag to its parent into the `tags` object
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the new tag will be stored
 * @param   { Object } parent - tag instance where the new child tag will be included
 */
function addChildTag(tag, tagName, parent) {
  var cachedTag = parent.tags[tagName]

  // if there are multiple children tags having the same name
  if (cachedTag) {
    // if the parent tags property is not yet an array
    // create it adding the first cached tag
    if (!isArray(cachedTag))
      // don't add the same tag twice
      if (cachedTag !== tag)
        parent.tags[tagName] = [cachedTag]
    // add the new nested tag to the array
    if (!contains(parent.tags[tagName], tag))
      parent.tags[tagName].push(tag)
  } else {
    parent.tags[tagName] = tag
  }
}

/**
 * Move the position of a custom tag in its parent tag
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tag, tagName, newPos) {
  var parent = tag.parent,
    tags
  // no parent no move
  if (!parent) return

  tags = parent.tags[tagName]

  if (isArray(tags))
    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
  else addChildTag(tag, tagName, parent)
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag(child, opts, innerHTML),
    tagName = getTagName(opts.root),
    ptag = getImmediateCustomParentTag(parent)
  // fix for the parent attribute in the looped elements
  tag.parent = ptag
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag._parent = parent

  // add this tag to the custom parent tag
  addChildTag(tag, tagName, ptag)
  // and also to the real parent tag
  if (ptag !== parent)
    addChildTag(tag, tagName, parent)
  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = ''

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag
  while (!getTag(ptag.root)) {
    if (!ptag.parent) break
    ptag = ptag.parent
  }
  return ptag
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
* @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options))
  return el
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom) {
  var child = getTag(dom),
    namedTag = getAttr(dom, 'name'),
    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()

  return tagName
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          src[key] = obj[key]
      }
    }
  }
  return src
}

/**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
function contains(arr, item) {
  return ~arr.indexOf(item)
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
function isArray(a) { return Array.isArray(a) || a instanceof Array }

/**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
function isWritable(obj, key) {
  var props = Object.getOwnPropertyDescriptor(obj, key)
  return typeof obj[key] === T_UNDEF || props && props.writable
}


/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
    return data

  var o = {}
  for (var key in data) {
    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
  }
  return o
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 */
function walk(dom, fn) {
  if (dom) {
    // stop the recursion
    if (fn(dom) === false) return
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
      }
    }
  }
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttributes(html, fn) {
  var m,
    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

  while (m = re.exec(html)) {
    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
  }
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - should we use a SVG as parent node?
 * @returns { Object } DOM node just created
 */
function mkEl(name, isSvg) {
  return isSvg ?
    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
    document.createElement(name)
}

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Simple object prototypal inheritance
 * @param   { Object } parent - parent object
 * @returns { Object } child instance
 */
function inherit(parent) {
  return Object.create(parent || null)
}

/**
 * Get the name property needed to identify a DOM node in riot
 * @param   { Object } dom - DOM node we need to parse
 * @returns { String | undefined } give us back a string to identify this dom node
 */
function getNamedKey(dom) {
  return getAttr(dom, 'id') || getAttr(dom, 'name')
}

/**
 * Set the named properties of a tag element
 * @param { Object } dom - DOM node we need to parse
 * @param { Object } parent - tag instance where the named dom element will be eventually added
 * @param { Array } keys - list of all the tag instance properties
 */
function setNamed(dom, parent, keys) {
  // get the key value we want to add to the tag instance
  var key = getNamedKey(dom),
    isArr,
    // add the node detected to a tag instance using the named property
    add = function(value) {
      // avoid to override the tag properties already set
      if (contains(keys, key)) return
      // check whether this value is an array
      isArr = isArray(value)
      // if the key was never set
      if (!value)
        // set it once on the tag instance
        parent[key] = dom
      // if it was an array and not yet set
      else if (!isArr || isArr && !contains(value, dom)) {
        // add the dom node into the array
        if (isArr)
          value.push(dom)
        else
          parent[key] = [value, dom]
      }
    }

  // skip the elements with no named properties
  if (!key) return

  // check whether this key has been already evaluated
  if (tmpl.hasExpr(key))
    // wait the first updated event only once
    parent.one('mount', function() {
      key = getNamedKey(dom)
      add(parent[key])
    })
  else
    add(parent[key])

}

/**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
function startsWith(src, str) {
  return src.slice(0, str.length) === str
}

/**
 * requestAnimationFrame function
 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
 */
var rAF = (function (w) {
  var raf = w.requestAnimationFrame    ||
            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame

  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
    var lastTime = 0

    raf = function (cb) {
      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
    }
  }
  return raf

})(window || {})

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts) {
  var tag = __tagImpl[tagName],
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

  // clear the inner html
  root.innerHTML = ''

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    // add this tag to the virtualDom variable
    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
  }

  return tag
}
/**
 * Riot public api
 */

// share methods for other riot parts, e.g. compiler
riot.util = { brackets: brackets, tmpl: tmpl }

/**
 * Create a mixin that could be globally shared across all the tags
 */
riot.mixin = (function() {
  var mixins = {},
    globals = mixins[GLOBAL_MIXIN] = {},
    _id = 0

  /**
   * Create/Return a mixin by its name
   * @param   { String }  name - mixin name (global mixin if object)
   * @param   { Object }  mixin - mixin logic
   * @param   { Boolean } g - is global?
   * @returns { Object }  the mixin logic
   */
  return function(name, mixin, g) {
    // Unnamed global
    if (isObject(name)) {
      riot.mixin('__unnamed_'+_id++, name, true)
      return
    }

    var store = g ? globals : mixins

    // Getter
    if (!mixin) {
      if (typeof store[name] === T_UNDEF) {
        throw new Error('Unregistered mixin: ' + name)
      }
      return store[name]
    }
    // Setter
    if (isFunction(mixin)) {
      extend(mixin.prototype, store[name] || {})
      store[name] = mixin
    }
    else {
      store[name] = extend(store[name] || {}, mixin)
    }
  }

})()

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else styleManager.add(css)
  }
  name = name.toLowerCase()
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag2 = function(name, html, css, attrs, fn) {
  if (css) styleManager.add(css)
  //if (bpair) riot.settings.brackets = bpair
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { String } selector - tag DOM selector
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
riot.mount = function(selector, tagName, opts) {

  var els,
    allTags,
    tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      if (!/[^-\w]/.test(e)) {
        e = e.trim().toLowerCase()
        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
      }
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(__tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName
        setAttr(root, RIOT_TAG_IS, tagName)
        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
      }
      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    } else if (root.length) {
      each(root, pushTags)   // assume nodeList
    }
  }

  // ----- mount code -----

  // inject styles into DOM
  styleManager.inject()

  if (isObject(tagName)) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*')
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    else
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(/, */))

    // make sure to pass always a selector
    // to the querySelectorAll function
    els = selector ? $$(selector) : []
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName)
      els = $$(tagName, els)
    else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  pushTags(els)

  return tags
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
riot.update = function() {
  return each(__virtualDom, function(tag) {
    tag.update()
  })
}

/**
 * Export the Virtual DOM
 */
riot.vdom = __virtualDom

/**
 * Export the Tag constructor
 */
riot.Tag = Tag
  // support CommonJS, AMD & browser
  /* istanbul ignore next */
  if (typeof exports === T_OBJECT)
    module.exports = riot
  else if ("function" === T_FUNCTION && typeof __webpack_require__(51) !== T_UNDEF)
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : void 0);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(50);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_edit_modal', '<div class="modal-dialog" id="editDialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">EDIT TOPIC</h4> </div> <div class="modal-body"> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <label>Title</label> <p><input type="text" class="form-control" id="editTitle" placeholder="Title" name="editTitle" minlength="3" maxlength="250"> </p> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <h5>Details</h5> <div class="flex-container editor-bar"> <div class="editor-icons"> <label for="file-input2"> <i class="fa fa-picture-o" aria-hidden="true"></i> </label> <input type="file" id="file-input2" onchange="{previewFile2}" style="display:none"> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="format"><i class="fa fa-code" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="bold"><i class="fa fa-bold" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="italic"><i class="fa fa-italic" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="link"><i class="fa fa-link" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="bullet"><i class="fas fa-list" aria-hidden="true"></i></span> </div> </div> <textarea class="form-control topicModal" id="editTopicDetails" row="5" required onmouseup="{saveSelection}" onkeyup="{saveSelection}" onblur="{saveSelection}"> </textarea> </div> </div> <br> </div> <div class="modal-footer" id="edit_form"> <button type="button" data-dismiss="modal" class="btn btn-default">Close</button> <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="{updateTopic}">Submit</button> </div> </div> </div>', 'blog_edit_modal .custom_modal,[riot-tag="blog_edit_modal"] .custom_modal,[data-is="blog_edit_modal"] .custom_modal{ background: white; margin-top: 2%; border-radius: 5px; } blog_edit_modal .text_area_Vresize,[riot-tag="blog_edit_modal"] .text_area_Vresize,[data-is="blog_edit_modal"] .text_area_Vresize{ resize:vertical ; }', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;

        var escape = document.createElement('textarea');
        function escapeHTML(html) {
            escape.textContent = html;
            return escape.innerHTML;
        }

        this.updateTopic = function(e) {

            if(self.editTitle.value != null && self.editTitle.value.length > 3 && self.editTopicDetails.value.length > 3) {
                NProgress.start();
                var topic = {
                    "id" : e.target.id,
                    "title": self.editTitle.value,
                    "details": (self.editTopicDetails.value),
                    "url": escapeHTML(self.editTitle.value.toLowerCase().split(' ').join('-'))
                };

                $.ajax({
                    url: "/update_topic_by_topicId",
                    type: "POST",
                    data: JSON.stringify(topic),
                    contentType: "application/json",
                    success: function (article) {
                        console.log('is article uescaped ' , article);
                        DataMixin.data.topics.forEach(function(el) {
                            if(el._id === article._id) {
                                console.log('article going to be edited ', el);
                                el.title = article.title;
                                el.details = article.details;
                                el.url = article.url;
                            }
                        });
                        self.observable.trigger('post_edit');
                        document.getElementById('editTitle').value = '';
                        document.getElementById('editTopicDetails').value = '';
                        $('#blog_edit_modal').modal('hide');
                        NProgress.done();
                    },
                    error: function (err) {
                        console.log('Update failed: ', err);
                    }
                });
                $('#modal_edit_'+e.target.id).modal('hide');
            } else {
                alert('Title and details required');
            }
        }.bind(this)

        this.previewFile2 = function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                console.log("File API supported.!");

                var file = document.getElementById(e.target.id).files[0];
                var fileSize = (e.target.files[0].size / 1024).toFixed(2);

                if (file && fileSize < 400) {
                    var reader = new FileReader();

                    reader.onloadend = function(e){
                        var data = {
                            imageUrl: e.target.result,
                            imageName: file.name
                        };

                        console.log('image data is ', data);

                        $.ajax({
                            url: '/uploadImage',
                            type: 'POST',
                            data: data,
                            success: function success(res) {
                                console.log('image upload success!');
                                var imgTag = '<img src='+res+' layout="responsive" width="600" height="auto"/>';
                                var txtarea = document.getElementById('editTopicDetails');
                                var front = txtarea.value.substring(0, savedRange);
                                var back = txtarea.value.substring(savedRange, txtarea.value.length);
                                txtarea.value = front + imgTag + back;
                            },
                            error: function error(err) {
                                console.log('ERRORS: ' + err);
                            }
                        });
                    }

                    reader.readAsDataURL(file);
                } else {
                    alert('File size too large OR No file');

                }
            } else {
                console.log('The File APIs are not fully supported in this browser');
            }
        }.bind(this)

        this.formatText2 = function(e){
            var newtxt, selectedText, textAreaVal = "";
            var textArea = document.getElementById('editTopicDetails');
            textAreaVal = textArea.value;
            if(textAreaVal.length>0) {
                selectedText = self.getSelectedText(textArea);
                if(e.target.parentElement.id == "format") {
                    newtxt = '<pre><code>'+wrapLines(selectedText)+'</code></pre>';
                } else if(e.target.parentElement.id == "bold") {
                    newtxt = '<strong>'+selectedText+'</strong>';
                } else if(e.target.parentElement.id == "italic") {
                    newtxt = '<i>'+selectedText+'</i>';
                } else if(e.target.parentElement.id == "link") {
                    newtxt = '<a href='+selectedText+' target="_blank">'+selectedText+'</a>';
                } else if(e.target.parentElement.id == "bullet") {
                    newtxt = '<li style="list-style-type: square !important;">'+selectedText+'</li>';
                }
                self.replaceIt(textArea, newtxt);
            }
        }.bind(this)

        this.replaceIt = function(textArea, newtxt) {
            textArea.value = textArea.value.substring(0, textArea.selectionStart)
                    +newtxt+
            textArea.value.substring(textArea.selectionEnd);
        }.bind(this)

        this.getSelectedText = function(textArea) {
            var text = "";
            var activeEl = textArea;
            var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
            if ((activeElTagName == "textarea") || (activeElTagName == "input" &&
              /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
                (typeof activeEl.selectionStart == "number")) {
                text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
            } else if (window.getSelection) {
                text = window.getSelection().toString();
            }
            return text;
        }.bind(this)

        this.saveSelection = function(e){
           savedRange =  e.target.selectionStart;

        }.bind(this)
});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_post_details_admin', '<div class="content col-md-9 "> <div class="container-fluid"> <div class="row"> <div class="col-md-12 fadeInAnimation" id="blog_post_details" style="padding: 0 5%;"> <div class="row blog_item_title_post_details"> <div class="col-md-12 margin_bottom5" style="text-align: justify"> <h4 style="margin-top: 20px;"> <a class="blog_item_title" href="#">{post_details.title} </a> </h4> </div> </div> <div class="row"> <div class="col-md-12 col-md-12 col-xs-12 mobile_margin_bottom10"> <div class="blog_time"> <h5 class="blog_time">By techstack21 on {post_details.created_at}</h5> </div> </div> </div> <div class="row"> <div class="col-md-12 col-md-12 col-xs-12"> <raw id="complete_topic_details"></raw> </div> </div> <div class="" style="padding: 7px 1px;"> <div class="flex-container"> <div class="flex-item" style="max-width: 80%;"> <div> <a class="icon social" id="fb_shareAsAdmin" name="fb_{post_details.article_id}" data-title="{post_details.title}" data-details="{post_details.details}" data-postimageurl="{post_details.postImageUrl}" data-url="http://www.techstack21.com/article/{post_details.url}" onclick="{sharePostAsAdmin}"> <i class="fa fa-facebook" data-title="{post_details.title}" data-details="{post_details.details}" data-postimageurl="{post_details.postImageUrl}" data-url="http://www.techstack21.com/article/{post_details.url}"></i> </a> </div> <div> <a id="twitterShare" href="#" class="icon social tw" data-event="Twitter" onclick="{socialSharePostAsUser}"> <i class="fa fa-twitter"></i> </a> </div> <div> <a class="icon social tw" href="https://www.linkedin.com/shareArticle?mini=true&url=http://www.techstack21.com/article/{post_details.title}+&title={post_details.title}&summary=""&source=techstack21.com" target="_blank" id="fb_{post_details.article_id}"> <i class="fa fa-linkedin"></i> </a> </div> <div> <a class="icon social tw" id="blogger_shareAsAdmin" name="blogger_{post_details.article_id}" data-title="{post_details.title}" data-details="{post_details}" data-postimageurl="{post_details.postImageUrl}" data-url="http://www.techstack21.com/article/{post_details.title}" onclick="{createGoogleBloggerPost}"> <i class="fa fa-google-plus" data-title="{post_details.title}" data-details="{post_details}" data-postimageurl="{post_details.postImageUrl}" data-url="http://www.techstack21.com/article/{post_details.title}"></i> </a> </div> </div> </div> </div> <div class="row"> <div class="col-md-12"> </div> </div> <div class="clear"></div> </div> </div> <div class=""> <div id="disqus_thread"></div> </div> </div> <div class="clear"></div> </div>', '', '', function(opts) {
        var self = this;
        self.data = {};

        if(opts.details != null){
            self.post_details = opts.details;
            self.complete_topic_details.innerHTML = opts.details.details;
        }

        riot.util.tmpl.errorHandler = function (err) {
            console.error(err.message + ' in ' + err.riotData.tagName);
        }

        this.socialSharePostAsUser = function(e){
            $("meta[property='og\\:title']").attr("content", opts.topic.title);
            var url = 'http://twitter.com/share?text='+opts.topic.title+'&url=http://www.techstack21.com&hashtags=Divine';
            window.open(url, 'popup', 'width=500,height=500');
        }.bind(this)

        this.createGoogleBloggerPost = function(e) {
            var params = {};

            window.auth2.grantOfflineAccess().then(function(authResult){
                if(authResult['code']){
                    params = {
                        title: e.target.dataset.title,
                        details: e.target.dataset.details,
                        postImageUrl: e.target.dataset.postImageUrl,
                        url: e.target.dataset.url,
                        exchangeCode: authResult['code']
                    }

                    console.log('EXCHANGE CODE CLIENT SIDE ', authResult['code']);

                    $.ajax({
                        url:'/createGoogleBloggerPost',
                        type: 'POST',
                        data:params,
                        success:function(res){
                            console.log('Blogger post status ', res);
                            if(res == "BLOG POST SUCCESS")
                            alert('Posted article to google blogger successfully!');
                        },
                        error: function(err){
                            console.log(err);
                        }
                    })
                }
            });
            console.log('google blogger params ', params);
        }.bind(this)

        this.shareToLinked = function(e){
            popupTools.popup('shareToLinked/', "linkedin Authentication", {}, function (err, user) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('user social profile ', user);
                    NProgress.done();
                }
            });
        }.bind(this)

        this.sharePostAsAdmin = function(e){
            console.log('sharing posts as Admin...');

            var params = {
                title: e.target.dataset.title,
                details: e.target.dataset.details,
                postImageUrl: e.target.dataset.postImageUrl,
                url: e.target.dataset.url
            }
            console.log('params ', params);

            $.ajax({
                url:'/sharePost',
                type: 'POST',
                data:params,
                success: function(res){
                    alert('FACEBOOK SHARE SUCCESS');
                    console.log('FACEBOOK SHARE SUCCESS:' , res);

                },
                error: function(err){
                    alert('FACEBOOK SHARE FAILED');
                    console.log('FACEBOOK SHARE FAILED:' ,err);
                }
            });
        }.bind(this)

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_post_details_user', '<div class="content col-md-9" 0> <div class="container-fluid"> <div class="row"> <div class="col-md-12 fadeInAnimation" id="blog_post_details" style="padding: 0 5%;"> <div class="row blog_item_title_post_details"> <div class="col-md-12 margin_bottom5" style="text-align: justify"> <h4 style="margin-top: 20px;"> <a class="blog_item_title" href="#">{article.title} </a> </h4> </div> </div> <div class="row"> <div class="col-md-12 col-md-12 col-xs-12 mobile_margin_bottom10"> <div class="blog_time"> <h5 class="blog_time">By techstack21 on {article.created_at}</h5> </div> </div> </div> <div class="row"> <div class="col-md-12 col-md-12 col-xs-12"> <raw id="complete_topic_details"></raw> </div> </div> <div class="" style="padding: 7px 1px; margin-top: 10px;"> <div class="flex-container"> <div class="flex-item" style="max-width: 80%;"> <div> <a class="icon social" id="fb_shareAsUser" name="fb_{article.article_id}" data-title="{article.title}" data-details="{article.details}" data-postimageurl="{article.url}" data-url="http://www.techstack21.com/article/{article.url}" onclick="{fbSharePostAsUser}"> <i class="fa fa-facebook" data-title="{article.title}" data-details="{article.details}" data-postimageurl="{article.url}" data-url="http://www.techstack21.com/article/{article.url}"></i> </a> </div> <div> <a id="twitterShare" href="http://twitter.com/share?text={article.title}&url=http://www.techstack21.com/article/{article.url}&hashtags=tech" target="_blank" class="icon social tw" data-event="Twitter"> <i class="fa fa-twitter"></i> </a> </div> <div> <a class="icon social tw" href="https://www.linkedin.com/shareArticle?mini=true&url=http://www.techstack21.com/article/{article.url}+&title={article.title}&summary=""&source=techstack21.com" target="_blank" id="fb_{article.article_id}"> <i class="fa fa-linkedin"></i> </a> </div> <div> <a class="icon social tw" href="//plus.google.com/share?&url=http://www.techstack21.com/article/{article.url}" onclick="window.open(this.href, \'\',\'scrollbars=1\', \'width=400,height=620\'); return false;"> <i class="fa fa-google-plus"></i> </a> </div> </div> </div> </div> </div> </div> <div class="" style="margin-top: 50px;"> <div id="disqus_thread"></div> </div> </div> <div class="clear"></div> </div>', '', 'class="mobile_center"', function(opts) {
        var self = this;
        self.data = {};

        if(typeof opts !== 'undefined' && opts !== null) {
            self.article = (opts.article);
            self.complete_topic_details.innerHTML = (opts.article.details);
        }

        riot.util.tmpl.errorHandler = function (err) {
            console.error(err.message + ' in ' + err.riotData.tagName);
        }

        this.linkedInShare = function(e) {
            popupTools.popup('linkedInShare/', "linkedin Authentication", {}, function (err, user) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('user social profile ', user);
                    NProgress.done();
                }
            });
        }.bind(this)
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_posting_modal', '<div class="modal-dialog" id="createDialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button> <h4 class="modal-title">POST NEW TOPIC</h4> </div> <div class="modal-body"> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <h5>Title</h5> <p><input class="form-control" id="title" type="text" required></p> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <h5>Details</h5> <div class="flex-container"> <div class="editor-icons"> <label for="file-input"> <i class="fa fa-picture-o" aria-hidden="true"></i> </label> <input type="file" id="file-input" onchange="{previewFile}" style="display:none"> </div> <div class="editor-icons"> <span onclick="{formatText}" id="format"><i class="fa fa-code" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText}" id="bold"><i class="fa fa-bold" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText}" id="italic"><i class="fa fa-italic" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText}" id="link"><i class="fa fa-link" aria-hidden="true"></i></span> </div> <div class="editor-icons"> <span onclick="{formatText2}" id="bullet"><i class="fas fa-list" aria-hidden="true"></i></span> </div> </div> <textarea class="form-control topicModal" id="topicDetails" row="5" placeholder="Enter details" required onmouseup="{saveSelection}" onkeyup="{saveSelection}"> </textarea> </div> </div> <br> <div class="row" style="overflow-x:hidden;"> <div class="col-md-12"> <div><label>Select Category:</label></div> <div> <select multiple="multiple" class="styled-select" id="category_select"> <option each="{item, i in data.categories}" value="{item.category}">{item.category}</option> </select> </div> </div> </div> </div> <div class="modal-footer"> <button type="button" data-dismiss="modal" class="btn btn-default">Close</button> <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="{postTopic}">Submit</button> </div> </div> </div>', 'option:hover { background-color: #1e90ff; color:white; } .styled-select { position: relative; width: 100%; z-index: 1; } .styled-select select { background: transparent; border: none; height: 29px; padding: 5px; width: 268px; }', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;
        self.data = {};
        self.data.blogTopicsArr = [];
        self.data = {};
        self.data.categories = [];
        var savedRange,isInFocus;
        var isInFocus = false;

        self.on('mount', function(){
            console.log('self.root.localName ', self.root.localName);
        });

        this.previewFile = function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                console.log("File API supported.!");

                var file = document.getElementById(e.target.id).files[0];
                var fileSize = (e.target.files[0].size / 1024).toFixed(2);

                if (file && fileSize < 400) {
                    var reader = new FileReader();

                    reader.onloadend = function(e){
                        var data = {
                            imageUrl: e.target.result,
                            imageName: file.name
                        };

                        console.log('image data is ', data);

                        $.ajax({
                            url: '/uploadImage',
                            type: 'POST',
                            data: data,
                            success: function success(res) {
                                console.log('image upload success!');
                                var imgTag = '<img src='+res+' layout="responsive" width="600" height="auto"/>';
                                var txtarea = document.getElementById('topicDetails');
                                var front = txtarea.value.substring(0, savedRange);
                                var back = txtarea.value.substring(savedRange, txtarea.value.length);
                                txtarea.value = front + imgTag + back;
                            },
                            error: function error(err) {
                                console.log('ERRORS: ' + err);
                            }
                        });
                    }

                    reader.readAsDataURL(file);
                } else {
                    alert('File size too large OR No file');
                }
            } else {
                console.log('The File APIs are not fully supported in this browser');
            }
        }.bind(this)

        var escape = document.createElement('textarea');
        function escapeHTML(html) {
            escape.textContent = html;
            return escape.innerHTML;
        }

        this.postTopic = function(e) {
            e.preventDefault();
            console.log('creating post...');

            if(self.title.value != null && self.title.value.length > 3 && self.topicDetails.value.length > 3){

                var blog_details = document.getElementById('topicDetails').value;

                var topic = {
                    "title": document.getElementById('title').value,
                    "details": (document.getElementById('topicDetails').value),
                    "username": DataMixin.getUsername(),
                    "postImageUrl": blog_details.indexOf('src') > 0 ? blog_details.match(/src=([^\s]+)/)[1]: "",
                    "url": escapeHTML(document.getElementById('title').value.toLowerCase().split(' ').join('-')),
                    "categories": DataMixin.getCheckedBoxes("category_select"),
                };

                $.ajax({
                    url: "/new_topic",
                    type: "POST",
                    data: JSON.stringify(topic),
                    contentType: "application/json",
                    success: function (res) {
                        console.log('post create success: ', res);
                        if (res === 'Authentication failed') {
                            riot.route("signup_popup");
                        } else if (typeof res !== "undefined") {
                            DataMixin.data.topics.unshift(res);
                            self.observable.trigger('post_created');
                            document.getElementById('title').value = '';
                            document.getElementById('topicDetails').value = '';
                            document.getElementById("file-input").value = '';
                        }
                    },
                    error: function (err) {
                        console.log('err>>>>', err);
                    }
                });
                $('#blog_posting_modal').modal('hide');
            } else {
                alert('Title and details required');
            }
        }.bind(this)

        this.formatText = function(e){
            var newtxt, selectedText, textAreaVal = "";
            var textArea = document.getElementById('topicDetails');
            textAreaVal = textArea.value;
            if(textAreaVal.length>0) {
                selectedText = self.getSelectedText(textArea);
                if(e.target.parentElement.id == "format") {
                    newtxt = '<pre><code>'+wrapLines(selectedText)+'</code></pre>';
                } else if(e.target.parentElement.id == "bold") {
                    newtxt = '<strong>'+selectedText+'</strong>';
                } else if(e.target.parentElement.id == "italic") {
                    newtxt = '<i>'+selectedText+'</i>';
                } else if(e.target.parentElement.id == "link") {
                    newtxt = '<a href='+selectedText+' target="_blank">'+selectedText+'</a>';
                }
                else if(e.target.parentElement.id == "bullet") {
                    newtxt = '<li style="list-style-type: square !important;">'+selectedText+'</li>';
                }
                self.replaceIt(textArea, newtxt);
            }
        }.bind(this)

        this.replaceIt = function(textArea, newtxt) {
            textArea.value = textArea.value.substring(0, textArea.selectionStart)
                    +newtxt+
            textArea.value.substring(textArea.selectionEnd);
        }.bind(this)

        this.getSelectedText = function(textArea) {
            var text = "";
            var activeEl = textArea;
            var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
            if (
              (activeElTagName == "textarea") || (activeElTagName == "input" &&
              /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
              (typeof activeEl.selectionStart == "number")
            ) {
                text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
            } else if (window.getSelection) {
                text = window.getSelection().toString();
            }
            return text;
        }.bind(this)

        this.saveSelection = function(e){
           savedRange =  e.target.selectionStart;
        }.bind(this)

        self.observable.on('set_categories', function(categories) {
            categories.forEach(function(v, i) {
                console.log('v' , v);
                self.data.categories.push(v);
            })
            self.data.categories.unshift({category: 'Javascript'}, {category: 'NodeJs'}, {category: 'Jquery'}, {category: 'Quiz'}, {category: 'Git'}, {category: 'HTML'} ,{category: 'Latest Tech'}, {category: 'CSS'}, {category: 'Misc'});
            self.update();
        });

});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_sidebar', '<div class="col-md-2" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.state === \'blog_topic_title\')}"> <div class="row"> <div class="col-md-12 padding_right_zero"> <div class="mobile_margin_top70" style="margin-bottom: 20px;"> <h5 class="sidebar">RECENT POSTS</h5> </div> <div class="row"> <div class="col-md-12" id="recent_parent"> <ul each="{item, i in data.recents}"> <li class="padding_12_0"> <a id="{item._id}" href="http://www.techstack21.com/article/{item.url}">{item.title}</a> </li> </ul> </div> </div> </div> </div> <div class="row" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.state === \'blog_topic_title\')}"> <div class="col-md-12"> <div class="category-block"> <div class="category-name"> <h5 class=" sidebar">CATEGORY</h5> </div> <div class="add-category-icon" style="display: inline-block" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <span class="glyphicon glyphicon-plus" onclick="{showCategory}" style="cursor:pointer"></span> </div> <div style="display:flex" id="addCategory" class="hidden"> <div style="flex:1"> <input type="text" class="form-control" id="categoryInput"> </div> <div class="category-save-icon"> <button class="btn btn-default" onclick="{createCategory}"><span class="glyphicon glyphicon-ok-circle"></span></button> </div> <div class="category-delete-icon"> <button class="btn btn-default" onclick="{cancelCategory}"><span class="glyphicon glyphicon-remove-circle"></span></button> </div> </div> <ul class="category_list_parent"> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">ReactJs</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">MongoDb</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">JointJs</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">D3Js</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">Anuglar</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">Java</div> </li> <li class="category_list" name="category-name"> <div onclick="{getArticleByCategory}">Git</div> </li> <li class="category_list" name="remove-category-icon" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <span onclick="{deleteCategory}" name="{item.category}" class="glyphicon glyphicon-remove-circle"></span> </li> </ul> </div> </div> </div> </div>', '', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;
        self.data = {};
        self.data.categories = [];

        this.showCategory = function(e){
            document.getElementById("addCategory").classList.remove('hidden');
            document.getElementById("categoryInput").value = "";
        }.bind(this)

        this.cancelCategory = function(e) {
            document.getElementById("addCategory").classList.add('hidden');
        }.bind(this)

        this.createCategory = function(e) {
            self.categoryValue = document.getElementById('categoryInput').value;
            if(self.categoryValue.length > 2) {
                $.ajax({
                    url:'/createCategory/' + encodeURIComponent(self.categoryValue),
                    success: function(res) {
                        console.log('success createCategory: ', res);
                        self.data.categories.unshift(res.category);
                        document.getElementById("categoryInput").value = "";
                        document.getElementById("addCategory").classList.add('hidden');
                        self.update();
                    },
                    error: function(err){
                        console.log('error ', err);
                    }
                })
            } else {
                alert('Category name should be atleast 3 letters');
            }

            e.preventDefault();
        }.bind(this)

        this.deleteCategory = function(e) {
            self.categoryToBeDeleted = e.target.getAttribute('name');
            $.ajax({
                url:'/deleteCategory/' + encodeURIComponent(self.categoryToBeDeleted),
                success: function(res) {
                    console.log('success deleteCategory: ', res);
                    self.data.categories.forEach(function(e,i) {
                        if(e.category === self.categoryToBeDeleted) {
                            self.data.categories.splice(i,1);
                        }
                    })
                    document.getElementById("categoryInput").value = "";
                    document.getElementById("addCategory").classList.add('hidden');
                    self.update();
                },
                error: function(err){
                    console.log('error ', err);
                }
            })
            e.preventDefault();
        }.bind(this)

        this.getArticleByCategory = function(e) {
            var that = $(this);
            that.off('click');
            console.log('e.target.innerText', e.target.innerText);
            DataMixin.data.categoryType = e.target.innerText;
            console.log('active ajax requests', $.active);
            if($.active == 0) {
                $.ajax({
                    url:'/get_post_by_category/' + encodeURIComponent(e.target.innerText),
                    success: function(articles) {
                        console.log('success postByCategories: ', articles);
                        DataMixin.data.topics = articles;
                        setTimeout(function() {
                            self.observable.trigger('set_data_on_load');
                        },1000)
                    },
                    error: function(err) {
                        console.log('error ', err);
                    }
                })
                .always(function() {
                    that.on('click', self.getArticleByCategory);
                });
            }
        }.bind(this)

        this.getRecentPosts = function() {
            self.data.recents = [];
            console.log('getting recent posts...', DataMixin.data.topics.length);
            var params = {
                limit: 5,
                offset: DataMixin.data.topics.length < 5 ? 0 : DataMixin.data.topics.length - 5
            };
            $.ajax({
                url:'/getRecent',
                type:'POST',
                data: params,
                success: function(res) {
                    console.log('get recent articles' , res);
                    res.forEach(function(el, i) {
                        self.data.recents.push(el);
                    });
                    self.update();
                },
                error: function(err) {
                    console.log('Recent posts failed ', err);
                }
            });
        }.bind(this)

        SharedMixin.observable.on('set_data_on_load', function() {
            self.getRecentPosts();
        });

        self.observable.on('set_categories', function(categories) {
            categories.forEach(function(v, i) {
                self.data.categories.push(v);
            })
            self.update();
        });

        self.observable.on('post_delete', function(deleteId) {
            self.getRecentPosts();
        });

});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_slide_menu', '<nav class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right" id="cbp-spmenu-s2"> <div style="background: #fff;display: flex;"> <div style="flex:1"> <h3>techstack21</h3> </div> <div id="menuClose" class="fa fa-close"></div> </div> <ul id="main-menu-list"> <li class="main-menu-item" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <a> <span class="create_button btn btn-xs btn-default" id="post_new_topic_btn" data-toggle="modal" data-target="#blog_posting_modal">+ CREATE POST</span> </a> </li> <li><a href="http://www.techstack21.com">Home</a></li> <li><a onclick="{getArticleByCategory}" href="#">Javascript</a></li> <li><a onclick="{getArticleByCategory}" href="#">NodeJs</a></li> <li><a onclick="{getArticleByCategory}" href="#">Jquery</a></li> <li><a onclick="{getArticleByCategory}" href="#">Latest Tech</a></li> </ul> <li class="main-menu-item" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <a data-toggle="collapse" id="logout" data-target=".navbar-collapse.in" href="#" onclick="{logout}">LOGOUT</a> </li> </nav>', '', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;

        this.getArticleByCategory = function(e) {

            console.log('e.target.innerText', e.target.innerText);
            $.ajax({
                url:'/get_post_by_category/' + encodeURIComponent(e.target.innerText),
                success: function(articles) {
                    console.log('success postByCategories: ', articles);
                    DataMixin.data.topics = articles;
                    self.observable.trigger('set_data_on_load');
                },
                error: function(err){
                    console.log('error ', err);
                }
            })
        }.bind(this)

        self.on('mount', function () {
            if(document.getElementById) {
                var menuRight = document.getElementById('cbp-spmenu-s2');
                var showRightPush = document.getElementById('nav-icon3');
                var menuClose = document.getElementById('menuClose');
                var mainMenuList = document.getElementById('main-menu-list');
                var body = document.body;

                showRightPush.onclick = function() {
                    classie.toggle(menuRight, 'cbp-spmenu-open');
                };

                menuClose.onclick = function(){
                    classie.toggle(menuRight, 'cbp-spmenu-open');
                    $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                }
            }
        });

        this.authenticate = function(){
            self.currentState = DataMixin.state;
            self.observable.trigger('previous_state', self.currentState);
            riot.route('signup_popup');
        }.bind(this)

        this.logout = function() {
            $.ajax({
                url:"/logout",
                success: function(res){
                    DataMixin.setAuthentication(res);
                    $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                    riot.route(res.redirect);
                },
                error: function(err){
                    console.error('err ', err);
                }
            });
        }.bind(this)

});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('blog_topic_title', '<div id="topic_{opts.topic._id}" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.state==⁗blog_topic_title⁗)}"> <div class="article_subwrap"> <div class="listing-items fadeInAnimation"> <div class="container-fluid"> <div class="row"> <div class="col-md-12"> <div if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <div class="col-md-3 col-sm-3 col-xs-3 no_padding mobile_margin_bottom20"> <button class="btn btn-default btn-sm btn-xs glyphicon glyphicon-pencil" data-toggle="modal" id="edit_{opts.topic._id}" onclick="{openEditModal}"> </button> </div> <div class="col-md-2 col-sm-3 col-xs-2 no_padding margin_left_minus_50"> <button class="btn btn-default btn-sm btn-xs glyphicon glyphicon-trash" id="delete_{opts.topic._id}" onclick="{deleteTopic}"></button> </div> </div> </div> <div class="col-md-12 col-sm-12 col-xs-12"> <h4 style="margin-top: 20px;"> <a class="blog_item_title" id="{opts.topic._id}" href="article/{opts.topic.url}" style="text-align: justify; cursor: pointer">{opts.topic.title}</a> </h4> </div> </div> <div class="row"></div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <h5 class="blog_time">By techstack21 on {opts.topic.created_at.split(⁗T⁗)[0]}</h5> </div> <div class="col-md-12 col-sm-10 col-xs-12"> <raw id="brief_topic_details"></raw> </div> </div> <div class="" style="padding: 7px 1px;"> <div class="flex-container"> <div class="flex-item" style="max-width: 80%;"> <a class="underline_on_hover bold cursor_pointer" rel="read_more" id="{opts.topic._id}" href="article/{opts.topic.url}">Read More..</a> </div> <div class="flex-container" style="min-width: 19%;"> <div if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() !== \'ROLE_ADMIN\')}"> <a class="icon social" id="fb_{opts.topic._id}" name="fb_{opts.topic._id}" onclick="{fbsharePostAsUser}"> <i class="fa fa-facebook"></i> </a> </div> <div if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <a class="icon social" id="fb_shareAsAdmin" name="fb_{opts.topic._id}" data-title="{opts.topic.title}" data-details="{opts.topic.details}" data-postimageurl="{opts.topic.url}" data-url="https://techstack21.com/article/{opts.topic.url}" onclick="{fbSharePostAsAdmin}"> <i class="fa fa-facebook" data-title="{opts.topic.title}" data-details="{opts.topic.details}" data-postimageurl="{opts.topic.url}" data-url="https://techstack21.com/article/{opts.topic.url}"></i> </a> </div> <div> <a id="twitterShare" href="#" class="icon social tw" data-event="Twitter" onclick="{twittersharePostAsUser}"> <i class="fa fa-twitter"></i> </a> </div> <div> <a class="icon social tw" href="https://www.linkedin.com/shareArticle?mini=true&url=http://www.techstack21.com/article/{opts.topic.url}+&title={opts.topic.title}&summary=""&source=techstack21.in" target="_blank" id="fb_{opts.topic._id}"> <i class="fa fa-linkedin"></i> </a> </div> <div> <a if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}" class="icon social tw" id="blogger_{opts.topic._id}" name="blogger_{opts.topic._id}" data-title="{opts.topic.title}" data-details="{opts.topic.details}" data-imageurl="{opts.topic.postImageUrl}" data-url="http://www.techstack21.com/article/{opts.topic.url}" onclick="{createGoogleBloggerPost}"> <i class="fa fa-google-plus" data-title="{opts.topic.title}" data-details="{opts.topic.details}" data-imageurl="{opts.topic.postImageUrl}" data-url="http://www.techstack21.com/article/{opts.topic.url}"></i> </a> </div> <div if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() !== \'ROLE_ADMIN\')}"> <a class="icon social tw" href="//plus.google.com/share?&url=http://www.techstack21.com/article/{opts.topic.url}" target="_blank" onclick="window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=400,height=620\'); return false;" alt="Share on Google+"> <i class="fa fa-google-plus"></i> </a> </div> </div> </div> </div> </div> </div> </div> </div>', '', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;
        self.data = {};
        self.data.blogTopicsArr = [];

        self.on('mount', function() {
            if (opts.topic && opts.topic.details != null)
            self.brief_topic_details.innerHTML = opts.topic.details.substring(0, 200) + "...";
        });

        this.openEditModal = function(e){
            $('#blog_edit_modal').modal('show');
            document.getElementById('edit_form').children[1].setAttribute('id', opts.topic._id);
            document.getElementById('editTitle').value = opts.topic.title;
            document.getElementById('editTopicDetails').value = opts.topic.details;
        }.bind(this)

        this.deleteTopic = function(e){
            NProgress.start();
            var deleteId = e.target.id.split('_')[1];
            console.log('attempt deleting blog post id:', deleteId, '....');
            $.ajax({
                type:'GET',
                url:'/deleteTopic/' + encodeURIComponent(deleteId),
                success: function(res){
                    console.log('post delete success: ', res);
                    DataMixin.data.topics.forEach(function(el, i){
                    if (el._id == deleteId){
                        DataMixin.data.topics.splice(i, 1);
                    }
                });
                self.observable.trigger('post_delete', deleteId);
                    NProgress.done();
                },
                error: function(err){
                    console.log('Failed to delete blog post from DB....', err);
                }
            });
        }.bind(this)

        this.twittersharePostAsUser = function(e){
            $("meta[property='og\\:title']").attr("content", opts.topic.title);
            var url = 'http://twitter.com/share?text=' + opts.topic.title + '&url=http://www.techstack21.com&hashtags=Technology';
            window.open(url, 'popup', 'width=500,height=500');
        }.bind(this)

        this.createGoogleBloggerPost = function(e) {
            var params = {};
            NProgress.start();

            window.auth2.grantOfflineAccess().then(function(authResult){

                if (authResult['code']){
                    params = {
                        title: e.target.dataset.title,
                        details: e.target.dataset.details,
                        imageurl: e.target.dataset.imageurl,
                        url: e.target.dataset.url,
                        exchangeCode: authResult['code']
                    }

                    $.ajax({
                    url:'/createGoogleBloggerPost',
                        type: 'POST',
                        data:params,
                        success:function(res){
                        console.log('Blogger post status ', res);
                        NProgress.done();
                        if (res == "BLOG POST SUCCESS")
                            alert('Posted article to google blogger successfully!');
                        },
                        error: function(err){
                        console.log(err);
                        NProgress.done();
                        }
                    })
                }
            });
            console.log('google blogger params ', params);
        }.bind(this)

        this.linkedInshare = function(e){
            popupTools.popup('linkedInshare/', "linkedin Authentication", {}, function (err, user) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('user social profile ', user);
                    NProgress.done();
                }
            });
        }.bind(this)

        this.fbsharePostAsUser = function(e){
            console.log('sharing posts as User...', opts);

            FB.ui({

                method: 'share',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object: {
                        'og:url': 'http://techstack21.com/article/' + opts.topic.url,
                        'og:title': opts.topic.title,
                        'og:description': opts.topic.details,

                    }
                })
                }, function(response){
                    console.log('FACEBOOK FEED SHARE SUCCESS', response);
            });
        }.bind(this)

        this.toBoldUnicode = function(str) {
            var strArr = str.split('');
            for (let i = 0; i < strArr.length; i++) {
                let BUnicode = self.toUnicode(strArr[i]);
                strArr[i] = '&#' + "0000".substring(0, 4 - BUnicode.length) + BUnicode;
            }
            var joined = strArr.join("");
            var el = document.createElement('div');
            el.innerHTML = joined;
            return el.innerHTML;
        }.bind(this)

        this.toUnicode = function(char) {
            let unicode = char.charCodeAt(0);
            if (97 <= unicode && unicode <= 122) {
                return (unicode + 119737);
            } else if (65 <= unicode && unicode <= 90) {
                return (unicode + 119743);
            } else if (48 <= unicode && unicode <= 57) {
                return (unicode + 120764);
            }
            return unicode;
        }.bind(this)

        this.fbSharePostAsAdmin = function(e) {
            var params = {
                title: self.toBoldUnicode(e.target.dataset.title),
                details: e.target.dataset.details,
                postImageUrl: e.target.dataset.postImageUrl,
                url: e.target.dataset.url
            }
            console.log('fb_shareAsAdmin params ', params);

            $.ajax({
                url:'/sharePost',
                type: 'POST',
                data:params,
                success: function(res) {
                    alert('FACEBOOK SHARE SUCCESS');
                    console.log('FACEBOOK SHARE SUCCESS:' , res);
                },
                error: function(err) {
                    alert('FACEBOOK SHARE FAILED');
                    console.log('FACEBOOK SHARE FAILED:' ,err);
                }
            });
        }.bind(this)
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('footer_tag', '<footer class="footer"> <div id="footerText"> <span> &copy; 2018 techstack21. All rights reserved </span> </div> </footer>', '', '', function(opts) {
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('header_tag', '<div> <div class="main float-panel" data-top="0" data-scroll="500"> <div class="flex-container" id="header_height"> <div class="flex-item" style="flex:30%"> <a class="logo" href="http://www.techstack21.com" style="color: white"> <svg viewbox="0 0 661.3532104492188 160" preserveaspectratio="xMidYMid meet" class=" logo" id="cfdghhae"><defs id="SvgjsDefs1553"></defs><g id="SvgjsG1554" featurekey="root" fill="#ffffff" transform="matrix(1,0,0,1,0,0)"></g><g id="SvgjsG1555" featurekey="symbol1" fill="#21789a" transform="matrix(1.06372342152248,0,0,1.06372342152248,313.85068982308064,-342.18691770816423)"><path d="M-217.1,378.8c-1-0.9-2.6-0.9-3.5,0.1l-15.5,16.4c-0.9,1-0.9,2.5,0,3.4l15.5,16.4c0.5,0.5,1.2,0.8,1.8,0.8 c0.6,0,1.2-0.2,1.7-0.7c1-0.9,1-2.5,0.1-3.5l-13.8-14.7l13.8-14.7C-216,381.3-216.1,379.7-217.1,378.8z M-189.4,378.9 c-0.9-1-2.5-1-3.5-0.1c-1,0.9-1,2.5-0.1,3.5l13.8,14.7l-13.8,14.7c-0.9,1-0.9,2.6,0.1,3.5c0.5,0.5,1.1,0.7,1.7,0.7 c0.7,0,1.3-0.3,1.8-0.8l15.5-16.4c0.9-1,0.9-2.5,0-3.4L-189.4,378.9z M-200.5,378.4c-1.3-0.3-2.7,0.5-3,1.8l-7.8,32.3 c-0.3,1.3,0.5,2.7,1.8,3c0.2,0,0.4,0.1,0.6,0.1c1.1,0,2.2-0.8,2.4-1.9l7.8-32.3C-198.3,380.1-199.2,378.7-200.5,378.4z M-162.5,377.5c-1.6-4.9-4.3-8.4-8.2-10.6c-4.2-2.5-8.4-4.9-12.6-7.3c-4.2-2.4-8.4-4.8-12.6-7.3c-2.7-1.5-5.4-2.3-8.4-2.4 c-3.6-0.1-6.7,0.6-9.4,2.2c-2.4,1.4-4.8,2.7-7.1,4.1c-6,3.4-12.2,7-18.3,10.6c-5.8,3.5-8.9,8.9-8.9,15.5c-0.1,6.5,0,13.1,0,19.5 c0,3.2,0,6.5,0,9.7c0,1.9,0.3,3.7,0.8,5.2c1.6,4.6,4.3,8.1,8.1,10.3c4.1,2.4,8.3,4.8,12.5,7.2c4.2,2.4,8.4,4.8,12.5,7.2 c2.5,1.5,5.1,2.3,8.1,2.5c0.5,0,1,0,1.4,0c3.2,0,6.1-0.8,8.7-2.3c8.2-4.8,16.7-9.8,25.1-14.6c2.7-1.5,4.9-3.6,6.5-6.4 c1.8-3.1,2.6-5.7,2.6-8.5v-29.9C-161.8,380.8-162,379.1-162.5,377.5z M-166.8,412.3c0,1.8-0.6,3.7-2,6c-1.1,2-2.6,3.5-4.6,4.6 c-8.5,4.8-17,9.8-25.2,14.6c-2.1,1.2-4.4,1.7-7.2,1.6c-2.2-0.2-4.1-0.8-5.9-1.9c-4.2-2.4-8.3-4.8-12.5-7.2 c-4.2-2.4-8.3-4.8-12.5-7.2c-2.8-1.6-4.7-4-5.9-7.6c-0.4-1-0.6-2.2-0.6-3.6c0-3.2,0-6.5,0-9.7c0-6.4,0-13,0-19.5 c0-5,2.1-8.6,6.5-11.3c6-3.6,12.2-7.1,18.2-10.6c2.4-1.4,4.8-2.7,7.2-4.1c1.8-1.1,3.7-1.6,6.1-1.6c0.2,0,0.4,0,0.6,0 c2.2,0.1,4.2,0.7,6.1,1.8c4.2,2.5,8.4,4.9,12.6,7.3c4.2,2.4,8.4,4.8,12.6,7.3c2.8,1.6,4.7,4.1,5.9,7.8c0.3,1,0.5,2.2,0.5,3.4V412.3z "></path></g><g id="SvgjsG1556" featurekey="text1" fill="#84704e" transform="matrix(4.010474030317776,0,0,4.010474030317776,187.8867169736126,15.809195845727977)"><path d="M11.924 14.687475 l-1.0938 0.68359 q-1.416015625 -1.89453125 -3.8671875 -1.89453125 q-1.962890625 0 -3.256835938 1.259765625 t-1.2939 3.0664 q0 1.171875 0.595703125 2.211914063 t1.6309 1.6064 t2.3242 0.56641 q2.373046875 0 3.8671875 -1.875 l1.0938 0.71289 q-0.771484375 1.15234375 -2.065429688 1.782226563 t-2.9541 0.62988 q-2.529296875 0 -4.204101563 -1.611328125 t-1.6748 -3.916 q0 -1.5625 0.7861328125 -2.895507813 t2.1484 -2.0801 t3.0615 -0.74707 q1.0546875 0 2.045898438 0.322265625 t1.6846 0.84473 t1.1719 1.333 z M19.61914375 12.187375 q2.470703125 0 4.1015625 1.787109375 q1.474609375 1.640625 1.474609375 3.876953125 t-1.5625 3.9111 t-4.0137 1.6748 q-2.4609375 0 -4.018554688 -1.674804688 t-1.5576 -3.9111 q0 -2.2265625 1.474609375 -3.8671875 q1.630859375 -1.796875 4.1015625 -1.796875 z M19.61914375 13.535375 q-1.708984375 0 -2.939453125 1.26953125 t-1.2305 3.0664 q0 1.162109375 0.5615234375 2.172851563 t1.5186 1.5527 t2.0898 0.54199 q1.15234375 0 2.104492188 -0.5419921875 t1.5088 -1.5527 t0.55664 -2.1729 q0 -1.796875 -1.23046875 -3.06640625 t-2.9395 -1.2695 z M27.724571875 19.365275 l-0.019531 -1.1426 q-0.029296875 -0.83984375 0.068359375 -1.42578125 q0.21484375 -1.845703125 0.9375 -2.705078125 q0.703125 -0.751953125 1.435546875 -1.162109375 q1.2109375 -0.517578125 2.763671875 -0.48828125 q1.2109375 0 2.241210938 0.6103515625 t1.4697 1.6406 t0.43945 3.2275 l0 5.5078 l-1.3672 0 l0 -5.1074 q0 -1.85546875 -0.15625 -2.48046875 q-0.244140625 -1.064453125 -0.966796875 -1.508789063 t-2.1387 -0.44434 q-1.25 0 -2.2265625 0.72265625 t-0.9082 1.9727 q-0.185546875 0.80078125 -0.185546875 2.919921875 l0 3.9258 l-1.3867 0 l0 -4.0625 z M43.857396875 21.914075 q-1.015625 0.546875 -1.9921875 0.087890625 q-1.19140625 -0.908203125 -1.1328125 -2.587890625 l0 -4.5313 l2.5391 0 l0 -1.1816 l-2.5488 0 l0 -5.1758 l-1.3867 0 l0 11.123 q-0.01953125 1.171875 0.537109375 2.1484375 q0.91796875 1.552734375 2.5 1.640625 q0.83984375 0.029296875 1.9140625 -0.380859375 q-0.166015625 -0.41015625 -0.4296875 -1.142578125 z M55.498171875 19.619175 l1.1523 0.61523 q-0.556640625 1.123046875 -1.30859375 1.806640625 t-1.6895 1.04 t-2.1191 0.35645 q-2.6171875 0 -4.091796875 -1.713867188 t-1.4746 -3.8721 q0 -2.041015625 1.25 -3.6328125 q1.58203125 -2.03125 4.248046875 -2.03125 q2.724609375 0 4.365234375 2.080078125 q1.162109375 1.46484375 1.171875 3.65234375 l-9.6191 0 q0.0390625 1.875 1.19140625 3.071289063 t2.8418 1.1963 q0.8203125 0 1.591796875 -0.2880859375 t1.3135 -0.75684 t1.1768 -1.5234 z M55.498171875 16.738275 q-0.2734375 -1.103515625 -0.80078125 -1.762695313 t-1.3965 -1.0645 t-1.8262 -0.40527 q-1.572265625 0 -2.705078125 1.015625 q-0.8203125 0.7421875 -1.240234375 2.216796875 l7.9688 0 z M69.961109375 14.687475 l-1.0938 0.68359 q-1.416015625 -1.89453125 -3.8671875 -1.89453125 q-1.962890625 0 -3.256835938 1.259765625 t-1.2939 3.0664 q0 1.171875 0.595703125 2.211914063 t1.6309 1.6064 t2.3242 0.56641 q2.373046875 0 3.8671875 -1.875 l1.0938 0.71289 q-0.771484375 1.15234375 -2.065429688 1.782226563 t-2.9541 0.62988 q-2.529296875 0 -4.204101563 -1.611328125 t-1.6748 -3.916 q0 -1.5625 0.7861328125 -2.895507813 t2.1484 -2.0801 t3.0615 -0.74707 q1.0546875 0 2.045898438 0.322265625 t1.6846 0.84473 t1.1719 1.333 z M72.587853125 8.593375 l1.3867 0 l0 6.0645 q0.830078125 -1.103515625 1.831054688 -1.650390625 t2.1729 -0.54688 q1.2109375 0 2.138671875 0.6103515625 t1.3672 1.6357 t0.43945 3.2324 l0 5.5078 l-1.3672 0 l0 -5.1074 q0 -1.85546875 -0.15625 -2.48046875 q-0.25390625 -1.064453125 -0.927734375 -1.596679688 t-1.7676 -0.53223 q-1.25 0 -2.241210938 0.8251953125 t-1.3037 2.0459 q-0.185546875 0.78125 -0.185546875 2.919921875 l0 3.9258 l-1.3867 0 l0 -14.854 z M88.720678125 21.914075 q-1.015625 0.546875 -1.9921875 0.087890625 q-1.19140625 -0.908203125 -1.1328125 -2.587890625 l0 -4.5313 l2.5391 0 l0 -1.1816 l-2.5488 0 l0 -5.1758 l-1.3867 0 l0 11.123 q-0.01953125 1.171875 0.537109375 2.1484375 q0.91796875 1.552734375 2.5 1.640625 q0.83984375 0.029296875 1.9140625 -0.380859375 q-0.166015625 -0.41015625 -0.4296875 -1.142578125 z M91.162153125 12.461375 l1.3867 0 l0 5 q0 1.8359375 0.1953125 2.51953125 q0.29296875 0.986328125 1.123046875 1.557617188 t1.9922 0.57129 q1.15234375 0 1.953125 -0.556640625 t1.1035 -1.4648 q0.21484375 -0.615234375 0.21484375 -2.626953125 l0 -5 l1.4063 0 l0 5.2637 q0 2.216796875 -0.5224609375 3.334960938 t-1.5576 1.748 t-2.5977 0.62988 q-1.572265625 0 -2.6171875 -0.6298828125 t-1.5625 -1.7676 t-0.51758 -3.4229 l0 -5.1563 z M108.64258125 12.187375 q2.470703125 0 4.1015625 1.787109375 q1.50390625 1.630859375 1.50390625 3.876953125 q0.01953125 5.546875 0 5.634765625 l-1.4551 0 l0 -2.4316 q-1.142578125 2.12890625 -4.150390625 2.3828125 q-2.4609375 0 -4.018554688 -1.674804688 t-1.5576 -3.9111 q0 -2.2265625 1.474609375 -3.8671875 q1.630859375 -1.796875 4.1015625 -1.796875 z M108.64258125 13.535375 q-1.708984375 0 -2.939453125 1.26953125 t-1.2305 3.0664 q0 1.162109375 0.6298828125 2.236328125 t2.1338 1.8164 q3.76953125 0.83984375 5.361328125 -3.427734375 q0.087890625 -1.3671875 -0.29296875 -2.6171875 q-0.2734375 -0.56640625 -0.751953125 -1.07421875 q-1.201171875 -1.26953125 -2.91015625 -1.26953125 z M116.709025 8.574375 l1.3867 0 l0 14.854 l-1.3867 0 l0 -14.854 z"></path></g></svg> </a> </div> <div class="flex-item flex-menu-items" style="flex:70%"> <ul class="flex-container menu-links"> <li class="flex-item"> <a href="http://www.techstack21.com">Home</a> </li> <li class="flex-item"> <a onclick="{getArticleByCategory}" href="/">Javascript</a> </li> <li class="flex-item"> <a onclick="{getArticleByCategory}" href="/">NodeJs</a> </li> <li class="flex-item"> <a onclick="{getArticleByCategory}" href="/">Jquery</a> </li> <li class="flex-item"> <a onclick="{getArticleByCategory}" href="/">Latest Tech</a> </li> <li class="flex-item" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <a> <span class="create_button btn btn-xs btn-default" id="post_new_topic_btn" data-toggle="modal" data-target="#blog_posting_modal">+ CREATE POST</span> </a> </li> <li class="flex-item" if="{(typeof DataMixin !== \'undefined\' && DataMixin !== null) && (DataMixin.getRole() === \'ROLE_ADMIN\')}"> <a data-toggle="collapse" id="logout" data-target=".navbar-collapse.in" href="#" onclick="{logout}">LOGOUT</a> </li> <li id="slideIcon" class="flex-item"> <div id="nav-icon3"> <span></span> <span></span> <span></span> <span></span> </div> </li> </ul> </div> </div> </div> </div>', '', '', function(opts) {
        SharedMixin = {
            observable: riot.observable()
        };
        this.mixin(SharedMixin);
        var self = this;
        self.data = {};
        self.data.categories = [];

        self.on('mount', function(){

        });

        this.logout = function(){
            $.ajax({
                url:"/logout",
                success: function(res){
                    DataMixin.setAuthentication(res);
                    $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                    riot.route(res.redirect);
                },
                error: function(err){
                    console.error('err ', err);
                }
            });
        }.bind(this)

        this.getArticleByCategory = function(e) {
            var that = $(this);
            that.off('click');
            console.log('e.target.innerText', e.target.innerText);
            DataMixin.data.categoryType = e.target.innerText;
            console.log('active ajax requests', $.active);
            if($.active == 0) {
                $.ajax({
                    url:'/get_post_by_category/' + encodeURIComponent(e.target.innerText),
                    success: function(articles) {
                        console.log('success postByCategories: ', articles);
                        DataMixin.data.topics = articles;
                        setTimeout(function() {
                            self.observable.trigger('set_data_on_load');
                        },1000)
                    },
                    error: function(err) {
                        console.log('error ', err);
                    }
                })
                .always(function() {
                    that.on('click', self.getArticleByCategory);
                });
            }
        }.bind(this)
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('logout_tag', '<div id="container" if="{DataMixin.state==\'logout\'}"> <div class="signupBox"> <div class=""> <h4>You are now signed out.</h4> </div> <div class="signup_subtite"> <div> You can <a href="/#!blog_topic_title">return to home page</a> or <a href="/#!signup_popup">sign in again</a> </div> </div> </div> </div>', '#container { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 300px; } .signup_subtite > *{ font-size: 1em; }', '', function(opts) {
});


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('post_blog', '<div class="col-md-10" if="{DataMixin.state==⁗blog_topic_title⁗}" style="margin-bottom: 10px;"> <blog_posting_modal id="blog_posting_modal" class="modal fade" data-backdrop="static" data-keyboard="false" role="dialog"></blog_posting_modal> <blog_edit_modal id="blog_edit_modal" class="modal fade" role="dialog"></blog_edit_modal> <blog_topic_title each="{item , i in data.blogTopicsArr}" index="{i}" id="{item._id}" topic="{item}"></blog_topic_title> </div>', 'post_blog #post_blog_subTitle,[riot-tag="post_blog"] #post_blog_subTitle,[data-is="post_blog"] #post_blog_subTitle{ font-weight: bold; } post_blog .pad5555,[riot-tag="post_blog"] .pad5555,[data-is="post_blog"] .pad5555{ padding: 0px 55px 0px 12px; }', '', function(opts) {
        this.mixin(SharedMixin);
        var self = this;
        self.data = {};

        self.on('mount', function() {
            console.log('self.root.localName ', self.root.localName);
        });

        this.updateTitles = function(){
            self.data.blogTopicsArr = DataMixin.data.topics;
            self.update();
        }.bind(this)

        this.loadMore = function(){
            if (DataMixin.data.categoryType == 'All') {
                DataMixin.get_data_on_scrollEnd(3, DataMixin.data.topics.length);
            }
        }.bind(this)

        self.observable.on('set_data_on_load', function() {
            self.updateTitles();
        });

        self.observable.on('post_created', function() {
            self.data.blogTopicsArr = DataMixin.data.topics;
            self.update();
        });

        self.observable.on('post_edit', function() {
            self.data.blogTopicsArr = DataMixin.data.topics;
            self.update();
        });

        self.observable.on('post_delete', function(deleteId) {
            self.data.blogTopicsArr = DataMixin.data.topics;
            self.update();
        });

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('signup_popup', '<div id="wraper" if="{DataMixin.state==⁗signup_popup⁗}" style="margin-top: -40px;"> <div class="flex-container flex-item-center"> <div class="flex-item"> </div> <div class="flex-item signup_subtite"> </div> <div class="flex-item"> <div class="signupBox"> <div class="fb" data-social="facebook" onclick="{socialAuthentication}"> <i class="fa fa-facebook" style="color: white;"> <span class="">Sign in with Facebook</span> </i> </div> <div class="padding_top10"></div> <div class="gp" data-social="google" onclick="{socialAuthentication}"> <i class="fa fa-google-plus" style="color:white"> <span> Sign in with Google</span> </i> </div> </div> </div> </div> </div>', '', 'id="signup"', function(opts) {

    this.mixin(SharedMixin);
    var self = this;
    self.previousState = '';
    self.data = {};

    self.observable.on('previous_state', function(previousState) {
        self.previousState = previousState;
        if(self.previousState == 'signup_popup'){
            self.previousState = 'post_blog';
        }
        self.update(self.previousState);
    });

    this.socialAuthentication = function(e) {
        NProgress.start();
        var social = e.currentTarget.dataset.social;
        popupTools.popup('auth/'+social+'/', "Google Authentication", {}, function (err, user) {
            if (err) {
                console.error(err.message);
                NProgress.done();
            } else {
                $('#cbp-spmenu-s2').removeClass('cbp-spmenu-open');
                console.log('user social profile ', user);
                DataMixin.data.username = user.username;
                DataMixin.data.userImage = user.profilePhoto;
                self.currentState = DataMixin.state;
                self.observable.trigger('previous_state', self.currentState);
                DataMixin.setAuthentication(user);
                riot.route(self.previousState);
                NProgress.done();
            }
        });
    }.bind(this)

});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)(__webpack_require__(46)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/kiriti/Documents/VS_CODE/techstack21/node_modules/babel-loader/lib/index.js!/home/kiriti/Documents/VS_CODE/techstack21/public_html/assets/js/textWrapper.js")

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)(__webpack_require__(47)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/kiriti/Documents/VS_CODE/techstack21/node_modules/babel-loader/lib/index.js!/home/kiriti/Documents/VS_CODE/techstack21/public_html/assets/vendor/js/PopupTools.min.js")

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)(__webpack_require__(48)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/kiriti/Documents/VS_CODE/techstack21/node_modules/babel-loader/lib/index.js!/home/kiriti/Documents/VS_CODE/techstack21/public_html/assets/vendor/js/classie.js")

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2)(__webpack_require__(49)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/kiriti/Documents/VS_CODE/techstack21/node_modules/babel-loader/lib/index.js!/home/kiriti/Documents/VS_CODE/techstack21/public_html/assets/vendor/js/nprogress.js")

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./custom.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./custom.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./font-colors.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./font-colors.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./font.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./font.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./header_scoped.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./header_scoped.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./media-queries.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./media-queries.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./sidebar_scoped.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./sidebar_scoped.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./signup_scoped.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./signup_scoped.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./slide_scoped.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./slide_scoped.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./social.css", function() {
			var newContent = require("!!../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../node_modules/style-loader/index.js!../../../node_modules/css-loader/index.js??ref--2-2!./social.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./component.css", function() {
			var newContent = require("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./component.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./normalize.css", function() {
			var newContent = require("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./normalize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./nprogress.css", function() {
			var newContent = require("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./nprogress.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./svg-menu.css", function() {
			var newContent = require("!!../../../../node_modules/extract-text-webpack-plugin/loader.js??ref--2-0!../../../../node_modules/style-loader/index.js!../../../../node_modules/css-loader/index.js??ref--2-2!./svg-menu.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {


__webpack_require__(29);
__webpack_require__(20);
__webpack_require__(21);
__webpack_require__(19);
__webpack_require__(27);
__webpack_require__(22);
__webpack_require__(24);
__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(23);
__webpack_require__(28);
__webpack_require__(31);
__webpack_require__(30);

__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);

var riot = __webpack_require__(0);

__webpack_require__(11);
__webpack_require__(9);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(10);
__webpack_require__(8);
__webpack_require__(13);
__webpack_require__(7);
__webpack_require__(14);
__webpack_require__(12);

document.addEventListener('DOMContentLoaded', function (e) {

    commons = {};
    $.getJSON('commons.json', function (data) {
        commons = data.commons;
    });

    SharedMixin = {
        observable: riot.observable() //trigger,on,one etc
    };

    var self = this;
    self.data = {};

    window.DataMixin = {
        data: {
            "status": "Init",
            "processing": false,
            "limit": 3,
            "offset": 0,
            "currentOffset": 0
        },

        setAuthentication: function (user) {
            if (typeof user !== 'undefined' && user !== null) {
                localStorage.setItem('role', user.role);
                localStorage.setItem('username', user.username);
            }
        },

        getRole: function () {
            return localStorage.getItem('role');
        },

        getUsername: function () {
            return localStorage.getItem('username');
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        getCheckedBoxes: function (category_select) {
            //            var category = document.getElementById(category_select);
            //            var options = category && category.options;
            //            var opt;
            //            
            //            var checkboxesChecked = [];
            //            for (var i = 0; i < options.length; i++) {
            //                opt = options[i];
            //                if (options[i].selected) {
            //                    checkboxesChecked.push(opt.value || opt.text);
            //                }
            //            }
            //Improved version of getting select options as array using array.prototype.method!
            var checkboxesChecked = Array.prototype.slice.call(document.querySelectorAll('#category_select option:checked'), 0).map(function (v, i, a) {
                return v.value;
            });
            console.log('checkboxesChecked list', checkboxesChecked);
            // Return the array if it is non-empty, or null
            var result = checkboxesChecked.length > 0 ? checkboxesChecked : checkboxesChecked[0] = new Array("Miscellaneous");
            SharedMixin.observable.trigger('set_categories', result);
            return result;
        },

        getParameterByName: function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        get_data_page_load: function () {
            $.ajax({
                url: '/getDataOnPageLoad/' + encodeURIComponent(DataMixin.data.limit) + '/' + encodeURIComponent(DataMixin.data.offset),
                type: 'GET',
                async: true,
                success: function (res) {
                    DataMixin.data.topics = [];

                    if (res.redirect && res.redirect == "logout") {
                        riot.route('/logout');
                    } else {

                        for (var i = 0; i < res.length; i++) {
                            DataMixin.data.topics.push(res[i]);
                        }

                        //UPDATE AFTER GETTING COMMENT COUNT
                        DataMixin.data.categoryType = "All";
                        riot.mount('blog_sidebar');
                        SharedMixin.observable.trigger('set_data_on_load');
                    }
                },
                error: function (err) {
                    console.log('failed getting data on login', err);
                }
            });

            $.ajax({
                url: '/getCategoriesOnPageLoad',
                success: function (res) {
                    console.log('categories: ', res);
                    SharedMixin.observable.trigger('set_categories', res);
                },
                error: function (err) {
                    console.log('err', err);
                }
            });
        },

        get_data_on_scrollEnd: function (limit, offset) {
            $.ajax({
                url: '/getDataOnScrollEnd/' + encodeURIComponent(limit) + '/' + encodeURIComponent(offset),
                type: 'GET',
                async: true,
                success: function (res) {

                    for (var i = 0; i < res.length; i++) {
                        DataMixin.data.topics.push(res[i]);
                    }

                    //UPDATE AFTER GETTING COMMENT COUNT
                    SharedMixin.observable.trigger('set_data_on_load');
                },
                error: function (err) {
                    console.log('failed getting data on login', err);
                }
            });
        },

        sendAnalyticsData: function () {
            // Start : Google Analytics Code
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments);
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            ga('create', 'UA-92532850-2', 'auto');
            ga('send', 'pageview');
            // Start : Google Analytics Code
        },

        b64toBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        },

        getGoogleReports: function () {
            $.ajax({
                url: '/getGoogleReports',
                success: function (res) {
                    console.log('Google Report success: ', res);
                    DataMixin.totalPageViews = res.reports[0].data.totals[0].values[0];
                    console.log('Total site views: ', DataMixin.totalPageViews);
                },
                error: function (err) {
                    console.log('Googlr report error: ', err);
                }
            });
        }
    };

    // DataMixin.linkedInExchangeCode = {
    //     code: DataMixin.getParameterByName('code')
    // };

    // console.log("exchange code on load, " , self.linkedInExchangeCode);


    function goTo(path) {
        console.log('path ', path);
        DataMixin.sendAnalyticsData();
        //        DataMixin.getGoogleReports();
        window.pageState = '';

        if (path !== 'signup_popup' && DataMixin.state !== 'signup_popup') {
            //            window.onbeforeunload = function (e) {
            //                //no need to set any return msg as browser has its own default value.
            //                return "";
            //            };
        }

        if (path === 'blog_topic_title') {
            DataMixin.state = 'blog_topic_title';
            window.pageState = 'blog_topic_title';
            riot.update();
        } else if (path === 'article') {
            var posts = DataMixin.getParameterByName('dataUrl');
            SharedMixin.observable.trigger('post_details_url', posts);
            DataMixin.state = 'article';
            riot.update();
        } else if (path === 'blog_comments') {
            DataMixin.state = 'blog_comments';
            riot.update();
        } else if (path === 'signup_popup') {
            DataMixin.state = 'signup_popup';
            riot.mount("signup_popup");
            riot.update();
        } else if (path === 'Terms_of_use') {
            DataMixin.state = 'Terms_of_use';
            riot.mount("Terms_of_use");
            riot.update();
        } else if (path === 'logout') {
            DataMixin.state = 'logout';
            riot.mount("logout_tag");
            riot.update();
        } else {
            console.log('no path found');
            DataMixin.state = 'blog_topic_title';
            riot.route('/blog_topic_title');
            riot.update();
        }
    }

    riot.route.base('#!');
    header = riot.mount("header_tag");
    slide = riot.mount("blog_slide_menu");
    post = riot.mount("post_blog");
    footer = riot.mount("footer_tag");
    riot.route(goTo);
    riot.route.start(true);

    riot.mixin(SharedMixin);
    riot.mixin(DataMixin);
});

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 39 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 41 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 42 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 43 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 44 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 45 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "/* \n * To change this license header, choose License Headers in Project Properties.\n * To change this template file, choose Tools | Templates\n * and open the template in the editor.\n */\n\n/**\n * Wraps a string around each character/letter\n *\n * @param {string} str The string to transform\n * @param {string} tmpl Template that gets interpolated\n * @returns {string} The given input as splitted by chars/letters\n */\nfunction wrapChars(str, tmpl) {\n  return str.replace(/\\w/g, tmpl || \"<span>$&</span>\");\n}\n\n/**\n * Wraps a string around each word\n *\n * @param {string} str The string to transform\n * @param {string} tmpl Template that gets interpolated\n * @returns {string} The given input splitted by words\n */\nfunction wrapWords(str, tmpl) {\n  return str.replace(/\\w+/g, tmpl || \"<span>$&</span>\");\n}\n\n/**\n * Wraps a string around each line\n *\n * @param {string} str The string to transform\n * @param {string} tmpl Template that gets interpolated\n * @returns {string} The given input splitted by lines\n */\nfunction wrapLines(str, tmpl) {\n  return str.replace(/.+$/gm, tmpl || \"<span>$&</span>\");\n}"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "(function (f) {\n  if (typeof exports === \"object\" && typeof module !== \"undefined\") {\n    module.exports = f();\n  } else if (typeof define === \"function\" && define.amd) {\n    define([], f);\n  } else {\n    var g;if (typeof window !== \"undefined\") {\n      g = window;\n    } else if (typeof global !== \"undefined\") {\n      g = global;\n    } else if (typeof self !== \"undefined\") {\n      g = self;\n    } else {\n      g = this;\n    }g.popupTools = f();\n  }\n})(function () {\n  var define, module, exports;\"use strict\";var defaultOptions = { width: 700, height: 520, menubar: \"no\", resizable: \"yes\", location: \"yes\", scrollbars: \"no\", centered: true };var popupCount = 1;function optionsToString(options) {\n    return Object.keys(options).map(function processOption(key) {\n      return key + \"=\" + options[key];\n    }).join(\",\");\n  }function defaultPopupName() {\n    popupCount += 1;return \"Popup \" + popupCount;\n  }function optionsResolveCentered(options) {\n    var result = options;var width = window.outerWidth - options.width;var height = window.outerHeight - options.height;if (options.centered) {\n      result.left = options.left || Math.round(window.screenX + width / 2);result.top = options.top || Math.round(window.screenY + height / 2.5);delete result.centered;\n    }return result;\n  }function assign(target) {\n    var sources = Array.prototype.slice.call(arguments, 1);function assignArgument(previous, source) {\n      Object.keys(source).forEach(function assignItem(key) {\n        previous[key] = source[key];\n      });return previous;\n    }return sources.reduce(assignArgument, target);\n  }function openPopupWithPost(url, postData, name, options) {\n    var form = document.createElement(\"form\");var win;form.setAttribute(\"method\", \"post\");form.setAttribute(\"action\", url);form.setAttribute(\"target\", name);Object.keys(postData).forEach(function addFormItem(key) {\n      var input = document.createElement(\"input\");input.type = \"hidden\";input.name = key;input.value = postData[key];form.appendChild(input);\n    });document.body.appendChild(form);win = window.open(\"about:blank\", name, options);win.document.write(\"Loading...\");form.submit();document.body.removeChild(form);return win;\n  }function popupExecute(execute, url, name, options, callback) {\n    var popupName = name || defaultPopupName();var popupOptions = optionsResolveCentered(assign({}, defaultOptions, options));var popupCallback = callback || function noop() {};var optionsString = optionsToString(popupOptions);var win = execute(url, popupName, optionsString);var isMessageSent = false;var interval;function onMessage(message) {\n      var data = message ? message.data : undefined;if (data) {\n        isMessageSent = true;window.removeEventListener(\"message\", onMessage);popupCallback(undefined, data);\n      }\n    }window.addEventListener(\"message\", onMessage, false);if (win) {\n      interval = setInterval(function closePopupCallback() {\n        if (win == null || win.closed) {\n          setTimeout(function delayWindowClosing() {\n            clearInterval(interval);if (!isMessageSent) {\n              popupCallback(new Error(\"Popup closed\"));\n            }\n          }, 500);\n        }\n      }, 100);\n    } else {\n      popupCallback(new Error(\"Popup blocked\"));\n    }return win;\n  }function popup(url, name, options, callback) {\n    return popupExecute(window.open, url, name, options, callback);\n  }function popupWithPost(url, postData, name, options, callback) {\n    function openWithPostData(popupUrl, popupName, optionsString) {\n      return openPopupWithPost(popupUrl, postData, popupName, optionsString);\n    }return popupExecute(openWithPostData, url, name, options, callback);\n  }function popupResponse(data) {\n    var jsonData = JSON.stringify(data);return \"<script>\" + \"window.opener.postMessage(\" + jsonData + ', \"*\");' + \"setTimeout(function() { window.close(); }, 50);\" + \"</script>\";\n  }return { popup: popup, popupWithPost: popupWithPost, popupResponse: popupResponse };\n});"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "/*!\n * classie - class helper functions\n * from bonzo https://github.com/ded/bonzo\n * \n * classie.has( elem, 'my-class' ) -> true/false\n * classie.add( elem, 'my-new-class' )\n * classie.remove( elem, 'my-unwanted-class' )\n * classie.toggle( elem, 'my-class' )\n */\n\n/*jshint browser: true, strict: true, undef: true */\n/*global define: false */\n\n!function (s) {\n  \"use strict\";\n  function e(s) {\n    return new RegExp(\"(^|\\\\s+)\" + s + \"(\\\\s+|$)\");\n  }function n(s, e) {\n    var n = a(s, e) ? c : t;n(s, e);\n  }var a, t, c;\"classList\" in document.documentElement ? (a = function (s, e) {\n    return s.classList.contains(e);\n  }, t = function (s, e) {\n    s.classList.add(e);\n  }, c = function (s, e) {\n    s.classList.remove(e);\n  }) : (a = function (s, n) {\n    return e(n).test(s.className);\n  }, t = function (s, e) {\n    a(s, e) || (s.className = s.className + \" \" + e);\n  }, c = function (s, n) {\n    s.className = s.className.replace(e(n), \" \");\n  });var i = { hasClass: a, addClass: t, removeClass: c, toggleClass: n, has: a, add: t, remove: c, toggle: n };\"function\" == typeof define && define.amd ? define(i) : s.classie = i;\n}(window);"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress\n * @license MIT */\n\n!function (n, e) {\n  \"function\" == typeof define && define.amd ? define(e) : \"object\" == typeof exports ? module.exports = e() : n.NProgress = e();\n}(this, function () {\n  function n(n, e, t) {\n    return e > n ? e : n > t ? t : n;\n  }function e(n) {\n    return 100 * (-1 + n);\n  }function t(n, t, r) {\n    var i;return i = \"translate3d\" === c.positionUsing ? { transform: \"translate3d(\" + e(n) + \"%,0,0)\" } : \"translate\" === c.positionUsing ? { transform: \"translate(\" + e(n) + \"%,0)\" } : { \"margin-left\": e(n) + \"%\" }, i.transition = \"all \" + t + \"ms \" + r, i;\n  }function r(n, e) {\n    var t = \"string\" == typeof n ? n : o(n);return t.indexOf(\" \" + e + \" \") >= 0;\n  }function i(n, e) {\n    var t = o(n),\n        i = t + e;r(t, e) || (n.className = i.substring(1));\n  }function s(n, e) {\n    var t,\n        i = o(n);r(n, e) && (t = i.replace(\" \" + e + \" \", \" \"), n.className = t.substring(1, t.length - 1));\n  }function o(n) {\n    return (\" \" + (n.className || \"\") + \" \").replace(/\\s+/gi, \" \");\n  }function a(n) {\n    n && n.parentNode && n.parentNode.removeChild(n);\n  }var u = {};u.version = \"0.2.0\";var c = u.settings = { minimum: .08, easing: \"ease\", positionUsing: \"\", speed: 200, trickle: !0, trickleRate: .02, trickleSpeed: 800, showSpinner: !0, barSelector: '[role=\"bar\"]', spinnerSelector: '[role=\"spinner\"]', parent: \"body\", template: '<div class=\"bar\" role=\"bar\"><div class=\"peg\"></div></div><div class=\"spinner\" role=\"spinner\"><div class=\"spinner-icon\"></div></div>' };u.configure = function (n) {\n    var e, t;for (e in n) t = n[e], void 0 !== t && n.hasOwnProperty(e) && (c[e] = t);return this;\n  }, u.status = null, u.set = function (e) {\n    var r = u.isStarted();e = n(e, c.minimum, 1), u.status = 1 === e ? null : e;var i = u.render(!r),\n        s = i.querySelector(c.barSelector),\n        o = c.speed,\n        a = c.easing;return i.offsetWidth, l(function (n) {\n      \"\" === c.positionUsing && (c.positionUsing = u.getPositioningCSS()), f(s, t(e, o, a)), 1 === e ? (f(i, { transition: \"none\", opacity: 1 }), i.offsetWidth, setTimeout(function () {\n        f(i, { transition: \"all \" + o + \"ms linear\", opacity: 0 }), setTimeout(function () {\n          u.remove(), n();\n        }, o);\n      }, o)) : setTimeout(n, o);\n    }), this;\n  }, u.isStarted = function () {\n    return \"number\" == typeof u.status;\n  }, u.start = function () {\n    u.status || u.set(0);var n = function () {\n      setTimeout(function () {\n        u.status && (u.trickle(), n());\n      }, c.trickleSpeed);\n    };return c.trickle && n(), this;\n  }, u.done = function (n) {\n    return n || u.status ? u.inc(.3 + .5 * Math.random()).set(1) : this;\n  }, u.inc = function (e) {\n    var t = u.status;return t ? (\"number\" != typeof e && (e = (1 - t) * n(Math.random() * t, .1, .95)), t = n(t + e, 0, .994), u.set(t)) : u.start();\n  }, u.trickle = function () {\n    return u.inc(Math.random() * c.trickleRate);\n  }, function () {\n    var n = 0,\n        e = 0;u.promise = function (t) {\n      return t && \"resolved\" !== t.state() ? (0 === e && u.start(), n++, e++, t.always(function () {\n        e--, 0 === e ? (n = 0, u.done()) : u.set((n - e) / n);\n      }), this) : this;\n    };\n  }(), u.render = function (n) {\n    if (u.isRendered()) return document.getElementById(\"nprogress\");i(document.documentElement, \"nprogress-busy\");var t = document.createElement(\"div\");t.id = \"nprogress\", t.innerHTML = c.template;var r,\n        s = t.querySelector(c.barSelector),\n        o = n ? \"-100\" : e(u.status || 0),\n        l = document.querySelector(c.parent);return f(s, { transition: \"all 0 linear\", transform: \"translate3d(\" + o + \"%,0,0)\" }), c.showSpinner || (r = t.querySelector(c.spinnerSelector), r && a(r)), l != document.body && i(l, \"nprogress-custom-parent\"), l.appendChild(t), t;\n  }, u.remove = function () {\n    s(document.documentElement, \"nprogress-busy\"), s(document.querySelector(c.parent), \"nprogress-custom-parent\");var n = document.getElementById(\"nprogress\");n && a(n);\n  }, u.isRendered = function () {\n    return !!document.getElementById(\"nprogress\");\n  }, u.getPositioningCSS = function () {\n    var n = document.body.style,\n        e = \"WebkitTransform\" in n ? \"Webkit\" : \"MozTransform\" in n ? \"Moz\" : \"msTransform\" in n ? \"ms\" : \"OTransform\" in n ? \"O\" : \"\";return e + \"Perspective\" in n ? \"translate3d\" : e + \"Transform\" in n ? \"translate\" : \"margin\";\n  };var l = function () {\n    function n() {\n      var t = e.shift();t && t(n);\n    }var e = [];return function (t) {\n      e.push(t), 1 == e.length && n();\n    };\n  }(),\n      f = function () {\n    function n(n) {\n      return n.replace(/^-ms-/, \"ms-\").replace(/-([\\da-z])/gi, function (n, e) {\n        return e.toUpperCase();\n      });\n    }function e(n) {\n      var e = document.body.style;if (n in e) return n;for (var t, r = i.length, s = n.charAt(0).toUpperCase() + n.slice(1); r--;) if (t = i[r] + s, t in e) return t;return n;\n    }function t(t) {\n      return t = n(t), s[t] || (s[t] = e(t));\n    }function r(n, e, r) {\n      e = t(e), n.style[e] = r;\n    }var i = [\"Webkit\", \"O\", \"Moz\", \"ms\"],\n        s = {};return function (n, e) {\n      var t,\n          i,\n          s = arguments;if (2 == s.length) for (t in e) i = e[t], void 0 !== i && e.hasOwnProperty(t) && r(n, t, i);else r(n, s[1], s[2]);\n    };\n  }();return u;\n});"

/***/ }),
/* 50 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ })
/******/ ]);