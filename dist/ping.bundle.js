/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/eventemitter3/index.js"
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
(module) {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ },

/***/ "./dist/src/codes.js"
/*!***************************!*\
  !*** ./dist/src/codes.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConnectionState: () => (/* binding */ ConnectionState),
/* harmony export */   Disconnect: () => (/* binding */ Disconnect)
/* harmony export */ });
var Disconnect;
(function (Disconnect) {
    Disconnect[Disconnect["NormalClosure"] = 1000] = "NormalClosure";
    Disconnect[Disconnect["GoingAway"] = 1001] = "GoingAway";
    Disconnect[Disconnect["ProtocolError"] = 1002] = "ProtocolError";
    Disconnect[Disconnect["UnsupportedData"] = 1003] = "UnsupportedData";
    Disconnect[Disconnect["NoStatusReceived"] = 1005] = "NoStatusReceived";
    Disconnect[Disconnect["AbnormalClosure"] = 1006] = "AbnormalClosure";
    Disconnect[Disconnect["InvalidPayloadData"] = 1007] = "InvalidPayloadData";
    Disconnect[Disconnect["PolicyViolation"] = 1008] = "PolicyViolation";
    Disconnect[Disconnect["MessageTooBig"] = 1009] = "MessageTooBig";
    Disconnect[Disconnect["MandatoryExtension"] = 1010] = "MandatoryExtension";
    Disconnect[Disconnect["ServerError"] = 1011] = "ServerError";
    Disconnect[Disconnect["ServiceRestart"] = 1012] = "ServiceRestart";
    Disconnect[Disconnect["TryAgainLater"] = 1013] = "TryAgainLater";
    Disconnect[Disconnect["BadGateway"] = 1014] = "BadGateway";
    Disconnect[Disconnect["TLSHandshake"] = 1015] = "TLSHandshake";
})(Disconnect || (Disconnect = {}));
;
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Connecting"] = 0] = "Connecting";
    ConnectionState[ConnectionState["Open"] = 1] = "Open";
    ConnectionState[ConnectionState["Closing"] = 2] = "Closing";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
})(ConnectionState || (ConnectionState = {}));
;


/***/ },

/***/ "./dist/src/device.js"
/*!****************************!*\
  !*** ./dist/src/device.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Device: () => (/* binding */ Device)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.mjs");
/* harmony import */ var _reader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #~/reader */ "./dist/src/reader.js");
/* harmony import */ var _codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #~/codes */ "./dist/src/codes.js");



class Device extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__["default"] {
    socket;
    queue = [];
    peerIdentity = /* TODO: Add this type. */ null;
    constructor(socket) {
        super();
        this.socket = socket;
        socket.addEventListener('message', (event) => {
            const data = _reader__WEBPACK_IMPORTED_MODULE_1__.parse(event.data);
            if (data === null) {
                // TODO: Make this configurable.
                socket.close(_codes__WEBPACK_IMPORTED_MODULE_2__.Disconnect.InvalidPayloadData);
                return;
            }
            ;
            this.queue.push(data);
            this.emit('packet', data);
        });
        socket.addEventListener('close', (event) => {
            this.emit('disconnect', event.code, event.reason);
        });
    }
    ;
    send(data) {
        const string = _reader__WEBPACK_IMPORTED_MODULE_1__.stringify(data);
        if (string === null) {
            return;
        }
        ;
        this.socket.send(string);
    }
    ;
    async *receiver() {
        const queue = [];
        let next = {
            resolve: null,
            reject: null,
        };
        let disconnectInfo = null;
        this.on('packet', (packet) => {
            queue.push(packet);
            next.resolve?.();
            next.resolve = null;
        });
        this.once('disconnect', (code, reason) => {
            console.log(`Disconnected from server!`);
            next.resolve?.(); // Wake up the loop to handle the disconnect.
            disconnectInfo = {
                code: code,
                reason: reason,
            };
        });
        while (true) {
            // Yield all items currently in the queue.
            while (queue.length > 0) {
                yield queue.shift();
            }
            ;
            // Ensure that we don't `await` the promise, which will be unsettled.
            if (this.socket.readyState === _codes__WEBPACK_IMPORTED_MODULE_2__.ConnectionState.Closed) {
                return disconnectInfo;
                // Subsequent calls of `next` should give errors.
            }
            ;
            await new Promise((resolve, reject) => {
                next.resolve = resolve;
                next.reject = reject;
            });
        }
        ;
    }
    ;
}
;
(function (Device) {
    ;
})(Device || (Device = {}));
;


/***/ },

/***/ "./dist/src/index.js"
/*!***************************!*\
  !*** ./dist/src/index.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Wind: () => (/* reexport safe */ _wind__WEBPACK_IMPORTED_MODULE_0__.Wind),
