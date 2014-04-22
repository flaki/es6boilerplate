(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $getPrototypeOf = $Object.getPrototypeOf;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    $freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  $freeze(SymbolValue.prototype);
  Symbol.iterator = Symbol();
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    $defineProperty(Object, 'is', method(is));
    function assign(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        target[props[p]] = source[props[p]];
      }
      return target;
    }
    $defineProperty(Object, 'assign', method(assign));
    function mixin(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        descriptor = $getOwnPropertyDescriptor(source, props[p]);
        $defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    $defineProperty(Object, 'mixin', method(mixin));
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function toObject(value) {
    if (value == null)
      throw $TypeError();
    return $Object(value);
  }
  function spread() {
    var rv = [],
        k = 0;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = toObject(arguments[i]);
      for (var j = 0; j < valueToSpread.length; j++) {
        rv[k++] = valueToSpread[j];
      }
    }
    return rv;
  }
  function getPropertyDescriptor(object, name) {
    while (object !== null) {
      var result = $getOwnPropertyDescriptor(object, name);
      if (result)
        return result;
      object = $getPrototypeOf(object);
    }
    return undefined;
  }
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    if (!proto)
      throw $TypeError('super is null');
    return getPropertyDescriptor(proto, name);
  }
  function superCall(self, homeObject, name, args) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if ('value' in descriptor)
        return descriptor.value.apply(self, args);
      if (descriptor.get)
        return descriptor.get.call(self).apply(self, args);
    }
    throw $TypeError("super has no method '" + name + "'.");
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (descriptor.get)
        return descriptor.get.call(self);
      else if ('value' in descriptor)
        return descriptor.value;
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
    }
    if (superClass === null)
      return null;
    throw new TypeError();
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function addIterator(object) {
    return defineProperty(object, Symbol.iterator, nonEnum(function() {
      return this;
    }));
  }
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    }
  };
  function getNextOrThrow(ctx, moveNext, action) {
    return function(x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          throw new Error(("\"" + action + "\" on closed generator"));
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value = moveNext(ctx);
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    };
  }
  function generatorWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    return addIterator({
      next: getNextOrThrow(ctx, moveNext, 'next'),
      throw: getNextOrThrow(ctx, moveNext, 'throw')
    });
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = Object.create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        return;
      case RETHROW_STATE:
        this.reject(this.storedException);
      default:
        this.reject(getInternalError(this.state));
    }
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.createErrback = function(newState) {
      return function(err) {
        ctx.state = newState;
        ctx.err = err;
        moveNext(ctx);
      };
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.GState = ST_CLOSED;
            ctx.state = END_STATE;
            throw ex;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
      }
    };
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    asyncWrap: asyncWrap,
    createClass: createClass,
    defaultSuperCall: defaultSuperCall,
    exportStar: exportStar,
    generatorWrap: generatorWrap,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    spread: spread,
    superCall: superCall,
    superGet: superGet,
    superSet: superSet,
    toObject: toObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      return this.value_ = this.func.call(global);
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: func
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/utils";
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x | 0;
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__4;
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator";
  var $__5 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/utils"),
      toObject = $__5.toObject,
      toUint32 = $__5.toUint32;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__4 = {}, Object.defineProperty($__4, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap";
  var $__default = function asap(callback, arg) {
    var length = queue.push([callback, arg]);
    if (length === 1) {
      scheduleFlush();
    }
  };
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = [];
  function flush() {
    for (var i = 0; i < queue.length; i++) {
      var tuple = queue[i];
      var callback = tuple[0],
          arg = tuple[1];
      callback(arg);
    }
    queue = [];
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap").default;
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : (function(x) {
      return x;
    });
    var onReject = arguments[2] !== (void 0) ? arguments[2] : (function(e) {
      throw e;
    });
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 'pending':
        promise.onResolve_.push([deferred, onResolve]);
        promise.onReject_.push([deferred, onReject]);
        break;
      case 'resolved':
        promiseReact(deferred, onResolve, promise.value_);
        break;
      case 'rejected':
        promiseReact(deferred, onReject, promise.value_);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    var result = {};
    result.promise = new C((function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    }));
    return result;
  }
  var Promise = function Promise(resolver) {
    var $__6 = this;
    this.status_ = 'pending';
    this.onResolve_ = [];
    this.onReject_ = [];
    resolver((function(x) {
      promiseResolve($__6, x);
    }), (function(r) {
      promiseReject($__6, r);
    }));
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function() {
      var onResolve = arguments[0] !== (void 0) ? arguments[0] : (function(x) {
        return x;
      });
      var onReject = arguments[1];
      var $__6 = this;
      var constructor = this.constructor;
      return chain(this, (function(x) {
        x = promiseCoerce(constructor, x);
        return x === $__6 ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }), onReject);
    }
  }, {
    resolve: function(x) {
      return new this((function(resolve, reject) {
        resolve(x);
      }));
    },
    reject: function(r) {
      return new this((function(resolve, reject) {
        reject(r);
      }));
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var count = 0;
      var resolutions = [];
      try {
        for (var i = 0; i < values.length; i++) {
          ++count;
          this.cast(values[i]).then(function(i, x) {
            resolutions[i] = x;
            if (--count === 0)
              deferred.resolve(resolutions);
          }.bind(undefined, i), (function(r) {
            if (count > 0)
              count = 0;
            deferred.reject(r);
          }));
        }
        if (count === 0)
          deferred.resolve(resolutions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.cast(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  function promiseResolve(promise, x) {
    promiseDone(promise, 'resolved', x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, 'rejected', r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 'pending')
      return;
    for (var i = 0; i < reactions.length; i++) {
      promiseReact(reactions[i][0], reactions[i][1], value);
    }
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = promise.onReject_ = undefined;
  }
  function promiseReact(deferred, handler, x) {
    async((function() {
      try {
        var y = handler(x);
        if (y === deferred.promise)
          throw new TypeError;
        else if (isPromise(y))
          chain(y, deferred.resolve, deferred.reject);
        else
          deferred.resolve(y);
      } catch (e) {
        deferred.reject(e);
      }
    }));
  }
  var thenableSymbol = '@@thenable';
  function promiseCoerce(constructor, x) {
    if (isPromise(x)) {
      return x;
    } else if (x && typeof x.then === 'function') {
      var p = x[thenableSymbol];
      if (p) {
        return p;
      } else {
        var deferred = getDeferred(constructor);
        x[thenableSymbol] = deferred.promise;
        try {
          x.then(deferred.resolve, deferred.reject);
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    } else {
      return x;
    }
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/String";
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/polyfills";
  var Promise = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/Promise").Promise;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/String"),
      codePointAt = $__9.codePointAt,
      contains = $__9.contains,
      endsWith = $__9.endsWith,
      fromCodePoint = $__9.fromCodePoint,
      repeat = $__9.repeat,
      raw = $__9.raw,
      startsWith = $__9.startsWith;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator"),
      entries = $__9.entries,
      keys = $__9.keys,
      values = $__9.values;
  function maybeDefineMethod(object, name, value) {
    if (!(name in object)) {
      Object.defineProperty(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values]);
    if (Symbol && Symbol.iterator) {
      Object.defineProperty(Array.prototype, Symbol.iterator, {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfill-import";
  var $__11 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.32/src/runtime/polyfill-import" + '');

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "app";
console.debug('Initializing "demo" app...');
var Demo = require('demo').Demo;
window.APP = new Demo();
APP.addDemoGroup('ES6 Features');
var ArrowFunctionsDemo = require('es6/ArrowFunctions').example;
ArrowFunctionsDemo(APP);
APP.addDemoGroup('Open Web API-s');
var GeolocationDemo = require('webapi/Geolocation').example;
GeolocationDemo(APP);

},{"demo":2,"es6/ArrowFunctions":4,"webapi/Geolocation":5}],2:[function(require,module,exports){
"use strict";
var __moduleName = "demo";
var Demo = function Demo() {
  this.examples = [];
  this.labels = {};
  document.querySelector('header > button').addEventListener('click', (function(e) {
    if (document.body.dataset.page) {
      delete document.body.dataset.page;
      document.querySelector('article.active').classList.remove('active');
    }
  }));
};
($traceurRuntime.createClass)(Demo, {
  addDemoGroup: function(group) {
    var element = document.createElement('h2');
    element.textContent = group;
    document.querySelector('main').appendChild(element);
  },
  addDemo: function(example) {
    var $__0 = this;
    var $__2 = example,
        group = $__2.group,
        title = $__2.title;
    var label = (group ? group.toLowerCase() + '_' : '') + title.replace(/\s+/, '_').toLowerCase();
    this.examples.push({
      title: title,
      group: group,
      example: example,
      label: label
    });
    this.labels[label] = this.examples.length - 1;
    console.log('Added new example (' + label + '): ', example);
    var element = document.createElement('article');
    element.id = label;
    example.render(element);
    document.body.appendChild(element);
    var launcher = document.createElement('button');
    launcher.textContent = (group ? group.toUpperCase() + ': ' : '') + title;
    launcher.addEventListener('click', (function() {
      return $__0.activate(label);
    }));
    document.querySelector('main').appendChild(launcher);
  },
  activate: function(label) {
    var $__2 = this.examples[this.labels[label]],
        group = $__2.group,
        title = $__2.title;
    document.querySelector('header > .sub.group').textContent = group;
    document.querySelector('header > .sub.title').textContent = title;
    document.querySelector('article#' + label).classList.add('active');
    document.body.dataset.page = label;
  },
  home: function() {}
}, {});
module.exports = {
  get Demo() {
    return Demo;
  },
  __esModule: true
};

},{}],3:[function(require,module,exports){
"use strict";
var __moduleName = "demoexample";
function highlight(element) {
  Prism.highlightElement(element);
}
function escape(string) {
  return string.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}
function logging_function() {
  var $__6;
  for (var msgs = [],
      $__3 = 0; $__3 < arguments.length; $__3++)
    msgs[$__3] = arguments[$__3];
  ($__6 = console).log.apply($__6, $traceurRuntime.toObject(msgs));
  var sandbox = document.getElementById(this.dataset.sandbox);
  if (!sandbox)
    return false;
  for (var $__1 = msgs[Symbol.iterator](),
      $__2; !($__2 = $__1.next()).done; ) {
    try {
      throw undefined;
    } catch (m) {
      m = $__2.value;
      {
        switch (typeof m) {
          case 'object':
            if ("nodeName" in m) {
              sandbox.appendChild(m);
              break;
            }
            try {
              m = JSON.stringify(m, (function(k, v) {
                return (k === "app" ? undefined : v);
              })).replace(/(\:|\,|\{|\[)/g, '$1 ').replace(/(\]|\})/g, ' $1');
            } catch (ex) {
              m = m.toString();
            }
          default:
            sandbox.insertAdjacentHTML('beforeend', Prism.highlight(m + " ", Prism.languages.javascript));
        }
      }
    }
  }
  sandbox.appendChild(document.createTextNode("\n"));
}
function linkify(string) {
  return string.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (function() {
    for (var rx = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      rx[$__4] = arguments[$__4];
    return '<a target="_blank" href="' + rx[2] + '">' + rx[1] + '</a>';
  }));
}
function markdown_basics(string) {
  return linkify(string).replace(/\`([^\`]+)\`/g, (function() {
    for (var rx = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      rx[$__4] = arguments[$__4];
    return '<code>' + rx[1] + '</code>';
  })).replace(/\s*\r?\n(\s*\r?\n)+/g, '</p><p>').replace(/  \r?\n/g, '<br>\n').replace(/\*([^\*]+)\*/g, (function() {
    for (var rx = [],
        $__5 = 0; $__5 < arguments.length; $__5++)
      rx[$__5] = arguments[$__5];
    return '<strong>' + rx[1] + '</strong>';
  }));
}
var DemoExample = function DemoExample() {};
($traceurRuntime.createClass)(DemoExample, {
  render: function(frame) {
    this.frame = frame;
  },
  addText: function(contents) {
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.debug("Text: ", contents);
    var e = document.createDocumentFragment();
    markdown_basics(contents).split('</p><p>').forEach((function(contents) {
      var p = document.createElement('p');
      p.innerHTML = contents;
      e.appendChild(p);
    }));
    this.frame.appendChild(e);
  },
  addCode: function(source) {
    var type = arguments[1] !== (void 0) ? arguments[1] : "markup";
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.debug("Demo: ", type, source);
    var e = document.createElement('pre'),
        code = document.createElement('code');
    code.className = 'language-' + type;
    code.innerHTML = escape(source);
    e.appendChild(code);
    this.frame.appendChild(e);
    highlight(code);
  },
  addDemoCode: function(source, exec) {
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.debug("Code: ", source, exec);
    var e = document.createElement('pre'),
        code = document.createElement('code');
    code.className = "language-javascript";
    code.innerHTML = escape(source);
    e.appendChild(code);
    this.frame.appendChild(e);
    highlight(code);
    var sbid = 'sandbox_' + (new Date()).getTime();
    var sandbox = document.createElement('pre');
    sandbox.id = sbid;
    sandbox.className = 'sandbox language-clike';
    var launchbtn = document.createElement('button');
    launchbtn.textContent = "Run\u2026";
    launchbtn.dataset.sandbox = sbid;
    launchbtn.addEventListener('click', (function(e) {
      var btn = e.target;
      if (!btn.dataset.started) {
        btn.dataset.started = 'started';
        btn.textContent = "Reset";
        exec({log: logging_function.bind(btn)});
      } else {
        btn.dataset.started = '';
        btn.textContent = "Run\u2026";
        document.getElementById(btn.dataset.sandbox).innerHTML = '';
      }
    }));
    this.frame.appendChild(sandbox);
    this.frame.appendChild(launchbtn);
  }
}, {});
module.exports = {
  get DemoExample() {
    return DemoExample;
  },
  __esModule: true
};

},{}],4:[function(require,module,exports){
"use strict";
var __moduleName = "ArrowFunctions";
var DemoExample = require('demoexample').DemoExample;
var DEMO_GROUP = 'es6';
var DEMO_TITLE = 'Arrow functions';
var ES6ArrowsDemo = function ES6ArrowsDemo(app) {
  this.app = app;
  this.group = DEMO_GROUP;
  this.title = DEMO_TITLE;
  this.app.addDemo(this);
};
var $ES6ArrowsDemo = ES6ArrowsDemo;
($traceurRuntime.createClass)(ES6ArrowsDemo, {
  render: function(element) {
    var $__0 = this;
    $traceurRuntime.superCall(this, $ES6ArrowsDemo.prototype, "render", [element]);
    this.addText("<h1>ECMAScript 6 arrow functions</h1>\n*Docs*:\n [Strawman](http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax) &middot;\n [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/arrow_functions)  \n*Native support*:\n [Firefox 22+](https://developer.mozilla.org/en-US/docs/Web/JavaScript/ECMAScript_6_support_in_Mozilla) &middot;\n [Firefox OS 1.2+](https://developer.mozilla.org/en-US/Firefox_OS/Releases/1.2)\n\nArrow functions in EcmaScript 6 have their roots in C# and ar the the native equivalent of [CoffeeScript\n\"fat arrow\"](http://coffeescript.org/#fat-arrow) function declarations.\n\nBasic syntax: \`args *=>* function_body\`\n\n<h3>So, what are the advantages of using arrow functions?</h3>\n\nThey are shorter, more conscise and readable than traditional function declarations:\n");
    this.addCode("// Instead of writing\nfunction(arg) { return arg.prop }\n\n// ..all you need to type is\narg => arg.prop\n\n// Such as:\nvar f = x => x+1;\n\n// ..is the equivalent of\nvar f = function (x) { return x+1 };\n\n// ..empty argument lists are supported, too:\nvar empty = () => 'empty args list';\n\n// ..and, of course, lenghtier function bodies & multiple arguments:\nvar longer = (x, y) => {\n\tif (x == y) return 'It's a tie - <x> equals <y>.';\n\tif (x > y) return 'Yay, <x> wins!';\n\treturn 'There you go, <y> is the man!';\n};\n", 'javascript');
    this.addText("A useful perk of arrow functions, is that they're inherently bound by default\n(their \`this\` is lexically scoped, independent of the object the function is called on):\n\nNormally, the value of the \`this\` property inside an executing functin is dynamic - it depends on what object the function was called on (or the global object/\`undefined\` in cases where the function is not called as a method - read more about the [value of the \`this\` property on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)).\n\nPre-ES6, you could manipulate the \`this\` property via the function's \`call(thisvalue)\`/\`apply(thisvalue)\` method calls, by setting it to the desired \`this\` value just before calling the function itself.  \nSince ES5, you can use the [\`Array.prototype.bind()\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) call to permanently fix the \`this\` value of a particular function to a value specified by you, regardless of the calling environment. Function that are \"locked' on to a specific this value are called bound functions.\n\nArrow functions do something quite similar to this latter case, as they do not have their own \`this\` property, but are 'bound' to the active \`this\` value of the enclosing scope (=of the function object has been defined in).");
    this.addDemoCode("// Traditional function declaration\nvar func = function () { console.log(this, this && this.name); };\n\n// Traditional method declaration\nvar es5obj = {\n    name: 'ES5',\n    method: function () { console.log(this, this && this.name); }\n};\n\n// ES6 arrow syntax function declaration\nvar es6obj = {\n    name: 'ES6',\n    method: () => { console.log(this, this && this.name); }\n};\n\n// Call the named function directly\n// Logs: undefined \"\" (\"this\" is undefined for direct invocations, *see note)\nfunc();\n\n// Logs: es5obj \"ES5\"\nes5obj.method();\n\n// Logs: \"undefined\" since the arrow function is bound to the current outer scope (which is undefined)\nes6obj.method();\n\n// Logs: es6obj \"ES6\" as the method call will now act on the specified object (es6obj) as its this-value\nes5obj.method.call(es6obj);\n\n// Logs: \"undefined\" as the arrow function remains bound to the active scope of its declaration, and can not be overridden\nes6obj.method.call(es5obj);\n\n// The bound function below, on the other hand, will act pretty much alike the arrow function above\nvar bound_es5obj = {\n    name: 'Bound ES5',\n    method: (function () { console.log(this, this && this.name); }).bind(this)\n};\n\n// Logs: undefined \"\" for both calls, as the function is already bound to the enclosing this value, and can not be overridden\nconsole.log('Bound: ', bound_es5obj);\nbound_es5obj.method();\nbound_es5obj.method.call(es6obj);\n", (function(console) {
      return $__0.thisBindExample(console);
    }));
    this.addText("<strong>* NOTE: </strong> <em>Note that this only holds in strict mode\n(and thus, the implicitly strict module code, in traditional script context this in\nsuch calls refers to the global object (eg.: window)).</em>");
    this.addText("<h3>Arrow functions are great for:</h3>\n\n*Callbacks*:");
    this.addDemoCode("// They are great for quick, short callbacks for library functions:\n\n// Convert all numbers in a string to hexa form\nlet hexMe = \"ab 123 cd 34 efgh 576 k\";\nconsole.log(hexMe.replace(/\d+/g, n => \"0x\"+Number(n).toString(16) ));\n\n// Sort by object id\nlet sortMe = [\n\t{ id: \"M38D2LDJ\", name: \"Fish\" },\n\t{ id: \"B59C7123\", name: \"Spaghetti\" },\n\t{ id: \"0014ACX5\", name: \"Book\" },\n\t{ id: \"HDU27JEN\", name: \"Toy\" },\n];\nconsole.log(sortMe.sort( (a,b) => a.id.localeCompare(b.id) ));\n\n// Create cubic sum\nlet cubsumMe = [ 4, 2, 3 ];\nconsole.log(cubsumMe.reduce( (prev,current) => prev+current*current , 0));\n", (function(console) {
      return $__0.callbackExample(console);
    }));
    this.addText("*Event listeners*:");
    this.addDemoCode("// Create a new button to attach the event listener to\nlet button = document.createElement('button');\n\nbutton.textContent = 'Click me!';\nbutton.addEventListener('click', e => {\n\tconsole.log('Clicked button:');\n\n\t// \"this\" no longer represents the element the event was fired on but is instead, undefined ( = matches the \"this\" of the enclosing scope)\n\tconsole.log('value of this: ', this);\n\n\t// to access the event target, use the event argument\n\tconsole.log('event target: ', e.target);\n});\n\ndocument.body.appendChild(button);\n", (function(console) {
      return $__0.eventListenerExample(console);
    }));
    this.addText("*Promise handlers:*");
    this.addDemoCode("// Let's see when the AppSkeleton repo was last updated via an AJAX call to the CORS-enabled GitHub v3 REST API and create a new Promise for the result\nvar P = new Promise( (resolve, reject) => {\n\tvar xhr = new XMLHttpRequest();\n\n\t// Query the repo information using api.github.com\n\txhr.open('GET', 'https://api.github.com/repos/flaki/es6boilerplate', true);\n\txhr.onreadystatechange = () => {\n\t\t// Wait until request completes\n\t\tif (xhr.readyState != 4) return;\n\n\t\t// HTTP error\n\t\tif (xhr.status != 200) {\n\t\t\treturn reject(new Error('XHR failed: HTTP/' + xhr.status));\n\t\t}\n\n\t\t// Success!\n\t\ttry {\n\t\t\tresolve(new Date(JSON.parse(xhr.responseText).updated_at));\n\t\t}\n\t\t// JSON/Date parse error, or general malformed JSON error\n\t\tcatch (ex) {\n\t\t\treject(ex);\n\t\t}\n\t};\n\n\tconsole.log('[flaki/es6boilerplate] Querying GitHub API for repo info...');\n\txhr.send();\n});\n\nP.then(\n\tresult => console.log('Current local time at Mozilla HQ: ', result.toLocaleString())\n).catch(\n\texception => console.log('Failed: ', exception)\n);\n", (function(console) {
      $__0.promiseExample(console).then((function(result) {
        return console.log('The AppSkeleton was last updated @', result.toLocaleString());
      })).catch((function(exception) {
        return console.log('Failed:', exception);
      }));
    }));
    this.addText("\n<h2>[Help expand the demo...](https://github.com/flaki/es6boilerplate)</h2>\n...eg. by adding:\n\n&bull; more demos for useful use cases  \n&bull; anything else you feel like worth mentioning here\n");
  },
  thisBindExample: function(console) {
    (function() {
      var $__0 = this;
      var func = function() {
        console.log(this, this && this.name);
      };
      var es5obj = {
        name: 'ES5',
        method: function() {
          console.log(this, this && this.name);
        }
      };
      var es6obj = {
        name: 'ES6',
        method: (function() {
          console.log($__0, $__0 && $__0.name);
        })
      };
      func();
      es5obj.method();
      es6obj.method();
      es5obj.method.call(es6obj);
      es6obj.method.call(es5obj);
      var bound_es5obj = {
        name: 'Bound ES5',
        method: (function() {
          console.log(this, this && this.name);
        }).bind(this)
      };
      console.log('Bound: ', bound_es5obj);
      bound_es5obj.method();
      bound_es5obj.method.call(es6obj);
    })();
  },
  callbackExample: function(console) {
    var hexMe = "ab 123 cd 34 efgh 576 k";
    console.log(hexMe.replace(/\d+/g, (function(n) {
      return "0x" + Number(n).toString(16);
    })));
    var sortMe = [{
      id: "M38D2LDJ",
      name: "Fish"
    }, {
      id: "B59C7123",
      name: "Spaghetti"
    }, {
      id: "0014ACX5",
      name: "Book"
    }, {
      id: "HDU27JEN",
      name: "Toy"
    }];
    console.log(sortMe.sort((function(a, b) {
      return a.id.localeCompare(b.id);
    })));
    var cubsumMe = [4, 2, 3];
    console.log(cubsumMe.reduce((function(prev, current) {
      return prev + current * current;
    }), 0));
  },
  eventListenerExample: function(console) {
    var $__0 = this;
    var button = document.createElement('button');
    button.textContent = 'Click me!';
    button.addEventListener('click', (function(e) {
      console.log('Clicked button:');
      console.log('value of this: ', $__0);
      console.log('event target: ', e.target.toString());
    }));
    console.log(button);
  },
  promiseExample: function(console) {
    var P = new Promise((function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.github.com/repos/flaki/es6boilerplate', true);
      xhr.onreadystatechange = (function() {
        if (xhr.readyState != 4)
          return;
        if (xhr.status != 200) {
          return reject(new Error('XHR failed: HTTP/' + xhr.status));
        }
        try {
          resolve(new Date(JSON.parse(xhr.responseText).updated_at));
        } catch (ex) {
          reject(ex);
        }
      });
      console.log('[flaki/es6boilerplate] Querying GitHub API for repo info...');
      xhr.send();
    }));
    return P;
  },
  activate: function() {},
  reset: function() {}
}, {}, DemoExample);
function example(Demo) {
  return new ES6ArrowsDemo(Demo);
}
module.exports = {
  get example() {
    return example;
  },
  __esModule: true
};

},{"demoexample":3}],5:[function(require,module,exports){
"use strict";
var __moduleName = "Geolocation";
var DemoExample = require('demoexample').DemoExample;
var DEMO_GROUP = 'webapi';
var DEMO_TITLE = 'Geolocation';
var GeolocationDemo = function GeolocationDemo(app) {
  this.app = app;
  this.group = DEMO_GROUP;
  this.title = DEMO_TITLE;
  this.app.addDemo(this);
};
var $GeolocationDemo = GeolocationDemo;
($traceurRuntime.createClass)(GeolocationDemo, {
  render: function(element) {
    var $__0 = this;
    $traceurRuntime.superCall(this, $GeolocationDemo.prototype, "render", [element]);
    this.addText("\r\n<h1>Geolocation API demo</h1>\r\n*API docs*: [Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation)  \r\n*API availability*: Firefox OS 1.0.1+  \r\n*API permissions*:\r\n\t[geolocation](https://developer.mozilla.org/en-US/Apps/Build/App_permissions)\r\n\t\`hosted\`\r\n\r\n*Demo ES6-features*:  \r\n\tPromises, Arrow functions, Destructuring\r\n\r\nBased on the [MDN Geolocation Tutorial](https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation).\r\n\r\nWe will be using the \`navigator.geolocation\` API to access geolocation features. The API is present\r\nin Firefox OS from the earliest versions, and most modern browsers support it, too.\r\n\r\nWe will first start by creating a \`Promise\`-returning wrapper function - because the geolocation request\r\nis an async process, we will need this promise to store the result of the operation and act upon it:\r\n");
    this.addCode("// Get GPS cordinates via a Promise\r\nfunction getGPSCoords () {\r\n\t// Create new Promise to help out in fetching the geolocation data asynchronously\r\n\treturn new Promise( (resolve,reject) => { \r\n\r\n\t\t// Call the geolocation API\r\n\t\tnavigator.geolocation.getCurrentPosition(\r\n\t\t\t// Success callback -> promise resolves to geolocation position\r\n\t\t\t(pos) => resolve( [ pos.coords.latitude , pos.coords.longitude ] ),\r\n\r\n\t\t\t// Failure callback -> promise rejects with an error message\r\n\t\t\t()    => reject(new Error('Failed do retrieve your geolocation position.'))\r\n\t\t);\r\n\t});\r\n}", "javascript");
    this.addText("Let's see, how to use that!");
    this.addDemoCode("// Fetch GPS coordinates\r\nlet Coords = getGPSCoords();\r\n\r\n// If/when location information is retrieved, update the UI\r\nCoords.then(\r\n\t(coords) => {\r\n\t\tlet [lat,lon] = coords;\r\n\t\tconsole.log('Lat: '+lat+'°, Lon: '+lon+'°');\r\n\t}\r\n\r\n// ...or show an error message, if retrieving the GPS coordinates failed\r\n).catch(\r\n\t(e) => alert(e)\r\n);", (function(console) {
      return $__0.logLocation(console);
    }));
    this.addText("Let's try something more interesting/useful!  \r\nUsing the [Google Static Maps API](http://) we will show the location on a\r\nstatic image map:");
    this.addDemoCode("// Fetch GPS coordinates\r\n// If/when location information is retrieved, show them on map!\r\nCoords.then(\r\n\t(coords) => {\r\n\t\tlet [lat,lon] = coords;\r\n\t\tlet i = new Image();\r\n\t\ti.src = \"http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$\"\r\n\t\t\t.replace('$LAT$',lat)\r\n\t\t\t.replace('$LON$',lon);\r\n\r\n\t\tdocument.body.appendChild(i);\r\n\t}\r\n);", (function(console) {
      return $__0.showLocation(console);
    }));
    this.addText("\r\n<h2>[Help expand the demo...](https://github.com/flaki/es6boilerplate)</h2>\r\n...eg. by adding examples for:\r\n\r\n&bull; \`watchPosition()\`  \r\n&bull; flags (\`enableHighAccuracy\`, \`maximumAge\`, \`timeout\`)\r\n");
  },
  getGPSCoords: function() {
    return new Promise((function(resolve, reject) {
      navigator.geolocation.getCurrentPosition((function(pos) {
        return resolve([pos.coords.latitude, pos.coords.longitude]);
      }), (function() {
        return reject(new Error('Failed do retrieve your geolocation position.'));
      }));
    }));
  },
  logLocation: function() {
    var console = arguments[0] !== (void 0) ? arguments[0] : window.console;
    var Coords = this.getGPSCoords();
    Coords.then((function(coords) {
      var $__2 = coords,
          lat = $__2[0],
          lon = $__2[1];
      console.log('Lat: ' + lat + '°, Lon: ' + lon + '°');
    })).catch((function(e) {
      return alert(e);
    }));
  },
  showLocation: function() {
    var console = arguments[0] !== (void 0) ? arguments[0] : window.console;
    var Coords = this.getGPSCoords();
    Coords.then((function(coords) {
      var $__2 = coords,
          lat = $__2[0],
          lon = $__2[1];
      var i = new Image();
      i.src = "http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$".replace('$LAT$', lat).replace('$LON$', lon);
      console.log(i);
    })).catch((function(e) {
      return alert(e);
    }));
  },
  activate: function() {},
  reset: function() {}
}, {}, DemoExample);
function example(Demo) {
  return new GeolocationDemo(Demo);
}
module.exports = {
  get example() {
    return example;
  },
  __esModule: true
};

},{"demoexample":3}]},{},[1])