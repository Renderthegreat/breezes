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

/***/ "./node_modules/ws/browser.js"
/*!************************************!*\
  !*** ./node_modules/ws/browser.js ***!
  \************************************/
(module) {



module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};


/***/ },

/***/ "./dist/src/blower.js"
/*!****************************!*\
  !*** ./dist/src/blower.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Blower: () => (/* binding */ Blower),
/* harmony export */   blower: () => (/* binding */ blower)
/* harmony export */ });
/* harmony import */ var _assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #assets/identifier.json */ "./assets/identifier.json");
/* harmony import */ var _wind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #~/wind */ "./dist/src/wind.js");
/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ws */ "./node_modules/ws/browser.js");
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.mjs");




class Blower extends eventemitter3__WEBPACK_IMPORTED_MODULE_3__.EventEmitter {
    server;
    path;
    static __WebSocketServer__;
    // By default, use the *WebSocketServer* base.
    static {
        this.__WebSocketServer__ = ws__WEBPACK_IMPORTED_MODULE_2__.WebSocketServer;
    }
    ;
    static async create(config) {
        const server = new ws__WEBPACK_IMPORTED_MODULE_2__.WebSocketServer({
            perMessageDeflate: true,
            noServer: true,
        });
        return new Blower(server, config.path);
    }
    ;
    initialize(socket) {
        socket.once('message', (data) => {
            // TODO...
            socket.send(`"${_assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting}"`);
            // TODO...
            this.emit('connection', new _wind__WEBPACK_IMPORTED_MODULE_1__.Wind(socket /* TODO: Check the implications of this. */));
        });
    }
    constructor(server, path) {
        super();
        this.server = server;
        this.path = path;
        this.server.on('connection', (socket) => {
            this.initialize(socket);
        });
    }
    ;
    handle(request, socket, head) {
        this.server.handleUpgrade(request, socket, head, (socket, request) => {
            this.initialize(socket);
        });
    }
    ;
}
;
(function (Blower) {
    ;
    class Creator {
        // TODO: Document.
        static async create() {
            // Type declaration only.
            return null;
        }
        ;
    }
    Blower.Creator = Creator;
    ;
})(Blower || (Blower = {}));
;
function blower(config) {
    return (target) => {
        target.create = async () => {
            return await Blower.create(config);
        };
    };
}
;


/***/ },

/***/ "./dist/src/codes.js"
/*!***************************!*\
  !*** ./dist/src/codes.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Close: () => (/* binding */ Close),
/* harmony export */   ConnectionState: () => (/* binding */ ConnectionState)
/* harmony export */ });
var Close;
(function (Close) {
    Close[Close["NormalClosure"] = 1000] = "NormalClosure";
    Close[Close["GoingAway"] = 1001] = "GoingAway";
    Close[Close["ProtocolError"] = 1002] = "ProtocolError";
    Close[Close["UnsupportedData"] = 1003] = "UnsupportedData";
    Close[Close["NoStatusReceived"] = 1005] = "NoStatusReceived";
    Close[Close["AbnormalClosure"] = 1006] = "AbnormalClosure";
    Close[Close["InvalidPayloadData"] = 1007] = "InvalidPayloadData";
    Close[Close["PolicyViolation"] = 1008] = "PolicyViolation";
    Close[Close["MessageTooBig"] = 1009] = "MessageTooBig";
    Close[Close["MandatoryExtension"] = 1010] = "MandatoryExtension";
    Close[Close["ServerError"] = 1011] = "ServerError";
    Close[Close["ServiceRestart"] = 1012] = "ServiceRestart";
    Close[Close["TryAgainLater"] = 1013] = "TryAgainLater";
    Close[Close["BadGateway"] = 1014] = "BadGateway";
    Close[Close["TLSHandshake"] = 1015] = "TLSHandshake";
})(Close || (Close = {}));
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