/* harmony export */   wind: () => (/* reexport safe */ _wind__WEBPACK_IMPORTED_MODULE_0__.wind)
/* harmony export */ });
/* harmony import */ var _wind__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #~/wind */ "./dist/src/wind.js");



/***/ },

/***/ "./dist/src/reader.js"
/*!****************************!*\
  !*** ./dist/src/reader.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
function stringify(data) {
    try {
        return JSON.stringify(data);
    }
    catch {
        return null;
    }
    // removed by dead control flow

}
;
function parse(string) {
    try {
        return JSON.parse(string);
    }
    catch {
        return null;
    }
}
;


/***/ },

/***/ "./dist/src/wind.js"
/*!**************************!*\
  !*** ./dist/src/wind.js ***!
  \**************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Wind: () => (/* binding */ Wind),
/* harmony export */   wind: () => (/* binding */ wind)
/* harmony export */ });
/* harmony import */ var _assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #assets/identifier.json */ "./assets/identifier.json");
/* harmony import */ var _device__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #~/device */ "./dist/src/device.js");


class Wind extends _device__WEBPACK_IMPORTED_MODULE_1__.Device {
    static __WebSocket__;
    // By default, use the *WebSocket* base.
    static {
        this.__WebSocket__ = globalThis.WebSocket;
    }
    ;
    // Is there a `Self` type in *Typescript*?
    /**
     * Connects to a {@link Blower} instance.
     *
     * @param location The location of the *WebSocket*.
     *
     */
    static async connect(config) {
        const socket = new this.__WebSocket__(config.location);
        return new Promise((resolve, reject) => {
            socket.addEventListener('open', async () => {
                socket.send(`"${_assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting}"`);
                let response = await (new Promise((resolve, reject) => {
                    function listener(event) {
                        socket.removeEventListener('message', listener);
                        console.log(event.data);
                        resolve(event.data);
                    }
                    ;
                    socket.addEventListener('message', listener);
                    if (config.timeout !== undefined) {
                        setTimeout(reject, config.timeout);
                    }
                    ;
                }));
                if (response !== _assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting) {
                    reject("The server did not return the correct identifier.");
                }
                ;
                socket.send(`"${_assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting}"`);
                /*response = await (new Promise<string>((resolve, reject) => {
                    function listener(event: MessageEvent<string>) {
                        socket.removeEventListener('message', listener);

                        resolve(event.data);
                    };

                    socket.addEventListener('message', listener);

                    if (config.timeout !== undefined) {
                        setTimeout(reject, config.timeout);
                    };
                }));*/
                // The *WebSocket* is ready.
                const wind = new Wind(socket);
                // ...
                resolve(wind);
            });
            socket.addEventListener('error', (error) => {
                reject(error);
            });
        });
    }
    ;
}
;
(function (Wind) {
    class Creator {
        static async connect() {
            return null;
        }
        ;
    }
    Wind.Creator = Creator;
    ;
})(Wind || (Wind = {}));
;
function wind(config) {
    return (target) => {
        target.connect = async () => {
            return await Wind.connect(config);
        };
    };
}
;


/***/ },

/***/ "./dist/tests/ping.js"
/*!****************************!*\
  !*** ./dist/tests/ping.js ***!
  \****************************/
(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ping: () => (/* binding */ Ping)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #~/index */ "./dist/src/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let Ping = class Ping extends _index__WEBPACK_IMPORTED_MODULE_0__.Wind.Creator {
};
Ping = __decorate([
    _index__WEBPACK_IMPORTED_MODULE_0__.wind({
        location: new URL('ws://localhost:3000'),
        validateStructure: true,
        timeout: 1000,
    })
], Ping);

;
const ping = await Ping.connect();
/*ping.send({
    username: 'Brendan',
    password: 'Hello_W0rld!'
});*/
const receiver = ping.receiver();
for (let i = 0; i < 100; i++) {
    const packet = (await receiver.next()).value;
    console.log(packet);
    await new Promise((resolve) => setTimeout(resolve, 100));
    ping.send("ping");
}
;

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ },

/***/ "./node_modules/eventemitter3/index.mjs"
/*!**********************************************!*\
  !*** ./node_modules/eventemitter3/index.mjs ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/eventemitter3/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ },

/***/ "./assets/identifier.json"
/*!********************************!*\
  !*** ./assets/identifier.json ***!
  \********************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"version":"0.0.0","greeting":"breezes"}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var hasSymbol = typeof Symbol === "function";
/******/ 		var webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/ 		
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 		
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 		
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			var handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 		
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			var done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/tests/ping.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=ping.bundle.js.map