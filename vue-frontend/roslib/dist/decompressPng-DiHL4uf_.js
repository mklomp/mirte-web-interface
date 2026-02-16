import { g as W, a as K } from "./RosLib-BtCL1dIt.js";
var q = {};
const Q = {}, V = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Q
}, Symbol.toStringTag, { value: "Module" })), L = /* @__PURE__ */ W(V);
(function(B) {
  var j = L, A = L, x = L, _ = new Buffer("89504e470d0a1a0a", "hex");
  function G(c, h, n, a, r) {
    this.width = c, this.height = h, this.channels = n, this.data = a, this.trailer = r;
  }
  G.prototype.getPixel = function(c, h) {
    if (c = c | 0, h = h | 0, c < 0 || h < 0 || c >= this.width || h >= this.height)
      return 0;
    var n = (h * this.width + c) * this.channels, a, r, f, y;
    switch (this.channels) {
      case 1:
        a = r = f = this.data[n], y = 255;
        break;
      case 2:
        a = r = f = this.data[n], y = this.data[n + 1];
        break;
      case 3:
        a = this.data[n], r = this.data[n + 1], f = this.data[n + 2], y = 255;
        break;
      case 4:
        a = this.data[n], r = this.data[n + 1], f = this.data[n + 2], y = this.data[n + 3];
        break;
    }
    return (a << 24 | r << 16 | f << 8 | y) >>> 0;
  };
  function J(c, h, n) {
    var a = c + h - n, r = Math.abs(a - c), f = Math.abs(a - h), y = Math.abs(a - n);
    return r <= f && r <= y ? c : f <= y ? h : n;
  }
  B.parseStream = function(c, h) {
    var n = x.createInflate(), a = 0, r = 0, f = new Buffer(13), y = 2, p = -1, l = 0, H = 0, $ = 0, u, M, z, I, g, D, s, S, w, R, i, b, P, F, C, k, T, E;
    function d(o) {
      return c.destroy && c.destroy(), n.destroy && n.destroy(), h(o);
    }
    function O() {
      if (!--y)
        return h(
          void 0,
          new G(M, z, E, s, C)
        );
    }
    c.on("error", d), n.on("error", d), c.on("end", function() {
      return c.destroy(), s ? C ? O() : d(new Error("Corrupt PNG?")) : d(new Error("Corrupt PNG?"));
    }), n.on("end", function() {
      return n.destroy && n.destroy(), l !== s.length ? d(new Error("Too little pixel data! (Corrupt PNG?)")) : O();
    }), c.on("data", function(o) {
      if (c.readable)
        for (var t = o.length, e = 0, U, m; e !== t; )
          switch (a) {
            case 0:
              if (o[e++] !== _[r++])
                return d(new Error("Invalid PNG header."));
              r === _.length && (a = 1, r = 0);
              break;
            case 1:
              if (t - e < 8 - r)
                o.copy(f, r, e), r += t - e, e = t;
              else
                switch (o.copy(f, r, e, e + 8 - r), e += 8 - r, r = 0, u = f.readUInt32BE(0), f.toString("ascii", 4, 8)) {
                  case "IHDR":
                    a = 2;
                    break;
                  case "PLTE":
                    if (D !== 3)
                      a = 7;
                    else {
                      if (u % 3 !== 0)
                        return d(new Error("Invalid PLTE size."));
                      H = u / 3, k = new Buffer(u), a = 3;
                    }
                    break;
                  case "tRNS":
                    if (D !== 3)
                      return d(new Error("tRNS for non-paletted images not yet supported."));
                    E++, $ = u, T = new Buffer(u), a = 4;
                    break;
                  case "IDAT":
                    s || (s = new Buffer(M * z * E)), a = 5;
                    break;
                  case "IEND":
                    a = 6;
                    break;
                  default:
                    a = 7;
                    break;
                }
              break;
            case 2:
              if (u !== 13)
                return d(new Error("Invalid IHDR chunk."));
              if (t - e < u - r)
                o.copy(f, r, e), r += t - e, e = t;
              else {
                if (o.copy(f, r, e, e + u - r), f.readUInt8(10) !== 0)
                  return d(new Error("Unsupported compression method."));
                if (f.readUInt8(11) !== 0)
                  return d(new Error("Unsupported filter method."));
                if (f.readUInt8(12) !== 0)
                  return d(new Error("Unsupported interlace method."));
                switch (e += u - r, a = 8, r = 0, M = f.readUInt32BE(0), z = f.readUInt32BE(4), I = f.readUInt8(8), g = 255 / ((1 << I) - 1), D = f.readUInt8(9), D) {
                  case 0:
                    S = 1, w = Math.ceil(I * 0.125), E = 1;
                    break;
                  case 2:
                    S = 3, w = Math.ceil(I * 0.375), E = 3;
                    break;
                  case 3:
                    S = 1, w = 1, E = 3;
                    break;
                  case 4:
                    S = 2, w = Math.ceil(I * 0.25), E = 2;
                    break;
                  case 6:
                    S = 4, w = Math.ceil(I * 0.5), E = 4;
                    break;
                  default:
                    return d(
                      new Error("Unsupported color type: " + D)
                    );
                }
                R = Math.ceil(
                  M * I * S / 8
                ), i = new Buffer(S), b = new Buffer(R), P = new Buffer(R), b.fill(0);
              }
              break;
            case 3:
              if (t - e < u - r)
                o.copy(k, r, e), r += t - e, e = t;
              else
                for (o.copy(k, r, e, e + u - r), e += u - r, a = 8, r = 0, E = 1, m = H; m--; )
                  if (k[m * 3 + 0] !== k[m * 3 + 1] || k[m * 3 + 0] !== k[m * 3 + 2]) {
                    E = 3;
                    break;
                  }
              break;
            case 4:
              t - e < u - r ? (o.copy(T, r, e), r += t - e, e = t) : (o.copy(T, r, e, e + u - r), e += u - r, a = 8, r = 0);
              break;
            case 5:
              t - e < u - r ? (n.write(o.slice(e)), r += t - e, e = t) : (n.write(o.slice(e, e + u - r)), e += u - r, a = 8, r = 0);
              break;
            case 6:
              if (u !== 0)
                return d(new Error("Invalid IEND chunk."));
              t - e < 4 - r ? (r += t - e, e = t) : (C = new Buffer(0), e += 4 - r, a = 9, r = 0, n.end());
              break;
            case 7:
              t - e < u - r ? (r += t - e, e = t) : (e += u - r, a = 8, r = 0);
              break;
            case 8:
              t - e < 4 - r ? (r += t - e, e = t) : (e += 4 - r, a = 1, r = 0);
              break;
            case 9:
              U = new Buffer(r + t - e), C.copy(U), o.copy(U, r, e, t), C = U, r += t - e, e = t;
              break;
          }
    }), n.on("data", function(o) {
      if (n.readable) {
        var t = o.length, e, U, m, v, N;
        for (e = 0; e !== t; ++e) {
          if (p === -1)
            F = o[e], U = b, b = P, P = U;
          else
            switch (F) {
              case 0:
                b[p] = o[e];
                break;
              case 1:
                b[p] = p < w ? o[e] : o[e] + b[p - w] & 255;
                break;
              case 2:
                b[p] = o[e] + P[p] & 255;
                break;
              case 3:
                b[p] = o[e] + ((p < w ? P[p] : b[p - w] + P[p]) >>> 1) & 255;
                break;
              case 4:
                b[p] = o[e] + (p < w ? P[p] : J(
                  b[p - w],
                  P[p],
                  P[p - w]
                )) & 255;
                break;
              default:
                return d(
                  new Error("Unsupported scanline filter: " + F)
                );
            }
          if (++p === R) {
            if (l === s.length)
              return d(new Error("Too much pixel data! (Corrupt PNG?)"));
            for (v = 0, m = 0; m !== M; ++m) {
              for (N = 0; N !== S; ++v, ++N)
                switch (I) {
                  case 1:
                    i[N] = b[v >>> 3] >> 7 - (v & 7) & 1;
                    break;
                  case 2:
                    i[N] = b[v >>> 2] >> (3 - (v & 3) << 1) & 3;
                    break;
                  case 4:
                    i[N] = b[v >>> 1] >> (1 - (v & 1) << 2) & 15;
                    break;
                  case 8:
                    i[N] = b[v];
                    break;
                  default:
                    return d(new Error("Unsupported bit depth: " + I));
                }
              switch (D) {
                case 0:
                  s[l++] = i[0] * g;
                  break;
                case 2:
                  s[l++] = i[0] * g, s[l++] = i[1] * g, s[l++] = i[2] * g;
                  break;
                case 3:
                  if (i[0] >= H)
                    return d(new Error("Invalid palette index."));
                  switch (E) {
                    case 1:
                      s[l++] = k[i[0] * 3];
                      break;
                    case 2:
                      s[l++] = k[i[0] * 3], s[l++] = i[0] < $ ? T[i[0]] : 255;
                      break;
                    case 3:
                      s[l++] = k[i[0] * 3 + 0], s[l++] = k[i[0] * 3 + 1], s[l++] = k[i[0] * 3 + 2];
                      break;
                    case 4:
                      s[l++] = k[i[0] * 3 + 0], s[l++] = k[i[0] * 3 + 1], s[l++] = k[i[0] * 3 + 2], s[l++] = i[0] < $ ? T[i[0]] : 255;
                      break;
                  }
                  break;
                case 4:
                  s[l++] = i[0] * g, s[l++] = i[1] * g;
                  break;
                case 6:
                  s[l++] = i[0] * g, s[l++] = i[1] * g, s[l++] = i[2] * g, s[l++] = i[3] * g;
                  break;
              }
            }
            p = -1;
          }
        }
      }
    });
  }, B.parseFile = function(c, h) {
    return B.parseStream(j.createReadStream(c), h);
  }, B.parseBuffer = function(c, h) {
    var n = new A.Stream();
    n.readable = !0, n.destroy = function() {
      n.readable = !1;
    }, B.parseStream(n, h), n.emit("data", c), n.readable && n.emit("end");
  }, B.parse = B.parseBuffer;
})(q);
const X = /* @__PURE__ */ K(q);
function Z(B, j) {
  var A = new Buffer(B, "base64");
  X.parse(A, function(x, _) {
    if (x)
      console.warn("Cannot process PNG encoded message ");
    else {
      var G = _.data.toString();
      j(JSON.parse(G));
    }
  });
}
export {
  Z as default
};