// TODO: Add documentation.
// TODO: Ping/Pong.
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
                socket.close(_codes__WEBPACK_IMPORTED_MODULE_2__.Close.InvalidPayloadData);
                return;
            }
            ;
            this.queue.push(data);
            this.emit('packet', data);
        });
        socket.addEventListener('close', (event) => {
            this.emit('close', event.code, event.reason);
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
    /**
     * End the connection.
     *
     * @param code The closing code to send.
     */
    close(code = _codes__WEBPACK_IMPORTED_MODULE_2__.Close.NormalClosure, reason) {
        this.socket.close(code, reason);
    }
    ;
    async *receiver() {
        const queue = [];
        let next = {
            resolve: null,
            reject: null,
        };
        let closeInfo = null;
        this.on('packet', (packet) => {
            queue.push(packet);
            next.resolve?.();
            next.resolve = null;
        });
        this.once('close', (code, reason) => {
            next.resolve?.(); // Wake up the loop to handle the closure.
            closeInfo = {
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
                return closeInfo;
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
// import Z from 'zod';
/**
 * Converts {@link Serializable} → {@link string}.
 *
 * @param data The data to stringify.
 * @returns {string | null} The stringified data.
 */
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
/**
 * Converts {@link string} → {@link Serializable | null}.
 *
 * @param string The string to parse.
 * @returns {Serializable | null} The parsed data.
 */
function parse(string) {
    try {
        return JSON.parse(string);
    }
    catch {
        return null;
    }
    // removed by dead control flow

}
;


/***/ },

/***/ "./dist/src/router.js"
/*!****************************!*\
  !*** ./dist/src/router.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Router: () => (/* binding */ Router)
/* harmony export */ });
class Router {
    server;
    routes = new Map();
    constructor(server) {
        this.server = server;
        this.server.on('upgrade', (request, socket, head) => {
            const { pathname: path, } = new URL(`http://${request.headers.host}${request.url}`);
            if (this.routes.keys().toArray().includes(path)) {
                this.routes.get(path)?.handle(request, socket, head);
            }
            else {
                console.log(this.routes.keys());
            }
            ;
        });
    }
    ;
    push(blower) {
        this.routes.set(blower.path, blower);
    }
    ;
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
/* harmony import */ var _reader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #~/reader */ "./dist/src/reader.js");



class Wind extends _device__WEBPACK_IMPORTED_MODULE_1__.Device {
    static __WebSocket__;
    // By default, use the *WebSocket* base.
    static {
        this.__WebSocket__ = globalThis.WebSocket;
    }
    ;
    static async connect(config) {
        const socket = new this.__WebSocket__(config.location);
        return new Promise((resolve, reject) => {
            socket.addEventListener('open', async () => {
                socket.send(`"${_assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting}"`);
                let response = await (new Promise((resolve, reject) => {
                    function listener(event) {
                        socket.removeEventListener('message', listener);
                        resolve(_reader__WEBPACK_IMPORTED_MODULE_2__.parse(event.data));
                    }
                    ;
                    socket.addEventListener('message', listener);
                    /*if (config.timeout !== undefined) {
                        setTimeout(reject, config.timeout);
                    };*/
                }));
                if (response !== _assets_identifier_json__WEBPACK_IMPORTED_MODULE_0__.greeting) {
                    reject("The server did not return the correct identifier.");
                }
                ;
                /*if (config.doNotInquirePeerInfo !== true) {
                    response = await (new Promise<string>((resolve, reject) => {
                        function listener(event: MessageEvent<string>) {
                            socket.removeEventListener('message', listener);
    
                            resolve(event.data);
                        };
    
                        socket.addEventListener('message', listener);
    
                        if (config.timeout !== undefined) {
                            setTimeout(reject, config.timeout);
                        };
                    }));
                };*/
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
        /**
         * Connects to a {@link Blower} instance.
         *
         * @param location The location of the *WebSocket*.
         *
         */
        static async connect() {
            // Type declaration only.
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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./dist/src/index.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Blower: () => (/* reexport safe */ _blower__WEBPACK_IMPORTED_MODULE_1__.Blower),
/* harmony export */   Codes: () => (/* reexport module object */ _codes__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   Reader: () => (/* reexport module object */ _reader__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   Router: () => (/* reexport safe */ _router__WEBPACK_IMPORTED_MODULE_2__.Router),
/* harmony export */   Wind: () => (/* reexport safe */ _wind__WEBPACK_IMPORTED_MODULE_0__.Wind),
/* harmony export */   blower: () => (/* reexport safe */ _blower__WEBPACK_IMPORTED_MODULE_1__.blower),
/* harmony export */   wind: () => (/* reexport safe */ _wind__WEBPACK_IMPORTED_MODULE_0__.wind)
/* harmony export */ });
/* harmony import */ var _wind__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #~/wind */ "./dist/src/wind.js");
/* harmony import */ var _blower__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! #~/blower */ "./dist/src/blower.js");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! #~/router */ "./dist/src/router.js");
/* harmony import */ var _codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! #~/codes */ "./dist/src/codes.js");
/* harmony import */ var _reader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! #~/reader */ "./dist/src/reader.js");






})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map