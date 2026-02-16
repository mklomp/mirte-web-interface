var Au = Object.defineProperty;
var gu = (e, t, r) => t in e ? Au(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var y = (e, t, r) => gu(e, typeof t != "symbol" ? t + "" : t, r);
import { EventEmitter as ce } from "eventemitter3";
var Tu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Cu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function In(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function u() {
      return this instanceof u ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(u) {
    var i = Object.getOwnPropertyDescriptor(e, u);
    Object.defineProperty(r, u, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[u];
      }
    });
  }), r;
}
var pr = { exports: {} };
(function(e) {
  (function(t, r) {
    var u = Math.pow(2, -24), i = Math.pow(2, 32), n = Math.pow(2, 53);
    function s(o) {
      var l = new ArrayBuffer(256), h = new DataView(l), D, f = 0;
      function C(p) {
        for (var v = l.byteLength, d = f + p; v < d; )
          v *= 2;
        if (v !== l.byteLength) {
          var m = h;
          l = new ArrayBuffer(v), h = new DataView(l);
          for (var R = f + 3 >> 2, b = 0; b < R; ++b)
            h.setUint32(b * 4, m.getUint32(b * 4));
        }
        return D = p, h;
      }
      function E() {
        f += D;
      }
      function _(p) {
        E(C(8).setFloat64(f, p));
      }
      function T(p) {
        E(C(1).setUint8(f, p));
      }
      function z(p) {
        for (var v = C(p.length), d = 0; d < p.length; ++d)
          v.setUint8(f + d, p[d]);
        E();
      }
      function x(p) {
        E(C(2).setUint16(f, p));
      }
      function V(p) {
        E(C(4).setUint32(f, p));
      }
      function L(p) {
        var v = p % i, d = (p - v) / i, m = C(8);
        m.setUint32(f, d), m.setUint32(f + 4, v), E();
      }
      function q(p, v) {
        v < 24 ? T(p << 5 | v) : v < 256 ? (T(p << 5 | 24), T(v)) : v < 65536 ? (T(p << 5 | 25), x(v)) : v < 4294967296 ? (T(p << 5 | 26), V(v)) : (T(p << 5 | 27), L(v));
      }
      function Y(p) {
        var v;
        if (p === !1)
          return T(244);
        if (p === !0)
          return T(245);
        if (p === null)
          return T(246);
        if (p === r)
          return T(247);
        switch (typeof p) {
          case "number":
            if (Math.floor(p) === p) {
              if (0 <= p && p <= n)
                return q(0, p);
              if (-n <= p && p < 0)
                return q(1, -(p + 1));
            }
            return T(251), _(p);
          case "string":
            var d = [];
            for (v = 0; v < p.length; ++v) {
              var m = p.charCodeAt(v);
              m < 128 ? d.push(m) : m < 2048 ? (d.push(192 | m >> 6), d.push(128 | m & 63)) : m < 55296 ? (d.push(224 | m >> 12), d.push(128 | m >> 6 & 63), d.push(128 | m & 63)) : (m = (m & 1023) << 10, m |= p.charCodeAt(++v) & 1023, m += 65536, d.push(240 | m >> 18), d.push(128 | m >> 12 & 63), d.push(128 | m >> 6 & 63), d.push(128 | m & 63));
            }
            return q(3, d.length), z(d);
          default:
            var R;
            if (Array.isArray(p))
              for (R = p.length, q(4, R), v = 0; v < R; ++v)
                Y(p[v]);
            else if (p instanceof Uint8Array)
              q(2, p.length), z(p);
            else {
              var b = Object.keys(p);
              for (R = b.length, q(5, R), v = 0; v < R; ++v) {
                var O = b[v];
                Y(O), Y(p[O]);
              }
            }
        }
      }
      if (Y(o), "slice" in l)
        return l.slice(0, f);
      for (var ne = new ArrayBuffer(f), $ = new DataView(ne), Q = 0; Q < f; ++Q)
        $.setUint8(Q, h.getUint8(Q));
      return ne;
    }
    function a(o, l, h) {
      var D = new DataView(o), f = 0;
      typeof l != "function" && (l = function(d) {
        return d;
      }), typeof h != "function" && (h = function() {
        return r;
      });
      function C(d, m) {
        return f += m, d;
      }
      function E(d) {
        return C(new Uint8Array(o, f, d), d);
      }
      function _() {
        var d = new ArrayBuffer(4), m = new DataView(d), R = V(), b = R & 32768, O = R & 31744, te = R & 1023;
        if (O === 31744)
          O = 261120;
        else if (O !== 0)
          O += 114688;
        else if (te !== 0)
          return te * u;
        return m.setUint32(0, b << 16 | O << 13 | te << 13), m.getFloat32(0);
      }
      function T() {
        return C(D.getFloat32(f), 4);
      }
      function z() {
        return C(D.getFloat64(f), 8);
      }
      function x() {
        return C(D.getUint8(f), 1);
      }
      function V() {
        return C(D.getUint16(f), 2);
      }
      function L() {
        return C(D.getUint32(f), 4);
      }
      function q() {
        return L() * i + L();
      }
      function Y() {
        return D.getUint8(f) !== 255 ? !1 : (f += 1, !0);
      }
      function ne(d) {
        if (d < 24)
          return d;
        if (d === 24)
          return x();
        if (d === 25)
          return V();
        if (d === 26)
          return L();
        if (d === 27)
          return q();
        if (d === 31)
          return -1;
        throw "Invalid length encoding";
      }
      function $(d) {
        var m = x();
        if (m === 255)
          return -1;
        var R = ne(m & 31);
        if (R < 0 || m >> 5 !== d)
          throw "Invalid indefinite length element";
        return R;
      }
      function Q(d, m) {
        for (var R = 0; R < m; ++R) {
          var b = x();
          b & 128 && (b < 224 ? (b = (b & 31) << 6 | x() & 63, m -= 1) : b < 240 ? (b = (b & 15) << 12 | (x() & 63) << 6 | x() & 63, m -= 2) : (b = (b & 15) << 18 | (x() & 63) << 12 | (x() & 63) << 6 | x() & 63, m -= 3)), b < 65536 ? d.push(b) : (b -= 65536, d.push(55296 | b >> 10), d.push(56320 | b & 1023));
        }
      }
      function p() {
        var d = x(), m = d >> 5, R = d & 31, b, O;
        if (m === 7)
          switch (R) {
            case 25:
              return _();
            case 26:
              return T();
            case 27:
              return z();
          }
        if (O = ne(R), O < 0 && (m < 2 || 6 < m))
          throw "Invalid length";
        switch (m) {
          case 0:
            return O;
          case 1:
            return -1 - O;
          case 2:
            if (O < 0) {
              for (var te = [], S = 0; (O = $(m)) >= 0; )
                S += O, te.push(E(O));
              var j = new Uint8Array(S), De = 0;
              for (b = 0; b < te.length; ++b)
                j.set(te[b], De), De += te[b].length;
              return j;
            }
            return E(O);
          case 3:
            var pe = [];
            if (O < 0)
              for (; (O = $(m)) >= 0; )
                Q(pe, O);
            else
              Q(pe, O);
            return String.fromCharCode.apply(null, pe);
          case 4:
            var Ve;
            if (O < 0)
              for (Ve = []; !Y(); )
                Ve.push(p());
            else
              for (Ve = new Array(O), b = 0; b < O; ++b)
                Ve[b] = p();
            return Ve;
          case 5:
            var Ht = {};
            for (b = 0; b < O || O < 0 && !Y(); ++b) {
              var Eu = p();
              Ht[Eu] = p();
            }
            return Ht;
          case 6:
            return l(p(), O);
          case 7:
            switch (O) {
              case 20:
                return !1;
              case 21:
                return !0;
              case 22:
                return null;
              case 23:
                return r;
              default:
                return h(O);
            }
        }
      }
      var v = p();
      if (f !== o.byteLength)
        throw "Remaining bytes";
      return v;
    }
    var c = { encode: s, decode: a };
    e.exports ? e.exports = c : t.CBOR || (t.CBOR = c);
  })(Tu);
})(pr);
var bu = pr.exports;
const yu = /* @__PURE__ */ Cu(bu);
var mr = Math.pow(2, 32), zt = !1;
function dr() {
  zt || (zt = !0, console.warn(
    "CBOR 64-bit integer array values may lose precision. No further warnings."
  ));
}
function wu(e) {
  dr();
  for (var t = e.byteLength, r = e.byteOffset, u = t / 8, i = e.buffer.slice(r, r + t), n = new Uint32Array(i), s = new Array(u), a = 0; a < u; a++) {
    var c = a * 2, o = n[c], l = n[c + 1];
    s[a] = o + mr * l;
  }
  return s;
}
function Nu(e) {
  dr();
  for (var t = e.byteLength, r = e.byteOffset, u = t / 8, i = e.buffer.slice(r, r + t), n = new Uint32Array(i), s = new Int32Array(i), a = new Array(u), c = 0; c < u; c++) {
    var o = c * 2, l = n[o], h = s[o + 1];
    a[c] = l + mr * h;
  }
  return a;
}
function _u(e, t) {
  var r = e.byteLength, u = e.byteOffset, i = e.buffer.slice(u, u + r);
  return new t(i);
}
var Yt = {
  64: Uint8Array,
  69: Uint16Array,
  70: Uint32Array,
  72: Int8Array,
  77: Int16Array,
  78: Int32Array,
  85: Float32Array,
  86: Float64Array
}, jt = {
  71: wu,
  79: Nu
};
function xu(e, t) {
  if (t in Yt) {
    var r = Yt[t];
    return _u(e, r);
  }
  return t in jt ? jt[t](e) : e;
}
var St = null;
typeof bson < "u" && (St = bson().BSON);
function wt(e) {
  var t = null;
  e.transportOptions.decoder && (t = e.transportOptions.decoder);
  function r(n) {
    n.op === "publish" ? e.emit(n.topic, n.msg) : n.op === "service_response" ? e.emit(n.id, n) : n.op === "call_service" ? e.emit(n.service, n) : n.op === "send_action_goal" ? e.emit(n.action, n) : n.op === "cancel_action_goal" || n.op === "action_feedback" || n.op === "action_result" ? e.emit(n.id, n) : n.op === "status" && (n.id ? e.emit("status:" + n.id, n) : e.emit("status", n));
  }
  function u(n, s) {
    n.op === "png" ? typeof window > "u" ? import("./decompressPng-DiHL4uf_.js").then(({ default: a }) => a(n.data, s)) : import("./decompressPng-DB2EQ_f0.js").then(({ default: a }) => a(n.data, s)) : s(n);
  }
  function i(n, s) {
    if (!St)
      throw "Cannot process BSON encoded message without BSON header.";
    var a = new FileReader();
    a.onload = function() {
      var c = new Uint8Array(this.result), o = St.deserialize(c);
      s(o);
    }, a.readAsArrayBuffer(n);
  }
  return {
    /**
     * Emit a 'connection' event on WebSocket connection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onopen: function(s) {
      e.isConnected = !0, e.emit("connection", s);
    },
    /**
     * Emit a 'close' event on WebSocket disconnection.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onclose: function(s) {
      e.isConnected = !1, e.emit("close", s);
    },
    /**
     * Emit an 'error' event whenever there was an error.
     *
     * @param {function} event - The argument to emit with the event.
     * @memberof SocketAdapter
     */
    onerror: function(s) {
      e.emit("error", s);
    },
    /**
     * Parse message responses from rosbridge and send to the appropriate
     * topic, service, or param.
     *
     * @param {Object} data - The raw JSON message from rosbridge.
     * @memberof SocketAdapter
     */
    onmessage: function(s) {
      if (t)
        t(s.data, function(o) {
          r(o);
        });
      else if (typeof Blob < "u" && s.data instanceof Blob)
        i(s.data, function(o) {
          u(o, r);
        });
      else if (s.data instanceof ArrayBuffer) {
        var a = yu.decode(s.data, xu);
        r(a);
      } else {
        var c = JSON.parse(typeof s == "string" ? s : s.data);
        u(c, r);
      }
    }
  };
}
class H extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The topic name, like '/cmd_vel'.
   * @param {string} options.messageType - The message type, like 'std_msgs/String'.
   * @param {string} [options.compression=none] - The type of compression to use, like 'png', 'cbor', or 'cbor-raw'.
   * @param {number} [options.throttle_rate=0] - The rate (in ms in between messages) at which to throttle the topics.
   * @param {number} [options.queue_size=100] - The queue created at bridge side for re-publishing webtopics.
   * @param {boolean} [options.latch=false] - Latch the topic when publishing.
   * @param {number} [options.queue_length=0] - The queue length at bridge side used when subscribing.
   * @param {boolean} [options.reconnect_on_close=true] - The flag to enable resubscription and readvertisement on close event.
   */
  constructor(r) {
    super();
    /** @type {boolean | undefined} */
    y(this, "waitForReconnect");
    /** @type {(() => void) | undefined} */
    y(this, "reconnectFunc");
    y(this, "isAdvertised", !1);
    y(this, "_messageCallback", (r) => {
      this.emit("message", r);
    });
    this.ros = r.ros, this.name = r.name, this.messageType = r.messageType, this.compression = r.compression || "none", this.throttle_rate = r.throttle_rate || 0, this.latch = r.latch || !1, this.queue_size = r.queue_size || 100, this.queue_length = r.queue_length || 0, this.reconnect_on_close = r.reconnect_on_close !== void 0 ? r.reconnect_on_close : !0, this.compression && this.compression !== "png" && this.compression !== "cbor" && this.compression !== "cbor-raw" && this.compression !== "none" && (this.emit(
      "warning",
      this.compression + " compression is not supported. No compression will be used."
    ), this.compression = "none"), this.throttle_rate < 0 && (this.emit("warning", this.throttle_rate + " is not allowed. Set to 0"), this.throttle_rate = 0), this.reconnect_on_close ? this.callForSubscribeAndAdvertise = (u) => {
      this.ros.callOnConnection(u), this.waitForReconnect = !1, this.reconnectFunc = () => {
        this.waitForReconnect || (this.waitForReconnect = !0, this.ros.callOnConnection(u), this.ros.once("connection", () => {
          this.waitForReconnect = !1;
        }));
      }, this.ros.on("close", this.reconnectFunc);
    } : this.callForSubscribeAndAdvertise = this.ros.callOnConnection;
  }
  /**
   * @callback subscribeCallback
   * @param {T} message - The published message.
   */
  /**
   * Every time a message is published for the given topic, the callback
   * will be called with the message object.
   *
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(r) {
    typeof r == "function" && this.on("message", r), !this.subscribeId && (this.ros.on(this.name, this._messageCallback), this.subscribeId = "subscribe:" + this.name + ":" + (++this.ros.idCounter).toString(), this.callForSubscribeAndAdvertise({
      op: "subscribe",
      id: this.subscribeId,
      type: this.messageType,
      topic: this.name,
      compression: this.compression,
      throttle_rate: this.throttle_rate,
      queue_length: this.queue_length
    }));
  }
  /**
   * Unregister as a subscriber for the topic. Unsubscribing will stop
   * and remove all subscribe callbacks. To remove a callback, you must
   * explicitly pass the callback function in.
   *
   * @param {import('eventemitter3').EventEmitter.ListenerFn} [callback] - The callback to unregister, if
   *     provided and other listeners are registered the topic won't
   *     unsubscribe, just stop emitting to the passed listener.
   */
  unsubscribe(r) {
    r && (this.off("message", r), this.listeners("message").length) || this.subscribeId && (this.ros.off(this.name, this._messageCallback), this.reconnect_on_close && this.ros.off("close", this.reconnectFunc), this.emit("unsubscribe"), this.ros.callOnConnection({
      op: "unsubscribe",
      id: this.subscribeId,
      topic: this.name
    }), this.subscribeId = null);
  }
  /**
   * Register as a publisher for the topic.
   */
  advertise() {
    this.isAdvertised || (this.advertiseId = "advertise:" + this.name + ":" + (++this.ros.idCounter).toString(), this.callForSubscribeAndAdvertise({
      op: "advertise",
      id: this.advertiseId,
      type: this.messageType,
      topic: this.name,
      latch: this.latch,
      queue_size: this.queue_size
    }), this.isAdvertised = !0, this.reconnect_on_close || this.ros.on("close", () => {
      this.isAdvertised = !1;
    }));
  }
  /**
   * Unregister as a publisher for the topic.
   */
  unadvertise() {
    this.isAdvertised && (this.reconnect_on_close && this.ros.off("close", this.reconnectFunc), this.emit("unadvertise"), this.ros.callOnConnection({
      op: "unadvertise",
      id: this.advertiseId,
      topic: this.name
    }), this.isAdvertised = !1);
  }
  /**
   * Publish the message.
   *
   * @param {T} message - The message to publish.
   */
  publish(r) {
    this.isAdvertised || this.advertise(), this.ros.idCounter++;
    var u = {
      op: "publish",
      id: "publish:" + this.name + ":" + this.ros.idCounter,
      topic: this.name,
      msg: r,
      latch: this.latch
    };
    this.ros.callOnConnection(u);
  }
}
class k extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The service name, like '/add_two_ints'.
   * @param {string} options.serviceType - The service type, like 'rospy_tutorials/AddTwoInts'.
   */
  constructor(r) {
    super();
    /**
       * Stores a reference to the most recent service callback advertised so it can be removed from the EventEmitter during un-advertisement
       * @private
       * @type {((rosbridgeRequest) => any) | null}
       */
    y(this, "_serviceCallback", null);
    y(this, "isAdvertised", !1);
    this.ros = r.ros, this.name = r.name, this.serviceType = r.serviceType;
  }
  /**
   * @callback callServiceCallback
   *  @param {TResponse} response - The response from the service request.
   */
  /**
   * @callback callServiceFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Call the service. Returns the service response in the
   * callback. Does nothing if this service is currently advertised.
   *
   * @param {TRequest} request - The service request to send.
   * @param {callServiceCallback} [callback] - Function with the following params:
   * @param {callServiceFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  callService(r, u, i) {
    if (!this.isAdvertised) {
      var n = "call_service:" + this.name + ":" + (++this.ros.idCounter).toString();
      (u || i) && this.ros.once(n, function(a) {
        a.result !== void 0 && a.result === !1 ? typeof i == "function" && i(a.values) : typeof u == "function" && u(a.values);
      });
      var s = {
        op: "call_service",
        id: n,
        service: this.name,
        type: this.serviceType,
        args: r
      };
      this.ros.callOnConnection(s);
    }
  }
  /**
   * @callback advertiseCallback
   * @param {TRequest} request - The service request.
   * @param {Partial<TResponse>} response - An empty dictionary. Take care not to overwrite this. Instead, only modify the values within.
   * @returns {boolean} true if the service has finished successfully, i.e., without any fatal errors.
   */
  /**
   * Advertise the service. This turns the Service object from a client
   * into a server. The callback will be called with every request
   * that's made on this service.
   *
   * @param {advertiseCallback} callback - This works similarly to the callback for a C++ service and should take the following params
   */
  advertise(r) {
    if (this.isAdvertised)
      throw new Error("Cannot advertise the same Service twice!");
    this._serviceCallback = (u) => {
      var i = {}, n = r(u.args, i), s = {
        op: "service_response",
        service: this.name,
        values: i,
        result: n
      };
      u.id && (s.id = u.id), this.ros.callOnConnection(s);
    }, this.ros.on(this.name, this._serviceCallback), this.ros.callOnConnection({
      op: "advertise_service",
      type: this.serviceType,
      service: this.name
    }), this.isAdvertised = !0;
  }
  unadvertise() {
    if (!this.isAdvertised)
      throw new Error(`Tried to un-advertise service ${this.name}, but it was not advertised!`);
    this.ros.callOnConnection({
      op: "unadvertise_service",
      service: this.name
    }), this._serviceCallback && this.ros.off(this.name, this._serviceCallback), this.isAdvertised = !1;
  }
  /**
   * An alternate form of Service advertisement that supports a modern Promise-based interface for use with async/await.
   * @param {(request: TRequest) => Promise<TResponse>} callback An asynchronous callback processing the request and returning a response.
   */
  advertiseAsync(r) {
    if (this.isAdvertised)
      throw new Error("Cannot advertise the same Service twice!");
    this._serviceCallback = async (u) => {
      let i = {
        op: "service_response",
        service: this.name,
        result: !1
      };
      try {
        i.values = await r(u.args), i.result = !0;
      } finally {
        u.id && (i.id = u.id), this.ros.callOnConnection(i);
      }
    }, this.ros.on(this.name, this._serviceCallback), this.ros.callOnConnection({
      op: "advertise_service",
      type: this.serviceType,
      service: this.name
    }), this.isAdvertised = !0;
  }
}
class Dr {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The param name, like max_vel_x.
   */
  constructor(t) {
    this.ros = t.ros, this.name = t.name;
  }
  /**
   * @callback getCallback
   * @param {Object} value - The value of the param from ROS.
   */
  /**
   * @callback getFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Fetch the value of the param.
   *
   * @param {getCallback} callback - The callback function.
   * @param {getFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  get(t, r) {
    var u = new k({
      ros: this.ros,
      name: "/rosapi/get_param",
      serviceType: "rosapi/GetParam"
    }), i = { name: this.name };
    u.callService(
      i,
      function(n) {
        var s = JSON.parse(n.value);
        t(s);
      },
      r
    );
  }
  /**
   * @callback setParamCallback
   * @param {Object} response - The response from the service request.
   */
  /**
   * @callback setParamFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Set the value of the param in ROS.
   *
   * @param {Object} value - The value to set param to.
   * @param {setParamCallback} [callback] - The callback function.
   * @param {setParamFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  set(t, r, u) {
    var i = new k({
      ros: this.ros,
      name: "/rosapi/set_param",
      serviceType: "rosapi/SetParam"
    }), n = {
      name: this.name,
      value: JSON.stringify(t)
    };
    i.callService(n, r, u);
  }
  /**
   * Delete this parameter on the ROS server.
   *
   * @param {setParamCallback} callback - The callback function.
   * @param {setParamFailedCallback} [failedCallback] - The callback function when the service call failed.
   */
  delete(t, r) {
    var u = new k({
      ros: this.ros,
      name: "/rosapi/delete_param",
      serviceType: "rosapi/DeleteParam"
    }), i = {
      name: this.name
    };
    u.callService(i, t, r);
  }
}
class Bt extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   * @param {number} [options.timeout] - The timeout length when connecting to the action server.
   * @param {boolean} [options.omitFeedback] - The flag to indicate whether to omit the feedback channel or not.
   * @param {boolean} [options.omitStatus] - The flag to indicate whether to omit the status channel or not.
   * @param {boolean} [options.omitResult] - The flag to indicate whether to omit the result channel or not.
   */
  constructor(r) {
    super();
    y(this, "goals", {});
    /** flag to check if a status has been received */
    y(this, "receivedStatus", !1);
    this.ros = r.ros, this.serverName = r.serverName, this.actionName = r.actionName, this.timeout = r.timeout, this.omitFeedback = r.omitFeedback, this.omitStatus = r.omitStatus, this.omitResult = r.omitResult, this.feedbackListener = new H({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    }), this.statusListener = new H({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    }), this.resultListener = new H({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    }), this.goalTopic = new H({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    }), this.cancelTopic = new H({
      ros: this.ros,
      name: this.serverName + "/cancel",
      messageType: "actionlib_msgs/GoalID"
    }), this.goalTopic.advertise(), this.cancelTopic.advertise(), this.omitStatus || this.statusListener.subscribe((u) => {
      this.receivedStatus = !0, u.status_list.forEach((i) => {
        var n = this.goals[i.goal_id.id];
        n && n.emit("status", i);
      });
    }), this.omitFeedback || this.feedbackListener.subscribe((u) => {
      var i = this.goals[u.status.goal_id.id];
      i && (i.emit("status", u.status), i.emit("feedback", u.feedback));
    }), this.omitResult || this.resultListener.subscribe((u) => {
      var i = this.goals[u.status.goal_id.id];
      i && (i.emit("status", u.status), i.emit("result", u.result));
    }), this.timeout && setTimeout(() => {
      this.receivedStatus || this.emit("timeout");
    }, this.timeout);
  }
  /**
   * Cancel all goals associated with this ActionClient.
   */
  cancel() {
    var r = {};
    this.cancelTopic.publish(r);
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this ActionClient.
   */
  dispose() {
    this.goalTopic.unadvertise(), this.cancelTopic.unadvertise(), this.omitStatus || this.statusListener.unsubscribe(), this.omitFeedback || this.feedbackListener.unsubscribe(), this.omitResult || this.resultListener.unsubscribe();
  }
}
class vr extends ce {
  /**
   * @param {Object} options
   * @param {ActionClient} options.actionClient - The ROSLIB.ActionClient to use with this goal.
   * @param {Object} options.goalMessage - The JSON object containing the goal for the action server.
   */
  constructor(r) {
    super();
    y(this, "isFinished", !1);
    y(this, "status");
    y(this, "result");
    y(this, "feedback");
    // Create a random ID
    y(this, "goalID", "goal_" + Math.random() + "_" + (/* @__PURE__ */ new Date()).getTime());
    this.actionClient = r.actionClient, this.goalMessage = {
      goal_id: {
        stamp: {
          secs: 0,
          nsecs: 0
        },
        id: this.goalID
      },
      goal: r.goalMessage
    }, this.on("status", (u) => {
      this.status = u;
    }), this.on("result", (u) => {
      this.isFinished = !0, this.result = u;
    }), this.on("feedback", (u) => {
      this.feedback = u;
    }), this.actionClient.goals[this.goalID] = this;
  }
  /**
   * Send the goal to the action server.
   *
   * @param {number} [timeout] - A timeout length for the goal's result.
   */
  send(r) {
    this.actionClient.goalTopic.publish(this.goalMessage), r && setTimeout(() => {
      this.isFinished || this.emit("timeout");
    }, r);
  }
  /**
   * Cancel the current goal.
   */
  cancel() {
    var r = {
      id: this.goalID
    };
    this.actionClient.cancelTopic.publish(r);
  }
}
class he {
  /**
   * @param {Object} [options]
   * @param {number|null} [options.x=0] - The x value.
   * @param {number|null} [options.y=0] - The y value.
   * @param {number|null} [options.z=0] - The z value.
   * @param {number|null} [options.w=1] - The w value.
   */
  constructor(t) {
    t = t || {}, this.x = t.x || 0, this.y = t.y || 0, this.z = t.z || 0, this.w = typeof t.w == "number" ? t.w : 1;
  }
  /**
   * Perform a conjugation on this quaternion.
   */
  conjugate() {
    this.x *= -1, this.y *= -1, this.z *= -1;
  }
  /**
   * Return the norm of this quaternion.
   */
  norm() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  /**
   * Perform a normalization on this quaternion.
   */
  normalize() {
    var t = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
    t === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 1) : (t = 1 / t, this.x = this.x * t, this.y = this.y * t, this.z = this.z * t, this.w = this.w * t);
  }
  /**
   * Convert this quaternion into its inverse.
   */
  invert() {
    this.conjugate(), this.normalize();
  }
  /**
   * Set the values of this quaternion to the product of itself and the given quaternion.
   *
   * @param {Quaternion} q - The quaternion to multiply with.
   */
  multiply(t) {
    var r = this.x * t.w + this.y * t.z - this.z * t.y + this.w * t.x, u = -this.x * t.z + this.y * t.w + this.z * t.x + this.w * t.y, i = this.x * t.y - this.y * t.x + this.z * t.w + this.w * t.z, n = -this.x * t.x - this.y * t.y - this.z * t.z + this.w * t.w;
    this.x = r, this.y = u, this.z = i, this.w = n;
  }
  /**
   * Clone a copy of this quaternion.
   *
   * @returns {Quaternion} The cloned quaternion.
   */
  clone() {
    return new he(this);
  }
}
class ie {
  /**
   * @param {Object} [options]
   * @param {number} [options.x=0] - The x value.
   * @param {number} [options.y=0] - The y value.
   * @param {number} [options.z=0] - The z value.
   */
  constructor(t) {
    t = t || {}, this.x = t.x || 0, this.y = t.y || 0, this.z = t.z || 0;
  }
  /**
   * Set the values of this vector to the sum of itself and the given vector.
   *
   * @param {Vector3} v - The vector to add with.
   */
  add(t) {
    this.x += t.x, this.y += t.y, this.z += t.z;
  }
  /**
   * Set the values of this vector to the difference of itself and the given vector.
   *
   * @param {Vector3} v - The vector to subtract with.
   */
  subtract(t) {
    this.x -= t.x, this.y -= t.y, this.z -= t.z;
  }
  /**
   * Multiply the given Quaternion with this vector.
   *
   * @param {Quaternion} q - The quaternion to multiply with.
   */
  multiplyQuaternion(t) {
    var r = t.w * this.x + t.y * this.z - t.z * this.y, u = t.w * this.y + t.z * this.x - t.x * this.z, i = t.w * this.z + t.x * this.y - t.y * this.x, n = -t.x * this.x - t.y * this.y - t.z * this.z;
    this.x = r * t.w + n * -t.x + u * -t.z - i * -t.y, this.y = u * t.w + n * -t.y + i * -t.x - r * -t.z, this.z = i * t.w + n * -t.z + r * -t.y - u * -t.x;
  }
  /**
   * Clone a copy of this vector.
   *
   * @returns {Vector3} The cloned vector.
   */
  clone() {
    return new ie(this);
  }
}
class ut {
  /**
   * @param {Object} options
   * @param {Vector3} options.translation - The ROSLIB.Vector3 describing the translation.
   * @param {Quaternion} options.rotation - The ROSLIB.Quaternion describing the rotation.
   */
  constructor(t) {
    this.translation = new ie(t.translation), this.rotation = new he(t.rotation);
  }
  /**
   * Clone a copy of this transform.
   *
   * @returns {Transform} The cloned transform.
   */
  clone() {
    return new ut(this);
  }
}
class Er extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} [options.fixedFrame=base_link] - The fixed frame.
   * @param {number} [options.angularThres=2.0] - The angular threshold for the TF republisher.
   * @param {number} [options.transThres=0.01] - The translation threshold for the TF republisher.
   * @param {number} [options.rate=10.0] - The rate for the TF republisher.
   * @param {number} [options.updateDelay=50] - The time (in ms) to wait after a new subscription
   *     to update the TF republisher's list of TFs.
   * @param {number} [options.topicTimeout=2.0] - The timeout parameter for the TF republisher.
   * @param {string} [options.serverName="/tf2_web_republisher"] - The name of the tf2_web_republisher server.
   * @param {string} [options.repubServiceName="/republish_tfs"] - The name of the republish_tfs service (non groovy compatibility mode only).
   */
  constructor(r) {
    super();
    /** @type {Goal|false} */
    y(this, "currentGoal", !1);
    /** @type {Topic|false} */
    y(this, "currentTopic", !1);
    y(this, "frameInfos", {});
    y(this, "republisherUpdateRequested", !1);
    /** @type {((tf: any) => any) | undefined} */
    y(this, "_subscribeCB");
    y(this, "_isDisposed", !1);
    this.ros = r.ros, this.fixedFrame = r.fixedFrame || "base_link", this.angularThres = r.angularThres || 2, this.transThres = r.transThres || 0.01, this.rate = r.rate || 10, this.updateDelay = r.updateDelay || 50;
    var u = r.topicTimeout || 2, i = Math.floor(u), n = Math.floor((u - i) * 1e9);
    this.topicTimeout = {
      secs: i,
      nsecs: n
    }, this.serverName = r.serverName || "/tf2_web_republisher", this.repubServiceName = r.repubServiceName || "/republish_tfs", this.actionClient = new Bt({
      ros: r.ros,
      serverName: this.serverName,
      actionName: "tf2_web_republisher/TFSubscriptionAction",
      omitStatus: !0,
      omitResult: !0
    }), this.serviceClient = new k({
      ros: r.ros,
      name: this.repubServiceName,
      serviceType: "tf2_web_republisher/RepublishTFs"
    });
  }
  /**
   * Process the incoming TF message and send them out using the callback
   * functions.
   *
   * @param {Object} tf - The TF message from the server.
   */
  processTFArray(r) {
    r.transforms.forEach((u) => {
      var i = u.child_frame_id;
      i[0] === "/" && (i = i.substring(1));
      var n = this.frameInfos[i];
      n && (n.transform = new ut({
        translation: u.transform.translation,
        rotation: u.transform.rotation
      }), n.cbs.forEach((s) => {
        s(n.transform);
      }));
    }, this);
  }
  /**
   * Create and send a new goal (or service request) to the tf2_web_republisher
   * based on the current list of TFs.
   */
  updateGoal() {
    var r = {
      source_frames: Object.keys(this.frameInfos),
      target_frame: this.fixedFrame,
      angular_thres: this.angularThres,
      trans_thres: this.transThres,
      rate: this.rate
    };
    this.ros.groovyCompatibility ? (this.currentGoal && this.currentGoal.cancel(), this.currentGoal = new vr({
      actionClient: this.actionClient,
      goalMessage: r
    }), this.currentGoal.on("feedback", this.processTFArray.bind(this)), this.currentGoal.send()) : (r.timeout = this.topicTimeout, this.serviceClient.callService(r, this.processResponse.bind(this))), this.republisherUpdateRequested = !1;
  }
  /**
   * Process the service response and subscribe to the tf republisher
   * topic.
   *
   * @param {Object} response - The service response containing the topic name.
   */
  processResponse(r) {
    this._isDisposed || (this.currentTopic && this.currentTopic.unsubscribe(this._subscribeCB), this.currentTopic = new H({
      ros: this.ros,
      name: r.topic_name,
      messageType: "tf2_web_republisher/TFArray"
    }), this._subscribeCB = this.processTFArray.bind(this), this.currentTopic.subscribe(this._subscribeCB));
  }
  /**
   * @callback subscribeCallback
   * @param {Transform} callback.transform - The transform data.
   */
  /**
   * Subscribe to the given TF frame.
   *
   * @param {string} frameID - The TF frame to subscribe to.
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(r, u) {
    r[0] === "/" && (r = r.substring(1)), this.frameInfos[r] ? this.frameInfos[r].transform && u(this.frameInfos[r].transform) : (this.frameInfos[r] = {
      cbs: []
    }, this.republisherUpdateRequested || (setTimeout(this.updateGoal.bind(this), this.updateDelay), this.republisherUpdateRequested = !0)), this.frameInfos[r].cbs.push(u);
  }
  /**
   * Unsubscribe from the given TF frame.
   *
   * @param {string} frameID - The TF frame to unsubscribe from.
   * @param {function} callback - The callback function to remove.
   */
  unsubscribe(r, u) {
    r[0] === "/" && (r = r.substring(1));
    for (var i = this.frameInfos[r], n = i && i.cbs || [], s = n.length; s--; )
      n[s] === u && n.splice(s, 1);
    (!u || n.length === 0) && delete this.frameInfos[r];
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this TFClient.
   */
  dispose() {
    this._isDisposed = !0, this.actionClient.dispose(), this.currentTopic && this.currentTopic.unsubscribe(this._subscribeCB);
  }
}
class Ar extends ce {
  // the one this'll be preempting
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   */
  constructor(r) {
    super();
    // needed for handling preemption prompted by a new goal being received
    /** @type {{goal_id: {id: any, stamp: any}, goal: any} | null} */
    y(this, "currentGoal", null);
    // currently tracked goal
    /** @type {{goal_id: {id: any, stamp: any}, goal: any} | null} */
    y(this, "nextGoal", null);
    this.ros = r.ros, this.serverName = r.serverName, this.actionName = r.actionName, this.feedbackPublisher = new H({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    }), this.feedbackPublisher.advertise();
    var u = new H({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    });
    u.advertise(), this.resultPublisher = new H({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    }), this.resultPublisher.advertise();
    var i = new H({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    }), n = new H({
      ros: this.ros,
      name: this.serverName + "/cancel",
      messageType: "actionlib_msgs/GoalID"
    });
    this.statusMessage = {
      header: {
        stamp: { secs: 0, nsecs: 100 },
        frame_id: ""
      },
      /** @type {{goal_id: any, status: number}[]} */
      status_list: []
    }, i.subscribe((a) => {
      this.currentGoal ? (this.nextGoal = a, this.emit("cancel")) : (this.statusMessage.status_list = [{ goal_id: a.goal_id, status: 1 }], this.currentGoal = a, this.emit("goal", a.goal));
    });
    var s = function(a, c) {
      return a.secs > c.secs ? !1 : a.secs < c.secs ? !0 : a.nsecs < c.nsecs;
    };
    n.subscribe((a) => {
      a.stamp.secs === 0 && a.stamp.secs === 0 && a.id === "" ? (this.nextGoal = null, this.currentGoal && this.emit("cancel")) : (this.currentGoal && a.id === this.currentGoal.goal_id.id ? this.emit("cancel") : this.nextGoal && a.id === this.nextGoal.goal_id.id && (this.nextGoal = null), this.nextGoal && s(this.nextGoal.goal_id.stamp, a.stamp) && (this.nextGoal = null), this.currentGoal && s(this.currentGoal.goal_id.stamp, a.stamp) && this.emit("cancel"));
    }), setInterval(() => {
      var a = /* @__PURE__ */ new Date(), c = Math.floor(a.getTime() / 1e3), o = Math.round(
        1e9 * (a.getTime() / 1e3 - c)
      );
      this.statusMessage.header.stamp.secs = c, this.statusMessage.header.stamp.nsecs = o, u.publish(this.statusMessage);
    }, 500);
  }
  /**
   * Set action state to succeeded and return to client.
   *
   * @param {Object} result - The result to return to the client.
   */
  setSucceeded(r) {
    if (this.currentGoal !== null) {
      var u = {
        status: { goal_id: this.currentGoal.goal_id, status: 3 },
        result: r
      };
      this.resultPublisher.publish(u), this.statusMessage.status_list = [], this.nextGoal ? (this.currentGoal = this.nextGoal, this.nextGoal = null, this.emit("goal", this.currentGoal.goal)) : this.currentGoal = null;
    }
  }
  /**
   * Set action state to aborted and return to client.
   *
   * @param {Object} result - The result to return to the client.
   */
  setAborted(r) {
    if (this.currentGoal !== null) {
      var u = {
        status: { goal_id: this.currentGoal.goal_id, status: 4 },
        result: r
      };
      this.resultPublisher.publish(u), this.statusMessage.status_list = [], this.nextGoal ? (this.currentGoal = this.nextGoal, this.nextGoal = null, this.emit("goal", this.currentGoal.goal)) : this.currentGoal = null;
    }
  }
  /**
   * Send a feedback message.
   *
   * @param {Object} feedback - The feedback to send to the client.
   */
  sendFeedback(r) {
    if (this.currentGoal !== null) {
      var u = {
        status: { goal_id: this.currentGoal.goal_id, status: 1 },
        feedback: r
      };
      this.feedbackPublisher.publish(u);
    }
  }
  /**
   * Handle case where client requests preemption.
   */
  setPreempted() {
    if (this.currentGoal !== null) {
      this.statusMessage.status_list = [];
      var r = {
        status: { goal_id: this.currentGoal.goal_id, status: 2 }
      };
      this.resultPublisher.publish(r), this.nextGoal ? (this.currentGoal = this.nextGoal, this.nextGoal = null, this.emit("goal", this.currentGoal.goal)) : this.currentGoal = null;
    }
  }
}
class Su extends ce {
  /**
   * @param {Object} [options]
   * @param {string} [options.url] - The WebSocket URL for rosbridge. Can be specified later with `connect`.
   * @param {boolean} [options.groovyCompatibility=true] - Don't use interfaces that changed after the last groovy release or rosbridge_suite and related tools.
   * @param {'websocket'|RTCPeerConnection} [options.transportLibrary='websocket'] - 'websocket', or an RTCPeerConnection instance controlling how the connection is created in `connect`.
   * @param {Object} [options.transportOptions={}] - The options to use when creating a connection. Currently only used if `transportLibrary` is RTCPeerConnection.
   */
  constructor(r) {
    super();
    /** @type {WebSocket | import("ws").WebSocket | null} */
    y(this, "socket", null);
    y(this, "idCounter", 0);
    y(this, "isConnected", !1);
    y(this, "groovyCompatibility", !0);
    r = r || {}, this.transportLibrary = r.transportLibrary || "websocket", this.transportOptions = r.transportOptions || {}, this.groovyCompatibility = r.groovyCompatibility || false, r.url && this.connect(r.url);
  }
  /**
   * Connect to the specified WebSocket.
   *
   * @param {string} url - WebSocket URL or RTCDataChannel label for rosbridge.
   */
  connect(r) {
    if (this.transportLibrary.constructor.name === "RTCPeerConnection")
      this.socket = Object.assign(
        // @ts-expect-error -- this is kinda wild. `this.transportLibrary` can either be a string or an RTCDataChannel. This needs fixing.
        this.transportLibrary.createDataChannel(r, this.transportOptions),
        wt(this)
      );
    else if (this.transportLibrary === "websocket")
      if (typeof window < "u") {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
          const u = new WebSocket(r);
          u.binaryType = "arraybuffer", this.socket = Object.assign(u, wt(this));
        }
      } else
        import("ws").then((u) => {
          if (!this.socket || this.socket.readyState === u.WebSocket.CLOSED) {
            const i = new u.WebSocket(r);
            i.binaryType = "arraybuffer", this.socket = Object.assign(i, wt(this));
          }
        });
    else
      throw "Unknown transportLibrary: " + this.transportLibrary.toString();
  }
  /**
   * Disconnect from the WebSocket server.
   */
  close() {
    this.socket && this.socket.close();
  }
  /**
   * Send an authorization request to the server.
   *
   * @param {string} mac - MAC (hash) string given by the trusted source.
   * @param {string} client - IP of the client.
   * @param {string} dest - IP of the destination.
   * @param {string} rand - Random string given by the trusted source.
   * @param {Object} t - Time of the authorization request.
   * @param {string} level - User level as a string given by the client.
   * @param {Object} end - End time of the client's session.
   */
  authenticate(r, u, i, n, s, a, c) {
    var o = {
      op: "auth",
      mac: r,
      client: u,
      dest: i,
      rand: n,
      t: s,
      level: a,
      end: c
    };
    this.callOnConnection(o);
  }
  /**
   * Send an encoded message over the WebSocket.
   *
   * @param {Object} messageEncoded - The encoded message to be sent.
   */
  sendEncodedMessage(r) {
    this.isConnected ? this.socket !== null && this.socket.send(r) : this.once("connection", () => {
      this.socket !== null && this.socket.send(r);
    });
  }
  /**
   * Send the message over the WebSocket, but queue the message up if not yet
   * connected.
   *
   * @param {Object} message - The message to be sent.
   */
  callOnConnection(r) {
    this.transportOptions.encoder ? this.transportOptions.encoder(r, this.sendEncodedMessage) : this.sendEncodedMessage(JSON.stringify(r));
  }
  /**
   * Send a set_level request to the server.
   *
   * @param {string} level - Status level (none, error, warning, info).
   * @param {number} [id] - Operation ID to change status level on.
   */
  setStatusLevel(r, u) {
    var i = {
      op: "set_level",
      level: r,
      id: u
    };
    this.callOnConnection(i);
  }
  /**
   * @callback getActionServersCallback
   * @param {string[]} actionservers - Array of action server names.
   */
  /**
   * @callback getActionServersFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of action servers in ROS as an array of string.
   *
   * @param {getActionServersCallback} callback - Function with the following params:
   * @param {getActionServersFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getActionServers(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/action_servers",
      serviceType: "rosapi/GetActionServers"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s.action_servers);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s.action_servers);
    });
  }
  /**
   * @callback getTopicsCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.topics - Array of topic names.
   * @param {string[]} result.types - Array of message type names.
   */
  /**
   * @callback getTopicsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics in ROS as an array.
   *
   * @param {getTopicsCallback} callback - Function with the following params:
   * @param {getTopicsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopics(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/topics",
      serviceType: "rosapi/Topics"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s);
    });
  }
  /**
   * @callback getTopicsForTypeCallback
   * @param {string[]} topics - Array of topic names.
   */
  /**
   * @callback getTopicsForTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics in ROS as an array of a specific type.
   *
   * @param {string} topicType - The topic type to find.
   * @param {getTopicsForTypeCallback} callback - Function with the following params:
   * @param {getTopicsForTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicsForType(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/topics_for_type",
      serviceType: "rosapi/TopicsForType"
    }), s = {
      type: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.topics);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a.topics);
    });
  }
  /**
   * @callback getServicesCallback
   * @param {string[]} services - Array of service names.
   */
  /**
   * @callback getServicesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of active service names in ROS.
   *
   * @param {getServicesCallback} callback - Function with the following params:
   * @param {getServicesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServices(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/services",
      serviceType: "rosapi/Services"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s.services);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s.services);
    });
  }
  /**
   * @callback getServicesForTypeCallback
   * @param {string[]} topics - Array of service names.
   */
  /**
   * @callback getServicesForTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of services in ROS as an array as specific type.
   *
   * @param {string} serviceType - The service type to find.
   * @param {getServicesForTypeCallback} callback - Function with the following params:
   * @param {getServicesForTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServicesForType(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/services_for_type",
      serviceType: "rosapi/ServicesForType"
    }), s = {
      type: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.services);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a.services);
    });
  }
  /**
   * @callback getServiceRequestDetailsCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.typedefs - An array containing the details of the service request.
   */
  /**
   * @callback getServiceRequestDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS service request.
   *
   * @param {string} type - The type of the service.
   * @param {getServiceRequestDetailsCallback} callback - Function with the following params:
   * @param {getServiceRequestDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceRequestDetails(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/service_request_details",
      serviceType: "rosapi/ServiceRequestDetails"
    }), s = {
      type: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a);
    });
  }
  /**
   * @callback getServiceResponseDetailsCallback
   * @param {{typedefs: string[]}} result - The result object with the following params:
   */
  /**
   * @callback getServiceResponseDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS service response.
   *
   * @param {string} type - The type of the service.
   * @param {getServiceResponseDetailsCallback} callback - Function with the following params:
   * @param {getServiceResponseDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceResponseDetails(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/service_response_details",
      serviceType: "rosapi/ServiceResponseDetails"
    }), s = {
      type: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a);
    });
  }
  /**
   * @callback getNodesCallback
   * @param {string[]} nodes - Array of node names.
   */
  /**
   * @callback getNodesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of active node names in ROS.
   *
   * @param {getNodesCallback} callback - Function with the following params:
   * @param {getNodesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getNodes(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/nodes",
      serviceType: "rosapi/Nodes"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s.nodes);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s.nodes);
    });
  }
  /**
   * @callback getNodeDetailsCallback
   * @param {string[]} subscriptions - Array of subscribed topic names.
   * @param {string[]} publications - Array of published topic names.
   * @param {string[]} services - Array of service names hosted.
   */
  /**
   * @callback getNodeDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * @callback getNodeDetailsLegacyCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.subscribing - Array of subscribed topic names.
   * @param {string[]} result.publishing - Array of published topic names.
   * @param {string[]} result.services - Array of service names hosted.
   */
  /**
   * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
   * <br>
   * These are the parameters if failedCallback is <strong>defined</strong>.
   *
   * @param {string} node - Name of the node.
   * @param {getNodeDetailsCallback} callback - Function with the following params:
   * @param {getNodeDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   *
   * @also
   *
   * Retrieve a list of subscribed topics, publishing topics and services of a specific node.
   * <br>
   * These are the parameters if failedCallback is <strong>undefined</strong>.
   *
   * @param {string} node - Name of the node.
   * @param {getNodeDetailsLegacyCallback} callback - Function with the following params:
   * @param {getNodeDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getNodeDetails(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/node_details",
      serviceType: "rosapi/NodeDetails"
    }), s = {
      node: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.subscribing, a.publishing, a.services);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a);
    });
  }
  /**
   * @callback getParamsCallback
   * @param {string[]} params - Array of param names.
   */
  /**
   * @callback getParamsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of parameter names from the ROS Parameter Server.
   *
   * @param {getParamsCallback} callback - Function with the following params:
   * @param {getParamsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getParams(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/get_param_names",
      serviceType: "rosapi/GetParamNames"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s.names);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s.names);
    });
  }
  /**
   * @callback getTopicTypeCallback
   * @param {string} type - The type of the topic.
   */
  /**
   * @callback getTopicTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the type of a ROS topic.
   *
   * @param {string} topic - Name of the topic.
   * @param {getTopicTypeCallback} callback - Function with the following params:
   * @param {getTopicTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicType(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/topic_type",
      serviceType: "rosapi/TopicType"
    }), s = {
      topic: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.type);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a.type);
    });
  }
  /**
   * @callback getServiceTypeCallback
   * @param {string} type - The type of the service.
   */
  /**
   * @callback getServiceTypeFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the type of a ROS service.
   *
   * @param {string} service - Name of the service.
   * @param {getServiceTypeCallback} callback - Function with the following params:
   * @param {getServiceTypeFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getServiceType(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/service_type",
      serviceType: "rosapi/ServiceType"
    }), s = {
      service: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.type);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a.type);
    });
  }
  /**
   * @callback getMessageDetailsCallback
   * @param {string} details - An array of the message details.
   */
  /**
   * @callback getMessageDetailsFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve the details of a ROS message.
   *
   * @param {string} message - The name of the message type.
   * @param {getMessageDetailsCallback} callback - Function with the following params:
   * @param {getMessageDetailsFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getMessageDetails(r, u, i) {
    var n = new k({
      ros: this,
      name: "/rosapi/message_details",
      serviceType: "rosapi/MessageDetails"
    }), s = {
      type: r
    };
    typeof i == "function" ? n.callService(
      s,
      function(a) {
        u(a.typedefs);
      },
      function(a) {
        i(a);
      }
    ) : n.callService(s, function(a) {
      u(a.typedefs);
    });
  }
  /**
   * Decode a typedef array into a dictionary like `rosmsg show foo/bar`.
   *
   * @param {Object[]} defs - Array of type_def dictionary.
   */
  decodeTypeDefs(r) {
    var u = (i, n) => {
      for (var s = {}, a = 0; a < i.fieldnames.length; a++) {
        var c = i.fieldarraylen[a], o = i.fieldnames[a], l = i.fieldtypes[a];
        if (l.indexOf("/") === -1)
          c === -1 ? s[o] = l : s[o] = [l];
        else {
          for (var h = !1, D = 0; D < n.length; D++)
            if (n[D].type.toString() === l.toString()) {
              h = n[D];
              break;
            }
          if (h) {
            var f = u(h, n);
            c === -1 ? s[o] = f : s[o] = [f];
          } else
            this.emit(
              "error",
              "Cannot find " + l + " in decodeTypeDefs"
            );
        }
      }
      return s;
    };
    return u(r[0], r);
  }
  /**
   * @callback getTopicsAndRawTypesCallback
   * @param {Object} result - The result object with the following params:
   * @param {string[]} result.topics - Array of topic names.
   * @param {string[]} result.types - Array of message type names.
   * @param {string[]} result.typedefs_full_text - Array of full definitions of message types, similar to `gendeps --cat`.
   */
  /**
   * @callback getTopicsAndRawTypesFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Retrieve a list of topics and their associated type definitions.
   *
   * @param {getTopicsAndRawTypesCallback} callback - Function with the following params:
   * @param {getTopicsAndRawTypesFailedCallback} [failedCallback] - The callback function when the service call failed with params:
   */
  getTopicsAndRawTypes(r, u) {
    var i = new k({
      ros: this,
      name: "/rosapi/topics_and_raw_types",
      serviceType: "rosapi/TopicsAndRawTypes"
    }), n = {};
    typeof u == "function" ? i.callService(
      n,
      function(s) {
        r(s);
      },
      function(s) {
        u(s);
      }
    ) : i.callService(n, function(s) {
      r(s);
    });
  }
  Topic(r) {
    return new H({ ros: this, ...r });
  }
  Param(r) {
    return new Dr({ ros: this, ...r });
  }
  Service(r) {
    return new k({ ros: this, ...r });
  }
  TFClient(r) {
    return new Er({ ros: this, ...r });
  }
  ActionClient(r) {
    return new Bt({ ros: this, ...r });
  }
  SimpleActionServer(r) {
    return new Ar({ ros: this, ...r });
  }
}
class gr extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.name - The action name, like '/fibonacci'.
   * @param {string} options.actionType - The action type, like 'action_tutorials_interfaces/Fibonacci'.
   */
  constructor(r) {
    super();
    y(this, "isAdvertised", !1);
    /**
     * @callback advertiseActionCallback
     * @param {TGoal} goal - The action goal.
     * @param {string} id - The ID of the action goal to execute.
     */
    /**
     * @private
     * @type {advertiseActionCallback | null}
     */
    y(this, "_actionCallback", null);
    /**
     * @callback advertiseCancelCallback
     * @param {string} id - The ID of the action goal to cancel.
     */
    /**
     * @private
     * @type {advertiseCancelCallback | null}
     */
    y(this, "_cancelCallback", null);
    this.ros = r.ros, this.name = r.name, this.actionType = r.actionType;
  }
  /**
   * @callback sendGoalResultCallback
   * @param {TResult} result - The result from the action.
   */
  /**
   * @callback sendGoalFeedbackCallback
   * @param {TFeedback} feedback - The feedback from the action.
   */
  /**
   * @callback sendGoalFailedCallback
   * @param {string} error - The error message reported by ROS.
   */
  /**
   * Sends an action goal. Returns the feedback in the feedback callback while the action is running
   * and the result in the result callback when the action is completed.
   * Does nothing if this action is currently advertised.
   *
   * @param {TGoal} goal - The action goal to send.
   * @param {sendGoalResultCallback} resultCallback - The callback function when the action is completed.
   * @param {sendGoalFeedbackCallback} [feedbackCallback] - The callback function when the action pulishes feedback.
   * @param {sendGoalFailedCallback} [failedCallback] - The callback function when the action failed.
   */
  sendGoal(r, u, i, n) {
    if (!this.isAdvertised) {
      var s = "send_action_goal:" + this.name + ":" + ++this.ros.idCounter;
      (u || n) && this.ros.on(s, function(c) {
        c.result !== void 0 && c.result === !1 ? typeof n == "function" && n(c.values) : c.op === "action_feedback" && typeof i == "function" ? i(c.values) : c.op === "action_result" && typeof u == "function" && u(c.values);
      });
      var a = {
        op: "send_action_goal",
        id: s,
        action: this.name,
        action_type: this.actionType,
        args: r,
        feedback: !0
      };
      return this.ros.callOnConnection(a), s;
    }
  }
  /**
   * Cancels an action goal.
   *
   * @param {string} id - The ID of the action goal to cancel.
   */
  cancelGoal(r) {
    var u = {
      op: "cancel_action_goal",
      id: r,
      action: this.name
    };
    this.ros.callOnConnection(u);
  }
  /**
   * Advertise the action. This turns the Action object from a client
   * into a server. The callback will be called with every goal sent to this action.
   *
   * @param {advertiseActionCallback} actionCallback - This works similarly to the callback for a C++ action.
   * @param {advertiseCancelCallback} cancelCallback - A callback function to execute when the action is canceled.
   */
  advertise(r, u) {
    this.isAdvertised || typeof r != "function" || (this._actionCallback = r, this._cancelCallback = u, this.ros.on(this.name, this._executeAction.bind(this)), this.ros.callOnConnection({
      op: "advertise_action",
      type: this.actionType,
      action: this.name
    }), this.isAdvertised = !0);
  }
  /**
   * Unadvertise a previously advertised action.
   */
  unadvertise() {
    this.isAdvertised && (this.ros.callOnConnection({
      op: "unadvertise_action",
      action: this.name
    }), this.isAdvertised = !1);
  }
  /**
   * Helper function that executes an action by calling the provided
   * action callback with the auto-generated ID as a user-accessible input.
   * Should not be called manually.
   *
   * @param {Object} rosbridgeRequest - The rosbridge request containing the action goal to send and its ID.
   * @param {string} rosbridgeRequest.id - The ID of the action goal.
   * @param {TGoal} rosbridgeRequest.args - The arguments of the action goal.
   */
  _executeAction(r) {
    var u = r.id;
    typeof u == "string" && this.ros.on(u, (i) => {
      i.op === "cancel_action_goal" && typeof this._cancelCallback == "function" && this._cancelCallback(u);
    }), typeof this._actionCallback == "function" && this._actionCallback(r.args, u);
  }
  /**
   * Helper function to send action feedback inside an action handler.
   *
   * @param {string} id - The action goal ID.
   * @param {TFeedback} feedback - The feedback to send.
   */
  sendFeedback(r, u) {
    var i = {
      op: "action_feedback",
      id: r,
      action: this.name,
      values: u
    };
    this.ros.callOnConnection(i);
  }
  /**
   * Helper function to set an action as succeeded.
   *
   * @param {string} id - The action goal ID.
   * @param {TResult} result - The result to set.
   */
  setSucceeded(r, u) {
    var i = {
      op: "action_result",
      id: r,
      action: this.name,
      values: u,
      result: !0
    };
    this.ros.callOnConnection(i);
  }
  /**
   * Helper function to set an action as failed.
   *
   * @param {string} id - The action goal ID.
   */
  setFailed(r) {
    var u = {
      op: "action_result",
      id: r,
      action: this.name,
      result: !1
    };
    this.ros.callOnConnection(u);
  }
}
const Ou = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Action: gr,
  Param: Dr,
  Ros: Su,
  Service: k,
  Topic: H
}, Symbol.toStringTag, { value: "Module" }));
class Fu extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} options.serverName - The action server name, like '/fibonacci'.
   * @param {string} options.actionName - The action message name, like 'actionlib_tutorials/FibonacciAction'.
   */
  constructor(t) {
    super(), this.ros = t.ros, this.serverName = t.serverName, this.actionName = t.actionName;
    var r = new H({
      ros: this.ros,
      name: this.serverName + "/goal",
      messageType: this.actionName + "Goal"
    }), u = new H({
      ros: this.ros,
      name: this.serverName + "/feedback",
      messageType: this.actionName + "Feedback"
    }), i = new H({
      ros: this.ros,
      name: this.serverName + "/status",
      messageType: "actionlib_msgs/GoalStatusArray"
    }), n = new H({
      ros: this.ros,
      name: this.serverName + "/result",
      messageType: this.actionName + "Result"
    });
    r.subscribe((s) => {
      this.emit("goal", s);
    }), i.subscribe((s) => {
      s.status_list.forEach((a) => {
        this.emit("status", a);
      });
    }), u.subscribe((s) => {
      this.emit("status", s.status), this.emit("feedback", s.feedback);
    }), n.subscribe((s) => {
      this.emit("status", s.status), this.emit("result", s.result);
    });
  }
}
const Bu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionClient: Bt,
  ActionListener: Fu,
  Goal: vr,
  SimpleActionServer: Ar
}, Symbol.toStringTag, { value: "Module" }));
class ve {
  /**
   * @param {Object} [options]
   * @param {Vector3} [options.position] - The ROSLIB.Vector3 describing the position.
   * @param {Quaternion} [options.orientation] - The ROSLIB.Quaternion describing the orientation.
   */
  constructor(t) {
    t = t || {}, t = t || {}, this.position = new ie(t.position), this.orientation = new he(t.orientation);
  }
  /**
   * Apply a transform against this pose.
   *
   * @param {Transform} tf - The transform to be applied.
   */
  applyTransform(t) {
    this.position.multiplyQuaternion(t.rotation), this.position.add(t.translation);
    var r = t.rotation.clone();
    r.multiply(this.orientation), this.orientation = r;
  }
  /**
   * Clone a copy of this pose.
   *
   * @returns {Pose} The cloned pose.
   */
  clone() {
    return new ve(this);
  }
  /**
   * Multiply this pose with another pose without altering this pose.
   *
   * @returns {Pose} The result of the multiplication.
   */
  multiply(t) {
    var r = t.clone();
    return r.applyTransform({
      rotation: this.orientation,
      translation: this.position
    }), r;
  }
  /**
   * Compute the inverse of this pose.
   *
   * @returns {Pose} The inverse of the pose.
   */
  getInverse() {
    var t = this.clone();
    return t.orientation.invert(), t.position.multiplyQuaternion(t.orientation), t.position.x *= -1, t.position.y *= -1, t.position.z *= -1, t;
  }
}
const Mu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Pose: ve,
  Quaternion: he,
  Transform: ut,
  Vector3: ie
}, Symbol.toStringTag, { value: "Module" }));
class Ru extends ce {
  /**
   * @param {Object} options
   * @param {Ros} options.ros - The ROSLIB.Ros connection handle.
   * @param {string} [options.fixedFrame=base_link] - The fixed frame.
   * @param {number} [options.angularThres=2.0] - The angular threshold for the TF republisher.
   * @param {number} [options.transThres=0.01] - The translation threshold for the TF republisher.
   * @param {number} [options.rate=10.0] - The rate for the TF republisher.
   * @param {number} [options.updateDelay=50] - The time (in ms) to wait after a new subscription
   *     to update the TF republisher's list of TFs.
   * @param {number} [options.topicTimeout=2.0] - The timeout parameter for the TF republisher.
   * @param {string} [options.serverName="/tf2_web_republisher"] - The name of the tf2_web_republisher server.
   * @param {string} [options.repubServiceName="/republish_tfs"] - The name of the republish_tfs service (non groovy compatibility mode only).
   */
  constructor(t) {
    super(), this.ros = t.ros, this.fixedFrame = t.fixedFrame || "base_link", this.angularThres = t.angularThres || 2, this.transThres = t.transThres || 0.01, this.rate = t.rate || 10, this.updateDelay = t.updateDelay || 50;
    const r = t.topicTimeout || 2, u = Math.floor(r), i = Math.floor((r - u) * 1e9);
    this.topicTimeout = {
      secs: u,
      nsecs: i
    }, this.serverName = t.serverName || "/tf2_web_republisher", this.goal_id = "", this.frameInfos = {}, this.republisherUpdateRequested = !1, this._subscribeCB = void 0, this._isDisposed = !1, this.actionClient = new gr({
      ros: t.ros,
      name: this.serverName,
      actionType: "tf2_web_republisher_msgs/TFSubscription"
    });
  }
  /**
   * Process the incoming TF message and send them out using the callback
   * functions.
   *
   * @param {Object} tf - The TF message from the server.
   */
  processTFArray(t) {
    let r = this;
    t.transforms.forEach(function(u) {
      let i = u.child_frame_id;
      i[0] === "/" && (i = i.substring(1));
      const n = r.frameInfos[i];
      n && (n.transform = new ut({
        translation: u.transform.translation,
        rotation: u.transform.rotation
      }), n.cbs.forEach(function(s) {
        s(n.transform);
      }));
    }, this);
  }
  /**
   * Create and send a new goal (or service request) to the tf2_web_republisher
   * based on the current list of TFs.
   */
  updateGoal() {
    const t = {
      source_frames: Object.keys(this.frameInfos),
      target_frame: this.fixedFrame,
      angular_thres: this.angularThres,
      trans_thres: this.transThres,
      rate: this.rate
    };
    this.goal_id !== "" && this.actionClient.cancelGoal(this.goal_id), this.currentGoal = t;
    const r = this.actionClient.sendGoal(
      t,
      (u) => {
      },
      (u) => {
        this.processTFArray(u);
      }
    );
    typeof r == "string" && (this.goal_id = r), this.republisherUpdateRequested = !1;
  }
  /**
   * @callback subscribeCallback
   * @param {Transform} callback.transform - The transform data.
   */
  /**
   * Subscribe to the given TF frame.
   *
   * @param {string} frameID - The TF frame to subscribe to.
   * @param {subscribeCallback} callback - Function with the following params:
   */
  subscribe(t, r) {
    t[0] === "/" && (t = t.substring(1)), this.frameInfos[t] ? this.frameInfos[t].transform && r(this.frameInfos[t].transform) : (this.frameInfos[t] = {
      cbs: []
    }, this.republisherUpdateRequested || (setTimeout(this.updateGoal.bind(this), this.updateDelay), this.republisherUpdateRequested = !0)), this.frameInfos[t].cbs.push(r);
  }
  /**
   * Unsubscribe from the given TF frame.
   *
   * @param {string} frameID - The TF frame to unsubscribe from.
   * @param {function} callback - The callback function to remove.
   */
  unsubscribe(t, r) {
    t[0] === "/" && (t = t.substring(1));
    const u = this.frameInfos[t];
    for (var i = u && u.cbs || [], n = i.length; n--; )
      i[n] === r && i.splice(n, 1);
    (!r || i.length === 0) && delete this.frameInfos[t];
  }
  /**
   * Unsubscribe and unadvertise all topics associated with this TFClient.
   */
  dispose() {
    this._isDisposed = !0;
  }
}
const Iu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROS2TFClient: Ru,
  TFClient: Er
}, Symbol.toStringTag, { value: "Module" })), Tr = 0, Cr = 1, br = 2, yr = 3;
class wr {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    /** @type {Vector3 | null} */
    y(this, "dimension");
    var u;
    this.type = Cr;
    var r = (u = t.xml.getAttribute("size")) == null ? void 0 : u.split(" ");
    r ? this.dimension = new ie({
      x: parseFloat(r[0]),
      y: parseFloat(r[1]),
      z: parseFloat(r[2])
    }) : this.dimension = null;
  }
}
class Nr {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    var u;
    var r = (u = t.xml.getAttribute("rgba")) == null ? void 0 : u.split(" ");
    r && (this.r = parseFloat(r[0]), this.g = parseFloat(r[1]), this.b = parseFloat(r[2]), this.a = parseFloat(r[3]));
  }
}
class _r {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    this.type = br, this.length = parseFloat(t.xml.getAttribute("length")), this.radius = parseFloat(t.xml.getAttribute("radius"));
  }
}
class Mt {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    /** @type {string | null} */
    y(this, "textureFilename", null);
    /** @type {UrdfColor | null} */
    y(this, "color", null);
    this.name = t.xml.getAttribute("name");
    var r = t.xml.getElementsByTagName("texture");
    r.length > 0 && (this.textureFilename = r[0].getAttribute("filename"));
    var u = t.xml.getElementsByTagName("color");
    u.length > 0 && (this.color = new Nr({
      xml: u[0]
    }));
  }
  isLink() {
    return this.color === null && this.textureFilename === null;
  }
  assign(t) {
    return Object.assign(this, t);
  }
}
class xr {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    /** @type {Vector3 | null} */
    y(this, "scale", null);
    this.type = yr, this.filename = t.xml.getAttribute("filename");
    var r = t.xml.getAttribute("scale");
    if (r) {
      var u = r.split(" ");
      this.scale = new ie({
        x: parseFloat(u[0]),
        y: parseFloat(u[1]),
        z: parseFloat(u[2])
      });
    }
  }
}
class Sr {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    this.type = Tr, this.radius = parseFloat(t.xml.getAttribute("radius") || "NaN");
  }
}
class Or {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    /** @type {Pose | null} */
    y(this, "origin", null);
    /** @type {UrdfMesh | UrdfSphere | UrdfBox | UrdfCylinder | null} */
    y(this, "geometry", null);
    /** @type {UrdfMaterial | null} */
    y(this, "material", null);
    var r = t.xml;
    this.name = t.xml.getAttribute("name");
    var u = r.getElementsByTagName("origin");
    if (u.length === 0)
      this.origin = new ve();
    else {
      var i = u[0].getAttribute("xyz"), n = new ie();
      if (i) {
        var s = i.split(" ");
        n = new ie({
          x: parseFloat(s[0]),
          y: parseFloat(s[1]),
          z: parseFloat(s[2])
        });
      }
      var a = u[0].getAttribute("rpy"), c = new he();
      if (a) {
        var o = a.split(" "), l = parseFloat(o[0]), h = parseFloat(o[1]), D = parseFloat(o[2]), f = l / 2, C = h / 2, E = D / 2, _ = Math.sin(f) * Math.cos(C) * Math.cos(E) - Math.cos(f) * Math.sin(C) * Math.sin(E), T = Math.cos(f) * Math.sin(C) * Math.cos(E) + Math.sin(f) * Math.cos(C) * Math.sin(E), z = Math.cos(f) * Math.cos(C) * Math.sin(E) - Math.sin(f) * Math.sin(C) * Math.cos(E), x = Math.cos(f) * Math.cos(C) * Math.cos(E) + Math.sin(f) * Math.sin(C) * Math.sin(E);
        c = new he({
          x: _,
          y: T,
          z,
          w: x
        }), c.normalize();
      }
      this.origin = new ve({
        position: n,
        orientation: c
      });
    }
    var V = r.getElementsByTagName("geometry");
    if (V.length > 0) {
      for (var L = V[0], q = null, Y = 0; Y < L.childNodes.length; Y++) {
        var ne = L.childNodes[Y];
        if (ne.nodeType === 1) {
          q = ne;
          break;
        }
      }
      if (q) {
        var $ = q.nodeName;
        $ === "sphere" ? this.geometry = new Sr({
          xml: q
        }) : $ === "box" ? this.geometry = new wr({
          xml: q
        }) : $ === "cylinder" ? this.geometry = new _r({
          xml: q
        }) : $ === "mesh" ? this.geometry = new xr({
          xml: q
        }) : console.warn("Unknown geometry type " + $);
      }
    }
    var Q = r.getElementsByTagName("material");
    Q.length > 0 && (this.material = new Mt({
      xml: Q[0]
    }));
  }
}
class Fr {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    this.name = t.xml.getAttribute("name"), this.visuals = [];
    for (var r = t.xml.getElementsByTagName("visual"), u = 0; u < r.length; u++)
      this.visuals.push(
        new Or({
          xml: r[u]
        })
      );
  }
}
class Lu {
  /**
   * @param {Object} options
   * @param {Element} options.xml - The XML element to parse.
   */
  constructor(t) {
    this.name = t.xml.getAttribute("name"), this.type = t.xml.getAttribute("type");
    var r = t.xml.getElementsByTagName("parent");
    r.length > 0 && (this.parent = r[0].getAttribute("link"));
    var u = t.xml.getElementsByTagName("child");
    u.length > 0 && (this.child = u[0].getAttribute("link"));
    var i = t.xml.getElementsByTagName("limit");
    i.length > 0 && (this.minval = parseFloat(i[0].getAttribute("lower") || "NaN"), this.maxval = parseFloat(i[0].getAttribute("upper") || "NaN"));
    var n = t.xml.getElementsByTagName("origin");
    if (n.length === 0)
      this.origin = new ve();
    else {
      var s = n[0].getAttribute("xyz"), a = new ie();
      if (s) {
        var c = s.split(" ");
        a = new ie({
          x: parseFloat(c[0]),
          y: parseFloat(c[1]),
          z: parseFloat(c[2])
        });
      }
      var o = n[0].getAttribute("rpy"), l = new he();
      if (o) {
        var h = o.split(" "), D = parseFloat(h[0]), f = parseFloat(h[1]), C = parseFloat(h[2]), E = D / 2, _ = f / 2, T = C / 2, z = Math.sin(E) * Math.cos(_) * Math.cos(T) - Math.cos(E) * Math.sin(_) * Math.sin(T), x = Math.cos(E) * Math.sin(_) * Math.cos(T) + Math.sin(E) * Math.cos(_) * Math.sin(T), V = Math.cos(E) * Math.cos(_) * Math.sin(T) - Math.sin(E) * Math.sin(_) * Math.cos(T), L = Math.cos(E) * Math.cos(_) * Math.cos(T) + Math.sin(E) * Math.sin(_) * Math.sin(T);
        l = new he({
          x: z,
          y: x,
          z: V,
          w: L
        }), l.normalize();
      }
      this.origin = new ve({
        position: a,
        orientation: l
      });
    }
  }
}
var P = {};
function Pu(e, t, r) {
  if (r === void 0 && (r = Array.prototype), e && typeof r.find == "function")
    return r.find.call(e, t);
  for (var u = 0; u < e.length; u++)
    if (ye(e, u)) {
      var i = e[u];
      if (t.call(void 0, i, u, e))
        return i;
    }
}
function Pe(e, t) {
  return t === void 0 && (t = Object), t && typeof t.getOwnPropertyDescriptors == "function" && (e = t.create(null, t.getOwnPropertyDescriptors(e))), t && typeof t.freeze == "function" ? t.freeze(e) : e;
}
function ye(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function Uu(e, t) {
  if (e === null || typeof e != "object")
    throw new TypeError("target is not an object");
  for (var r in t)
    ye(t, r) && (e[r] = t[r]);
  return e;
}
var Br = Pe({
  allowfullscreen: !0,
  async: !0,
  autofocus: !0,
  autoplay: !0,
  checked: !0,
  controls: !0,
  default: !0,
  defer: !0,
  disabled: !0,
  formnovalidate: !0,
  hidden: !0,
  ismap: !0,
  itemscope: !0,
  loop: !0,
  multiple: !0,
  muted: !0,
  nomodule: !0,
  novalidate: !0,
  open: !0,
  playsinline: !0,
  readonly: !0,
  required: !0,
  reversed: !0,
  selected: !0
});
function qu(e) {
  return ye(Br, e.toLowerCase());
}
var Mr = Pe({
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  embed: !0,
  hr: !0,
  img: !0,
  input: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0
});
function ku(e) {
  return ye(Mr, e.toLowerCase());
}
var Xe = Pe({
  script: !1,
  style: !1,
  textarea: !0,
  title: !0
});
function Gu(e) {
  var t = e.toLowerCase();
  return ye(Xe, t) && !Xe[t];
}
function Vu(e) {
  var t = e.toLowerCase();
  return ye(Xe, t) && Xe[t];
}
function Rr(e) {
  return e === $e.HTML;
}
function Hu(e) {
  return Rr(e) || e === $e.XML_XHTML_APPLICATION;
}
var $e = Pe({
  /**
   * `text/html`, the only mime type that triggers treating an XML document as HTML.
   *
   * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
   * @see https://en.wikipedia.org/wiki/HTML Wikipedia
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
   * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
   *      WHATWG HTML Spec
   */
  HTML: "text/html",
  /**
   * `application/xml`, the standard mime type for XML documents.
   *
   * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
   *      registration
   * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
   * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
   */
  XML_APPLICATION: "application/xml",
  /**
   * `text/html`, an alias for `application/xml`.
   *
   * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
   * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
   * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
   */
  XML_TEXT: "text/xml",
  /**
   * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
   * but is parsed as an XML document.
   *
   * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
   *      registration
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
   * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
   */
  XML_XHTML_APPLICATION: "application/xhtml+xml",
  /**
   * `image/svg+xml`,
   *
   * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
   * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
   * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
   */
  XML_SVG_IMAGE: "image/svg+xml"
}), zu = Object.keys($e).map(function(e) {
  return $e[e];
});
function Yu(e) {
  return zu.indexOf(e) > -1;
}
var ju = Pe({
  /**
   * The XHTML namespace.
   *
   * @see http://www.w3.org/1999/xhtml
   */
  HTML: "http://www.w3.org/1999/xhtml",
  /**
   * The SVG namespace.
   *
   * @see http://www.w3.org/2000/svg
   */
  SVG: "http://www.w3.org/2000/svg",
  /**
   * The `xml:` namespace.
   *
   * @see http://www.w3.org/XML/1998/namespace
   */
  XML: "http://www.w3.org/XML/1998/namespace",
  /**
   * The `xmlns:` namespace.
   *
   * @see https://www.w3.org/2000/xmlns/
   */
  XMLNS: "http://www.w3.org/2000/xmlns/"
});
P.assign = Uu;
P.find = Pu;
P.freeze = Pe;
P.HTML_BOOLEAN_ATTRIBUTES = Br;
P.HTML_RAW_TEXT_ELEMENTS = Xe;
P.HTML_VOID_ELEMENTS = Mr;
P.hasDefaultHTMLNamespace = Hu;
P.hasOwn = ye;
P.isHTMLBooleanAttribute = qu;
P.isHTMLRawTextElement = Gu;
P.isHTMLEscapableRawTextElement = Vu;
P.isHTMLMimeType = Rr;
P.isHTMLVoidElement = ku;
P.isValidMimeType = Yu;
P.MIME_TYPE = $e;
P.NAMESPACE = ju;
var we = {}, Xu = P;
function Ir(e, t) {
  e.prototype = Object.create(Error.prototype, {
    constructor: { value: e },
    name: { value: e.name, enumerable: !0, writable: t }
  });
}
var Qe = Xu.freeze({
  /**
   * the default value as defined by the spec
   */
  Error: "Error",
  /**
   * @deprecated
   * Use RangeError instead.
   */
  IndexSizeError: "IndexSizeError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  DomstringSizeError: "DomstringSizeError",
  HierarchyRequestError: "HierarchyRequestError",
  WrongDocumentError: "WrongDocumentError",
  InvalidCharacterError: "InvalidCharacterError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  NoDataAllowedError: "NoDataAllowedError",
  NoModificationAllowedError: "NoModificationAllowedError",
  NotFoundError: "NotFoundError",
  NotSupportedError: "NotSupportedError",
  InUseAttributeError: "InUseAttributeError",
  InvalidStateError: "InvalidStateError",
  SyntaxError: "SyntaxError",
  InvalidModificationError: "InvalidModificationError",
  NamespaceError: "NamespaceError",
  /**
   * @deprecated
   * Use TypeError for invalid arguments,
   * "NotSupportedError" DOMException for unsupported operations,
   * and "NotAllowedError" DOMException for denied requests instead.
   */
  InvalidAccessError: "InvalidAccessError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  ValidationError: "ValidationError",
  /**
   * @deprecated
   * Use TypeError instead.
   */
  TypeMismatchError: "TypeMismatchError",
  SecurityError: "SecurityError",
  NetworkError: "NetworkError",
  AbortError: "AbortError",
  /**
   * @deprecated
   * Just to match the related static code, not part of the spec.
   */
  URLMismatchError: "URLMismatchError",
  QuotaExceededError: "QuotaExceededError",
  TimeoutError: "TimeoutError",
  InvalidNodeTypeError: "InvalidNodeTypeError",
  DataCloneError: "DataCloneError",
  EncodingError: "EncodingError",
  NotReadableError: "NotReadableError",
  UnknownError: "UnknownError",
  ConstraintError: "ConstraintError",
  DataError: "DataError",
  TransactionInactiveError: "TransactionInactiveError",
  ReadOnlyError: "ReadOnlyError",
  VersionError: "VersionError",
  OperationError: "OperationError",
  NotAllowedError: "NotAllowedError",
  OptOutError: "OptOutError"
}), Lr = Object.keys(Qe);
function Pr(e) {
  return typeof e == "number" && e >= 1 && e <= 25;
}
function $u(e) {
  return typeof e == "string" && e.substring(e.length - Qe.Error.length) === Qe.Error;
}
function it(e, t) {
  Pr(e) ? (this.name = Lr[e], this.message = t || "") : (this.message = e, this.name = $u(t) ? t : Qe.Error), Error.captureStackTrace && Error.captureStackTrace(this, it);
}
Ir(it, !0);
Object.defineProperties(it.prototype, {
  code: {
    enumerable: !0,
    get: function() {
      var e = Lr.indexOf(this.name);
      return Pr(e) ? e : 0;
    }
  }
});
var Ur = {
  INDEX_SIZE_ERR: 1,
  DOMSTRING_SIZE_ERR: 2,
  HIERARCHY_REQUEST_ERR: 3,
  WRONG_DOCUMENT_ERR: 4,
  INVALID_CHARACTER_ERR: 5,
  NO_DATA_ALLOWED_ERR: 6,
  NO_MODIFICATION_ALLOWED_ERR: 7,
  NOT_FOUND_ERR: 8,
  NOT_SUPPORTED_ERR: 9,
  INUSE_ATTRIBUTE_ERR: 10,
  INVALID_STATE_ERR: 11,
  SYNTAX_ERR: 12,
  INVALID_MODIFICATION_ERR: 13,
  NAMESPACE_ERR: 14,
  INVALID_ACCESS_ERR: 15,
  VALIDATION_ERR: 16,
  TYPE_MISMATCH_ERR: 17,
  SECURITY_ERR: 18,
  NETWORK_ERR: 19,
  ABORT_ERR: 20,
  URL_MISMATCH_ERR: 21,
  QUOTA_EXCEEDED_ERR: 22,
  TIMEOUT_ERR: 23,
  INVALID_NODE_TYPE_ERR: 24,
  DATA_CLONE_ERR: 25
}, Nt = Object.entries(Ur);
for (var ot = 0; ot < Nt.length; ot++) {
  var Qu = Nt[ot][0], Wu = Nt[ot][1];
  it[Qu] = Wu;
}
function Rt(e, t, r) {
  this.message = e, this.locator = t, this.cause = r, Error.captureStackTrace && Error.captureStackTrace(this, Rt);
}
Ir(Rt);
we.DOMException = it;
we.DOMExceptionName = Qe;
we.ParseError = Rt;
we.ExceptionCode = Ur;
var U = {}, w = {};
function qr(e) {
  try {
    typeof e != "function" && (e = RegExp);
    var t = new e("𝌆", "u").exec("𝌆");
    return !!t && t[0].length === 2;
  } catch {
  }
  return !1;
}
var nt = qr();
function Ee(e) {
  if (e.source[0] !== "[")
    throw new Error(e + " can not be used with chars");
  return e.source.slice(1, e.source.lastIndexOf("]"));
}
function Me(e, t) {
  if (e.source[0] !== "[")
    throw new Error("/" + e.source + "/ can not be used with chars_without");
  if (!t || typeof t != "string")
    throw new Error(JSON.stringify(t) + " is not a valid search");
  if (e.source.indexOf(t) === -1)
    throw new Error('"' + t + '" is not is /' + e.source + "/");
  if (t === "-" && e.source.indexOf(t) !== 1)
    throw new Error('"' + t + '" is not at the first postion of /' + e.source + "/");
  return new RegExp(e.source.replace(t, ""), nt ? "u" : "");
}
function N(e) {
  var t = this;
  return new RegExp(
    Array.prototype.slice.call(arguments).map(function(r) {
      var u = typeof r == "string";
      if (u && t === void 0 && r === "|")
        throw new Error("use regg instead of reg to wrap expressions with `|`!");
      return u ? r : r.source;
    }).join(""),
    nt ? "mu" : "m"
  );
}
function g(e) {
  if (arguments.length === 0)
    throw new Error("no parameters provided");
  return N.apply(g, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
}
var Ju = "�", Ae = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
nt && (Ae = N("[", Ee(Ae), "\\u{10000}-\\u{10FFFF}", "]"));
var It = /[\x20\x09\x0D\x0A]/, Zu = Ee(It), M = N(It, "+"), I = N(It, "*"), We = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
nt && (We = N("[", Ee(We), "\\u{10000}-\\u{10FFFF}", "]"));
var Ku = Ee(We), Lt = N("[", Ku, Ee(/[-.0-9\xB7]/), Ee(/[\u0300-\u036F\u203F-\u2040]/), "]"), ee = N(We, Lt, "*"), Xt = N(Lt, "+"), ei = N("&", ee, ";"), ti = g(/&#[0-9]+;|&#x[0-9a-fA-F]+;/), Je = g(ei, "|", ti), Ze = N("%", ee, ";"), Pt = g(
  N('"', g(/[^%&"]/, "|", Ze, "|", Je), "*", '"'),
  "|",
  N("'", g(/[^%&']/, "|", Ze, "|", Je), "*", "'")
), ri = g('"', g(/[^<&"]/, "|", Je), "*", '"', "|", "'", g(/[^<&']/, "|", Je), "*", "'"), ui = Me(We, ":"), ii = Me(Lt, ":"), $t = N(ui, ii, "*"), st = N($t, g(":", $t), "?"), ni = N("^", st, "$"), si = N("(", st, ")"), Ke = g(/"[^"]*"|'[^']*'/), ai = N(/^<\?/, "(", ee, ")", g(M, "(", Ae, "*?)"), "?", /\?>/), Qt = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/, pt = g('"', Qt, '*"', "|", "'", Me(Qt, "'"), "*'"), kr = "<!--", Gr = "-->", oi = N(kr, g(Me(Ae, "-"), "|", N("-", Me(Ae, "-"))), "*", Gr), Wt = "#PCDATA", ci = g(
  N(/\(/, I, Wt, g(I, /\|/, I, st), "*", I, /\)\*/),
  "|",
  N(/\(/, I, Wt, I, /\)/)
), li = /[?*+]?/, hi = N(
  /\([^>]+\)/,
  li
  /*regg(choice, '|', seq), _children_quantity*/
), fi = g("EMPTY", "|", "ANY", "|", ci, "|", hi), pi = "<!ELEMENT", mi = N(pi, M, g(st, "|", Ze), M, g(fi, "|", Ze), I, ">"), di = N("NOTATION", M, /\(/, I, ee, g(I, /\|/, I, ee), "*", I, /\)/), Di = N(/\(/, I, Xt, g(I, /\|/, I, Xt), "*", I, /\)/), vi = g(di, "|", Di), Ei = g(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", vi), Ai = g(/#REQUIRED|#IMPLIED/, "|", g(g("#FIXED", M), "?", ri)), gi = g(M, ee, M, Ei, M, Ai), Ti = "<!ATTLIST", Ci = N(Ti, M, ee, gi, "*", I, ">"), Ut = "SYSTEM", mt = "PUBLIC", dt = g(g(Ut, M, Ke), "|", g(mt, M, pt, M, Ke)), bi = N(
  "^",
  g(
    g(Ut, M, "(?<SystemLiteralOnly>", Ke, ")"),
    "|",
    g(mt, M, "(?<PubidLiteral>", pt, ")", M, "(?<SystemLiteral>", Ke, ")")
  )
), yi = g(M, "NDATA", M, ee), wi = g(Pt, "|", g(dt, yi, "?")), Vr = "<!ENTITY", Ni = N(Vr, M, ee, M, wi, I, ">"), _i = g(Pt, "|", dt), xi = N(Vr, M, "%", M, ee, M, _i, I, ">"), Si = g(Ni, "|", xi), Oi = N(mt, M, pt), Fi = N("<!NOTATION", M, ee, M, g(dt, "|", Oi), I, ">"), qt = N(I, "=", I), Jt = /1[.]\d+/, Bi = N(M, "version", qt, g("'", Jt, "'", "|", '"', Jt, '"')), Zt = /[A-Za-z][-A-Za-z0-9._]*/, Mi = g(M, "encoding", qt, g('"', Zt, '"', "|", "'", Zt, "'")), Ri = g(M, "standalone", qt, g("'", g("yes", "|", "no"), "'", "|", '"', g("yes", "|", "no"), '"')), Ii = N(/^<\?xml/, Bi, Mi, "?", Ri, "?", I, /\?>/), Li = "<!DOCTYPE", Pi = "<![CDATA[", Ui = "]]>", qi = /<!\[CDATA\[/, ki = /\]\]>/, Gi = N(Ae, "*?", ki), Vi = N(qi, Gi);
w.chars = Ee;
w.chars_without = Me;
w.detectUnicodeSupport = qr;
w.reg = N;
w.regg = g;
w.AttlistDecl = Ci;
w.CDATA_START = Pi;
w.CDATA_END = Ui;
w.CDSect = Vi;
w.Char = Ae;
w.Comment = oi;
w.COMMENT_START = kr;
w.COMMENT_END = Gr;
w.DOCTYPE_DECL_START = Li;
w.elementdecl = mi;
w.EntityDecl = Si;
w.EntityValue = Pt;
w.ExternalID = dt;
w.ExternalID_match = bi;
w.Name = ee;
w.NotationDecl = Fi;
w.Reference = Je;
w.PEReference = Ze;
w.PI = ai;
w.PUBLIC = mt;
w.PubidLiteral = pt;
w.QName = st;
w.QName_exact = ni;
w.QName_group = si;
w.S = M;
w.SChar_s = Zu;
w.S_OPT = I;
w.SYSTEM = Ut;
w.SystemLiteral = Ke;
w.UNICODE_REPLACEMENT_CHARACTER = Ju;
w.UNICODE_SUPPORT = nt;
w.XMLDecl = Ii;
var K = P, se = K.find, Hi = K.hasDefaultHTMLNamespace, Re = K.hasOwn, zi = K.isHTMLMimeType, Yi = K.isHTMLRawTextElement, ji = K.isHTMLVoidElement, je = K.MIME_TYPE, oe = K.NAMESPACE, X = Symbol(), Xi = we, A = Xi.DOMException, le = w;
function W(e) {
  if (e !== X)
    throw new TypeError("Illegal constructor");
}
function $i(e) {
  return e !== "";
}
function Qi(e) {
  return e ? e.split(/[\t\n\f\r ]+/).filter($i) : [];
}
function Wi(e, t) {
  return Re(e, t) || (e[t] = !0), e;
}
function Kt(e) {
  if (!e) return [];
  var t = Qi(e);
  return Object.keys(t.reduce(Wi, {}));
}
function Ji(e) {
  return function(t) {
    return e && e.indexOf(t) !== -1;
  };
}
function Hr(e) {
  if (!le.QName_exact.test(e))
    throw new A(A.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + e + '"');
}
function Ot(e, t) {
  Hr(t), e = e || null;
  var r = null, u = t;
  if (t.indexOf(":") >= 0) {
    var i = t.split(":");
    r = i[0], u = i[1];
  }
  if (r !== null && e === null)
    throw new A(A.NAMESPACE_ERR, "prefix is non-null and namespace is null");
  if (r === "xml" && e !== K.NAMESPACE.XML)
    throw new A(A.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
  if ((r === "xmlns" || t === "xmlns") && e !== K.NAMESPACE.XMLNS)
    throw new A(
      A.NAMESPACE_ERR,
      'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
    );
  if (e === K.NAMESPACE.XMLNS && r !== "xmlns" && t !== "xmlns")
    throw new A(
      A.NAMESPACE_ERR,
      'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
    );
  return [e, r, u];
}
function Ue(e, t) {
  for (var r in e)
    Re(e, r) && (t[r] = e[r]);
}
function J(e, t) {
  var r = e.prototype;
  if (!(r instanceof t)) {
    let u = function() {
    };
    u.prototype = t.prototype, u = new u(), Ue(r, u), e.prototype = r = u;
  }
  r.constructor != e && (typeof e != "function" && console.error("unknown Class:" + e), r.constructor = e);
}
var Z = {}, re = Z.ELEMENT_NODE = 1, Ie = Z.ATTRIBUTE_NODE = 2, ht = Z.TEXT_NODE = 3, zr = Z.CDATA_SECTION_NODE = 4, Yr = Z.ENTITY_REFERENCE_NODE = 5, Zi = Z.ENTITY_NODE = 6, jr = Z.PROCESSING_INSTRUCTION_NODE = 7, Xr = Z.COMMENT_NODE = 8, et = Z.DOCUMENT_NODE = 9, $r = Z.DOCUMENT_TYPE_NODE = 10, de = Z.DOCUMENT_FRAGMENT_NODE = 11, Ki = Z.NOTATION_NODE = 12, G = K.freeze({
  DOCUMENT_POSITION_DISCONNECTED: 1,
  DOCUMENT_POSITION_PRECEDING: 2,
  DOCUMENT_POSITION_FOLLOWING: 4,
  DOCUMENT_POSITION_CONTAINS: 8,
  DOCUMENT_POSITION_CONTAINED_BY: 16,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
});
function er(e) {
  for (var t = []; e.parentNode || e.ownerElement; )
    e = e.parentNode || e.ownerElement, t.unshift(e);
  return t;
}
function Qr(e, t) {
  if (t.length < e.length) return Qr(t, e);
  var r = null;
  for (var u in e) {
    if (e[u] !== t[u]) return r;
    r = e[u];
  }
  return r;
}
function tr(e) {
  return e.guid || (e.guid = Math.random()), e.guid;
}
function ue() {
}
ue.prototype = {
  /**
   * The number of nodes in the list. The range of valid child node indices is 0 to length-1
   * inclusive.
   *
   * @type {number}
   */
  length: 0,
  /**
   * Returns the item at `index`. If index is greater than or equal to the number of nodes in
   * the list, this returns null.
   *
   * @param index
   * Unsigned long Index into the collection.
   * @returns {Node | null}
   * The node at position `index` in the NodeList,
   * or null if that is not a valid index.
   */
  item: function(e) {
    return e >= 0 && e < this.length ? this[e] : null;
  },
  /**
   * Returns a string representation of the NodeList.
   *
   * @param {unknown} nodeFilter
   * __A filter function? Not implemented according to the spec?__.
   * @returns {string}
   * A string representation of the NodeList.
   */
  toString: function(e) {
    for (var t = [], r = 0; r < this.length; r++)
      Be(this[r], t, e);
    return t.join("");
  },
  /**
   * Filters the NodeList based on a predicate.
   *
   * @param {function(Node): boolean} predicate
   * - A predicate function to filter the NodeList.
   * @returns {Node[]}
   * An array of nodes that satisfy the predicate.
   * @private
   */
  filter: function(e) {
    return Array.prototype.filter.call(this, e);
  },
  /**
   * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
   * not present.
   *
   * @param {Node} item
   * - The Node item to locate in the NodeList.
   * @returns {number}
   * The first index of the node in the NodeList; -1 if not found.
   * @private
   */
  indexOf: function(e) {
    return Array.prototype.indexOf.call(this, e);
  }
};
ue.prototype[Symbol.iterator] = function() {
  var e = this, t = 0;
  return {
    next: function() {
      return t < e.length ? {
        value: e[t++],
        done: !1
      } : {
        done: !0
      };
    },
    return: function() {
      return {
        done: !0
      };
    }
  };
};
function ge(e, t) {
  this._node = e, this._refresh = t, Dt(this);
}
function Dt(e) {
  var t = e._node._inc || e._node.ownerDocument._inc;
  if (e._inc !== t) {
    var r = e._refresh(e._node);
    if (au(e, "length", r.length), !e.$$length || r.length < e.$$length)
      for (var u = r.length; u in e; u++)
        Re(e, u) && delete e[u];
    Ue(r, e), e._inc = t;
  }
}
ge.prototype.item = function(e) {
  return Dt(this), this[e] || null;
};
J(ge, ue);
function Le() {
}
function Wr(e, t) {
  for (var r = 0; r < e.length; ) {
    if (e[r] === t)
      return r;
    r++;
  }
}
function en(e, t, r, u) {
  if (u ? t[Wr(t, u)] = r : (t[t.length] = r, t.length++), e) {
    r.ownerElement = e;
    var i = e.ownerDocument;
    i && (u && Kr(i, e, u), tn(i, e, r));
  }
}
function rr(e, t, r) {
  var u = Wr(t, r);
  if (u >= 0) {
    for (var i = t.length - 1; u <= i; )
      t[u] = t[++u];
    if (t.length = i, e) {
      var n = e.ownerDocument;
      n && Kr(n, e, r), r.ownerElement = null;
    }
  }
}
Le.prototype = {
  length: 0,
  item: ue.prototype.item,
  /**
   * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
   * document.
   *
   * @param {string} localName
   * The local name of the attribute.
   * @returns {Attr | null}
   * The attribute with the given local name, or null if no such attribute exists.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
   */
  getNamedItem: function(e) {
    this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    for (var t = 0; t < this.length; ) {
      var r = this[t];
      if (r.nodeName === e)
        return r;
      t++;
    }
    return null;
  },
  /**
   * Set an attribute.
   *
   * @param {Attr} attr
   * The attribute to set.
   * @returns {Attr | null}
   * The old attribute with the same local name and namespace URI as the new one, or null if no
   * such attribute exists.
   * @throws {DOMException}
   * With code:
   * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
   * element.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
   */
  setNamedItem: function(e) {
    var t = e.ownerElement;
    if (t && t !== this._ownerElement)
      throw new A(A.INUSE_ATTRIBUTE_ERR);
    var r = this.getNamedItemNS(e.namespaceURI, e.localName);
    return r === e ? e : (en(this._ownerElement, this, e, r), r);
  },
  /**
   * Set an attribute, replacing an existing attribute with the same local name and namespace
   * URI if one exists.
   *
   * @param {Attr} attr
   * The attribute to set.
   * @returns {Attr | null}
   * The old attribute with the same local name and namespace URI as the new one, or null if no
   * such attribute exists.
   * @throws {DOMException}
   * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
   * attribute of another element.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
   */
  setNamedItemNS: function(e) {
    return this.setNamedItem(e);
  },
  /**
   * Removes an attribute specified by the local name.
   *
   * @param {string} localName
   * The local name of the attribute to be removed.
   * @returns {Attr}
   * The attribute node that was removed.
   * @throws {DOMException}
   * With code:
   * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
   */
  removeNamedItem: function(e) {
    var t = this.getNamedItem(e);
    if (!t)
      throw new A(A.NOT_FOUND_ERR, e);
    return rr(this._ownerElement, this, t), t;
  },
  /**
   * Removes an attribute specified by the namespace and local name.
   *
   * @param {string | null} namespaceURI
   * The namespace URI of the attribute to be removed.
   * @param {string} localName
   * The local name of the attribute to be removed.
   * @returns {Attr}
   * The attribute node that was removed.
   * @throws {DOMException}
   * With code:
   * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
   * name is found.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
   */
  removeNamedItemNS: function(e, t) {
    var r = this.getNamedItemNS(e, t);
    if (!r)
      throw new A(A.NOT_FOUND_ERR, e ? e + " : " + t : t);
    return rr(this._ownerElement, this, r), r;
  },
  /**
   * Get an attribute by namespace and local name.
   *
   * @param {string | null} namespaceURI
   * The namespace URI of the attribute.
   * @param {string} localName
   * The local name of the attribute.
   * @returns {Attr | null}
   * The attribute with the given namespace URI and local name, or null if no such attribute
   * exists.
   * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
   */
  getNamedItemNS: function(e, t) {
    e || (e = null);
    for (var r = 0; r < this.length; ) {
      var u = this[r];
      if (u.localName === t && u.namespaceURI === e)
        return u;
      r++;
    }
    return null;
  }
};
Le.prototype[Symbol.iterator] = function() {
  var e = this, t = 0;
  return {
    next: function() {
      return t < e.length ? {
        value: e[t++],
        done: !1
      } : {
        done: !0
      };
    },
    return: function() {
      return {
        done: !0
      };
    }
  };
};
function Jr() {
}
Jr.prototype = {
  /**
   * Test if the DOM implementation implements a specific feature and version, as specified in
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
   *
   * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
   * feature is supported. The different implementations fairly diverged in what kind of
   * features were reported. The latest version of the spec settled to force this method to
   * always return true, where the functionality was accurate and in use.
   *
   * @deprecated
   * It is deprecated and modern browsers return true in all cases.
   * @function DOMImplementation#hasFeature
   * @param {string} feature
   * The name of the feature to test.
   * @param {string} [version]
   * This is the version number of the feature to test.
   * @returns {boolean}
   * Always returns true.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
   * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
   */
  hasFeature: function(e, t) {
    return !0;
  },
  /**
   * Creates a DOM Document object of the specified type with its document element. Note that
   * based on the {@link DocumentType}
   * given to create the document, the implementation may instantiate specialized
   * {@link Document} objects that support additional features than the "Core", such as "HTML"
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
   * On the other hand, setting the {@link DocumentType} after the document was created makes
   * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
   * such as createHTMLDocument
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
   * can be used to obtain specific types of {@link Document} objects.
   *
   * __It behaves slightly different from the description in the living standard__:
   * - There is no interface/class `XMLDocument`, it returns a `Document`
   * instance (with it's `type` set to `'xml'`).
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   *
   * @function DOMImplementation.createDocument
   * @param {string | null} namespaceURI
   * The
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
   * of the document element to create or null.
   * @param {string | null} qualifiedName
   * The
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
   * of the document element to be created or null.
   * @param {DocumentType | null} [doctype=null]
   * The type of document to be created or null. When doctype is not null, its
   * {@link Node#ownerDocument} attribute is set to the document being created. Default is
   * `null`
   * @returns {Document}
   * A new {@link Document} object with its document element. If the NamespaceURI,
   * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
   * document element.
   * @throws {DOMException}
   * With code:
   *
   * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
   * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
   * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
   * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
   * is different from null, or if the qualifiedName has a prefix that is "xml" and the
   * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
   * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
   * or if the DOM implementation does not support the "XML" feature but a non-null namespace
   * URI was provided, since namespaces were defined by XML.
   * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
   * or was created from a different implementation.
   * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
   * "XML" and the language exposed through the Document does not support XML Namespaces (such
   * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
   * @since DOM Level 2.
   * @see {@link #createHTMLDocument}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
   *      Level 3 Core
   * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
   *      Level 2 Core (initial)
   */
  createDocument: function(e, t, r) {
    var u = je.XML_APPLICATION;
    e === oe.HTML ? u = je.XML_XHTML_APPLICATION : e === oe.SVG && (u = je.XML_SVG_IMAGE);
    var i = new Te(X, { contentType: u });
    if (i.implementation = this, i.childNodes = new ue(), i.doctype = r || null, r && i.appendChild(r), t) {
      var n = i.createElementNS(e, t);
      i.appendChild(n);
    }
    return i;
  },
  /**
   * Creates an empty DocumentType node. Entity declarations and notations are not made
   * available. Entity reference expansions and default attribute additions do not occur.
   *
   * **This behavior is slightly different from the in the specs**:
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   * - `publicId` and `systemId` contain the raw data including any possible quotes,
   *   so they can always be serialized back to the original value
   * - `internalSubset` contains the raw string between `[` and `]` if present,
   *   but is not parsed or validated in any form.
   *
   * @function DOMImplementation#createDocumentType
   * @param {string} qualifiedName
   * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
   * name} of the document type to be created.
   * @param {string} [publicId]
   * The external subset public identifier.
   * @param {string} [systemId]
   * The external subset system identifier.
   * @param {string} [internalSubset]
   * the internal subset or an empty string if it is not present
   * @returns {DocumentType}
   * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
   * @throws {DOMException}
   * With code:
   *
   * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
   * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
   * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
   * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
   * "XML" and the language exposed through the Document does not support XML Namespaces (such
   * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
   * @since DOM Level 2.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
   *      MDN
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
   *      Standard
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
   *      Level 3 Core
   * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
   *      Level 2 Core
   * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
   * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
   * @prettierignore
   */
  createDocumentType: function(e, t, r, u) {
    Hr(e);
    var i = new gt(X);
    return i.name = e, i.nodeName = e, i.publicId = t || "", i.systemId = r || "", i.internalSubset = u || "", i;
  },
  /**
   * Returns an HTML document, that might already have a basic DOM structure.
   *
   * __It behaves slightly different from the description in the living standard__:
   * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
   * omitted)
   * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
   *
   * @param {string | false} [title]
   * A string containing the title to give the new HTML document.
   * @returns {Document}
   * The HTML document.
   * @since WHATWG Living Standard.
   * @see {@link #createDocument}
   * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
   * @see https://dom.spec.whatwg.org/#html-document
   */
  createHTMLDocument: function(e) {
    var t = new Te(X, { contentType: je.HTML });
    if (t.implementation = this, t.childNodes = new ue(), e !== !1) {
      t.doctype = this.createDocumentType("html"), t.doctype.ownerDocument = t, t.appendChild(t.doctype);
      var r = t.createElement("html");
      t.appendChild(r);
      var u = t.createElement("head");
      if (r.appendChild(u), typeof e == "string") {
        var i = t.createElement("title");
        i.appendChild(t.createTextNode(e)), u.appendChild(i);
      }
      r.appendChild(t.createElement("body"));
    }
    return t;
  }
};
function B(e) {
  W(e);
}
B.prototype = {
  /**
   * The first child of this node.
   *
   * @type {Node | null}
   */
  firstChild: null,
  /**
   * The last child of this node.
   *
   * @type {Node | null}
   */
  lastChild: null,
  /**
   * The previous sibling of this node.
   *
   * @type {Node | null}
   */
  previousSibling: null,
  /**
   * The next sibling of this node.
   *
   * @type {Node | null}
   */
  nextSibling: null,
  /**
   * The attributes of this node.
   *
   * @type {NamedNodeMap | null}
   */
  attributes: null,
  /**
   * The parent node of this node.
   *
   * @type {Node | null}
   */
  parentNode: null,
  /**
   * The child nodes of this node.
   *
   * @type {NodeList | null}
   */
  childNodes: null,
  /**
   * The document object associated with this node.
   *
   * @type {Document | null}
   */
  ownerDocument: null,
  /**
   * The value of this node.
   *
   * @type {string | null}
   */
  nodeValue: null,
  /**
   * The namespace URI of this node.
   *
   * @type {string | null}
   */
  namespaceURI: null,
  /**
   * The prefix of the namespace for this node.
   *
   * @type {string | null}
   */
  prefix: null,
  /**
   * The local part of the qualified name of this node.
   *
   * @type {string | null}
   */
  localName: null,
  /**
   * Inserts a node before a reference node as a child of this node.
   *
   * @param {Node} newChild
   * The new child node to be inserted.
   * @param {Node | null} refChild
   * The reference node before which newChild will be inserted.
   * @returns {Node}
   * The new child node successfully inserted.
   * @throws {DOMException}
   * Throws a DOMException if inserting the node would result in a DOM tree that is not
   * well-formed, or if `child` is provided but is not a child of `parent`.
   * See {@link _insertBefore} for more details.
   * @since Modified in DOM L2
   */
  insertBefore: function(e, t) {
    return ft(this, e, t);
  },
  /**
   * Replaces an old child node with a new child node within this node.
   *
   * @param {Node} newChild
   * The new node that is to replace the old node.
   * If it already exists in the DOM, it is removed from its original position.
   * @param {Node} oldChild
   * The existing child node to be replaced.
   * @returns {Node}
   * Returns the replaced child node.
   * @throws {DOMException}
   * Throws a DOMException if replacing the node would result in a DOM tree that is not
   * well-formed, or if `oldChild` is not a child of `this`.
   * This can also occur if the pre-replacement validity assertion fails.
   * See {@link _insertBefore}, {@link Node.removeChild}, and
   * {@link assertPreReplacementValidityInDocument} for more details.
   * @see https://dom.spec.whatwg.org/#concept-node-replace
   */
  replaceChild: function(e, t) {
    ft(this, e, t, uu), t && this.removeChild(t);
  },
  /**
   * Removes an existing child node from this node.
   *
   * @param {Node} oldChild
   * The child node to be removed.
   * @returns {Node}
   * Returns the removed child node.
   * @throws {DOMException}
   * Throws a DOMException if `oldChild` is not a child of `this`.
   * See {@link _removeChild} for more details.
   */
  removeChild: function(e) {
    return tu(this, e);
  },
  /**
   * Appends a child node to this node.
   *
   * @param {Node} newChild
   * The child node to be appended to this node.
   * If it already exists in the DOM, it is removed from its original position.
   * @returns {Node}
   * Returns the appended child node.
   * @throws {DOMException}
   * Throws a DOMException if appending the node would result in a DOM tree that is not
   * well-formed, or if `newChild` is not a valid Node.
   * See {@link insertBefore} for more details.
   */
  appendChild: function(e) {
    return this.insertBefore(e, null);
  },
  /**
   * Determines whether this node has any child nodes.
   *
   * @returns {boolean}
   * Returns true if this node has any child nodes, and false otherwise.
   */
  hasChildNodes: function() {
    return this.firstChild != null;
  },
  /**
   * Creates a copy of the calling node.
   *
   * @param {boolean} deep
   * If true, the contents of the node are recursively copied.
   * If false, only the node itself (and its attributes, if it is an element) are copied.
   * @returns {Node}
   * Returns the newly created copy of the node.
   * @throws {DOMException}
   * May throw a DOMException if operations within {@link Element#setAttributeNode} or
   * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
   * specific constraints.
   * @see {@link cloneNode}
   */
  cloneNode: function(e) {
    return Ft(this.ownerDocument || this, this, e);
  },
  /**
   * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
   * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
   *
   * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
   * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
   * nodes.
   *
   * This method operates recursively, so it also normalizes any and all descendent nodes within
   * the subtree.
   *
   * @throws {DOMException}
   * May throw a DOMException if operations within removeChild or appendData (which are
   * potentially invoked in this method) do not meet their specific constraints.
   * @since Modified in DOM Level 2
   * @see {@link Node.removeChild}
   * @see {@link CharacterData.appendData}
   */
  normalize: function() {
    for (var e = this.firstChild; e; ) {
      var t = e.nextSibling;
      t && t.nodeType == ht && e.nodeType == ht ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(), e = t);
    }
  },
  /**
   * Checks whether the DOM implementation implements a specific feature and its version.
   *
   * @deprecated
   * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
   * @param {string} feature
   * The package name of the feature to test. This is the same name that can be passed to the
   * method `hasFeature` on `DOMImplementation`.
   * @param {string} version
   * This is the version number of the package name to test.
   * @returns {boolean}
   * Returns true in all cases in the current implementation.
   * @since Introduced in DOM Level 2
   * @see {@link DOMImplementation.hasFeature}
   */
  isSupported: function(e, t) {
    return this.ownerDocument.implementation.hasFeature(e, t);
  },
  /**
   * Determines if the node has any attributes.
   *
   * @returns {boolean}
   * Returns true if the node has any attributes, and false otherwise.
   * @since Introduced in DOM Level 2
   */
  hasAttributes: function() {
    return this.attributes.length > 0;
  },
  /**
   * Look up the prefix associated to the given namespace URI, starting from this node.
   * **The default namespace declarations are ignored by this method.**
   * See Namespace Prefix Lookup for details on the algorithm used by this method.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} namespaceURI
   * The namespace URI for which to find the associated prefix.
   * @returns {string | null}
   * The associated prefix, if found; otherwise, null.
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
   * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
   * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
   * @see https://github.com/xmldom/xmldom/issues/322
   * @prettierignore
   */
  lookupPrefix: function(e) {
    for (var t = this; t; ) {
      var r = t._nsMap;
      if (r) {
        for (var u in r)
          if (Re(r, u) && r[u] === e)
            return u;
      }
      t = t.nodeType == Ie ? t.ownerDocument : t.parentNode;
    }
    return null;
  },
  /**
   * This function is used to look up the namespace URI associated with the given prefix,
   * starting from this node.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} prefix
   * The prefix for which to find the associated namespace URI.
   * @returns {string | null}
   * The associated namespace URI, if found; otherwise, null.
   * @since DOM Level 3
   * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
   * @prettierignore
   */
  lookupNamespaceURI: function(e) {
    for (var t = this; t; ) {
      var r = t._nsMap;
      if (r && Re(r, e))
        return r[e];
      t = t.nodeType == Ie ? t.ownerDocument : t.parentNode;
    }
    return null;
  },
  /**
   * Determines whether the given namespace URI is the default namespace.
   *
   * The function works by looking up the prefix associated with the given namespace URI. If no
   * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
   * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
   * the default.
   *
   * **This behavior is different from the in the specs**:
   * - no node type specific handling
   * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
   *
   * @param {string | null} namespaceURI
   * The namespace URI to be checked.
   * @returns {boolean}
   * Returns true if the given namespace URI is the default namespace, false otherwise.
   * @since DOM Level 3
   * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
   * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
   * @prettierignore
   */
  isDefaultNamespace: function(e) {
    var t = this.lookupPrefix(e);
    return t == null;
  },
  /**
   * Compares the reference node with a node with regard to their position in the document and
   * according to the document order.
   *
   * @param {Node} other
   * The node to compare the reference node to.
   * @returns {number}
   * Returns how the node is positioned relatively to the reference node according to the
   * bitmask. 0 if reference node and given node are the same.
   * @since DOM Level 3
   * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
   * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
   */
  compareDocumentPosition: function(e) {
    if (this === e) return 0;
    var t = e, r = this, u = null, i = null;
    if (t instanceof be && (u = t, t = u.ownerElement), r instanceof be && (i = r, r = i.ownerElement, u && t && r === t))
      for (var n = 0, s; s = r.attributes[n]; n++) {
        if (s === u)
          return G.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + G.DOCUMENT_POSITION_PRECEDING;
        if (s === i)
          return G.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + G.DOCUMENT_POSITION_FOLLOWING;
      }
    if (!t || !r || r.ownerDocument !== t.ownerDocument)
      return G.DOCUMENT_POSITION_DISCONNECTED + G.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (tr(r.ownerDocument) > tr(t.ownerDocument) ? G.DOCUMENT_POSITION_FOLLOWING : G.DOCUMENT_POSITION_PRECEDING);
    var a = er(t), c = er(r);
    if (!u && c.indexOf(t) >= 0 || i && t === r)
      return G.DOCUMENT_POSITION_CONTAINS + G.DOCUMENT_POSITION_PRECEDING;
    if (!i && a.indexOf(r) >= 0 || u && t === r)
      return G.DOCUMENT_POSITION_CONTAINED_BY + G.DOCUMENT_POSITION_FOLLOWING;
    var o = Qr(c, a);
    for (var l in o.childNodes) {
      var h = o.childNodes[l];
      if (h === r) return G.DOCUMENT_POSITION_FOLLOWING;
      if (h === t) return G.DOCUMENT_POSITION_PRECEDING;
      if (c.indexOf(h) >= 0) return G.DOCUMENT_POSITION_FOLLOWING;
      if (a.indexOf(h) >= 0) return G.DOCUMENT_POSITION_PRECEDING;
    }
    return 0;
  }
};
function Zr(e) {
  return e == "<" && "&lt;" || e == ">" && "&gt;" || e == "&" && "&amp;" || e == '"' && "&quot;" || "&#" + e.charCodeAt() + ";";
}
Ue(Z, B);
Ue(Z, B.prototype);
Ue(G, B);
Ue(G, B.prototype);
function tt(e, t) {
  if (t(e))
    return !0;
  if (e = e.firstChild)
    do
      if (tt(e, t))
        return !0;
    while (e = e.nextSibling);
}
function Te(e, t) {
  W(e);
  var r = t || {};
  this.ownerDocument = this, this.contentType = r.contentType || je.XML_APPLICATION, this.type = zi(this.contentType) ? "html" : "xml";
}
function tn(e, t, r) {
  e && e._inc++;
  var u = r.namespaceURI;
  u === oe.XMLNS && (t._nsMap[r.prefix ? r.localName : ""] = r.value);
}
function Kr(e, t, r, u) {
  e && e._inc++;
  var i = r.namespaceURI;
  i === oe.XMLNS && delete t._nsMap[r.prefix ? r.localName : ""];
}
function eu(e, t, r) {
  if (e && e._inc) {
    e._inc++;
    var u = t.childNodes;
    {
      for (var i = t.firstChild, n = 0; i; )
        u[n++] = i, i = i.nextSibling;
      u.length = n, delete u[u.length];
    }
  }
}
function tu(e, t) {
  if (e !== t.parentNode)
    throw new A(A.NOT_FOUND_ERR, "child's parent is not parent");
  var r = t.previousSibling, u = t.nextSibling;
  return r ? r.nextSibling = u : e.firstChild = u, u ? u.previousSibling = r : e.lastChild = r, eu(e.ownerDocument, e), t.parentNode = null, t.previousSibling = null, t.nextSibling = null, t;
}
function rn(e) {
  return e && (e.nodeType === B.DOCUMENT_NODE || e.nodeType === B.DOCUMENT_FRAGMENT_NODE || e.nodeType === B.ELEMENT_NODE);
}
function un(e) {
  return e && (ae(e) || e instanceof Ne || fe(e) || e.nodeType === B.DOCUMENT_FRAGMENT_NODE || e.nodeType === B.COMMENT_NODE || e.nodeType === B.PROCESSING_INSTRUCTION_NODE);
}
function fe(e) {
  return e && e.nodeType === B.DOCUMENT_TYPE_NODE;
}
function ae(e) {
  return e && e.nodeType === B.ELEMENT_NODE;
}
function ru(e) {
  return e && e.nodeType === B.TEXT_NODE;
}
function ur(e, t) {
  var r = e.childNodes || [];
  if (se(r, ae) || fe(t))
    return !1;
  var u = se(r, fe);
  return !(t && u && r.indexOf(u) > r.indexOf(t));
}
function ir(e, t) {
  var r = e.childNodes || [];
  function u(n) {
    return ae(n) && n !== t;
  }
  if (se(r, u))
    return !1;
  var i = se(r, fe);
  return !(t && i && r.indexOf(i) > r.indexOf(t));
}
function nn(e, t, r) {
  if (!rn(e))
    throw new A(A.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + e.nodeType);
  if (r && r.parentNode !== e)
    throw new A(A.NOT_FOUND_ERR, "child not in parent");
  if (
    // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
    !un(t) || // 5. If either `node` is a Text node and `parent` is a document,
    // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
    // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
    // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
    fe(t) && e.nodeType !== B.DOCUMENT_NODE
  )
    throw new A(
      A.HIERARCHY_REQUEST_ERR,
      "Unexpected node type " + t.nodeType + " for parent node type " + e.nodeType
    );
}
function sn(e, t, r) {
  var u = e.childNodes || [], i = t.childNodes || [];
  if (t.nodeType === B.DOCUMENT_FRAGMENT_NODE) {
    var n = i.filter(ae);
    if (n.length > 1 || se(i, ru))
      throw new A(A.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
    if (n.length === 1 && !ur(e, r))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
  }
  if (ae(t) && !ur(e, r))
    throw new A(A.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
  if (fe(t)) {
    if (se(u, fe))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
    var s = se(u, ae);
    if (r && u.indexOf(s) < u.indexOf(r))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
    if (!r && s)
      throw new A(A.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
  }
}
function uu(e, t, r) {
  var u = e.childNodes || [], i = t.childNodes || [];
  if (t.nodeType === B.DOCUMENT_FRAGMENT_NODE) {
    var n = i.filter(ae);
    if (n.length > 1 || se(i, ru))
      throw new A(A.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
    if (n.length === 1 && !ir(e, r))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
  }
  if (ae(t) && !ir(e, r))
    throw new A(A.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
  if (fe(t)) {
    if (se(u, function(c) {
      return fe(c) && c !== r;
    }))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
    var s = se(u, ae);
    if (r && u.indexOf(s) < u.indexOf(r))
      throw new A(A.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
  }
}
function ft(e, t, r, u) {
  nn(e, t, r), e.nodeType === B.DOCUMENT_NODE && (u || sn)(e, t, r);
  var i = t.parentNode;
  if (i && i.removeChild(t), t.nodeType === de) {
    var n = t.firstChild;
    if (n == null)
      return t;
    var s = t.lastChild;
  } else
    n = s = t;
  var a = r ? r.previousSibling : e.lastChild;
  n.previousSibling = a, s.nextSibling = r, a ? a.nextSibling = n : e.firstChild = n, r == null ? e.lastChild = s : r.previousSibling = s;
  do
    n.parentNode = e;
  while (n !== s && (n = n.nextSibling));
  return eu(e.ownerDocument || e, e), t.nodeType == de && (t.firstChild = t.lastChild = null), t;
}
Te.prototype = {
  /**
   * The implementation that created this document.
   *
   * @type DOMImplementation
   * @readonly
   */
  implementation: null,
  nodeName: "#document",
  nodeType: et,
  /**
   * The DocumentType node of the document.
   *
   * @type DocumentType
   * @readonly
   */
  doctype: null,
  documentElement: null,
  _inc: 1,
  insertBefore: function(e, t) {
    if (e.nodeType == de) {
      for (var r = e.firstChild; r; ) {
        var u = r.nextSibling;
        this.insertBefore(r, t), r = u;
      }
      return e;
    }
    return ft(this, e, t), e.ownerDocument = this, this.documentElement === null && e.nodeType === re && (this.documentElement = e), e;
  },
  removeChild: function(e) {
    var t = tu(this, e);
    return t === this.documentElement && (this.documentElement = null), t;
  },
  replaceChild: function(e, t) {
    ft(this, e, t, uu), e.ownerDocument = this, t && this.removeChild(t), ae(e) && (this.documentElement = e);
  },
  // Introduced in DOM Level 2:
  importNode: function(e, t) {
    return su(this, e, t);
  },
  // Introduced in DOM Level 2:
  getElementById: function(e) {
    var t = null;
    return tt(this.documentElement, function(r) {
      if (r.nodeType == re && r.getAttribute("id") == e)
        return t = r, !0;
    }), t;
  },
  /**
   * The `getElementsByClassName` method of `Document` interface returns an array-like object of
   * all child elements which have **all** of the given class name(s).
   *
   * Returns an empty list if `classeNames` is an empty string or only contains HTML white space
   * characters.
   *
   * Warning: This is a live LiveNodeList.
   * Changes in the DOM will reflect in the array as the changes occur.
   * If an element selected by this array no longer qualifies for the selector,
   * it will automatically be removed. Be aware of this for iteration purposes.
   *
   * @param {string} classNames
   * Is a string representing the class name(s) to match; multiple class names are separated by
   * (ASCII-)whitespace.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
   * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
   */
  getElementsByClassName: function(e) {
    var t = Kt(e);
    return new ge(this, function(r) {
      var u = [];
      return t.length > 0 && tt(r.documentElement, function(i) {
        if (i !== r && i.nodeType === re) {
          var n = i.getAttribute("class");
          if (n) {
            var s = e === n;
            if (!s) {
              var a = Kt(n);
              s = t.every(Ji(a));
            }
            s && u.push(i);
          }
        }
      }), u;
    });
  },
  /**
   * Creates a new `Element` that is owned by this `Document`.
   * In HTML Documents `localName` is the lower cased `tagName`,
   * otherwise no transformation is being applied.
   * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
   *
   * __This implementation differs from the specification:__ - The provided name is not checked
   * against the `Name` production,
   * so no related error will be thrown.
   * - There is no interface `HTMLElement`, it is always an `Element`.
   * - There is no support for a second argument to indicate using custom elements.
   *
   * @param {string} tagName
   * @returns {Element}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
   * @see https://dom.spec.whatwg.org/#dom-document-createelement
   * @see https://dom.spec.whatwg.org/#concept-create-element
   */
  createElement: function(e) {
    var t = new Ce(X);
    t.ownerDocument = this, this.type === "html" && (e = e.toLowerCase()), Hi(this.contentType) && (t.namespaceURI = oe.HTML), t.nodeName = e, t.tagName = e, t.localName = e, t.childNodes = new ue();
    var r = t.attributes = new Le();
    return r._ownerElement = t, t;
  },
  createDocumentFragment: function() {
    var e = new at(X);
    return e.ownerDocument = this, e.childNodes = new ue(), e;
  },
  createTextNode: function(e) {
    var t = new vt(X);
    return t.ownerDocument = this, t.appendData(e), t;
  },
  createComment: function(e) {
    var t = new Et(X);
    return t.ownerDocument = this, t.appendData(e), t;
  },
  createCDATASection: function(e) {
    var t = new At(X);
    return t.ownerDocument = this, t.appendData(e), t;
  },
  createProcessingInstruction: function(e, t) {
    var r = new Ct(X);
    return r.ownerDocument = this, r.nodeName = r.target = e, r.nodeValue = r.data = t, r;
  },
  /**
   * Creates an `Attr` node that is owned by this document.
   * In HTML Documents `localName` is the lower cased `name`,
   * otherwise no transformation is being applied.
   *
   * __This implementation differs from the specification:__ - The provided name is not checked
   * against the `Name` production,
   * so no related error will be thrown.
   *
   * @param {string} name
   * @returns {Attr}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
   * @see https://dom.spec.whatwg.org/#dom-document-createattribute
   */
  createAttribute: function(e) {
    if (!le.QName_exact.test(e))
      throw new A(A.INVALID_CHARACTER_ERR, 'invalid character in name "' + e + '"');
    return this.type === "html" && (e = e.toLowerCase()), this._createAttribute(e);
  },
  _createAttribute: function(e) {
    var t = new be(X);
    return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0, t;
  },
  createEntityReference: function(e) {
    var t = new Tt(X);
    return t.ownerDocument = this, t.nodeName = e, t;
  },
  // Introduced in DOM Level 2:
  createElementNS: function(e, t) {
    var r = Ot(e, t), u = new Ce(X), i = u.attributes = new Le();
    return u.childNodes = new ue(), u.ownerDocument = this, u.nodeName = t, u.tagName = t, u.namespaceURI = r[0], u.prefix = r[1], u.localName = r[2], i._ownerElement = u, u;
  },
  // Introduced in DOM Level 2:
  createAttributeNS: function(e, t) {
    var r = Ot(e, t), u = new be(X);
    return u.ownerDocument = this, u.nodeName = t, u.name = t, u.specified = !0, u.namespaceURI = r[0], u.prefix = r[1], u.localName = r[2], u;
  }
};
J(Te, B);
function Ce(e) {
  W(e), this._nsMap = /* @__PURE__ */ Object.create(null);
}
Ce.prototype = {
  nodeType: re,
  getQualifiedName: function() {
    return this.prefix ? this.prefix + ":" + this.localName : this.localName;
  },
  _isInHTMLDocumentAndNamespace: function() {
    return this.ownerDocument.type === "html" && this.namespaceURI === oe.HTML;
  },
  hasAttribute: function(e) {
    return !!this.getAttributeNode(e);
  },
  /**
   * Returns element’s first attribute whose qualified name is `name`, and `null`
   * if there is no such attribute.
   *
   * @param {string} name
   * @returns {string | null}
   */
  getAttribute: function(e) {
    var t = this.getAttributeNode(e);
    return t ? t.value : null;
  },
  getAttributeNode: function(e) {
    return this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase()), this.attributes.getNamedItem(e);
  },
  /**
   * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
   *
   * @param {string} name
   * @param {string} value
   */
  setAttribute: function(e, t) {
    this._isInHTMLDocumentAndNamespace() && (e = e.toLowerCase());
    var r = this.getAttributeNode(e);
    r ? r.value = r.nodeValue = "" + t : (r = this.ownerDocument._createAttribute(e), r.value = r.nodeValue = "" + t, this.setAttributeNode(r));
  },
  removeAttribute: function(e) {
    var t = this.getAttributeNode(e);
    t && this.removeAttributeNode(t);
  },
  setAttributeNode: function(e) {
    return this.attributes.setNamedItem(e);
  },
  setAttributeNodeNS: function(e) {
    return this.attributes.setNamedItemNS(e);
  },
  removeAttributeNode: function(e) {
    return this.attributes.removeNamedItem(e.nodeName);
  },
  //get real attribute name,and remove it by removeAttributeNode
  removeAttributeNS: function(e, t) {
    var r = this.getAttributeNodeNS(e, t);
    r && this.removeAttributeNode(r);
  },
  hasAttributeNS: function(e, t) {
    return this.getAttributeNodeNS(e, t) != null;
  },
  /**
   * Returns element’s attribute whose namespace is `namespaceURI` and local name is
   * `localName`,
   * or `null` if there is no such attribute.
   *
   * @param {string} namespaceURI
   * @param {string} localName
   * @returns {string | null}
   */
  getAttributeNS: function(e, t) {
    var r = this.getAttributeNodeNS(e, t);
    return r ? r.value : null;
  },
  /**
   * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
   * `localName` to value.
   *
   * @param {string} namespaceURI
   * @param {string} qualifiedName
   * @param {string} value
   * @see https://dom.spec.whatwg.org/#dom-element-setattributens
   */
  setAttributeNS: function(e, t, r) {
    var u = Ot(e, t), i = u[2], n = this.getAttributeNodeNS(e, i);
    n ? n.value = n.nodeValue = "" + r : (n = this.ownerDocument.createAttributeNS(e, t), n.value = n.nodeValue = "" + r, this.setAttributeNode(n));
  },
  getAttributeNodeNS: function(e, t) {
    return this.attributes.getNamedItemNS(e, t);
  },
  /**
   * Returns a LiveNodeList of elements with the given qualifiedName.
   * Searching for all descendants can be done by passing `*` as `qualifiedName`.
   *
   * All descendants of the specified element are searched, but not the element itself.
   * The returned list is live, which means it updates itself with the DOM tree automatically.
   * Therefore, there is no need to call `Element.getElementsByTagName()`
   * with the same element and arguments repeatedly if the DOM changes in between calls.
   *
   * When called on an HTML element in an HTML document,
   * `getElementsByTagName` lower-cases the argument before searching for it.
   * This is undesirable when trying to match camel-cased SVG elements (such as
   * `<linearGradient>`) in an HTML document.
   * Instead, use `Element.getElementsByTagNameNS()`,
   * which preserves the capitalization of the tag name.
   *
   * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
   * except that it only searches for elements that are descendants of the specified element.
   *
   * @param {string} qualifiedName
   * @returns {LiveNodeList}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
   * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
   */
  getElementsByTagName: function(e) {
    var t = (this.nodeType === et ? this : this.ownerDocument).type === "html", r = e.toLowerCase();
    return new ge(this, function(u) {
      var i = [];
      return tt(u, function(n) {
        if (!(n === u || n.nodeType !== re))
          if (e === "*")
            i.push(n);
          else {
            var s = n.getQualifiedName(), a = t && n.namespaceURI === oe.HTML ? r : e;
            s === a && i.push(n);
          }
      }), i;
    });
  },
  getElementsByTagNameNS: function(e, t) {
    return new ge(this, function(r) {
      var u = [];
      return tt(r, function(i) {
        i !== r && i.nodeType === re && (e === "*" || i.namespaceURI === e) && (t === "*" || i.localName == t) && u.push(i);
      }), u;
    });
  }
};
Te.prototype.getElementsByTagName = Ce.prototype.getElementsByTagName;
Te.prototype.getElementsByTagNameNS = Ce.prototype.getElementsByTagNameNS;
J(Ce, B);
function be(e) {
  W(e), this.namespaceURI = null, this.prefix = null, this.ownerElement = null;
}
be.prototype.nodeType = Ie;
J(be, B);
function Ne(e) {
  W(e);
}
Ne.prototype = {
  data: "",
  substringData: function(e, t) {
    return this.data.substring(e, e + t);
  },
  appendData: function(e) {
    e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
  },
  insertData: function(e, t) {
    this.replaceData(e, 0, t);
  },
  deleteData: function(e, t) {
    this.replaceData(e, t, "");
  },
  replaceData: function(e, t, r) {
    var u = this.data.substring(0, e), i = this.data.substring(e + t);
    r = u + r + i, this.nodeValue = this.data = r, this.length = r.length;
  }
};
J(Ne, B);
function vt(e) {
  W(e);
}
vt.prototype = {
  nodeName: "#text",
  nodeType: ht,
  splitText: function(e) {
    var t = this.data, r = t.substring(e);
    t = t.substring(0, e), this.data = this.nodeValue = t, this.length = t.length;
    var u = this.ownerDocument.createTextNode(r);
    return this.parentNode && this.parentNode.insertBefore(u, this.nextSibling), u;
  }
};
J(vt, Ne);
function Et(e) {
  W(e);
}
Et.prototype = {
  nodeName: "#comment",
  nodeType: Xr
};
J(Et, Ne);
function At(e) {
  W(e);
}
At.prototype = {
  nodeName: "#cdata-section",
  nodeType: zr
};
J(At, Ne);
function gt(e) {
  W(e);
}
gt.prototype.nodeType = $r;
J(gt, B);
function kt(e) {
  W(e);
}
kt.prototype.nodeType = Ki;
J(kt, B);
function Gt(e) {
  W(e);
}
Gt.prototype.nodeType = Zi;
J(Gt, B);
function Tt(e) {
  W(e);
}
Tt.prototype.nodeType = Yr;
J(Tt, B);
function at(e) {
  W(e);
}
at.prototype.nodeName = "#document-fragment";
at.prototype.nodeType = de;
J(at, B);
function Ct(e) {
  W(e);
}
Ct.prototype.nodeType = jr;
J(Ct, B);
function iu() {
}
iu.prototype.serializeToString = function(e, t) {
  return nu.call(e, t);
};
B.prototype.toString = nu;
function nu(e) {
  var t = [], r = this.nodeType === et && this.documentElement || this, u = r.prefix, i = r.namespaceURI;
  if (i && u == null) {
    var u = r.lookupPrefix(i);
    if (u == null)
      var n = [
        { namespace: i, prefix: null }
        //{namespace:uri,prefix:''}
      ];
  }
  return Be(this, t, e, n), t.join("");
}
function nr(e, t, r) {
  var u = e.prefix || "", i = e.namespaceURI;
  if (!i || u === "xml" && i === oe.XML || i === oe.XMLNS)
    return !1;
  for (var n = r.length; n--; ) {
    var s = r[n];
    if (s.prefix === u)
      return s.namespace !== i;
  }
  return !0;
}
function _t(e, t, r) {
  e.push(" ", t, '="', r.replace(/[<>&"\t\n\r]/g, Zr), '"');
}
function Be(e, t, r, u) {
  u || (u = []);
  var i = e.nodeType === et ? e : e.ownerDocument, n = i.type === "html";
  if (r)
    if (e = r(e), e) {
      if (typeof e == "string") {
        t.push(e);
        return;
      }
    } else
      return;
  switch (e.nodeType) {
    case re:
      var s = e.attributes, a = s.length, x = e.firstChild, c = e.tagName, o = c;
      if (!n && !e.prefix && e.namespaceURI) {
        for (var l, h = 0; h < s.length; h++)
          if (s.item(h).name === "xmlns") {
            l = s.item(h).value;
            break;
          }
        if (!l)
          for (var D = u.length - 1; D >= 0; D--) {
            var f = u[D];
            if (f.prefix === "" && f.namespace === e.namespaceURI) {
              l = f.namespace;
              break;
            }
          }
        if (l !== e.namespaceURI)
          for (var D = u.length - 1; D >= 0; D--) {
            var f = u[D];
            if (f.namespace === e.namespaceURI) {
              f.prefix && (o = f.prefix + ":" + c);
              break;
            }
          }
      }
      t.push("<", o);
      for (var C = 0; C < a; C++) {
        var E = s.item(C);
        E.prefix == "xmlns" ? u.push({
          prefix: E.localName,
          namespace: E.value
        }) : E.nodeName == "xmlns" && u.push({ prefix: "", namespace: E.value });
      }
      for (var C = 0; C < a; C++) {
        var E = s.item(C);
        if (nr(E, n, u)) {
          var _ = E.prefix || "", T = E.namespaceURI;
          _t(t, _ ? "xmlns:" + _ : "xmlns", T), u.push({ prefix: _, namespace: T });
        }
        Be(E, t, r, u);
      }
      if (c === o && nr(e, n, u)) {
        var _ = e.prefix || "", T = e.namespaceURI;
        _t(t, _ ? "xmlns:" + _ : "xmlns", T), u.push({ prefix: _, namespace: T });
      }
      var z = !x;
      if (z && (n || e.namespaceURI === oe.HTML) && (z = ji(c)), z)
        t.push("/>");
      else {
        if (t.push(">"), n && Yi(c))
          for (; x; )
            x.data ? t.push(x.data) : Be(x, t, r, u.slice()), x = x.nextSibling;
        else
          for (; x; )
            Be(x, t, r, u.slice()), x = x.nextSibling;
        t.push("</", o, ">");
      }
      return;
    case et:
    case de:
      for (var x = e.firstChild; x; )
        Be(x, t, r, u.slice()), x = x.nextSibling;
      return;
    case Ie:
      return _t(t, e.name, e.value);
    case ht:
      return t.push(e.data.replace(/[<&>]/g, Zr));
    case zr:
      return t.push(le.CDATA_START, e.data, le.CDATA_END);
    case Xr:
      return t.push(le.COMMENT_START, e.data, le.COMMENT_END);
    case $r:
      var V = e.publicId, L = e.systemId;
      t.push(le.DOCTYPE_DECL_START, " ", e.name), V ? (t.push(" ", le.PUBLIC, " ", V), L && L !== "." && t.push(" ", L)) : L && L !== "." && t.push(" ", le.SYSTEM, " ", L), e.internalSubset && t.push(" [", e.internalSubset, "]"), t.push(">");
      return;
    case jr:
      return t.push("<?", e.target, " ", e.data, "?>");
    case Yr:
      return t.push("&", e.nodeName, ";");
    default:
      t.push("??", e.nodeName);
  }
}
function su(e, t, r) {
  var u;
  switch (t.nodeType) {
    case re:
      u = t.cloneNode(!1), u.ownerDocument = e;
    case de:
      break;
    case Ie:
      r = !0;
      break;
  }
  if (u || (u = t.cloneNode(!1)), u.ownerDocument = e, u.parentNode = null, r)
    for (var i = t.firstChild; i; )
      u.appendChild(su(e, i, r)), i = i.nextSibling;
  return u;
}
function Ft(e, t, r) {
  var u = new t.constructor(X);
  for (var i in t)
    if (Re(t, i)) {
      var n = t[i];
      typeof n != "object" && n != u[i] && (u[i] = n);
    }
  switch (t.childNodes && (u.childNodes = new ue()), u.ownerDocument = e, u.nodeType) {
    case re:
      var s = t.attributes, a = u.attributes = new Le(), c = s.length;
      a._ownerElement = u;
      for (var o = 0; o < c; o++)
        u.setAttributeNode(Ft(e, s.item(o), !0));
      break;
    case Ie:
      r = !0;
  }
  if (r)
    for (var l = t.firstChild; l; )
      u.appendChild(Ft(e, l, r)), l = l.nextSibling;
  return u;
}
function au(e, t, r) {
  e[t] = r;
}
try {
  if (Object.defineProperty) {
    let e = function(t) {
      switch (t.nodeType) {
        case re:
        case de:
          var r = [];
          for (t = t.firstChild; t; )
            t.nodeType !== 7 && t.nodeType !== 8 && r.push(e(t)), t = t.nextSibling;
          return r.join("");
        default:
          return t.nodeValue;
      }
    };
    Object.defineProperty(ge.prototype, "length", {
      get: function() {
        return Dt(this), this.$$length;
      }
    }), Object.defineProperty(B.prototype, "textContent", {
      get: function() {
        return e(this);
      },
      set: function(t) {
        switch (this.nodeType) {
          case re:
          case de:
            for (; this.firstChild; )
              this.removeChild(this.firstChild);
            (t || String(t)) && this.appendChild(this.ownerDocument.createTextNode(t));
            break;
          default:
            this.data = t, this.value = t, this.nodeValue = t;
        }
      }
    }), au = function(t, r, u) {
      t["$$" + r] = u;
    };
  }
} catch {
}
U._updateLiveList = Dt;
U.Attr = be;
U.CDATASection = At;
U.CharacterData = Ne;
U.Comment = Et;
U.Document = Te;
U.DocumentFragment = at;
U.DocumentType = gt;
U.DOMImplementation = Jr;
U.Element = Ce;
U.Entity = Gt;
U.EntityReference = Tt;
U.LiveNodeList = ge;
U.NamedNodeMap = Le;
U.Node = B;
U.NodeList = ue;
U.Notation = kt;
U.Text = vt;
U.XMLSerializer = iu;
U.ProcessingInstruction = Ct;
var qe = {}, ou = {};
(function(e) {
  var t = P.freeze;
  e.XML_ENTITIES = t({
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"'
  }), e.HTML_ENTITIES = t({
    Aacute: "Á",
    aacute: "á",
    Abreve: "Ă",
    abreve: "ă",
    ac: "∾",
    acd: "∿",
    acE: "∾̳",
    Acirc: "Â",
    acirc: "â",
    acute: "´",
    Acy: "А",
    acy: "а",
    AElig: "Æ",
    aelig: "æ",
    af: "⁡",
    Afr: "𝔄",
    afr: "𝔞",
    Agrave: "À",
    agrave: "à",
    alefsym: "ℵ",
    aleph: "ℵ",
    Alpha: "Α",
    alpha: "α",
    Amacr: "Ā",
    amacr: "ā",
    amalg: "⨿",
    AMP: "&",
    amp: "&",
    And: "⩓",
    and: "∧",
    andand: "⩕",
    andd: "⩜",
    andslope: "⩘",
    andv: "⩚",
    ang: "∠",
    ange: "⦤",
    angle: "∠",
    angmsd: "∡",
    angmsdaa: "⦨",
    angmsdab: "⦩",
    angmsdac: "⦪",
    angmsdad: "⦫",
    angmsdae: "⦬",
    angmsdaf: "⦭",
    angmsdag: "⦮",
    angmsdah: "⦯",
    angrt: "∟",
    angrtvb: "⊾",
    angrtvbd: "⦝",
    angsph: "∢",
    angst: "Å",
    angzarr: "⍼",
    Aogon: "Ą",
    aogon: "ą",
    Aopf: "𝔸",
    aopf: "𝕒",
    ap: "≈",
    apacir: "⩯",
    apE: "⩰",
    ape: "≊",
    apid: "≋",
    apos: "'",
    ApplyFunction: "⁡",
    approx: "≈",
    approxeq: "≊",
    Aring: "Å",
    aring: "å",
    Ascr: "𝒜",
    ascr: "𝒶",
    Assign: "≔",
    ast: "*",
    asymp: "≈",
    asympeq: "≍",
    Atilde: "Ã",
    atilde: "ã",
    Auml: "Ä",
    auml: "ä",
    awconint: "∳",
    awint: "⨑",
    backcong: "≌",
    backepsilon: "϶",
    backprime: "‵",
    backsim: "∽",
    backsimeq: "⋍",
    Backslash: "∖",
    Barv: "⫧",
    barvee: "⊽",
    Barwed: "⌆",
    barwed: "⌅",
    barwedge: "⌅",
    bbrk: "⎵",
    bbrktbrk: "⎶",
    bcong: "≌",
    Bcy: "Б",
    bcy: "б",
    bdquo: "„",
    becaus: "∵",
    Because: "∵",
    because: "∵",
    bemptyv: "⦰",
    bepsi: "϶",
    bernou: "ℬ",
    Bernoullis: "ℬ",
    Beta: "Β",
    beta: "β",
    beth: "ℶ",
    between: "≬",
    Bfr: "𝔅",
    bfr: "𝔟",
    bigcap: "⋂",
    bigcirc: "◯",
    bigcup: "⋃",
    bigodot: "⨀",
    bigoplus: "⨁",
    bigotimes: "⨂",
    bigsqcup: "⨆",
    bigstar: "★",
    bigtriangledown: "▽",
    bigtriangleup: "△",
    biguplus: "⨄",
    bigvee: "⋁",
    bigwedge: "⋀",
    bkarow: "⤍",
    blacklozenge: "⧫",
    blacksquare: "▪",
    blacktriangle: "▴",
    blacktriangledown: "▾",
    blacktriangleleft: "◂",
    blacktriangleright: "▸",
    blank: "␣",
    blk12: "▒",
    blk14: "░",
    blk34: "▓",
    block: "█",
    bne: "=⃥",
    bnequiv: "≡⃥",
    bNot: "⫭",
    bnot: "⌐",
    Bopf: "𝔹",
    bopf: "𝕓",
    bot: "⊥",
    bottom: "⊥",
    bowtie: "⋈",
    boxbox: "⧉",
    boxDL: "╗",
    boxDl: "╖",
    boxdL: "╕",
    boxdl: "┐",
    boxDR: "╔",
    boxDr: "╓",
    boxdR: "╒",
    boxdr: "┌",
    boxH: "═",
    boxh: "─",
    boxHD: "╦",
    boxHd: "╤",
    boxhD: "╥",
    boxhd: "┬",
    boxHU: "╩",
    boxHu: "╧",
    boxhU: "╨",
    boxhu: "┴",
    boxminus: "⊟",
    boxplus: "⊞",
    boxtimes: "⊠",
    boxUL: "╝",
    boxUl: "╜",
    boxuL: "╛",
    boxul: "┘",
    boxUR: "╚",
    boxUr: "╙",
    boxuR: "╘",
    boxur: "└",
    boxV: "║",
    boxv: "│",
    boxVH: "╬",
    boxVh: "╫",
    boxvH: "╪",
    boxvh: "┼",
    boxVL: "╣",
    boxVl: "╢",
    boxvL: "╡",
    boxvl: "┤",
    boxVR: "╠",
    boxVr: "╟",
    boxvR: "╞",
    boxvr: "├",
    bprime: "‵",
    Breve: "˘",
    breve: "˘",
    brvbar: "¦",
    Bscr: "ℬ",
    bscr: "𝒷",
    bsemi: "⁏",
    bsim: "∽",
    bsime: "⋍",
    bsol: "\\",
    bsolb: "⧅",
    bsolhsub: "⟈",
    bull: "•",
    bullet: "•",
    bump: "≎",
    bumpE: "⪮",
    bumpe: "≏",
    Bumpeq: "≎",
    bumpeq: "≏",
    Cacute: "Ć",
    cacute: "ć",
    Cap: "⋒",
    cap: "∩",
    capand: "⩄",
    capbrcup: "⩉",
    capcap: "⩋",
    capcup: "⩇",
    capdot: "⩀",
    CapitalDifferentialD: "ⅅ",
    caps: "∩︀",
    caret: "⁁",
    caron: "ˇ",
    Cayleys: "ℭ",
    ccaps: "⩍",
    Ccaron: "Č",
    ccaron: "č",
    Ccedil: "Ç",
    ccedil: "ç",
    Ccirc: "Ĉ",
    ccirc: "ĉ",
    Cconint: "∰",
    ccups: "⩌",
    ccupssm: "⩐",
    Cdot: "Ċ",
    cdot: "ċ",
    cedil: "¸",
    Cedilla: "¸",
    cemptyv: "⦲",
    cent: "¢",
    CenterDot: "·",
    centerdot: "·",
    Cfr: "ℭ",
    cfr: "𝔠",
    CHcy: "Ч",
    chcy: "ч",
    check: "✓",
    checkmark: "✓",
    Chi: "Χ",
    chi: "χ",
    cir: "○",
    circ: "ˆ",
    circeq: "≗",
    circlearrowleft: "↺",
    circlearrowright: "↻",
    circledast: "⊛",
    circledcirc: "⊚",
    circleddash: "⊝",
    CircleDot: "⊙",
    circledR: "®",
    circledS: "Ⓢ",
    CircleMinus: "⊖",
    CirclePlus: "⊕",
    CircleTimes: "⊗",
    cirE: "⧃",
    cire: "≗",
    cirfnint: "⨐",
    cirmid: "⫯",
    cirscir: "⧂",
    ClockwiseContourIntegral: "∲",
    CloseCurlyDoubleQuote: "”",
    CloseCurlyQuote: "’",
    clubs: "♣",
    clubsuit: "♣",
    Colon: "∷",
    colon: ":",
    Colone: "⩴",
    colone: "≔",
    coloneq: "≔",
    comma: ",",
    commat: "@",
    comp: "∁",
    compfn: "∘",
    complement: "∁",
    complexes: "ℂ",
    cong: "≅",
    congdot: "⩭",
    Congruent: "≡",
    Conint: "∯",
    conint: "∮",
    ContourIntegral: "∮",
    Copf: "ℂ",
    copf: "𝕔",
    coprod: "∐",
    Coproduct: "∐",
    COPY: "©",
    copy: "©",
    copysr: "℗",
    CounterClockwiseContourIntegral: "∳",
    crarr: "↵",
    Cross: "⨯",
    cross: "✗",
    Cscr: "𝒞",
    cscr: "𝒸",
    csub: "⫏",
    csube: "⫑",
    csup: "⫐",
    csupe: "⫒",
    ctdot: "⋯",
    cudarrl: "⤸",
    cudarrr: "⤵",
    cuepr: "⋞",
    cuesc: "⋟",
    cularr: "↶",
    cularrp: "⤽",
    Cup: "⋓",
    cup: "∪",
    cupbrcap: "⩈",
    CupCap: "≍",
    cupcap: "⩆",
    cupcup: "⩊",
    cupdot: "⊍",
    cupor: "⩅",
    cups: "∪︀",
    curarr: "↷",
    curarrm: "⤼",
    curlyeqprec: "⋞",
    curlyeqsucc: "⋟",
    curlyvee: "⋎",
    curlywedge: "⋏",
    curren: "¤",
    curvearrowleft: "↶",
    curvearrowright: "↷",
    cuvee: "⋎",
    cuwed: "⋏",
    cwconint: "∲",
    cwint: "∱",
    cylcty: "⌭",
    Dagger: "‡",
    dagger: "†",
    daleth: "ℸ",
    Darr: "↡",
    dArr: "⇓",
    darr: "↓",
    dash: "‐",
    Dashv: "⫤",
    dashv: "⊣",
    dbkarow: "⤏",
    dblac: "˝",
    Dcaron: "Ď",
    dcaron: "ď",
    Dcy: "Д",
    dcy: "д",
    DD: "ⅅ",
    dd: "ⅆ",
    ddagger: "‡",
    ddarr: "⇊",
    DDotrahd: "⤑",
    ddotseq: "⩷",
    deg: "°",
    Del: "∇",
    Delta: "Δ",
    delta: "δ",
    demptyv: "⦱",
    dfisht: "⥿",
    Dfr: "𝔇",
    dfr: "𝔡",
    dHar: "⥥",
    dharl: "⇃",
    dharr: "⇂",
    DiacriticalAcute: "´",
    DiacriticalDot: "˙",
    DiacriticalDoubleAcute: "˝",
    DiacriticalGrave: "`",
    DiacriticalTilde: "˜",
    diam: "⋄",
    Diamond: "⋄",
    diamond: "⋄",
    diamondsuit: "♦",
    diams: "♦",
    die: "¨",
    DifferentialD: "ⅆ",
    digamma: "ϝ",
    disin: "⋲",
    div: "÷",
    divide: "÷",
    divideontimes: "⋇",
    divonx: "⋇",
    DJcy: "Ђ",
    djcy: "ђ",
    dlcorn: "⌞",
    dlcrop: "⌍",
    dollar: "$",
    Dopf: "𝔻",
    dopf: "𝕕",
    Dot: "¨",
    dot: "˙",
    DotDot: "⃜",
    doteq: "≐",
    doteqdot: "≑",
    DotEqual: "≐",
    dotminus: "∸",
    dotplus: "∔",
    dotsquare: "⊡",
    doublebarwedge: "⌆",
    DoubleContourIntegral: "∯",
    DoubleDot: "¨",
    DoubleDownArrow: "⇓",
    DoubleLeftArrow: "⇐",
    DoubleLeftRightArrow: "⇔",
    DoubleLeftTee: "⫤",
    DoubleLongLeftArrow: "⟸",
    DoubleLongLeftRightArrow: "⟺",
    DoubleLongRightArrow: "⟹",
    DoubleRightArrow: "⇒",
    DoubleRightTee: "⊨",
    DoubleUpArrow: "⇑",
    DoubleUpDownArrow: "⇕",
    DoubleVerticalBar: "∥",
    DownArrow: "↓",
    Downarrow: "⇓",
    downarrow: "↓",
    DownArrowBar: "⤓",
    DownArrowUpArrow: "⇵",
    DownBreve: "̑",
    downdownarrows: "⇊",
    downharpoonleft: "⇃",
    downharpoonright: "⇂",
    DownLeftRightVector: "⥐",
    DownLeftTeeVector: "⥞",
    DownLeftVector: "↽",
    DownLeftVectorBar: "⥖",
    DownRightTeeVector: "⥟",
    DownRightVector: "⇁",
    DownRightVectorBar: "⥗",
    DownTee: "⊤",
    DownTeeArrow: "↧",
    drbkarow: "⤐",
    drcorn: "⌟",
    drcrop: "⌌",
    Dscr: "𝒟",
    dscr: "𝒹",
    DScy: "Ѕ",
    dscy: "ѕ",
    dsol: "⧶",
    Dstrok: "Đ",
    dstrok: "đ",
    dtdot: "⋱",
    dtri: "▿",
    dtrif: "▾",
    duarr: "⇵",
    duhar: "⥯",
    dwangle: "⦦",
    DZcy: "Џ",
    dzcy: "џ",
    dzigrarr: "⟿",
    Eacute: "É",
    eacute: "é",
    easter: "⩮",
    Ecaron: "Ě",
    ecaron: "ě",
    ecir: "≖",
    Ecirc: "Ê",
    ecirc: "ê",
    ecolon: "≕",
    Ecy: "Э",
    ecy: "э",
    eDDot: "⩷",
    Edot: "Ė",
    eDot: "≑",
    edot: "ė",
    ee: "ⅇ",
    efDot: "≒",
    Efr: "𝔈",
    efr: "𝔢",
    eg: "⪚",
    Egrave: "È",
    egrave: "è",
    egs: "⪖",
    egsdot: "⪘",
    el: "⪙",
    Element: "∈",
    elinters: "⏧",
    ell: "ℓ",
    els: "⪕",
    elsdot: "⪗",
    Emacr: "Ē",
    emacr: "ē",
    empty: "∅",
    emptyset: "∅",
    EmptySmallSquare: "◻",
    emptyv: "∅",
    EmptyVerySmallSquare: "▫",
    emsp: " ",
    emsp13: " ",
    emsp14: " ",
    ENG: "Ŋ",
    eng: "ŋ",
    ensp: " ",
    Eogon: "Ę",
    eogon: "ę",
    Eopf: "𝔼",
    eopf: "𝕖",
    epar: "⋕",
    eparsl: "⧣",
    eplus: "⩱",
    epsi: "ε",
    Epsilon: "Ε",
    epsilon: "ε",
    epsiv: "ϵ",
    eqcirc: "≖",
    eqcolon: "≕",
    eqsim: "≂",
    eqslantgtr: "⪖",
    eqslantless: "⪕",
    Equal: "⩵",
    equals: "=",
    EqualTilde: "≂",
    equest: "≟",
    Equilibrium: "⇌",
    equiv: "≡",
    equivDD: "⩸",
    eqvparsl: "⧥",
    erarr: "⥱",
    erDot: "≓",
    Escr: "ℰ",
    escr: "ℯ",
    esdot: "≐",
    Esim: "⩳",
    esim: "≂",
    Eta: "Η",
    eta: "η",
    ETH: "Ð",
    eth: "ð",
    Euml: "Ë",
    euml: "ë",
    euro: "€",
    excl: "!",
    exist: "∃",
    Exists: "∃",
    expectation: "ℰ",
    ExponentialE: "ⅇ",
    exponentiale: "ⅇ",
    fallingdotseq: "≒",
    Fcy: "Ф",
    fcy: "ф",
    female: "♀",
    ffilig: "ﬃ",
    fflig: "ﬀ",
    ffllig: "ﬄ",
    Ffr: "𝔉",
    ffr: "𝔣",
    filig: "ﬁ",
    FilledSmallSquare: "◼",
    FilledVerySmallSquare: "▪",
    fjlig: "fj",
    flat: "♭",
    fllig: "ﬂ",
    fltns: "▱",
    fnof: "ƒ",
    Fopf: "𝔽",
    fopf: "𝕗",
    ForAll: "∀",
    forall: "∀",
    fork: "⋔",
    forkv: "⫙",
    Fouriertrf: "ℱ",
    fpartint: "⨍",
    frac12: "½",
    frac13: "⅓",
    frac14: "¼",
    frac15: "⅕",
    frac16: "⅙",
    frac18: "⅛",
    frac23: "⅔",
    frac25: "⅖",
    frac34: "¾",
    frac35: "⅗",
    frac38: "⅜",
    frac45: "⅘",
    frac56: "⅚",
    frac58: "⅝",
    frac78: "⅞",
    frasl: "⁄",
    frown: "⌢",
    Fscr: "ℱ",
    fscr: "𝒻",
    gacute: "ǵ",
    Gamma: "Γ",
    gamma: "γ",
    Gammad: "Ϝ",
    gammad: "ϝ",
    gap: "⪆",
    Gbreve: "Ğ",
    gbreve: "ğ",
    Gcedil: "Ģ",
    Gcirc: "Ĝ",
    gcirc: "ĝ",
    Gcy: "Г",
    gcy: "г",
    Gdot: "Ġ",
    gdot: "ġ",
    gE: "≧",
    ge: "≥",
    gEl: "⪌",
    gel: "⋛",
    geq: "≥",
    geqq: "≧",
    geqslant: "⩾",
    ges: "⩾",
    gescc: "⪩",
    gesdot: "⪀",
    gesdoto: "⪂",
    gesdotol: "⪄",
    gesl: "⋛︀",
    gesles: "⪔",
    Gfr: "𝔊",
    gfr: "𝔤",
    Gg: "⋙",
    gg: "≫",
    ggg: "⋙",
    gimel: "ℷ",
    GJcy: "Ѓ",
    gjcy: "ѓ",
    gl: "≷",
    gla: "⪥",
    glE: "⪒",
    glj: "⪤",
    gnap: "⪊",
    gnapprox: "⪊",
    gnE: "≩",
    gne: "⪈",
    gneq: "⪈",
    gneqq: "≩",
    gnsim: "⋧",
    Gopf: "𝔾",
    gopf: "𝕘",
    grave: "`",
    GreaterEqual: "≥",
    GreaterEqualLess: "⋛",
    GreaterFullEqual: "≧",
    GreaterGreater: "⪢",
    GreaterLess: "≷",
    GreaterSlantEqual: "⩾",
    GreaterTilde: "≳",
    Gscr: "𝒢",
    gscr: "ℊ",
    gsim: "≳",
    gsime: "⪎",
    gsiml: "⪐",
    Gt: "≫",
    GT: ">",
    gt: ">",
    gtcc: "⪧",
    gtcir: "⩺",
    gtdot: "⋗",
    gtlPar: "⦕",
    gtquest: "⩼",
    gtrapprox: "⪆",
    gtrarr: "⥸",
    gtrdot: "⋗",
    gtreqless: "⋛",
    gtreqqless: "⪌",
    gtrless: "≷",
    gtrsim: "≳",
    gvertneqq: "≩︀",
    gvnE: "≩︀",
    Hacek: "ˇ",
    hairsp: " ",
    half: "½",
    hamilt: "ℋ",
    HARDcy: "Ъ",
    hardcy: "ъ",
    hArr: "⇔",
    harr: "↔",
    harrcir: "⥈",
    harrw: "↭",
    Hat: "^",
    hbar: "ℏ",
    Hcirc: "Ĥ",
    hcirc: "ĥ",
    hearts: "♥",
    heartsuit: "♥",
    hellip: "…",
    hercon: "⊹",
    Hfr: "ℌ",
    hfr: "𝔥",
    HilbertSpace: "ℋ",
    hksearow: "⤥",
    hkswarow: "⤦",
    hoarr: "⇿",
    homtht: "∻",
    hookleftarrow: "↩",
    hookrightarrow: "↪",
    Hopf: "ℍ",
    hopf: "𝕙",
    horbar: "―",
    HorizontalLine: "─",
    Hscr: "ℋ",
    hscr: "𝒽",
    hslash: "ℏ",
    Hstrok: "Ħ",
    hstrok: "ħ",
    HumpDownHump: "≎",
    HumpEqual: "≏",
    hybull: "⁃",
    hyphen: "‐",
    Iacute: "Í",
    iacute: "í",
    ic: "⁣",
    Icirc: "Î",
    icirc: "î",
    Icy: "И",
    icy: "и",
    Idot: "İ",
    IEcy: "Е",
    iecy: "е",
    iexcl: "¡",
    iff: "⇔",
    Ifr: "ℑ",
    ifr: "𝔦",
    Igrave: "Ì",
    igrave: "ì",
    ii: "ⅈ",
    iiiint: "⨌",
    iiint: "∭",
    iinfin: "⧜",
    iiota: "℩",
    IJlig: "Ĳ",
    ijlig: "ĳ",
    Im: "ℑ",
    Imacr: "Ī",
    imacr: "ī",
    image: "ℑ",
    ImaginaryI: "ⅈ",
    imagline: "ℐ",
    imagpart: "ℑ",
    imath: "ı",
    imof: "⊷",
    imped: "Ƶ",
    Implies: "⇒",
    in: "∈",
    incare: "℅",
    infin: "∞",
    infintie: "⧝",
    inodot: "ı",
    Int: "∬",
    int: "∫",
    intcal: "⊺",
    integers: "ℤ",
    Integral: "∫",
    intercal: "⊺",
    Intersection: "⋂",
    intlarhk: "⨗",
    intprod: "⨼",
    InvisibleComma: "⁣",
    InvisibleTimes: "⁢",
    IOcy: "Ё",
    iocy: "ё",
    Iogon: "Į",
    iogon: "į",
    Iopf: "𝕀",
    iopf: "𝕚",
    Iota: "Ι",
    iota: "ι",
    iprod: "⨼",
    iquest: "¿",
    Iscr: "ℐ",
    iscr: "𝒾",
    isin: "∈",
    isindot: "⋵",
    isinE: "⋹",
    isins: "⋴",
    isinsv: "⋳",
    isinv: "∈",
    it: "⁢",
    Itilde: "Ĩ",
    itilde: "ĩ",
    Iukcy: "І",
    iukcy: "і",
    Iuml: "Ï",
    iuml: "ï",
    Jcirc: "Ĵ",
    jcirc: "ĵ",
    Jcy: "Й",
    jcy: "й",
    Jfr: "𝔍",
    jfr: "𝔧",
    jmath: "ȷ",
    Jopf: "𝕁",
    jopf: "𝕛",
    Jscr: "𝒥",
    jscr: "𝒿",
    Jsercy: "Ј",
    jsercy: "ј",
    Jukcy: "Є",
    jukcy: "є",
    Kappa: "Κ",
    kappa: "κ",
    kappav: "ϰ",
    Kcedil: "Ķ",
    kcedil: "ķ",
    Kcy: "К",
    kcy: "к",
    Kfr: "𝔎",
    kfr: "𝔨",
    kgreen: "ĸ",
    KHcy: "Х",
    khcy: "х",
    KJcy: "Ќ",
    kjcy: "ќ",
    Kopf: "𝕂",
    kopf: "𝕜",
    Kscr: "𝒦",
    kscr: "𝓀",
    lAarr: "⇚",
    Lacute: "Ĺ",
    lacute: "ĺ",
    laemptyv: "⦴",
    lagran: "ℒ",
    Lambda: "Λ",
    lambda: "λ",
    Lang: "⟪",
    lang: "⟨",
    langd: "⦑",
    langle: "⟨",
    lap: "⪅",
    Laplacetrf: "ℒ",
    laquo: "«",
    Larr: "↞",
    lArr: "⇐",
    larr: "←",
    larrb: "⇤",
    larrbfs: "⤟",
    larrfs: "⤝",
    larrhk: "↩",
    larrlp: "↫",
    larrpl: "⤹",
    larrsim: "⥳",
    larrtl: "↢",
    lat: "⪫",
    lAtail: "⤛",
    latail: "⤙",
    late: "⪭",
    lates: "⪭︀",
    lBarr: "⤎",
    lbarr: "⤌",
    lbbrk: "❲",
    lbrace: "{",
    lbrack: "[",
    lbrke: "⦋",
    lbrksld: "⦏",
    lbrkslu: "⦍",
    Lcaron: "Ľ",
    lcaron: "ľ",
    Lcedil: "Ļ",
    lcedil: "ļ",
    lceil: "⌈",
    lcub: "{",
    Lcy: "Л",
    lcy: "л",
    ldca: "⤶",
    ldquo: "“",
    ldquor: "„",
    ldrdhar: "⥧",
    ldrushar: "⥋",
    ldsh: "↲",
    lE: "≦",
    le: "≤",
    LeftAngleBracket: "⟨",
    LeftArrow: "←",
    Leftarrow: "⇐",
    leftarrow: "←",
    LeftArrowBar: "⇤",
    LeftArrowRightArrow: "⇆",
    leftarrowtail: "↢",
    LeftCeiling: "⌈",
    LeftDoubleBracket: "⟦",
    LeftDownTeeVector: "⥡",
    LeftDownVector: "⇃",
    LeftDownVectorBar: "⥙",
    LeftFloor: "⌊",
    leftharpoondown: "↽",
    leftharpoonup: "↼",
    leftleftarrows: "⇇",
    LeftRightArrow: "↔",
    Leftrightarrow: "⇔",
    leftrightarrow: "↔",
    leftrightarrows: "⇆",
    leftrightharpoons: "⇋",
    leftrightsquigarrow: "↭",
    LeftRightVector: "⥎",
    LeftTee: "⊣",
    LeftTeeArrow: "↤",
    LeftTeeVector: "⥚",
    leftthreetimes: "⋋",
    LeftTriangle: "⊲",
    LeftTriangleBar: "⧏",
    LeftTriangleEqual: "⊴",
    LeftUpDownVector: "⥑",
    LeftUpTeeVector: "⥠",
    LeftUpVector: "↿",
    LeftUpVectorBar: "⥘",
    LeftVector: "↼",
    LeftVectorBar: "⥒",
    lEg: "⪋",
    leg: "⋚",
    leq: "≤",
    leqq: "≦",
    leqslant: "⩽",
    les: "⩽",
    lescc: "⪨",
    lesdot: "⩿",
    lesdoto: "⪁",
    lesdotor: "⪃",
    lesg: "⋚︀",
    lesges: "⪓",
    lessapprox: "⪅",
    lessdot: "⋖",
    lesseqgtr: "⋚",
    lesseqqgtr: "⪋",
    LessEqualGreater: "⋚",
    LessFullEqual: "≦",
    LessGreater: "≶",
    lessgtr: "≶",
    LessLess: "⪡",
    lesssim: "≲",
    LessSlantEqual: "⩽",
    LessTilde: "≲",
    lfisht: "⥼",
    lfloor: "⌊",
    Lfr: "𝔏",
    lfr: "𝔩",
    lg: "≶",
    lgE: "⪑",
    lHar: "⥢",
    lhard: "↽",
    lharu: "↼",
    lharul: "⥪",
    lhblk: "▄",
    LJcy: "Љ",
    ljcy: "љ",
    Ll: "⋘",
    ll: "≪",
    llarr: "⇇",
    llcorner: "⌞",
    Lleftarrow: "⇚",
    llhard: "⥫",
    lltri: "◺",
    Lmidot: "Ŀ",
    lmidot: "ŀ",
    lmoust: "⎰",
    lmoustache: "⎰",
    lnap: "⪉",
    lnapprox: "⪉",
    lnE: "≨",
    lne: "⪇",
    lneq: "⪇",
    lneqq: "≨",
    lnsim: "⋦",
    loang: "⟬",
    loarr: "⇽",
    lobrk: "⟦",
    LongLeftArrow: "⟵",
    Longleftarrow: "⟸",
    longleftarrow: "⟵",
    LongLeftRightArrow: "⟷",
    Longleftrightarrow: "⟺",
    longleftrightarrow: "⟷",
    longmapsto: "⟼",
    LongRightArrow: "⟶",
    Longrightarrow: "⟹",
    longrightarrow: "⟶",
    looparrowleft: "↫",
    looparrowright: "↬",
    lopar: "⦅",
    Lopf: "𝕃",
    lopf: "𝕝",
    loplus: "⨭",
    lotimes: "⨴",
    lowast: "∗",
    lowbar: "_",
    LowerLeftArrow: "↙",
    LowerRightArrow: "↘",
    loz: "◊",
    lozenge: "◊",
    lozf: "⧫",
    lpar: "(",
    lparlt: "⦓",
    lrarr: "⇆",
    lrcorner: "⌟",
    lrhar: "⇋",
    lrhard: "⥭",
    lrm: "‎",
    lrtri: "⊿",
    lsaquo: "‹",
    Lscr: "ℒ",
    lscr: "𝓁",
    Lsh: "↰",
    lsh: "↰",
    lsim: "≲",
    lsime: "⪍",
    lsimg: "⪏",
    lsqb: "[",
    lsquo: "‘",
    lsquor: "‚",
    Lstrok: "Ł",
    lstrok: "ł",
    Lt: "≪",
    LT: "<",
    lt: "<",
    ltcc: "⪦",
    ltcir: "⩹",
    ltdot: "⋖",
    lthree: "⋋",
    ltimes: "⋉",
    ltlarr: "⥶",
    ltquest: "⩻",
    ltri: "◃",
    ltrie: "⊴",
    ltrif: "◂",
    ltrPar: "⦖",
    lurdshar: "⥊",
    luruhar: "⥦",
    lvertneqq: "≨︀",
    lvnE: "≨︀",
    macr: "¯",
    male: "♂",
    malt: "✠",
    maltese: "✠",
    Map: "⤅",
    map: "↦",
    mapsto: "↦",
    mapstodown: "↧",
    mapstoleft: "↤",
    mapstoup: "↥",
    marker: "▮",
    mcomma: "⨩",
    Mcy: "М",
    mcy: "м",
    mdash: "—",
    mDDot: "∺",
    measuredangle: "∡",
    MediumSpace: " ",
    Mellintrf: "ℳ",
    Mfr: "𝔐",
    mfr: "𝔪",
    mho: "℧",
    micro: "µ",
    mid: "∣",
    midast: "*",
    midcir: "⫰",
    middot: "·",
    minus: "−",
    minusb: "⊟",
    minusd: "∸",
    minusdu: "⨪",
    MinusPlus: "∓",
    mlcp: "⫛",
    mldr: "…",
    mnplus: "∓",
    models: "⊧",
    Mopf: "𝕄",
    mopf: "𝕞",
    mp: "∓",
    Mscr: "ℳ",
    mscr: "𝓂",
    mstpos: "∾",
    Mu: "Μ",
    mu: "μ",
    multimap: "⊸",
    mumap: "⊸",
    nabla: "∇",
    Nacute: "Ń",
    nacute: "ń",
    nang: "∠⃒",
    nap: "≉",
    napE: "⩰̸",
    napid: "≋̸",
    napos: "ŉ",
    napprox: "≉",
    natur: "♮",
    natural: "♮",
    naturals: "ℕ",
    nbsp: " ",
    nbump: "≎̸",
    nbumpe: "≏̸",
    ncap: "⩃",
    Ncaron: "Ň",
    ncaron: "ň",
    Ncedil: "Ņ",
    ncedil: "ņ",
    ncong: "≇",
    ncongdot: "⩭̸",
    ncup: "⩂",
    Ncy: "Н",
    ncy: "н",
    ndash: "–",
    ne: "≠",
    nearhk: "⤤",
    neArr: "⇗",
    nearr: "↗",
    nearrow: "↗",
    nedot: "≐̸",
    NegativeMediumSpace: "​",
    NegativeThickSpace: "​",
    NegativeThinSpace: "​",
    NegativeVeryThinSpace: "​",
    nequiv: "≢",
    nesear: "⤨",
    nesim: "≂̸",
    NestedGreaterGreater: "≫",
    NestedLessLess: "≪",
    NewLine: `
`,
    nexist: "∄",
    nexists: "∄",
    Nfr: "𝔑",
    nfr: "𝔫",
    ngE: "≧̸",
    nge: "≱",
    ngeq: "≱",
    ngeqq: "≧̸",
    ngeqslant: "⩾̸",
    nges: "⩾̸",
    nGg: "⋙̸",
    ngsim: "≵",
    nGt: "≫⃒",
    ngt: "≯",
    ngtr: "≯",
    nGtv: "≫̸",
    nhArr: "⇎",
    nharr: "↮",
    nhpar: "⫲",
    ni: "∋",
    nis: "⋼",
    nisd: "⋺",
    niv: "∋",
    NJcy: "Њ",
    njcy: "њ",
    nlArr: "⇍",
    nlarr: "↚",
    nldr: "‥",
    nlE: "≦̸",
    nle: "≰",
    nLeftarrow: "⇍",
    nleftarrow: "↚",
    nLeftrightarrow: "⇎",
    nleftrightarrow: "↮",
    nleq: "≰",
    nleqq: "≦̸",
    nleqslant: "⩽̸",
    nles: "⩽̸",
    nless: "≮",
    nLl: "⋘̸",
    nlsim: "≴",
    nLt: "≪⃒",
    nlt: "≮",
    nltri: "⋪",
    nltrie: "⋬",
    nLtv: "≪̸",
    nmid: "∤",
    NoBreak: "⁠",
    NonBreakingSpace: " ",
    Nopf: "ℕ",
    nopf: "𝕟",
    Not: "⫬",
    not: "¬",
    NotCongruent: "≢",
    NotCupCap: "≭",
    NotDoubleVerticalBar: "∦",
    NotElement: "∉",
    NotEqual: "≠",
    NotEqualTilde: "≂̸",
    NotExists: "∄",
    NotGreater: "≯",
    NotGreaterEqual: "≱",
    NotGreaterFullEqual: "≧̸",
    NotGreaterGreater: "≫̸",
    NotGreaterLess: "≹",
    NotGreaterSlantEqual: "⩾̸",
    NotGreaterTilde: "≵",
    NotHumpDownHump: "≎̸",
    NotHumpEqual: "≏̸",
    notin: "∉",
    notindot: "⋵̸",
    notinE: "⋹̸",
    notinva: "∉",
    notinvb: "⋷",
    notinvc: "⋶",
    NotLeftTriangle: "⋪",
    NotLeftTriangleBar: "⧏̸",
    NotLeftTriangleEqual: "⋬",
    NotLess: "≮",
    NotLessEqual: "≰",
    NotLessGreater: "≸",
    NotLessLess: "≪̸",
    NotLessSlantEqual: "⩽̸",
    NotLessTilde: "≴",
    NotNestedGreaterGreater: "⪢̸",
    NotNestedLessLess: "⪡̸",
    notni: "∌",
    notniva: "∌",
    notnivb: "⋾",
    notnivc: "⋽",
    NotPrecedes: "⊀",
    NotPrecedesEqual: "⪯̸",
    NotPrecedesSlantEqual: "⋠",
    NotReverseElement: "∌",
    NotRightTriangle: "⋫",
    NotRightTriangleBar: "⧐̸",
    NotRightTriangleEqual: "⋭",
    NotSquareSubset: "⊏̸",
    NotSquareSubsetEqual: "⋢",
    NotSquareSuperset: "⊐̸",
    NotSquareSupersetEqual: "⋣",
    NotSubset: "⊂⃒",
    NotSubsetEqual: "⊈",
    NotSucceeds: "⊁",
    NotSucceedsEqual: "⪰̸",
    NotSucceedsSlantEqual: "⋡",
    NotSucceedsTilde: "≿̸",
    NotSuperset: "⊃⃒",
    NotSupersetEqual: "⊉",
    NotTilde: "≁",
    NotTildeEqual: "≄",
    NotTildeFullEqual: "≇",
    NotTildeTilde: "≉",
    NotVerticalBar: "∤",
    npar: "∦",
    nparallel: "∦",
    nparsl: "⫽⃥",
    npart: "∂̸",
    npolint: "⨔",
    npr: "⊀",
    nprcue: "⋠",
    npre: "⪯̸",
    nprec: "⊀",
    npreceq: "⪯̸",
    nrArr: "⇏",
    nrarr: "↛",
    nrarrc: "⤳̸",
    nrarrw: "↝̸",
    nRightarrow: "⇏",
    nrightarrow: "↛",
    nrtri: "⋫",
    nrtrie: "⋭",
    nsc: "⊁",
    nsccue: "⋡",
    nsce: "⪰̸",
    Nscr: "𝒩",
    nscr: "𝓃",
    nshortmid: "∤",
    nshortparallel: "∦",
    nsim: "≁",
    nsime: "≄",
    nsimeq: "≄",
    nsmid: "∤",
    nspar: "∦",
    nsqsube: "⋢",
    nsqsupe: "⋣",
    nsub: "⊄",
    nsubE: "⫅̸",
    nsube: "⊈",
    nsubset: "⊂⃒",
    nsubseteq: "⊈",
    nsubseteqq: "⫅̸",
    nsucc: "⊁",
    nsucceq: "⪰̸",
    nsup: "⊅",
    nsupE: "⫆̸",
    nsupe: "⊉",
    nsupset: "⊃⃒",
    nsupseteq: "⊉",
    nsupseteqq: "⫆̸",
    ntgl: "≹",
    Ntilde: "Ñ",
    ntilde: "ñ",
    ntlg: "≸",
    ntriangleleft: "⋪",
    ntrianglelefteq: "⋬",
    ntriangleright: "⋫",
    ntrianglerighteq: "⋭",
    Nu: "Ν",
    nu: "ν",
    num: "#",
    numero: "№",
    numsp: " ",
    nvap: "≍⃒",
    nVDash: "⊯",
    nVdash: "⊮",
    nvDash: "⊭",
    nvdash: "⊬",
    nvge: "≥⃒",
    nvgt: ">⃒",
    nvHarr: "⤄",
    nvinfin: "⧞",
    nvlArr: "⤂",
    nvle: "≤⃒",
    nvlt: "<⃒",
    nvltrie: "⊴⃒",
    nvrArr: "⤃",
    nvrtrie: "⊵⃒",
    nvsim: "∼⃒",
    nwarhk: "⤣",
    nwArr: "⇖",
    nwarr: "↖",
    nwarrow: "↖",
    nwnear: "⤧",
    Oacute: "Ó",
    oacute: "ó",
    oast: "⊛",
    ocir: "⊚",
    Ocirc: "Ô",
    ocirc: "ô",
    Ocy: "О",
    ocy: "о",
    odash: "⊝",
    Odblac: "Ő",
    odblac: "ő",
    odiv: "⨸",
    odot: "⊙",
    odsold: "⦼",
    OElig: "Œ",
    oelig: "œ",
    ofcir: "⦿",
    Ofr: "𝔒",
    ofr: "𝔬",
    ogon: "˛",
    Ograve: "Ò",
    ograve: "ò",
    ogt: "⧁",
    ohbar: "⦵",
    ohm: "Ω",
    oint: "∮",
    olarr: "↺",
    olcir: "⦾",
    olcross: "⦻",
    oline: "‾",
    olt: "⧀",
    Omacr: "Ō",
    omacr: "ō",
    Omega: "Ω",
    omega: "ω",
    Omicron: "Ο",
    omicron: "ο",
    omid: "⦶",
    ominus: "⊖",
    Oopf: "𝕆",
    oopf: "𝕠",
    opar: "⦷",
    OpenCurlyDoubleQuote: "“",
    OpenCurlyQuote: "‘",
    operp: "⦹",
    oplus: "⊕",
    Or: "⩔",
    or: "∨",
    orarr: "↻",
    ord: "⩝",
    order: "ℴ",
    orderof: "ℴ",
    ordf: "ª",
    ordm: "º",
    origof: "⊶",
    oror: "⩖",
    orslope: "⩗",
    orv: "⩛",
    oS: "Ⓢ",
    Oscr: "𝒪",
    oscr: "ℴ",
    Oslash: "Ø",
    oslash: "ø",
    osol: "⊘",
    Otilde: "Õ",
    otilde: "õ",
    Otimes: "⨷",
    otimes: "⊗",
    otimesas: "⨶",
    Ouml: "Ö",
    ouml: "ö",
    ovbar: "⌽",
    OverBar: "‾",
    OverBrace: "⏞",
    OverBracket: "⎴",
    OverParenthesis: "⏜",
    par: "∥",
    para: "¶",
    parallel: "∥",
    parsim: "⫳",
    parsl: "⫽",
    part: "∂",
    PartialD: "∂",
    Pcy: "П",
    pcy: "п",
    percnt: "%",
    period: ".",
    permil: "‰",
    perp: "⊥",
    pertenk: "‱",
    Pfr: "𝔓",
    pfr: "𝔭",
    Phi: "Φ",
    phi: "φ",
    phiv: "ϕ",
    phmmat: "ℳ",
    phone: "☎",
    Pi: "Π",
    pi: "π",
    pitchfork: "⋔",
    piv: "ϖ",
    planck: "ℏ",
    planckh: "ℎ",
    plankv: "ℏ",
    plus: "+",
    plusacir: "⨣",
    plusb: "⊞",
    pluscir: "⨢",
    plusdo: "∔",
    plusdu: "⨥",
    pluse: "⩲",
    PlusMinus: "±",
    plusmn: "±",
    plussim: "⨦",
    plustwo: "⨧",
    pm: "±",
    Poincareplane: "ℌ",
    pointint: "⨕",
    Popf: "ℙ",
    popf: "𝕡",
    pound: "£",
    Pr: "⪻",
    pr: "≺",
    prap: "⪷",
    prcue: "≼",
    prE: "⪳",
    pre: "⪯",
    prec: "≺",
    precapprox: "⪷",
    preccurlyeq: "≼",
    Precedes: "≺",
    PrecedesEqual: "⪯",
    PrecedesSlantEqual: "≼",
    PrecedesTilde: "≾",
    preceq: "⪯",
    precnapprox: "⪹",
    precneqq: "⪵",
    precnsim: "⋨",
    precsim: "≾",
    Prime: "″",
    prime: "′",
    primes: "ℙ",
    prnap: "⪹",
    prnE: "⪵",
    prnsim: "⋨",
    prod: "∏",
    Product: "∏",
    profalar: "⌮",
    profline: "⌒",
    profsurf: "⌓",
    prop: "∝",
    Proportion: "∷",
    Proportional: "∝",
    propto: "∝",
    prsim: "≾",
    prurel: "⊰",
    Pscr: "𝒫",
    pscr: "𝓅",
    Psi: "Ψ",
    psi: "ψ",
    puncsp: " ",
    Qfr: "𝔔",
    qfr: "𝔮",
    qint: "⨌",
    Qopf: "ℚ",
    qopf: "𝕢",
    qprime: "⁗",
    Qscr: "𝒬",
    qscr: "𝓆",
    quaternions: "ℍ",
    quatint: "⨖",
    quest: "?",
    questeq: "≟",
    QUOT: '"',
    quot: '"',
    rAarr: "⇛",
    race: "∽̱",
    Racute: "Ŕ",
    racute: "ŕ",
    radic: "√",
    raemptyv: "⦳",
    Rang: "⟫",
    rang: "⟩",
    rangd: "⦒",
    range: "⦥",
    rangle: "⟩",
    raquo: "»",
    Rarr: "↠",
    rArr: "⇒",
    rarr: "→",
    rarrap: "⥵",
    rarrb: "⇥",
    rarrbfs: "⤠",
    rarrc: "⤳",
    rarrfs: "⤞",
    rarrhk: "↪",
    rarrlp: "↬",
    rarrpl: "⥅",
    rarrsim: "⥴",
    Rarrtl: "⤖",
    rarrtl: "↣",
    rarrw: "↝",
    rAtail: "⤜",
    ratail: "⤚",
    ratio: "∶",
    rationals: "ℚ",
    RBarr: "⤐",
    rBarr: "⤏",
    rbarr: "⤍",
    rbbrk: "❳",
    rbrace: "}",
    rbrack: "]",
    rbrke: "⦌",
    rbrksld: "⦎",
    rbrkslu: "⦐",
    Rcaron: "Ř",
    rcaron: "ř",
    Rcedil: "Ŗ",
    rcedil: "ŗ",
    rceil: "⌉",
    rcub: "}",
    Rcy: "Р",
    rcy: "р",
    rdca: "⤷",
    rdldhar: "⥩",
    rdquo: "”",
    rdquor: "”",
    rdsh: "↳",
    Re: "ℜ",
    real: "ℜ",
    realine: "ℛ",
    realpart: "ℜ",
    reals: "ℝ",
    rect: "▭",
    REG: "®",
    reg: "®",
    ReverseElement: "∋",
    ReverseEquilibrium: "⇋",
    ReverseUpEquilibrium: "⥯",
    rfisht: "⥽",
    rfloor: "⌋",
    Rfr: "ℜ",
    rfr: "𝔯",
    rHar: "⥤",
    rhard: "⇁",
    rharu: "⇀",
    rharul: "⥬",
    Rho: "Ρ",
    rho: "ρ",
    rhov: "ϱ",
    RightAngleBracket: "⟩",
    RightArrow: "→",
    Rightarrow: "⇒",
    rightarrow: "→",
    RightArrowBar: "⇥",
    RightArrowLeftArrow: "⇄",
    rightarrowtail: "↣",
    RightCeiling: "⌉",
    RightDoubleBracket: "⟧",
    RightDownTeeVector: "⥝",
    RightDownVector: "⇂",
    RightDownVectorBar: "⥕",
    RightFloor: "⌋",
    rightharpoondown: "⇁",
    rightharpoonup: "⇀",
    rightleftarrows: "⇄",
    rightleftharpoons: "⇌",
    rightrightarrows: "⇉",
    rightsquigarrow: "↝",
    RightTee: "⊢",
    RightTeeArrow: "↦",
    RightTeeVector: "⥛",
    rightthreetimes: "⋌",
    RightTriangle: "⊳",
    RightTriangleBar: "⧐",
    RightTriangleEqual: "⊵",
    RightUpDownVector: "⥏",
    RightUpTeeVector: "⥜",
    RightUpVector: "↾",
    RightUpVectorBar: "⥔",
    RightVector: "⇀",
    RightVectorBar: "⥓",
    ring: "˚",
    risingdotseq: "≓",
    rlarr: "⇄",
    rlhar: "⇌",
    rlm: "‏",
    rmoust: "⎱",
    rmoustache: "⎱",
    rnmid: "⫮",
    roang: "⟭",
    roarr: "⇾",
    robrk: "⟧",
    ropar: "⦆",
    Ropf: "ℝ",
    ropf: "𝕣",
    roplus: "⨮",
    rotimes: "⨵",
    RoundImplies: "⥰",
    rpar: ")",
    rpargt: "⦔",
    rppolint: "⨒",
    rrarr: "⇉",
    Rrightarrow: "⇛",
    rsaquo: "›",
    Rscr: "ℛ",
    rscr: "𝓇",
    Rsh: "↱",
    rsh: "↱",
    rsqb: "]",
    rsquo: "’",
    rsquor: "’",
    rthree: "⋌",
    rtimes: "⋊",
    rtri: "▹",
    rtrie: "⊵",
    rtrif: "▸",
    rtriltri: "⧎",
    RuleDelayed: "⧴",
    ruluhar: "⥨",
    rx: "℞",
    Sacute: "Ś",
    sacute: "ś",
    sbquo: "‚",
    Sc: "⪼",
    sc: "≻",
    scap: "⪸",
    Scaron: "Š",
    scaron: "š",
    sccue: "≽",
    scE: "⪴",
    sce: "⪰",
    Scedil: "Ş",
    scedil: "ş",
    Scirc: "Ŝ",
    scirc: "ŝ",
    scnap: "⪺",
    scnE: "⪶",
    scnsim: "⋩",
    scpolint: "⨓",
    scsim: "≿",
    Scy: "С",
    scy: "с",
    sdot: "⋅",
    sdotb: "⊡",
    sdote: "⩦",
    searhk: "⤥",
    seArr: "⇘",
    searr: "↘",
    searrow: "↘",
    sect: "§",
    semi: ";",
    seswar: "⤩",
    setminus: "∖",
    setmn: "∖",
    sext: "✶",
    Sfr: "𝔖",
    sfr: "𝔰",
    sfrown: "⌢",
    sharp: "♯",
    SHCHcy: "Щ",
    shchcy: "щ",
    SHcy: "Ш",
    shcy: "ш",
    ShortDownArrow: "↓",
    ShortLeftArrow: "←",
    shortmid: "∣",
    shortparallel: "∥",
    ShortRightArrow: "→",
    ShortUpArrow: "↑",
    shy: "­",
    Sigma: "Σ",
    sigma: "σ",
    sigmaf: "ς",
    sigmav: "ς",
    sim: "∼",
    simdot: "⩪",
    sime: "≃",
    simeq: "≃",
    simg: "⪞",
    simgE: "⪠",
    siml: "⪝",
    simlE: "⪟",
    simne: "≆",
    simplus: "⨤",
    simrarr: "⥲",
    slarr: "←",
    SmallCircle: "∘",
    smallsetminus: "∖",
    smashp: "⨳",
    smeparsl: "⧤",
    smid: "∣",
    smile: "⌣",
    smt: "⪪",
    smte: "⪬",
    smtes: "⪬︀",
    SOFTcy: "Ь",
    softcy: "ь",
    sol: "/",
    solb: "⧄",
    solbar: "⌿",
    Sopf: "𝕊",
    sopf: "𝕤",
    spades: "♠",
    spadesuit: "♠",
    spar: "∥",
    sqcap: "⊓",
    sqcaps: "⊓︀",
    sqcup: "⊔",
    sqcups: "⊔︀",
    Sqrt: "√",
    sqsub: "⊏",
    sqsube: "⊑",
    sqsubset: "⊏",
    sqsubseteq: "⊑",
    sqsup: "⊐",
    sqsupe: "⊒",
    sqsupset: "⊐",
    sqsupseteq: "⊒",
    squ: "□",
    Square: "□",
    square: "□",
    SquareIntersection: "⊓",
    SquareSubset: "⊏",
    SquareSubsetEqual: "⊑",
    SquareSuperset: "⊐",
    SquareSupersetEqual: "⊒",
    SquareUnion: "⊔",
    squarf: "▪",
    squf: "▪",
    srarr: "→",
    Sscr: "𝒮",
    sscr: "𝓈",
    ssetmn: "∖",
    ssmile: "⌣",
    sstarf: "⋆",
    Star: "⋆",
    star: "☆",
    starf: "★",
    straightepsilon: "ϵ",
    straightphi: "ϕ",
    strns: "¯",
    Sub: "⋐",
    sub: "⊂",
    subdot: "⪽",
    subE: "⫅",
    sube: "⊆",
    subedot: "⫃",
    submult: "⫁",
    subnE: "⫋",
    subne: "⊊",
    subplus: "⪿",
    subrarr: "⥹",
    Subset: "⋐",
    subset: "⊂",
    subseteq: "⊆",
    subseteqq: "⫅",
    SubsetEqual: "⊆",
    subsetneq: "⊊",
    subsetneqq: "⫋",
    subsim: "⫇",
    subsub: "⫕",
    subsup: "⫓",
    succ: "≻",
    succapprox: "⪸",
    succcurlyeq: "≽",
    Succeeds: "≻",
    SucceedsEqual: "⪰",
    SucceedsSlantEqual: "≽",
    SucceedsTilde: "≿",
    succeq: "⪰",
    succnapprox: "⪺",
    succneqq: "⪶",
    succnsim: "⋩",
    succsim: "≿",
    SuchThat: "∋",
    Sum: "∑",
    sum: "∑",
    sung: "♪",
    Sup: "⋑",
    sup: "⊃",
    sup1: "¹",
    sup2: "²",
    sup3: "³",
    supdot: "⪾",
    supdsub: "⫘",
    supE: "⫆",
    supe: "⊇",
    supedot: "⫄",
    Superset: "⊃",
    SupersetEqual: "⊇",
    suphsol: "⟉",
    suphsub: "⫗",
    suplarr: "⥻",
    supmult: "⫂",
    supnE: "⫌",
    supne: "⊋",
    supplus: "⫀",
    Supset: "⋑",
    supset: "⊃",
    supseteq: "⊇",
    supseteqq: "⫆",
    supsetneq: "⊋",
    supsetneqq: "⫌",
    supsim: "⫈",
    supsub: "⫔",
    supsup: "⫖",
    swarhk: "⤦",
    swArr: "⇙",
    swarr: "↙",
    swarrow: "↙",
    swnwar: "⤪",
    szlig: "ß",
    Tab: "	",
    target: "⌖",
    Tau: "Τ",
    tau: "τ",
    tbrk: "⎴",
    Tcaron: "Ť",
    tcaron: "ť",
    Tcedil: "Ţ",
    tcedil: "ţ",
    Tcy: "Т",
    tcy: "т",
    tdot: "⃛",
    telrec: "⌕",
    Tfr: "𝔗",
    tfr: "𝔱",
    there4: "∴",
    Therefore: "∴",
    therefore: "∴",
    Theta: "Θ",
    theta: "θ",
    thetasym: "ϑ",
    thetav: "ϑ",
    thickapprox: "≈",
    thicksim: "∼",
    ThickSpace: "  ",
    thinsp: " ",
    ThinSpace: " ",
    thkap: "≈",
    thksim: "∼",
    THORN: "Þ",
    thorn: "þ",
    Tilde: "∼",
    tilde: "˜",
    TildeEqual: "≃",
    TildeFullEqual: "≅",
    TildeTilde: "≈",
    times: "×",
    timesb: "⊠",
    timesbar: "⨱",
    timesd: "⨰",
    tint: "∭",
    toea: "⤨",
    top: "⊤",
    topbot: "⌶",
    topcir: "⫱",
    Topf: "𝕋",
    topf: "𝕥",
    topfork: "⫚",
    tosa: "⤩",
    tprime: "‴",
    TRADE: "™",
    trade: "™",
    triangle: "▵",
    triangledown: "▿",
    triangleleft: "◃",
    trianglelefteq: "⊴",
    triangleq: "≜",
    triangleright: "▹",
    trianglerighteq: "⊵",
    tridot: "◬",
    trie: "≜",
    triminus: "⨺",
    TripleDot: "⃛",
    triplus: "⨹",
    trisb: "⧍",
    tritime: "⨻",
    trpezium: "⏢",
    Tscr: "𝒯",
    tscr: "𝓉",
    TScy: "Ц",
    tscy: "ц",
    TSHcy: "Ћ",
    tshcy: "ћ",
    Tstrok: "Ŧ",
    tstrok: "ŧ",
    twixt: "≬",
    twoheadleftarrow: "↞",
    twoheadrightarrow: "↠",
    Uacute: "Ú",
    uacute: "ú",
    Uarr: "↟",
    uArr: "⇑",
    uarr: "↑",
    Uarrocir: "⥉",
    Ubrcy: "Ў",
    ubrcy: "ў",
    Ubreve: "Ŭ",
    ubreve: "ŭ",
    Ucirc: "Û",
    ucirc: "û",
    Ucy: "У",
    ucy: "у",
    udarr: "⇅",
    Udblac: "Ű",
    udblac: "ű",
    udhar: "⥮",
    ufisht: "⥾",
    Ufr: "𝔘",
    ufr: "𝔲",
    Ugrave: "Ù",
    ugrave: "ù",
    uHar: "⥣",
    uharl: "↿",
    uharr: "↾",
    uhblk: "▀",
    ulcorn: "⌜",
    ulcorner: "⌜",
    ulcrop: "⌏",
    ultri: "◸",
    Umacr: "Ū",
    umacr: "ū",
    uml: "¨",
    UnderBar: "_",
    UnderBrace: "⏟",
    UnderBracket: "⎵",
    UnderParenthesis: "⏝",
    Union: "⋃",
    UnionPlus: "⊎",
    Uogon: "Ų",
    uogon: "ų",
    Uopf: "𝕌",
    uopf: "𝕦",
    UpArrow: "↑",
    Uparrow: "⇑",
    uparrow: "↑",
    UpArrowBar: "⤒",
    UpArrowDownArrow: "⇅",
    UpDownArrow: "↕",
    Updownarrow: "⇕",
    updownarrow: "↕",
    UpEquilibrium: "⥮",
    upharpoonleft: "↿",
    upharpoonright: "↾",
    uplus: "⊎",
    UpperLeftArrow: "↖",
    UpperRightArrow: "↗",
    Upsi: "ϒ",
    upsi: "υ",
    upsih: "ϒ",
    Upsilon: "Υ",
    upsilon: "υ",
    UpTee: "⊥",
    UpTeeArrow: "↥",
    upuparrows: "⇈",
    urcorn: "⌝",
    urcorner: "⌝",
    urcrop: "⌎",
    Uring: "Ů",
    uring: "ů",
    urtri: "◹",
    Uscr: "𝒰",
    uscr: "𝓊",
    utdot: "⋰",
    Utilde: "Ũ",
    utilde: "ũ",
    utri: "▵",
    utrif: "▴",
    uuarr: "⇈",
    Uuml: "Ü",
    uuml: "ü",
    uwangle: "⦧",
    vangrt: "⦜",
    varepsilon: "ϵ",
    varkappa: "ϰ",
    varnothing: "∅",
    varphi: "ϕ",
    varpi: "ϖ",
    varpropto: "∝",
    vArr: "⇕",
    varr: "↕",
    varrho: "ϱ",
    varsigma: "ς",
    varsubsetneq: "⊊︀",
    varsubsetneqq: "⫋︀",
    varsupsetneq: "⊋︀",
    varsupsetneqq: "⫌︀",
    vartheta: "ϑ",
    vartriangleleft: "⊲",
    vartriangleright: "⊳",
    Vbar: "⫫",
    vBar: "⫨",
    vBarv: "⫩",
    Vcy: "В",
    vcy: "в",
    VDash: "⊫",
    Vdash: "⊩",
    vDash: "⊨",
    vdash: "⊢",
    Vdashl: "⫦",
    Vee: "⋁",
    vee: "∨",
    veebar: "⊻",
    veeeq: "≚",
    vellip: "⋮",
    Verbar: "‖",
    verbar: "|",
    Vert: "‖",
    vert: "|",
    VerticalBar: "∣",
    VerticalLine: "|",
    VerticalSeparator: "❘",
    VerticalTilde: "≀",
    VeryThinSpace: " ",
    Vfr: "𝔙",
    vfr: "𝔳",
    vltri: "⊲",
    vnsub: "⊂⃒",
    vnsup: "⊃⃒",
    Vopf: "𝕍",
    vopf: "𝕧",
    vprop: "∝",
    vrtri: "⊳",
    Vscr: "𝒱",
    vscr: "𝓋",
    vsubnE: "⫋︀",
    vsubne: "⊊︀",
    vsupnE: "⫌︀",
    vsupne: "⊋︀",
    Vvdash: "⊪",
    vzigzag: "⦚",
    Wcirc: "Ŵ",
    wcirc: "ŵ",
    wedbar: "⩟",
    Wedge: "⋀",
    wedge: "∧",
    wedgeq: "≙",
    weierp: "℘",
    Wfr: "𝔚",
    wfr: "𝔴",
    Wopf: "𝕎",
    wopf: "𝕨",
    wp: "℘",
    wr: "≀",
    wreath: "≀",
    Wscr: "𝒲",
    wscr: "𝓌",
    xcap: "⋂",
    xcirc: "◯",
    xcup: "⋃",
    xdtri: "▽",
    Xfr: "𝔛",
    xfr: "𝔵",
    xhArr: "⟺",
    xharr: "⟷",
    Xi: "Ξ",
    xi: "ξ",
    xlArr: "⟸",
    xlarr: "⟵",
    xmap: "⟼",
    xnis: "⋻",
    xodot: "⨀",
    Xopf: "𝕏",
    xopf: "𝕩",
    xoplus: "⨁",
    xotime: "⨂",
    xrArr: "⟹",
    xrarr: "⟶",
    Xscr: "𝒳",
    xscr: "𝓍",
    xsqcup: "⨆",
    xuplus: "⨄",
    xutri: "△",
    xvee: "⋁",
    xwedge: "⋀",
    Yacute: "Ý",
    yacute: "ý",
    YAcy: "Я",
    yacy: "я",
    Ycirc: "Ŷ",
    ycirc: "ŷ",
    Ycy: "Ы",
    ycy: "ы",
    yen: "¥",
    Yfr: "𝔜",
    yfr: "𝔶",
    YIcy: "Ї",
    yicy: "ї",
    Yopf: "𝕐",
    yopf: "𝕪",
    Yscr: "𝒴",
    yscr: "𝓎",
    YUcy: "Ю",
    yucy: "ю",
    Yuml: "Ÿ",
    yuml: "ÿ",
    Zacute: "Ź",
    zacute: "ź",
    Zcaron: "Ž",
    zcaron: "ž",
    Zcy: "З",
    zcy: "з",
    Zdot: "Ż",
    zdot: "ż",
    zeetrf: "ℨ",
    ZeroWidthSpace: "​",
    Zeta: "Ζ",
    zeta: "ζ",
    Zfr: "ℨ",
    zfr: "𝔷",
    ZHcy: "Ж",
    zhcy: "ж",
    zigrarr: "⇝",
    Zopf: "ℤ",
    zopf: "𝕫",
    Zscr: "𝒵",
    zscr: "𝓏",
    zwj: "‍",
    zwnj: "‌"
  }), e.entityMap = e.HTML_ENTITIES;
})(ou);
var bt = {}, ke = P, F = w, cu = we, an = ke.isHTMLEscapableRawTextElement, on = ke.isHTMLMimeType, cn = ke.isHTMLRawTextElement, rt = ke.hasOwn, sr = ke.NAMESPACE, ar = cu.ParseError, ln = cu.DOMException, He = 0, me = 1, xe = 2, ze = 3, Se = 4, Oe = 5, Ye = 6, ct = 7;
function lu() {
}
lu.prototype = {
  parse: function(e, t, r) {
    var u = this.domBuilder;
    u.startDocument(), hu(t, t = /* @__PURE__ */ Object.create(null)), hn(e, t, r, u, this.errorHandler), u.endDocument();
  }
};
var Vt = /&#?\w+;?/g;
function hn(e, t, r, u, i) {
  var n = on(u.mimeType);
  if (e.indexOf(F.UNICODE_REPLACEMENT_CHARACTER) >= 0)
    return i.fatalError("Unicode replacement character detected, source encoding issues?");
  function s(S) {
    if (S > 65535) {
      S -= 65536;
      var j = 55296 + (S >> 10), De = 56320 + (S & 1023);
      return String.fromCharCode(j, De);
    } else
      return String.fromCharCode(S);
  }
  function a(S) {
    var j = S[S.length - 1] === ";" ? S : S + ";";
    if (!n && j !== S)
      return i.error("EntityRef: expecting ;"), S;
    var De = F.Reference.exec(j);
    if (!De || De[0].length !== j.length)
      return i.error("entity not matching Reference production: " + S), S;
    var pe = j.slice(1, -1);
    return rt(r, pe) ? r[pe] : pe.charAt(0) === "#" ? s(parseInt(pe.substr(1).replace("x", "0x"))) : (i.error("entity not found:" + S), S);
  }
  function c(S) {
    if (S > _) {
      var j = e.substring(_, S).replace(Vt, a);
      f && o(_), u.characters(j, 0, S - _), _ = S;
    }
  }
  function o(S, j) {
    for (; S >= h && (j = D.exec(e)); )
      l = j.index, h = l + j[0].length, f.lineNumber++;
    f.columnNumber = S - l + 1;
  }
  for (var l = 0, h = 0, D = /.*(?:\r\n?|\n)|.*$/g, f = u.locator, C = [{ currentNSMap: t }], E = [], _ = 0; ; ) {
    try {
      var T = e.indexOf("<", _);
      if (T < 0) {
        if (!n && E.length > 0)
          return i.fatalError("unclosed xml tag(s): " + E.join(", "));
        if (!e.substring(_).match(/^\s*$/)) {
          var z = u.doc, x = z.createTextNode(e.substr(_));
          if (z.documentElement)
            return i.error("Extra content at the end of the document");
          z.appendChild(x), u.currentElement = x;
        }
        return;
      }
      if (T > _) {
        var V = e.substring(_, T);
        !n && E.length === 0 && (V = V.replace(new RegExp(F.S_OPT.source, "g"), ""), V && i.error("Unexpected content outside root element: '" + V + "'")), c(T);
      }
      switch (e.charAt(T + 1)) {
        case "/":
          var m = e.indexOf(">", T + 2), L = e.substring(T + 2, m > 0 ? m : void 0);
          if (!L)
            return i.fatalError("end tag name missing");
          var q = m > 0 && F.reg("^", F.QName_group, F.S_OPT, "$").exec(L);
          if (!q)
            return i.fatalError('end tag name contains invalid characters: "' + L + '"');
          if (!u.currentElement && !u.doc.documentElement)
            return;
          var Y = E[E.length - 1] || u.currentElement.tagName || u.doc.documentElement.tagName || "";
          if (Y !== q[1]) {
            var ne = q[1].toLowerCase();
            if (!n || Y.toLowerCase() !== ne)
              return i.fatalError('Opening and ending tag mismatch: "' + Y + '" != "' + L + '"');
          }
          var $ = C.pop();
          E.pop();
          var Q = $.localNSMap;
          if (u.endElement($.uri, $.localName, Y), Q)
            for (var p in Q)
              rt(Q, p) && u.endPrefixMapping(p);
          m++;
          break;
        case "?":
          f && o(T), m = dn(e, T, u, i);
          break;
        case "!":
          f && o(T), m = pu(e, T, u, i, n);
          break;
        default:
          f && o(T);
          var v = new mu(), d = C[C.length - 1].currentNSMap, m = fn(e, T, v, d, a, i, n), R = v.length;
          if (v.closed || (n && ke.isHTMLVoidElement(v.tagName) ? v.closed = !0 : E.push(v.tagName)), f && R) {
            for (var b = or(f, {}), O = 0; O < R; O++) {
              var te = v[O];
              o(te.offset), te.locator = or(f, {});
            }
            u.locator = b, cr(v, u, d) && C.push(v), u.locator = f;
          } else
            cr(v, u, d) && C.push(v);
          n && !v.closed ? m = pn(e, m, v.tagName, a, u) : m++;
      }
    } catch (S) {
      if (S instanceof ar)
        throw S;
      if (S instanceof ln)
        throw new ar(S.name + ": " + S.message, u.locator, S);
      i.error("element parse error: " + S), m = -1;
    }
    m > _ ? _ = m : c(Math.max(T, _) + 1);
  }
}
function or(e, t) {
  return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
}
function fn(e, t, r, u, i, n, s) {
  function a(f, C, E) {
    if (rt(r.attributeNames, f))
      return n.fatalError("Attribute " + f + " redefined");
    if (!s && C.indexOf("<") >= 0)
      return n.fatalError("Unescaped '<' not allowed in attributes values");
    r.addValue(
      f,
      // @see https://www.w3.org/TR/xml/#AVNormalize
      // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
      // - recursive replacement of (DTD) entity references
      // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
      C.replace(/[\t\n\r]/g, " ").replace(Vt, i),
      E
    );
  }
  for (var c, o, l = ++t, h = He; ; ) {
    var D = e.charAt(l);
    switch (D) {
      case "=":
        if (h === me)
          c = e.slice(t, l), h = ze;
        else if (h === xe)
          h = ze;
        else
          throw new Error("attribute equal must after attrName");
        break;
      case "'":
      case '"':
        if (h === ze || h === me)
          if (h === me && (n.warning('attribute value must after "="'), c = e.slice(t, l)), t = l + 1, l = e.indexOf(D, t), l > 0)
            o = e.slice(t, l), a(c, o, t - 1), h = Oe;
          else
            throw new Error("attribute value no end '" + D + "' match");
        else if (h == Se)
          o = e.slice(t, l), a(c, o, t), n.warning('attribute "' + c + '" missed start quot(' + D + ")!!"), t = l + 1, h = Oe;
        else
          throw new Error('attribute value must after "="');
        break;
      case "/":
        switch (h) {
          case He:
            r.setTagName(e.slice(t, l));
          case Oe:
          case Ye:
          case ct:
            h = ct, r.closed = !0;
          case Se:
          case me:
            break;
          case xe:
            r.closed = !0;
            break;
          default:
            throw new Error("attribute invalid close char('/')");
        }
        break;
      case "":
        return n.error("unexpected end of input"), h == He && r.setTagName(e.slice(t, l)), l;
      case ">":
        switch (h) {
          case He:
            r.setTagName(e.slice(t, l));
          case Oe:
          case Ye:
          case ct:
            break;
          case Se:
          case me:
            o = e.slice(t, l), o.slice(-1) === "/" && (r.closed = !0, o = o.slice(0, -1));
          case xe:
            h === xe && (o = c), h == Se ? (n.warning('attribute "' + o + '" missed quot(")!'), a(c, o, t)) : (s || n.warning('attribute "' + o + '" missed value!! "' + o + '" instead!!'), a(o, o, t));
            break;
          case ze:
            if (!s)
              return n.fatalError(`AttValue: ' or " expected`);
        }
        return l;
      case "":
        D = " ";
      default:
        if (D <= " ")
          switch (h) {
            case He:
              r.setTagName(e.slice(t, l)), h = Ye;
              break;
            case me:
              c = e.slice(t, l), h = xe;
              break;
            case Se:
              var o = e.slice(t, l);
              n.warning('attribute "' + o + '" missed quot(")!!'), a(c, o, t);
            case Oe:
              h = Ye;
              break;
          }
        else
          switch (h) {
            case xe:
              s || n.warning('attribute "' + c + '" missed value!! "' + c + '" instead2!!'), a(c, c, t), t = l, h = me;
              break;
            case Oe:
              n.warning('attribute space is required"' + c + '"!!');
            case Ye:
              h = me, t = l;
              break;
            case ze:
              h = Se, t = l;
              break;
            case ct:
              throw new Error("elements closed character '/' and '>' must be connected to");
          }
    }
    l++;
  }
}
function cr(e, t, r) {
  for (var u = e.tagName, i = null, h = e.length; h--; ) {
    var n = e[h], s = n.qName, a = n.value, D = s.indexOf(":");
    if (D > 0)
      var c = n.prefix = s.slice(0, D), o = s.slice(D + 1), l = c === "xmlns" && o;
    else
      o = s, c = null, l = s === "xmlns" && "";
    n.localName = o, l !== !1 && (i == null && (i = /* @__PURE__ */ Object.create(null), hu(r, r = /* @__PURE__ */ Object.create(null))), r[l] = i[l] = a, n.uri = sr.XMLNS, t.startPrefixMapping(l, a));
  }
  for (var h = e.length; h--; )
    n = e[h], n.prefix && (n.prefix === "xml" && (n.uri = sr.XML), n.prefix !== "xmlns" && (n.uri = r[n.prefix]));
  var D = u.indexOf(":");
  D > 0 ? (c = e.prefix = u.slice(0, D), o = e.localName = u.slice(D + 1)) : (c = null, o = e.localName = u);
  var f = e.uri = r[c || ""];
  if (t.startElement(f, o, u, e), e.closed) {
    if (t.endElement(f, o, u), i)
      for (c in i)
        rt(i, c) && t.endPrefixMapping(c);
  } else
    return e.currentNSMap = r, e.localNSMap = i, !0;
}
function pn(e, t, r, u, i) {
  var n = an(r);
  if (n || cn(r)) {
    var s = e.indexOf("</" + r + ">", t), a = e.substring(t + 1, s);
    return n && (a = a.replace(Vt, u)), i.characters(a, 0, a.length), s;
  }
  return t + 1;
}
function hu(e, t) {
  for (var r in e)
    rt(e, r) && (t[r] = e[r]);
}
function fu(e, t) {
  var r = t;
  function u(o) {
    return o = o || 0, e.charAt(r + o);
  }
  function i(o) {
    o = o || 1, r += o;
  }
  function n() {
    for (var o = 0; r < e.length; ) {
      var l = u();
      if (l !== " " && l !== `
` && l !== "	" && l !== "\r")
        return o;
      o++, i();
    }
    return -1;
  }
  function s() {
    return e.substring(r);
  }
  function a(o) {
    return e.substring(r, r + o.length) === o;
  }
  function c(o) {
    var l = F.reg("^", o), h = l.exec(s());
    return h ? (i(h[0].length), h[0]) : null;
  }
  return {
    char: u,
    getIndex: function() {
      return r;
    },
    getMatch: c,
    getSource: function() {
      return e;
    },
    skip: i,
    skipBlanks: n,
    substringFromIndex: s,
    substringStartsWith: a
  };
}
function mn(e, t) {
  function r(a, c) {
    var o = F.PI.exec(a.substringFromIndex());
    return o ? o[1].toLowerCase() === "xml" ? c.fatalError(
      "xml declaration is only allowed at the start of the document, but found at position " + a.getIndex()
    ) : (a.skip(o[0].length), o[0]) : c.fatalError("processing instruction is not well-formed at position " + a.getIndex());
  }
  var u = e.getSource();
  if (e.char() === "[") {
    e.skip(1);
    for (var i = e.getIndex(); e.getIndex() < u.length; ) {
      if (e.skipBlanks(), e.char() === "]") {
        var n = u.substring(i, e.getIndex());
        return e.skip(1), n;
      }
      var s = null;
      if (e.char() === "<" && e.char(1) === "!")
        switch (e.char(2)) {
          case "E":
            e.char(3) === "L" ? s = e.getMatch(F.elementdecl) : e.char(3) === "N" && (s = e.getMatch(F.EntityDecl));
            break;
          case "A":
            s = e.getMatch(F.AttlistDecl);
            break;
          case "N":
            s = e.getMatch(F.NotationDecl);
            break;
          case "-":
            s = e.getMatch(F.Comment);
            break;
        }
      else if (e.char() === "<" && e.char(1) === "?")
        s = r(e, t);
      else if (e.char() === "%")
        s = e.getMatch(F.PEReference);
      else
        return t.fatalError("Error detected in Markup declaration");
      if (!s)
        return t.fatalError("Error in internal subset at position " + e.getIndex());
    }
    return t.fatalError("doctype internal subset is not well-formed, missing ]");
  }
}
function pu(e, t, r, u, i) {
  var n = fu(e, t);
  switch (n.char(2)) {
    case "-":
      var s = n.getMatch(F.Comment);
      return s ? (r.comment(s, F.COMMENT_START.length, s.length - F.COMMENT_START.length - F.COMMENT_END.length), n.getIndex()) : u.fatalError("comment is not well-formed at position " + n.getIndex());
    case "[":
      var a = n.getMatch(F.CDSect);
      return a ? !i && !r.currentElement ? u.fatalError("CDATA outside of element") : (r.startCDATA(), r.characters(a, F.CDATA_START.length, a.length - F.CDATA_START.length - F.CDATA_END.length), r.endCDATA(), n.getIndex()) : u.fatalError("Invalid CDATA starting at position " + t);
    case "D": {
      if (r.doc && r.doc.documentElement)
        return u.fatalError("Doctype not allowed inside or after documentElement at position " + n.getIndex());
      if (!n.substringStartsWith(F.DOCTYPE_DECL_START))
        return u.fatalError("Expected " + F.DOCTYPE_DECL_START + " at position " + n.getIndex());
      if (n.skip(F.DOCTYPE_DECL_START.length), n.skipBlanks() < 1)
        return u.fatalError("Expected whitespace after " + F.DOCTYPE_DECL_START + " at position " + n.getIndex());
      var c = {
        name: void 0,
        publicId: void 0,
        systemId: void 0,
        internalSubset: void 0
      };
      if (c.name = n.getMatch(F.Name), !c.name)
        return u.fatalError("doctype name missing or contains unexpected characters at position " + n.getIndex());
      if (n.skipBlanks(), n.substringStartsWith(F.PUBLIC) || n.substringStartsWith(F.SYSTEM)) {
        var o = F.ExternalID_match.exec(n.substringFromIndex());
        if (!o)
          return u.fatalError("doctype external id is not well-formed at position " + n.getIndex());
        o.groups.SystemLiteralOnly !== void 0 ? c.systemId = o.groups.SystemLiteralOnly : (c.systemId = o.groups.SystemLiteral, c.publicId = o.groups.PubidLiteral), n.skip(o[0].length);
      }
      return n.skipBlanks(), c.internalSubset = mn(n, u), n.skipBlanks(), n.char() !== ">" ? u.fatalError("doctype not terminated with > at position " + n.getIndex()) : (n.skip(1), r.startDTD(c.name, c.publicId, c.systemId, c.internalSubset), r.endDTD(), n.getIndex());
    }
    default:
      return u.fatalError('Not well-formed XML starting with "<!" at position ' + t);
  }
}
function dn(e, t, r, u) {
  var i = e.substring(t).match(F.PI);
  if (!i)
    return u.fatalError("Invalid processing instruction starting at position " + t);
  if (i[1].toLowerCase() === "xml") {
    if (t > 0)
      return u.fatalError(
        "processing instruction at position " + t + " is an xml declaration which is only at the start of the document"
      );
    if (!F.XMLDecl.test(e.substring(t)))
      return u.fatalError("xml declaration is not well-formed");
  }
  return r.processingInstruction(i[1], i[2]), t + i[0].length;
}
function mu() {
  this.attributeNames = /* @__PURE__ */ Object.create(null);
}
mu.prototype = {
  setTagName: function(e) {
    if (!F.QName_exact.test(e))
      throw new Error("invalid tagName:" + e);
    this.tagName = e;
  },
  addValue: function(e, t, r) {
    if (!F.QName_exact.test(e))
      throw new Error("invalid attribute:" + e);
    this.attributeNames[e] = this.length, this[this.length++] = { qName: e, value: t, offset: r };
  },
  length: 0,
  getLocalName: function(e) {
    return this[e].localName;
  },
  getLocator: function(e) {
    return this[e].locator;
  },
  getQName: function(e) {
    return this[e].qName;
  },
  getURI: function(e) {
    return this[e].uri;
  },
  getValue: function(e) {
    return this[e].value;
  }
  //	,getIndex:function(uri, localName)){
  //		if(localName){
  //
  //		}else{
  //			var qName = uri
  //		}
  //	},
  //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
  //	getType:function(uri,localName){}
  //	getType:function(i){},
};
bt.XMLReader = lu;
bt.parseUtils = fu;
bt.parseDoctypeCommentOrCData = pu;
var _e = P, Dn = U, vn = we, lr = ou, En = bt, An = Dn.DOMImplementation, gn = _e.hasDefaultHTMLNamespace, Tn = _e.isHTMLMimeType, Cn = _e.isValidMimeType, du = _e.MIME_TYPE, xt = _e.NAMESPACE, hr = vn.ParseError, bn = En.XMLReader;
function Du(e) {
  return e.replace(/\r[\n\u0085]/g, `
`).replace(/[\r\u0085\u2028]/g, `
`);
}
function vu(e) {
  if (e = e || { locator: !0 }, this.assign = e.assign || _e.assign, this.domHandler = e.domHandler || yt, this.onError = e.onError || e.errorHandler, e.errorHandler && typeof e.errorHandler != "function")
    throw new TypeError("errorHandler object is no longer supported, switch to onError!");
  e.errorHandler && e.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this), this.normalizeLineEndings = e.normalizeLineEndings || Du, this.locator = !!e.locator, this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), e.xmlns);
}
vu.prototype.parseFromString = function(e, t) {
  if (!Cn(t))
    throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + t + '" is not valid.');
  var r = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns), u = lr.XML_ENTITIES, i = r[""] || null;
  gn(t) ? (u = lr.HTML_ENTITIES, i = xt.HTML) : t === du.XML_SVG_IMAGE && (i = xt.SVG), r[""] = i, r.xml = r.xml || xt.XML;
  var n = new this.domHandler({
    mimeType: t,
    defaultNamespace: i,
    onError: this.onError
  }), s = this.locator ? {} : void 0;
  this.locator && n.setDocumentLocator(s);
  var a = new bn();
  a.errorHandler = n, a.domBuilder = n;
  var c = !_e.isHTMLMimeType(t);
  return c && typeof e != "string" && a.errorHandler.fatalError("source is not a string"), a.parse(this.normalizeLineEndings(String(e)), r, u), n.doc.documentElement || a.errorHandler.fatalError("missing root element"), n.doc;
};
function yt(e) {
  var t = e || {};
  this.mimeType = t.mimeType || du.XML_APPLICATION, this.defaultNamespace = t.defaultNamespace || null, this.cdata = !1, this.currentElement = void 0, this.doc = void 0, this.locator = void 0, this.onError = t.onError;
}
function Fe(e, t) {
  t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
}
yt.prototype = {
  /**
   * Either creates an XML or an HTML document and stores it under `this.doc`.
   * If it is an XML document, `this.defaultNamespace` is used to create it,
   * and it will not contain any `childNodes`.
   * If it is an HTML document, it will be created without any `childNodes`.
   *
   * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
   */
  startDocument: function() {
    var e = new An();
    this.doc = Tn(this.mimeType) ? e.createHTMLDocument(!1) : e.createDocument(this.defaultNamespace, "");
  },
  startElement: function(e, t, r, u) {
    var i = this.doc, n = i.createElementNS(e, r || t), s = u.length;
    lt(this, n), this.currentElement = n, this.locator && Fe(this.locator, n);
    for (var a = 0; a < s; a++) {
      var e = u.getURI(a), c = u.getValue(a), r = u.getQName(a), o = i.createAttributeNS(e, r);
      this.locator && Fe(u.getLocator(a), o), o.value = o.nodeValue = c, n.setAttributeNode(o);
    }
  },
  endElement: function(e, t, r) {
    this.currentElement = this.currentElement.parentNode;
  },
  startPrefixMapping: function(e, t) {
  },
  endPrefixMapping: function(e) {
  },
  processingInstruction: function(e, t) {
    var r = this.doc.createProcessingInstruction(e, t);
    this.locator && Fe(this.locator, r), lt(this, r);
  },
  ignorableWhitespace: function(e, t, r) {
  },
  characters: function(e, t, r) {
    if (e = fr.apply(this, arguments), e) {
      if (this.cdata)
        var u = this.doc.createCDATASection(e);
      else
        var u = this.doc.createTextNode(e);
      this.currentElement ? this.currentElement.appendChild(u) : /^\s*$/.test(e) && this.doc.appendChild(u), this.locator && Fe(this.locator, u);
    }
  },
  skippedEntity: function(e) {
  },
  endDocument: function() {
    this.doc.normalize();
  },
  /**
   * Stores the locator to be able to set the `columnNumber` and `lineNumber`
   * on the created DOM nodes.
   *
   * @param {Locator} locator
   */
  setDocumentLocator: function(e) {
    e && (e.lineNumber = 0), this.locator = e;
  },
  //LexicalHandler
  comment: function(e, t, r) {
    e = fr.apply(this, arguments);
    var u = this.doc.createComment(e);
    this.locator && Fe(this.locator, u), lt(this, u);
  },
  startCDATA: function() {
    this.cdata = !0;
  },
  endCDATA: function() {
    this.cdata = !1;
  },
  startDTD: function(e, t, r, u) {
    var i = this.doc.implementation;
    if (i && i.createDocumentType) {
      var n = i.createDocumentType(e, t, r, u);
      this.locator && Fe(this.locator, n), lt(this, n), this.doc.doctype = n;
    }
  },
  reportError: function(e, t) {
    if (typeof this.onError == "function")
      try {
        this.onError(e, t, this);
      } catch (r) {
        throw new hr("Reporting " + e + ' "' + t + '" caused ' + r, this.locator);
      }
    else
      console.error("[xmldom " + e + "]	" + t, yn(this.locator));
  },
  /**
   * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
   */
  warning: function(e) {
    this.reportError("warning", e);
  },
  error: function(e) {
    this.reportError("error", e);
  },
  /**
   * This function reports a fatal error and throws a ParseError.
   *
   * @param {string} message
   * - The message to be used for reporting and throwing the error.
   * @returns {never}
   * This function always throws an error and never returns a value.
   * @throws {ParseError}
   * Always throws a ParseError with the provided message.
   */
  fatalError: function(e) {
    throw this.reportError("fatalError", e), new hr(e, this.locator);
  }
};
function yn(e) {
  if (e)
    return `
@#[line:` + e.lineNumber + ",col:" + e.columnNumber + "]";
}
function fr(e, t, r) {
  return typeof e == "string" ? e.substr(t, r) : e.length >= t + r || t ? new java.lang.String(e, t, r) + "" : e;
}
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
  /\w+/g,
  function(e) {
    yt.prototype[e] = function() {
      return null;
    };
  }
);
function lt(e, t) {
  e.currentElement ? e.currentElement.appendChild(t) : e.doc.appendChild(t);
}
function wn(e) {
  if (e === "error") throw "onErrorStopParsing";
}
function Nn() {
  throw "onWarningStopParsing";
}
qe.__DOMHandler = yt;
qe.DOMParser = vu;
qe.normalizeLineEndings = Du;
qe.onErrorStopParsing = wn;
qe.onWarningStopParsing = Nn;
var Ge = P;
Ge.assign;
Ge.hasDefaultHTMLNamespace;
Ge.isHTMLMimeType;
Ge.isValidMimeType;
var _n = Ge.MIME_TYPE;
Ge.NAMESPACE;
var xn = qe, Sn = xn.DOMParser;
class On {
  /**
   * @param {Object} options
   * @param {Element | null} [options.xml] - The XML element to parse.
   * @param {string} [options.string] - The XML element to parse as a string.
   */
  constructor(t) {
    y(this, "materials", {});
    y(this, "links", {});
    y(this, "joints", {});
    var r = t.xml, u = t.string;
    if (u) {
      var i = new Sn();
      r = i.parseFromString(u, _n.XML_TEXT).documentElement;
    }
    if (!r)
      throw new Error("No URDF document parsed!");
    var n = r;
    this.name = n.getAttribute("name");
    for (var s = n.childNodes, a = 0; a < s.length; a++) {
      var c = s[a];
      if (c.tagName === "material") {
        var o = new Mt({
          xml: c
        });
        this.materials[o.name] !== void 0 ? this.materials[o.name].isLink() ? this.materials[o.name].assign(o) : console.warn("Material " + o.name + "is not unique.") : this.materials[o.name] = o;
      } else if (c.tagName === "link") {
        var l = new Fr({
          xml: c
        });
        if (this.links[l.name] !== void 0)
          console.warn("Link " + l.name + " is not unique.");
        else {
          for (var h = 0; h < l.visuals.length; h++) {
            var D = l.visuals[h].material;
            D !== null && D.name && (this.materials[D.name] !== void 0 ? l.visuals[h].material = this.materials[D.name] : this.materials[D.name] = D);
          }
          this.links[l.name] = l;
        }
      } else if (c.tagName === "joint") {
        var f = new Lu({
          xml: c
        });
        this.joints[f.name] = f;
      }
    }
  }
}
const Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  URDF_BOX: Cr,
  URDF_CYLINDER: br,
  URDF_MESH: yr,
  URDF_SPHERE: Tr,
  UrdfBox: wr,
  UrdfColor: Nr,
  UrdfCylinder: _r,
  UrdfLink: Fr,
  UrdfMaterial: Mt,
  UrdfMesh: xr,
  UrdfModel: On,
  UrdfSphere: Sr,
  UrdfVisual: Or
}, Symbol.toStringTag, { value: "Module" })), Bn = "1.4.1";
globalThis.ROSLIB = {
  REVISION: Bn,
  ...Ou,
  ...Bu,
  ...Mu,
  ...Iu,
  ...Fn
};
export {
  gr as A,
  vr as G,
  Dr as P,
  he as Q,
  Bn as R,
  k as S,
  H as T,
  wr as U,
  ie as V,
  Cu as a,
  Su as b,
  Bt as c,
  Fu as d,
  Ar as e,
  ve as f,
  In as g,
  ut as h,
  Er as i,
  Ru as j,
  Nr as k,
  _r as l,
  Fr as m,
  Mt as n,
  xr as o,
  On as p,
  Sr as q,
  Or as r,
  Tr as s,
  Cr as t,
  br as u,
  yr as v
};
