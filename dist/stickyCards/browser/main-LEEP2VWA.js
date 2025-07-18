var kx = Object.defineProperty,
  Px = Object.defineProperties;
var Fx = Object.getOwnPropertyDescriptors;
var Pl = Object.getOwnPropertySymbols;
var ly = Object.prototype.hasOwnProperty,
  cy = Object.prototype.propertyIsEnumerable;
var ay = (n, t, e) =>
    t in n
      ? kx(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (n[t] = e),
  _ = (n, t) => {
    for (var e in (t ||= {})) ly.call(t, e) && ay(n, e, t[e]);
    if (Pl) for (var e of Pl(t)) cy.call(t, e) && ay(n, e, t[e]);
    return n;
  },
  B = (n, t) => Px(n, Fx(t));
var sh = (n, t) => {
  var e = {};
  for (var i in n) ly.call(n, i) && t.indexOf(i) < 0 && (e[i] = n[i]);
  if (n != null && Pl)
    for (var i of Pl(n)) t.indexOf(i) < 0 && cy.call(n, i) && (e[i] = n[i]);
  return e;
};
var ah;
function Fl() {
  return ah;
}
function kn(n) {
  let t = ah;
  return (ah = n), t;
}
var dy = Symbol("NotFound"),
  Ns = class extends Error {
    name = "\u0275NotFound";
    constructor(t) {
      super(t);
    }
  };
function pr(n) {
  return n === dy || n?.name === "\u0275NotFound";
}
function Hl(n, t) {
  return Object.is(n, t);
}
var Ke = null,
  Ll = !1,
  lh = 1,
  Lx = null,
  Ze = Symbol("SIGNAL");
function z(n) {
  let t = Ke;
  return (Ke = n), t;
}
function Ul() {
  return Ke;
}
var Mi = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function mr(n) {
  if (Ll) throw new Error("");
  if (Ke === null) return;
  Ke.consumerOnSignalRead(n);
  let t = Ke.nextProducerIndex++;
  if (
    (Gl(Ke), t < Ke.producerNode.length && Ke.producerNode[t] !== n && ks(Ke))
  ) {
    let e = Ke.producerNode[t];
    $l(e, Ke.producerIndexOfThis[t]);
  }
  Ke.producerNode[t] !== n &&
    ((Ke.producerNode[t] = n),
    (Ke.producerIndexOfThis[t] = ks(Ke) ? fy(n, Ke, t) : 0)),
    (Ke.producerLastReadVersion[t] = n.version);
}
function uy() {
  lh++;
}
function zl(n) {
  if (!(ks(n) && !n.dirty) && !(!n.dirty && n.lastCleanEpoch === lh)) {
    if (!n.producerMustRecompute(n) && !gr(n)) {
      Bl(n);
      return;
    }
    n.producerRecomputeValue(n), Bl(n);
  }
}
function ch(n) {
  if (n.liveConsumerNode === void 0) return;
  let t = Ll;
  Ll = !0;
  try {
    for (let e of n.liveConsumerNode) e.dirty || Vx(e);
  } finally {
    Ll = t;
  }
}
function dh() {
  return Ke?.consumerAllowSignalWrites !== !1;
}
function Vx(n) {
  (n.dirty = !0), ch(n), n.consumerMarkedDirty?.(n);
}
function Bl(n) {
  (n.dirty = !1), (n.lastCleanEpoch = lh);
}
function Jn(n) {
  return n && (n.nextProducerIndex = 0), z(n);
}
function Ti(n, t) {
  if (
    (z(t),
    !(
      !n ||
      n.producerNode === void 0 ||
      n.producerIndexOfThis === void 0 ||
      n.producerLastReadVersion === void 0
    ))
  ) {
    if (ks(n))
      for (let e = n.nextProducerIndex; e < n.producerNode.length; e++)
        $l(n.producerNode[e], n.producerIndexOfThis[e]);
    for (; n.producerNode.length > n.nextProducerIndex; )
      n.producerNode.pop(),
        n.producerLastReadVersion.pop(),
        n.producerIndexOfThis.pop();
  }
}
function gr(n) {
  Gl(n);
  for (let t = 0; t < n.producerNode.length; t++) {
    let e = n.producerNode[t],
      i = n.producerLastReadVersion[t];
    if (i !== e.version || (zl(e), i !== e.version)) return !0;
  }
  return !1;
}
function ho(n) {
  if ((Gl(n), ks(n)))
    for (let t = 0; t < n.producerNode.length; t++)
      $l(n.producerNode[t], n.producerIndexOfThis[t]);
  (n.producerNode.length =
    n.producerLastReadVersion.length =
    n.producerIndexOfThis.length =
      0),
    n.liveConsumerNode &&
      (n.liveConsumerNode.length = n.liveConsumerIndexOfThis.length = 0);
}
function fy(n, t, e) {
  if ((hy(n), n.liveConsumerNode.length === 0 && py(n)))
    for (let i = 0; i < n.producerNode.length; i++)
      n.producerIndexOfThis[i] = fy(n.producerNode[i], n, i);
  return n.liveConsumerIndexOfThis.push(e), n.liveConsumerNode.push(t) - 1;
}
function $l(n, t) {
  if ((hy(n), n.liveConsumerNode.length === 1 && py(n)))
    for (let i = 0; i < n.producerNode.length; i++)
      $l(n.producerNode[i], n.producerIndexOfThis[i]);
  let e = n.liveConsumerNode.length - 1;
  if (
    ((n.liveConsumerNode[t] = n.liveConsumerNode[e]),
    (n.liveConsumerIndexOfThis[t] = n.liveConsumerIndexOfThis[e]),
    n.liveConsumerNode.length--,
    n.liveConsumerIndexOfThis.length--,
    t < n.liveConsumerNode.length)
  ) {
    let i = n.liveConsumerIndexOfThis[t],
      r = n.liveConsumerNode[t];
    Gl(r), (r.producerIndexOfThis[i] = t);
  }
}
function ks(n) {
  return n.consumerIsAlwaysLive || (n?.liveConsumerNode?.length ?? 0) > 0;
}
function Gl(n) {
  (n.producerNode ??= []),
    (n.producerIndexOfThis ??= []),
    (n.producerLastReadVersion ??= []);
}
function hy(n) {
  (n.liveConsumerNode ??= []), (n.liveConsumerIndexOfThis ??= []);
}
function py(n) {
  return n.producerNode !== void 0;
}
function Wl(n) {
  Lx?.(n);
}
function Ps(n, t) {
  let e = Object.create(jx);
  (e.computation = n), t !== void 0 && (e.equal = t);
  let i = () => {
    if ((zl(e), mr(e), e.value === Os)) throw e.error;
    return e.value;
  };
  return (i[Ze] = e), Wl(e), i;
}
var Vl = Symbol("UNSET"),
  jl = Symbol("COMPUTING"),
  Os = Symbol("ERRORED"),
  jx = B(_({}, Mi), {
    value: Vl,
    dirty: !0,
    error: null,
    equal: Hl,
    kind: "computed",
    producerMustRecompute(n) {
      return n.value === Vl || n.value === jl;
    },
    producerRecomputeValue(n) {
      if (n.value === jl) throw new Error("");
      let t = n.value;
      n.value = jl;
      let e = Jn(n),
        i,
        r = !1;
      try {
        (i = n.computation()),
          z(null),
          (r = t !== Vl && t !== Os && i !== Os && n.equal(t, i));
      } catch (o) {
        (i = Os), (n.error = o);
      } finally {
        Ti(n, e);
      }
      if (r) {
        n.value = t;
        return;
      }
      (n.value = i), n.version++;
    },
  });
function Bx() {
  throw new Error();
}
var my = Bx;
function gy(n) {
  my(n);
}
function uh(n) {
  my = n;
}
var Hx = null;
function fh(n, t) {
  let e = Object.create(Fs);
  (e.value = n), t !== void 0 && (e.equal = t);
  let i = () => vy(e);
  return (i[Ze] = e), Wl(e), [i, (s) => po(e, s), (s) => hh(e, s)];
}
function vy(n) {
  return mr(n), n.value;
}
function po(n, t) {
  dh() || gy(n), n.equal(n.value, t) || ((n.value = t), Ux(n));
}
function hh(n, t) {
  dh() || gy(n), po(n, t(n.value));
}
var Fs = B(_({}, Mi), { equal: Hl, value: void 0, kind: "signal" });
function Ux(n) {
  n.version++, uy(), ch(n), Hx?.(n);
}
function Q(n) {
  return typeof n == "function";
}
function mo(n) {
  let e = n((i) => {
    Error.call(i), (i.stack = new Error().stack);
  });
  return (
    (e.prototype = Object.create(Error.prototype)),
    (e.prototype.constructor = e),
    e
  );
}
var ql = mo(
  (n) =>
    function (e) {
      n(this),
        (this.message = e
          ? `${e.length} errors occurred during unsubscription:
${e.map((i, r) => `${r + 1}) ${i.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = e);
    }
);
function vr(n, t) {
  if (n) {
    let e = n.indexOf(t);
    0 <= e && n.splice(e, 1);
  }
}
var W = class n {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: e } = this;
      if (e)
        if (((this._parentage = null), Array.isArray(e)))
          for (let o of e) o.remove(this);
        else e.remove(this);
      let { initialTeardown: i } = this;
      if (Q(i))
        try {
          i();
        } catch (o) {
          t = o instanceof ql ? o.errors : [o];
        }
      let { _finalizers: r } = this;
      if (r) {
        this._finalizers = null;
        for (let o of r)
          try {
            _y(o);
          } catch (s) {
            (t = t ?? []),
              s instanceof ql ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new ql(t);
    }
  }
  add(t) {
    var e;
    if (t && t !== this)
      if (this.closed) _y(t);
      else {
        if (t instanceof n) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (e = this._finalizers) !== null && e !== void 0 ? e : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: e } = this;
    return e === t || (Array.isArray(e) && e.includes(t));
  }
  _addParent(t) {
    let { _parentage: e } = this;
    this._parentage = Array.isArray(e) ? (e.push(t), e) : e ? [e, t] : t;
  }
  _removeParent(t) {
    let { _parentage: e } = this;
    e === t ? (this._parentage = null) : Array.isArray(e) && vr(e, t);
  }
  remove(t) {
    let { _finalizers: e } = this;
    e && vr(e, t), t instanceof n && t._removeParent(this);
  }
};
W.EMPTY = (() => {
  let n = new W();
  return (n.closed = !0), n;
})();
var ph = W.EMPTY;
function Yl(n) {
  return (
    n instanceof W ||
    (n && "closed" in n && Q(n.remove) && Q(n.add) && Q(n.unsubscribe))
  );
}
function _y(n) {
  Q(n) ? n() : n.unsubscribe();
}
var pn = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var go = {
  setTimeout(n, t, ...e) {
    let { delegate: i } = go;
    return i?.setTimeout ? i.setTimeout(n, t, ...e) : setTimeout(n, t, ...e);
  },
  clearTimeout(n) {
    let { delegate: t } = go;
    return (t?.clearTimeout || clearTimeout)(n);
  },
  delegate: void 0,
};
function Kl(n) {
  go.setTimeout(() => {
    let { onUnhandledError: t } = pn;
    if (t) t(n);
    else throw n;
  });
}
function Ls() {}
var yy = mh("C", void 0, void 0);
function by(n) {
  return mh("E", void 0, n);
}
function wy(n) {
  return mh("N", n, void 0);
}
function mh(n, t, e) {
  return { kind: n, value: t, error: e };
}
var _r = null;
function vo(n) {
  if (pn.useDeprecatedSynchronousErrorHandling) {
    let t = !_r;
    if ((t && (_r = { errorThrown: !1, error: null }), n(), t)) {
      let { errorThrown: e, error: i } = _r;
      if (((_r = null), e)) throw i;
    }
  } else n();
}
function Ey(n) {
  pn.useDeprecatedSynchronousErrorHandling &&
    _r &&
    ((_r.errorThrown = !0), (_r.error = n));
}
var yr = class extends W {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Yl(t) && t.add(this))
          : (this.destination = Gx);
    }
    static create(t, e, i) {
      return new ei(t, e, i);
    }
    next(t) {
      this.isStopped ? vh(wy(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? vh(by(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? vh(yy, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  zx = Function.prototype.bind;
function gh(n, t) {
  return zx.call(n, t);
}
var _h = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: e } = this;
      if (e.next)
        try {
          e.next(t);
        } catch (i) {
          Zl(i);
        }
    }
    error(t) {
      let { partialObserver: e } = this;
      if (e.error)
        try {
          e.error(t);
        } catch (i) {
          Zl(i);
        }
      else Zl(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (e) {
          Zl(e);
        }
    }
  },
  ei = class extends yr {
    constructor(t, e, i) {
      super();
      let r;
      if (Q(t) || !t)
        r = { next: t ?? void 0, error: e ?? void 0, complete: i ?? void 0 };
      else {
        let o;
        this && pn.useDeprecatedNextContext
          ? ((o = Object.create(t)),
            (o.unsubscribe = () => this.unsubscribe()),
            (r = {
              next: t.next && gh(t.next, o),
              error: t.error && gh(t.error, o),
              complete: t.complete && gh(t.complete, o),
            }))
          : (r = t);
      }
      this.destination = new _h(r);
    }
  };
function Zl(n) {
  pn.useDeprecatedSynchronousErrorHandling ? Ey(n) : Kl(n);
}
function $x(n) {
  throw n;
}
function vh(n, t) {
  let { onStoppedNotification: e } = pn;
  e && go.setTimeout(() => e(n, t));
}
var Gx = { closed: !0, next: Ls, error: $x, complete: Ls };
var _o = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function It(n) {
  return n;
}
function yh(...n) {
  return bh(n);
}
function bh(n) {
  return n.length === 0
    ? It
    : n.length === 1
    ? n[0]
    : function (e) {
        return n.reduce((i, r) => r(i), e);
      };
}
var H = (() => {
  class n {
    constructor(e) {
      e && (this._subscribe = e);
    }
    lift(e) {
      let i = new n();
      return (i.source = this), (i.operator = e), i;
    }
    subscribe(e, i, r) {
      let o = qx(e) ? e : new ei(e, i, r);
      return (
        vo(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(e) {
      try {
        return this._subscribe(e);
      } catch (i) {
        e.error(i);
      }
    }
    forEach(e, i) {
      return (
        (i = Dy(i)),
        new i((r, o) => {
          let s = new ei({
            next: (a) => {
              try {
                e(a);
              } catch (l) {
                o(l), s.unsubscribe();
              }
            },
            error: o,
            complete: r,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(e) {
      var i;
      return (i = this.source) === null || i === void 0
        ? void 0
        : i.subscribe(e);
    }
    [_o]() {
      return this;
    }
    pipe(...e) {
      return bh(e)(this);
    }
    toPromise(e) {
      return (
        (e = Dy(e)),
        new e((i, r) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => r(s),
            () => i(o)
          );
        })
      );
    }
  }
  return (n.create = (t) => new n(t)), n;
})();
function Dy(n) {
  var t;
  return (t = n ?? pn.Promise) !== null && t !== void 0 ? t : Promise;
}
function Wx(n) {
  return n && Q(n.next) && Q(n.error) && Q(n.complete);
}
function qx(n) {
  return (n && n instanceof yr) || (Wx(n) && Yl(n));
}
function wh(n) {
  return Q(n?.lift);
}
function q(n) {
  return (t) => {
    if (wh(t))
      return t.lift(function (e) {
        try {
          return n(e, this);
        } catch (i) {
          this.error(i);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function $(n, t, e, i, r) {
  return new Eh(n, t, e, i, r);
}
var Eh = class extends yr {
  constructor(t, e, i, r, o, s) {
    super(t),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = e
        ? function (a) {
            try {
              e(a);
            } catch (l) {
              t.error(l);
            }
          }
        : super._next),
      (this._error = r
        ? function (a) {
            try {
              r(a);
            } catch (l) {
              t.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = i
        ? function () {
            try {
              i();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: e } = this;
      super.unsubscribe(),
        !e && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function yo() {
  return q((n, t) => {
    let e = null;
    n._refCount++;
    let i = $(t, void 0, void 0, void 0, () => {
      if (!n || n._refCount <= 0 || 0 < --n._refCount) {
        e = null;
        return;
      }
      let r = n._connection,
        o = e;
      (e = null), r && (!o || r === o) && r.unsubscribe(), t.unsubscribe();
    });
    n.subscribe(i), i.closed || (e = n.connect());
  });
}
var bo = class extends H {
  constructor(t, e) {
    super(),
      (this.source = t),
      (this.subjectFactory = e),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      wh(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new W();
      let e = this.getSubject();
      t.add(
        this.source.subscribe(
          $(
            e,
            void 0,
            () => {
              this._teardown(), e.complete();
            },
            (i) => {
              this._teardown(), e.error(i);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = W.EMPTY));
    }
    return t;
  }
  refCount() {
    return yo()(this);
  }
};
var wo = {
  schedule(n) {
    let t = requestAnimationFrame,
      e = cancelAnimationFrame,
      { delegate: i } = wo;
    i && ((t = i.requestAnimationFrame), (e = i.cancelAnimationFrame));
    let r = t((o) => {
      (e = void 0), n(o);
    });
    return new W(() => e?.(r));
  },
  requestAnimationFrame(...n) {
    let { delegate: t } = wo;
    return (t?.requestAnimationFrame || requestAnimationFrame)(...n);
  },
  cancelAnimationFrame(...n) {
    let { delegate: t } = wo;
    return (t?.cancelAnimationFrame || cancelAnimationFrame)(...n);
  },
  delegate: void 0,
};
var Cy = mo(
  (n) =>
    function () {
      n(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var E = (() => {
    class n extends H {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(e) {
        let i = new Ql(this, this);
        return (i.operator = e), i;
      }
      _throwIfClosed() {
        if (this.closed) throw new Cy();
      }
      next(e) {
        vo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let i of this.currentObservers) i.next(e);
          }
        });
      }
      error(e) {
        vo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = e);
            let { observers: i } = this;
            for (; i.length; ) i.shift().error(e);
          }
        });
      }
      complete() {
        vo(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: e } = this;
            for (; e.length; ) e.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var e;
        return (
          ((e = this.observers) === null || e === void 0 ? void 0 : e.length) >
          0
        );
      }
      _trySubscribe(e) {
        return this._throwIfClosed(), super._trySubscribe(e);
      }
      _subscribe(e) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(e),
          this._innerSubscribe(e)
        );
      }
      _innerSubscribe(e) {
        let { hasError: i, isStopped: r, observers: o } = this;
        return i || r
          ? ph
          : ((this.currentObservers = null),
            o.push(e),
            new W(() => {
              (this.currentObservers = null), vr(o, e);
            }));
      }
      _checkFinalizedStatuses(e) {
        let { hasError: i, thrownError: r, isStopped: o } = this;
        i ? e.error(r) : o && e.complete();
      }
      asObservable() {
        let e = new H();
        return (e.source = this), e;
      }
    }
    return (n.create = (t, e) => new Ql(t, e)), n;
  })(),
  Ql = class extends E {
    constructor(t, e) {
      super(), (this.destination = t), (this.source = e);
    }
    next(t) {
      var e, i;
      (i =
        (e = this.destination) === null || e === void 0 ? void 0 : e.next) ===
        null ||
        i === void 0 ||
        i.call(e, t);
    }
    error(t) {
      var e, i;
      (i =
        (e = this.destination) === null || e === void 0 ? void 0 : e.error) ===
        null ||
        i === void 0 ||
        i.call(e, t);
    }
    complete() {
      var t, e;
      (e =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        e === void 0 ||
        e.call(t);
    }
    _subscribe(t) {
      var e, i;
      return (i =
        (e = this.source) === null || e === void 0
          ? void 0
          : e.subscribe(t)) !== null && i !== void 0
        ? i
        : ph;
    }
  };
var je = class extends E {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let e = super._subscribe(t);
    return !e.closed && t.next(this._value), e;
  }
  getValue() {
    let { hasError: t, thrownError: e, _value: i } = this;
    if (t) throw e;
    return this._throwIfClosed(), i;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Vs = {
  now() {
    return (Vs.delegate || Date).now();
  },
  delegate: void 0,
};
var Xl = class extends E {
  constructor(t = 1 / 0, e = 1 / 0, i = Vs) {
    super(),
      (this._bufferSize = t),
      (this._windowTime = e),
      (this._timestampProvider = i),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = e === 1 / 0),
      (this._bufferSize = Math.max(1, t)),
      (this._windowTime = Math.max(1, e));
  }
  next(t) {
    let {
      isStopped: e,
      _buffer: i,
      _infiniteTimeWindow: r,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    e || (i.push(t), !r && i.push(o.now() + s)),
      this._trimBuffer(),
      super.next(t);
  }
  _subscribe(t) {
    this._throwIfClosed(), this._trimBuffer();
    let e = this._innerSubscribe(t),
      { _infiniteTimeWindow: i, _buffer: r } = this,
      o = r.slice();
    for (let s = 0; s < o.length && !t.closed; s += i ? 1 : 2) t.next(o[s]);
    return this._checkFinalizedStatuses(t), e;
  }
  _trimBuffer() {
    let {
        _bufferSize: t,
        _timestampProvider: e,
        _buffer: i,
        _infiniteTimeWindow: r,
      } = this,
      o = (r ? 1 : 2) * t;
    if ((t < 1 / 0 && o < i.length && i.splice(0, i.length - o), !r)) {
      let s = e.now(),
        a = 0;
      for (let l = 1; l < i.length && i[l] <= s; l += 2) a = l;
      a && i.splice(0, a + 1);
    }
  }
};
var Jl = class extends W {
  constructor(t, e) {
    super();
  }
  schedule(t, e = 0) {
    return this;
  }
};
var js = {
  setInterval(n, t, ...e) {
    let { delegate: i } = js;
    return i?.setInterval ? i.setInterval(n, t, ...e) : setInterval(n, t, ...e);
  },
  clearInterval(n) {
    let { delegate: t } = js;
    return (t?.clearInterval || clearInterval)(n);
  },
  delegate: void 0,
};
var Eo = class extends Jl {
  constructor(t, e) {
    super(t, e), (this.scheduler = t), (this.work = e), (this.pending = !1);
  }
  schedule(t, e = 0) {
    var i;
    if (this.closed) return this;
    this.state = t;
    let r = this.id,
      o = this.scheduler;
    return (
      r != null && (this.id = this.recycleAsyncId(o, r, e)),
      (this.pending = !0),
      (this.delay = e),
      (this.id =
        (i = this.id) !== null && i !== void 0
          ? i
          : this.requestAsyncId(o, this.id, e)),
      this
    );
  }
  requestAsyncId(t, e, i = 0) {
    return js.setInterval(t.flush.bind(t, this), i);
  }
  recycleAsyncId(t, e, i = 0) {
    if (i != null && this.delay === i && this.pending === !1) return e;
    e != null && js.clearInterval(e);
  }
  execute(t, e) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let i = this._execute(t, e);
    if (i) return i;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, e) {
    let i = !1,
      r;
    try {
      this.work(t);
    } catch (o) {
      (i = !0), (r = o || new Error("Scheduled action threw falsy error"));
    }
    if (i) return this.unsubscribe(), r;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: e } = this,
        { actions: i } = e;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        vr(i, this),
        t != null && (this.id = this.recycleAsyncId(e, t, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Do = class n {
  constructor(t, e = n.now) {
    (this.schedulerActionCtor = t), (this.now = e);
  }
  schedule(t, e = 0, i) {
    return new this.schedulerActionCtor(this, t).schedule(i, e);
  }
};
Do.now = Vs.now;
var Co = class extends Do {
  constructor(t, e = Do.now) {
    super(t, e), (this.actions = []), (this._active = !1);
  }
  flush(t) {
    let { actions: e } = this;
    if (this._active) {
      e.push(t);
      return;
    }
    let i;
    this._active = !0;
    do if ((i = t.execute(t.state, t.delay))) break;
    while ((t = e.shift()));
    if (((this._active = !1), i)) {
      for (; (t = e.shift()); ) t.unsubscribe();
      throw i;
    }
  }
};
var br = new Co(Eo),
  Iy = br;
var ec = class extends Eo {
  constructor(t, e) {
    super(t, e), (this.scheduler = t), (this.work = e);
  }
  requestAsyncId(t, e, i = 0) {
    return i !== null && i > 0
      ? super.requestAsyncId(t, e, i)
      : (t.actions.push(this),
        t._scheduled ||
          (t._scheduled = wo.requestAnimationFrame(() => t.flush(void 0))));
  }
  recycleAsyncId(t, e, i = 0) {
    var r;
    if (i != null ? i > 0 : this.delay > 0)
      return super.recycleAsyncId(t, e, i);
    let { actions: o } = t;
    e != null &&
      e === t._scheduled &&
      ((r = o[o.length - 1]) === null || r === void 0 ? void 0 : r.id) !== e &&
      (wo.cancelAnimationFrame(e), (t._scheduled = void 0));
  }
};
var tc = class extends Co {
  flush(t) {
    this._active = !0;
    let e;
    t ? (e = t.id) : ((e = this._scheduled), (this._scheduled = void 0));
    let { actions: i } = this,
      r;
    t = t || i.shift();
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = i[0]) && t.id === e && i.shift());
    if (((this._active = !1), r)) {
      for (; (t = i[0]) && t.id === e && i.shift(); ) t.unsubscribe();
      throw r;
    }
  }
};
var nc = new tc(ec);
var ot = new H((n) => n.complete());
function ic(n) {
  return n && Q(n.schedule);
}
function Dh(n) {
  return n[n.length - 1];
}
function rc(n) {
  return Q(Dh(n)) ? n.pop() : void 0;
}
function Pn(n) {
  return ic(Dh(n)) ? n.pop() : void 0;
}
function Sy(n, t) {
  return typeof Dh(n) == "number" ? n.pop() : t;
}
function My(n, t, e, i) {
  function r(o) {
    return o instanceof e
      ? o
      : new e(function (s) {
          s(o);
        });
  }
  return new (e || (e = Promise))(function (o, s) {
    function a(d) {
      try {
        c(i.next(d));
      } catch (u) {
        s(u);
      }
    }
    function l(d) {
      try {
        c(i.throw(d));
      } catch (u) {
        s(u);
      }
    }
    function c(d) {
      d.done ? o(d.value) : r(d.value).then(a, l);
    }
    c((i = i.apply(n, t || [])).next());
  });
}
function xy(n) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    e = t && n[t],
    i = 0;
  if (e) return e.call(n);
  if (n && typeof n.length == "number")
    return {
      next: function () {
        return (
          n && i >= n.length && (n = void 0), { value: n && n[i++], done: !n }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function wr(n) {
  return this instanceof wr ? ((this.v = n), this) : new wr(n);
}
function Ty(n, t, e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var i = e.apply(n, t || []),
    r,
    o = [];
  return (
    (r = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (r[Symbol.asyncIterator] = function () {
      return this;
    }),
    r
  );
  function s(h) {
    return function (m) {
      return Promise.resolve(m).then(h, u);
    };
  }
  function a(h, m) {
    i[h] &&
      ((r[h] = function (g) {
        return new Promise(function (w, S) {
          o.push([h, g, w, S]) > 1 || l(h, g);
        });
      }),
      m && (r[h] = m(r[h])));
  }
  function l(h, m) {
    try {
      c(i[h](m));
    } catch (g) {
      p(o[0][3], g);
    }
  }
  function c(h) {
    h.value instanceof wr
      ? Promise.resolve(h.value.v).then(d, u)
      : p(o[0][2], h);
  }
  function d(h) {
    l("next", h);
  }
  function u(h) {
    l("throw", h);
  }
  function p(h, m) {
    h(m), o.shift(), o.length && l(o[0][0], o[0][1]);
  }
}
function Ry(n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = n[Symbol.asyncIterator],
    e;
  return t
    ? t.call(n)
    : ((n = typeof xy == "function" ? xy(n) : n[Symbol.iterator]()),
      (e = {}),
      i("next"),
      i("throw"),
      i("return"),
      (e[Symbol.asyncIterator] = function () {
        return this;
      }),
      e);
  function i(o) {
    e[o] =
      n[o] &&
      function (s) {
        return new Promise(function (a, l) {
          (s = n[o](s)), r(a, l, s.done, s.value);
        });
      };
  }
  function r(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var oc = (n) => n && typeof n.length == "number" && typeof n != "function";
function sc(n) {
  return Q(n?.then);
}
function ac(n) {
  return Q(n[_o]);
}
function lc(n) {
  return Symbol.asyncIterator && Q(n?.[Symbol.asyncIterator]);
}
function cc(n) {
  return new TypeError(
    `You provided ${
      n !== null && typeof n == "object" ? "an invalid object" : `'${n}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Yx() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var dc = Yx();
function uc(n) {
  return Q(n?.[dc]);
}
function fc(n) {
  return Ty(this, arguments, function* () {
    let e = n.getReader();
    try {
      for (;;) {
        let { value: i, done: r } = yield wr(e.read());
        if (r) return yield wr(void 0);
        yield yield wr(i);
      }
    } finally {
      e.releaseLock();
    }
  });
}
function hc(n) {
  return Q(n?.getReader);
}
function ye(n) {
  if (n instanceof H) return n;
  if (n != null) {
    if (ac(n)) return Kx(n);
    if (oc(n)) return Zx(n);
    if (sc(n)) return Qx(n);
    if (lc(n)) return Ay(n);
    if (uc(n)) return Xx(n);
    if (hc(n)) return Jx(n);
  }
  throw cc(n);
}
function Kx(n) {
  return new H((t) => {
    let e = n[_o]();
    if (Q(e.subscribe)) return e.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Zx(n) {
  return new H((t) => {
    for (let e = 0; e < n.length && !t.closed; e++) t.next(n[e]);
    t.complete();
  });
}
function Qx(n) {
  return new H((t) => {
    n.then(
      (e) => {
        t.closed || (t.next(e), t.complete());
      },
      (e) => t.error(e)
    ).then(null, Kl);
  });
}
function Xx(n) {
  return new H((t) => {
    for (let e of n) if ((t.next(e), t.closed)) return;
    t.complete();
  });
}
function Ay(n) {
  return new H((t) => {
    eM(n, t).catch((e) => t.error(e));
  });
}
function Jx(n) {
  return Ay(fc(n));
}
function eM(n, t) {
  var e, i, r, o;
  return My(this, void 0, void 0, function* () {
    try {
      for (e = Ry(n); (i = yield e.next()), !i.done; ) {
        let s = i.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        i && !i.done && (o = e.return) && (yield o.call(e));
      } finally {
        if (r) throw r.error;
      }
    }
    t.complete();
  });
}
function Ot(n, t, e, i = 0, r = !1) {
  let o = t.schedule(function () {
    e(), r ? n.add(this.schedule(null, i)) : this.unsubscribe();
  }, i);
  if ((n.add(o), !r)) return o;
}
function pc(n, t = 0) {
  return q((e, i) => {
    e.subscribe(
      $(
        i,
        (r) => Ot(i, n, () => i.next(r), t),
        () => Ot(i, n, () => i.complete(), t),
        (r) => Ot(i, n, () => i.error(r), t)
      )
    );
  });
}
function mc(n, t = 0) {
  return q((e, i) => {
    i.add(n.schedule(() => e.subscribe(i), t));
  });
}
function Ny(n, t) {
  return ye(n).pipe(mc(t), pc(t));
}
function Oy(n, t) {
  return ye(n).pipe(mc(t), pc(t));
}
function ky(n, t) {
  return new H((e) => {
    let i = 0;
    return t.schedule(function () {
      i === n.length
        ? e.complete()
        : (e.next(n[i++]), e.closed || this.schedule());
    });
  });
}
function Py(n, t) {
  return new H((e) => {
    let i;
    return (
      Ot(e, t, () => {
        (i = n[dc]()),
          Ot(
            e,
            t,
            () => {
              let r, o;
              try {
                ({ value: r, done: o } = i.next());
              } catch (s) {
                e.error(s);
                return;
              }
              o ? e.complete() : e.next(r);
            },
            0,
            !0
          );
      }),
      () => Q(i?.return) && i.return()
    );
  });
}
function gc(n, t) {
  if (!n) throw new Error("Iterable cannot be null");
  return new H((e) => {
    Ot(e, t, () => {
      let i = n[Symbol.asyncIterator]();
      Ot(
        e,
        t,
        () => {
          i.next().then((r) => {
            r.done ? e.complete() : e.next(r.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Fy(n, t) {
  return gc(fc(n), t);
}
function Ly(n, t) {
  if (n != null) {
    if (ac(n)) return Ny(n, t);
    if (oc(n)) return ky(n, t);
    if (sc(n)) return Oy(n, t);
    if (lc(n)) return gc(n, t);
    if (uc(n)) return Py(n, t);
    if (hc(n)) return Fy(n, t);
  }
  throw cc(n);
}
function Me(n, t) {
  return t ? Ly(n, t) : ye(n);
}
function I(...n) {
  let t = Pn(n);
  return Me(n, t);
}
function Ri(n, t) {
  let e = Q(n) ? n : () => n,
    i = (r) => r.error(e());
  return new H(t ? (r) => t.schedule(i, 0, r) : i);
}
function vc(n) {
  return !!n && (n instanceof H || (Q(n.lift) && Q(n.subscribe)));
}
var ti = mo(
  (n) =>
    function () {
      n(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Vy(n) {
  return n instanceof Date && !isNaN(n);
}
function R(n, t) {
  return q((e, i) => {
    let r = 0;
    e.subscribe(
      $(i, (o) => {
        i.next(n.call(t, o, r++));
      })
    );
  });
}
var { isArray: tM } = Array;
function nM(n, t) {
  return tM(t) ? n(...t) : n(t);
}
function _c(n) {
  return R((t) => nM(n, t));
}
var { isArray: iM } = Array,
  { getPrototypeOf: rM, prototype: oM, keys: sM } = Object;
function yc(n) {
  if (n.length === 1) {
    let t = n[0];
    if (iM(t)) return { args: t, keys: null };
    if (aM(t)) {
      let e = sM(t);
      return { args: e.map((i) => t[i]), keys: e };
    }
  }
  return { args: n, keys: null };
}
function aM(n) {
  return n && typeof n == "object" && rM(n) === oM;
}
function bc(n, t) {
  return n.reduce((e, i, r) => ((e[i] = t[r]), e), {});
}
function Io(...n) {
  let t = Pn(n),
    e = rc(n),
    { args: i, keys: r } = yc(n);
  if (i.length === 0) return Me([], t);
  let o = new H(lM(i, t, r ? (s) => bc(r, s) : It));
  return e ? o.pipe(_c(e)) : o;
}
function lM(n, t, e = It) {
  return (i) => {
    jy(
      t,
      () => {
        let { length: r } = n,
          o = new Array(r),
          s = r,
          a = r;
        for (let l = 0; l < r; l++)
          jy(
            t,
            () => {
              let c = Me(n[l], t),
                d = !1;
              c.subscribe(
                $(
                  i,
                  (u) => {
                    (o[l] = u), d || ((d = !0), a--), a || i.next(e(o.slice()));
                  },
                  () => {
                    --s || i.complete();
                  }
                )
              );
            },
            i
          );
      },
      i
    );
  };
}
function jy(n, t, e) {
  n ? Ot(e, n, t) : t();
}
function By(n, t, e, i, r, o, s, a) {
  let l = [],
    c = 0,
    d = 0,
    u = !1,
    p = () => {
      u && !l.length && !c && t.complete();
    },
    h = (g) => (c < i ? m(g) : l.push(g)),
    m = (g) => {
      o && t.next(g), c++;
      let w = !1;
      ye(e(g, d++)).subscribe(
        $(
          t,
          (S) => {
            r?.(S), o ? h(S) : t.next(S);
          },
          () => {
            w = !0;
          },
          void 0,
          () => {
            if (w)
              try {
                for (c--; l.length && c < i; ) {
                  let S = l.shift();
                  s ? Ot(t, s, () => m(S)) : m(S);
                }
                p();
              } catch (S) {
                t.error(S);
              }
          }
        )
      );
    };
  return (
    n.subscribe(
      $(t, h, () => {
        (u = !0), p();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Qe(n, t, e = 1 / 0) {
  return Q(t)
    ? Qe((i, r) => R((o, s) => t(i, o, r, s))(ye(n(i, r))), e)
    : (typeof t == "number" && (e = t), q((i, r) => By(i, r, n, e)));
}
function wc(n = 1 / 0) {
  return Qe(It, n);
}
function Hy() {
  return wc(1);
}
function Ai(...n) {
  return Hy()(Me(n, Pn(n)));
}
function Bs(n) {
  return new H((t) => {
    ye(n()).subscribe(t);
  });
}
function Er(...n) {
  let t = rc(n),
    { args: e, keys: i } = yc(n),
    r = new H((o) => {
      let { length: s } = e;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let d = 0; d < s; d++) {
        let u = !1;
        ye(e[d]).subscribe(
          $(
            o,
            (p) => {
              u || ((u = !0), c--), (a[d] = p);
            },
            () => l--,
            void 0,
            () => {
              (!l || !u) && (c || o.next(i ? bc(i, a) : a), o.complete());
            }
          )
        );
      }
    });
  return t ? r.pipe(_c(t)) : r;
}
function Ec(n = 0, t, e = Iy) {
  let i = -1;
  return (
    t != null && (ic(t) ? (e = t) : (i = t)),
    new H((r) => {
      let o = Vy(n) ? +n - e.now() : n;
      o < 0 && (o = 0);
      let s = 0;
      return e.schedule(function () {
        r.closed ||
          (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete());
      }, o);
    })
  );
}
function Ch(n = 0, t = br) {
  return n < 0 && (n = 0), Ec(n, n, t);
}
function kt(...n) {
  let t = Pn(n),
    e = Sy(n, 1 / 0),
    i = n;
  return i.length ? (i.length === 1 ? ye(i[0]) : wc(e)(Me(i, t))) : ot;
}
function ve(n, t) {
  return q((e, i) => {
    let r = 0;
    e.subscribe($(i, (o) => n.call(t, o, r++) && i.next(o)));
  });
}
function Uy(n) {
  return q((t, e) => {
    let i = !1,
      r = null,
      o = null,
      s = !1,
      a = () => {
        if ((o?.unsubscribe(), (o = null), i)) {
          i = !1;
          let c = r;
          (r = null), e.next(c);
        }
        s && e.complete();
      },
      l = () => {
        (o = null), s && e.complete();
      };
    t.subscribe(
      $(
        e,
        (c) => {
          (i = !0), (r = c), o || ye(n(c)).subscribe((o = $(e, a, l)));
        },
        () => {
          (s = !0), (!i || !o || o.closed) && e.complete();
        }
      )
    );
  });
}
function Dc(n, t = br) {
  return Uy(() => Ec(n, t));
}
function Fn(n) {
  return q((t, e) => {
    let i = null,
      r = !1,
      o;
    (i = t.subscribe(
      $(e, void 0, void 0, (s) => {
        (o = ye(n(s, Fn(n)(t)))),
          i ? (i.unsubscribe(), (i = null), o.subscribe(e)) : (r = !0);
      })
    )),
      r && (i.unsubscribe(), (i = null), o.subscribe(e));
  });
}
function zy(n, t, e, i, r) {
  return (o, s) => {
    let a = e,
      l = t,
      c = 0;
    o.subscribe(
      $(
        s,
        (d) => {
          let u = c++;
          (l = a ? n(l, d, u) : ((a = !0), d)), i && s.next(l);
        },
        r &&
          (() => {
            a && s.next(l), s.complete();
          })
      )
    );
  };
}
function Ni(n, t) {
  return Q(t) ? Qe(n, t, 1) : Qe(n, 1);
}
function Hs(n, t = br) {
  return q((e, i) => {
    let r = null,
      o = null,
      s = null,
      a = () => {
        if (r) {
          r.unsubscribe(), (r = null);
          let c = o;
          (o = null), i.next(c);
        }
      };
    function l() {
      let c = s + n,
        d = t.now();
      if (d < c) {
        (r = this.schedule(void 0, c - d)), i.add(r);
        return;
      }
      a();
    }
    e.subscribe(
      $(
        i,
        (c) => {
          (o = c), (s = t.now()), r || ((r = t.schedule(l, n)), i.add(r));
        },
        () => {
          a(), i.complete();
        },
        void 0,
        () => {
          o = r = null;
        }
      )
    );
  });
}
function Oi(n) {
  return q((t, e) => {
    let i = !1;
    t.subscribe(
      $(
        e,
        (r) => {
          (i = !0), e.next(r);
        },
        () => {
          i || e.next(n), e.complete();
        }
      )
    );
  });
}
function dt(n) {
  return n <= 0
    ? () => ot
    : q((t, e) => {
        let i = 0;
        t.subscribe(
          $(e, (r) => {
            ++i <= n && (e.next(r), n <= i && e.complete());
          })
        );
      });
}
function Cc(n, t = It) {
  return (
    (n = n ?? cM),
    q((e, i) => {
      let r,
        o = !0;
      e.subscribe(
        $(i, (s) => {
          let a = t(s);
          (o || !n(r, a)) && ((o = !1), (r = a), i.next(s));
        })
      );
    })
  );
}
function cM(n, t) {
  return n === t;
}
function Ic(n = dM) {
  return q((t, e) => {
    let i = !1;
    t.subscribe(
      $(
        e,
        (r) => {
          (i = !0), e.next(r);
        },
        () => (i ? e.complete() : e.error(n()))
      )
    );
  });
}
function dM() {
  return new ti();
}
function ki(n) {
  return q((t, e) => {
    try {
      t.subscribe(e);
    } finally {
      e.add(n);
    }
  });
}
function ni(n, t) {
  let e = arguments.length >= 2;
  return (i) =>
    i.pipe(
      n ? ve((r, o) => n(r, o, i)) : It,
      dt(1),
      e ? Oi(t) : Ic(() => new ti())
    );
}
function So(n) {
  return n <= 0
    ? () => ot
    : q((t, e) => {
        let i = [];
        t.subscribe(
          $(
            e,
            (r) => {
              i.push(r), n < i.length && i.shift();
            },
            () => {
              for (let r of i) e.next(r);
              e.complete();
            },
            void 0,
            () => {
              i = null;
            }
          )
        );
      });
}
function Ih(n, t) {
  let e = arguments.length >= 2;
  return (i) =>
    i.pipe(
      n ? ve((r, o) => n(r, o, i)) : It,
      So(1),
      e ? Oi(t) : Ic(() => new ti())
    );
}
function Sc() {
  return q((n, t) => {
    let e,
      i = !1;
    n.subscribe(
      $(t, (r) => {
        let o = e;
        (e = r), i && t.next([o, r]), (i = !0);
      })
    );
  });
}
function Sh(n, t) {
  return q(zy(n, t, arguments.length >= 2, !0));
}
function Us(n = {}) {
  let {
    connector: t = () => new E(),
    resetOnError: e = !0,
    resetOnComplete: i = !0,
    resetOnRefCountZero: r = !0,
  } = n;
  return (o) => {
    let s,
      a,
      l,
      c = 0,
      d = !1,
      u = !1,
      p = () => {
        a?.unsubscribe(), (a = void 0);
      },
      h = () => {
        p(), (s = l = void 0), (d = u = !1);
      },
      m = () => {
        let g = s;
        h(), g?.unsubscribe();
      };
    return q((g, w) => {
      c++, !u && !d && p();
      let S = (l = l ?? t());
      w.add(() => {
        c--, c === 0 && !u && !d && (a = xh(m, r));
      }),
        S.subscribe(w),
        !s &&
          c > 0 &&
          ((s = new ei({
            next: (ae) => S.next(ae),
            error: (ae) => {
              (u = !0), p(), (a = xh(h, e, ae)), S.error(ae);
            },
            complete: () => {
              (d = !0), p(), (a = xh(h, i)), S.complete();
            },
          })),
          ye(g).subscribe(s));
    })(o);
  };
}
function xh(n, t, ...e) {
  if (t === !0) {
    n();
    return;
  }
  if (t === !1) return;
  let i = new ei({
    next: () => {
      i.unsubscribe(), n();
    },
  });
  return ye(t(...e)).subscribe(i);
}
function xc(n, t, e) {
  let i,
    r = !1;
  return (
    n && typeof n == "object"
      ? ({
          bufferSize: i = 1 / 0,
          windowTime: t = 1 / 0,
          refCount: r = !1,
          scheduler: e,
        } = n)
      : (i = n ?? 1 / 0),
    Us({
      connector: () => new Xl(i, t, e),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: r,
    })
  );
}
function zs(n) {
  return ve((t, e) => n <= e);
}
function Xe(...n) {
  let t = Pn(n);
  return q((e, i) => {
    (t ? Ai(n, e, t) : Ai(n, e)).subscribe(i);
  });
}
function Be(n, t) {
  return q((e, i) => {
    let r = null,
      o = 0,
      s = !1,
      a = () => s && !r && i.complete();
    e.subscribe(
      $(
        i,
        (l) => {
          r?.unsubscribe();
          let c = 0,
            d = o++;
          ye(n(l, d)).subscribe(
            (r = $(
              i,
              (u) => i.next(t ? t(l, u, d, c++) : u),
              () => {
                (r = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Ie(n) {
  return q((t, e) => {
    ye(n).subscribe($(e, () => e.complete(), Ls)), !e.closed && t.subscribe(e);
  });
}
function we(n, t, e) {
  let i = Q(n) || t || e ? { next: n, error: t, complete: e } : n;
  return i
    ? q((r, o) => {
        var s;
        (s = i.subscribe) === null || s === void 0 || s.call(i);
        let a = !0;
        r.subscribe(
          $(
            o,
            (l) => {
              var c;
              (c = i.next) === null || c === void 0 || c.call(i, l), o.next(l);
            },
            () => {
              var l;
              (a = !1),
                (l = i.complete) === null || l === void 0 || l.call(i),
                o.complete();
            },
            (l) => {
              var c;
              (a = !1),
                (c = i.error) === null || c === void 0 || c.call(i, l),
                o.error(l);
            },
            () => {
              var l, c;
              a && ((l = i.unsubscribe) === null || l === void 0 || l.call(i)),
                (c = i.finalize) === null || c === void 0 || c.call(i);
            }
          )
        );
      })
    : It;
}
function $y(n) {
  let t = z(null);
  try {
    return n();
  } finally {
    z(t);
  }
}
var Nc =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  v = class extends Error {
    code;
    constructor(t, e) {
      super(xr(t, e)), (this.code = t);
    }
  };
function uM(n) {
  return `NG0${Math.abs(n)}`;
}
function xr(n, t) {
  return `${uM(n)}${t ? ": " + t : ""}`;
}
var Ln = globalThis;
function Te(n) {
  for (let t in n) if (n[t] === Te) return t;
  throw Error("");
}
function Yy(n, t) {
  for (let e in t) t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e]);
}
function Pt(n) {
  if (typeof n == "string") return n;
  if (Array.isArray(n)) return `[${n.map(Pt).join(", ")}]`;
  if (n == null) return "" + n;
  let t = n.overriddenName || n.name;
  if (t) return `${t}`;
  let e = n.toString();
  if (e == null) return "" + e;
  let i = e.indexOf(`
`);
  return i >= 0 ? e.slice(0, i) : e;
}
function Oc(n, t) {
  return n ? (t ? `${n} ${t}` : n) : t || "";
}
var fM = Te({ __forward_ref__: Te });
function mn(n) {
  return (
    (n.__forward_ref__ = mn),
    (n.toString = function () {
      return Pt(this());
    }),
    n
  );
}
function ut(n) {
  return jh(n) ? n() : n;
}
function jh(n) {
  return (
    typeof n == "function" && n.hasOwnProperty(fM) && n.__forward_ref__ === mn
  );
}
function Ky(n, t, e, i) {
  throw new Error(
    `ASSERTION ERROR: ${n}` +
      (i == null ? "" : ` [Expected=> ${e} ${i} ${t} <=Actual]`)
  );
}
function b(n) {
  return {
    token: n.token,
    providedIn: n.providedIn || null,
    factory: n.factory,
    value: void 0,
  };
}
function Y(n) {
  return { providers: n.providers || [], imports: n.imports || [] };
}
function Ys(n) {
  return hM(n, kc);
}
function Bh(n) {
  return Ys(n) !== null;
}
function hM(n, t) {
  return (n.hasOwnProperty(t) && n[t]) || null;
}
function pM(n) {
  let t = n?.[kc] ?? null;
  return t || null;
}
function Th(n) {
  return n && n.hasOwnProperty(Tc) ? n[Tc] : null;
}
var kc = Te({ ɵprov: Te }),
  Tc = Te({ ɵinj: Te }),
  y = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(t, e) {
      (this._desc = t),
        (this.ɵprov = void 0),
        typeof e == "number"
          ? (this.__NG_ELEMENT_ID__ = e)
          : e !== void 0 &&
            (this.ɵprov = b({
              token: this,
              providedIn: e.providedIn || "root",
              factory: e.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Hh(n) {
  return n && !!n.ɵproviders;
}
var Uh = Te({ ɵcmp: Te }),
  zh = Te({ ɵdir: Te }),
  $h = Te({ ɵpipe: Te }),
  Gh = Te({ ɵmod: Te }),
  Gs = Te({ ɵfac: Te }),
  Mr = Te({ __NG_ELEMENT_ID__: Te }),
  Gy = Te({ __NG_ENV_ID__: Te });
function Mo(n) {
  return typeof n == "string" ? n : n == null ? "" : String(n);
}
function Zy(n) {
  return typeof n == "function"
    ? n.name || n.toString()
    : typeof n == "object" && n != null && typeof n.type == "function"
    ? n.type.name || n.type.toString()
    : Mo(n);
}
function Wh(n, t) {
  throw new v(-200, n);
}
function Pc(n, t) {
  throw new v(-201, !1);
}
var Rh;
function Qy() {
  return Rh;
}
function St(n) {
  let t = Rh;
  return (Rh = n), t;
}
function qh(n, t, e) {
  let i = Ys(n);
  if (i && i.providedIn == "root")
    return i.value === void 0 ? (i.value = i.factory()) : i.value;
  if (e & 8) return null;
  if (t !== void 0) return t;
  Pc(n, "Injector");
}
var mM = {},
  Dr = mM,
  Ah = "__NG_DI_FLAG__",
  Nh = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, e) {
      let i = Cr(e) || 0;
      try {
        return this.injector.get(t, i & 8 ? null : Dr, i);
      } catch (r) {
        if (pr(r)) return r;
        throw r;
      }
    }
  },
  Rc = "ngTempTokenPath",
  gM = "ngTokenPath",
  vM = /\n/gm,
  _M = "\u0275",
  Wy = "__source";
function yM(n, t = 0) {
  let e = Fl();
  if (e === void 0) throw new v(-203, !1);
  if (e === null) return qh(n, void 0, t);
  {
    let i = bM(t),
      r = e.retrieve(n, i);
    if (pr(r)) {
      if (i.optional) return null;
      throw r;
    }
    return r;
  }
}
function A(n, t = 0) {
  return (Qy() || yM)(ut(n), t);
}
function f(n, t) {
  return A(n, Cr(t));
}
function Cr(n) {
  return typeof n > "u" || typeof n == "number"
    ? n
    : 0 | (n.optional && 8) | (n.host && 1) | (n.self && 2) | (n.skipSelf && 4);
}
function bM(n) {
  return {
    optional: !!(n & 8),
    host: !!(n & 1),
    self: !!(n & 2),
    skipSelf: !!(n & 4),
  };
}
function Oh(n) {
  let t = [];
  for (let e = 0; e < n.length; e++) {
    let i = ut(n[e]);
    if (Array.isArray(i)) {
      if (i.length === 0) throw new v(900, !1);
      let r,
        o = 0;
      for (let s = 0; s < i.length; s++) {
        let a = i[s],
          l = wM(a);
        typeof l == "number" ? (l === -1 ? (r = a.token) : (o |= l)) : (r = a);
      }
      t.push(A(r, o));
    } else t.push(A(i));
  }
  return t;
}
function Yh(n, t) {
  return (n[Ah] = t), (n.prototype[Ah] = t), n;
}
function wM(n) {
  return n[Ah];
}
function EM(n, t, e, i) {
  let r = n[Rc];
  throw (
    (t[Wy] && r.unshift(t[Wy]),
    (n.message = DM(
      `
` + n.message,
      r,
      e,
      i
    )),
    (n[gM] = r),
    (n[Rc] = null),
    n)
  );
}
function DM(n, t, e, i = null) {
  n =
    n &&
    n.charAt(0) ===
      `
` &&
    n.charAt(1) == _M
      ? n.slice(2)
      : n;
  let r = Pt(t);
  if (Array.isArray(t)) r = t.map(Pt).join(" -> ");
  else if (typeof t == "object") {
    let o = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : Pt(a)));
      }
    r = `{${o.join(", ")}}`;
  }
  return `${e}${i ? "(" + i + ")" : ""}[${r}]: ${n.replace(
    vM,
    `
  `
  )}`;
}
function Pi(n, t) {
  let e = n.hasOwnProperty(Gs);
  return e ? n[Gs] : null;
}
function Xy(n, t, e) {
  if (n.length !== t.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let r = n[i],
      o = t[i];
    if ((e && ((r = e(r)), (o = e(o))), o !== r)) return !1;
  }
  return !0;
}
function Jy(n) {
  return n.flat(Number.POSITIVE_INFINITY);
}
function Fc(n, t) {
  n.forEach((e) => (Array.isArray(e) ? Fc(e, t) : t(e)));
}
function Kh(n, t, e) {
  t >= n.length ? n.push(e) : n.splice(t, 0, e);
}
function Ks(n, t) {
  return t >= n.length - 1 ? n.pop() : n.splice(t, 1)[0];
}
function eb(n, t) {
  let e = [];
  for (let i = 0; i < n; i++) e.push(t);
  return e;
}
function tb(n, t, e, i) {
  let r = n.length;
  if (r == t) n.push(e, i);
  else if (r === 1) n.push(i, n[0]), (n[0] = e);
  else {
    for (r--, n.push(n[r - 1], n[r]); r > t; ) {
      let o = r - 2;
      (n[r] = n[o]), r--;
    }
    (n[t] = e), (n[t + 1] = i);
  }
}
function Lc(n, t, e) {
  let i = To(n, t);
  return i >= 0 ? (n[i | 1] = e) : ((i = ~i), tb(n, i, t, e)), i;
}
function Vc(n, t) {
  let e = To(n, t);
  if (e >= 0) return n[e | 1];
}
function To(n, t) {
  return CM(n, t, 1);
}
function CM(n, t, e) {
  let i = 0,
    r = n.length >> e;
  for (; r !== i; ) {
    let o = i + ((r - i) >> 1),
      s = n[o << e];
    if (t === s) return o << e;
    s > t ? (r = o) : (i = o + 1);
  }
  return ~(r << e);
}
var Li = {},
  _t = [],
  Vn = new y(""),
  Zh = new y("", -1),
  Qh = new y(""),
  Ws = class {
    get(t, e = Dr) {
      if (e === Dr)
        throw new Ns(`NullInjectorError: No provider for ${Pt(t)}!`);
      return e;
    }
  };
function Xh(n) {
  return n[Gh] || null;
}
function ri(n) {
  return n[Uh] || null;
}
function Jh(n) {
  return n[zh] || null;
}
function nb(n) {
  return n[$h] || null;
}
function oi(n) {
  return { ɵproviders: n };
}
function ib(n) {
  return oi([{ provide: Vn, multi: !0, useValue: n }]);
}
function rb(...n) {
  return { ɵproviders: ep(!0, n), ɵfromNgModule: !0 };
}
function ep(n, ...t) {
  let e = [],
    i = new Set(),
    r,
    o = (s) => {
      e.push(s);
    };
  return (
    Fc(t, (s) => {
      let a = s;
      Ac(a, o, [], i) && ((r ||= []), r.push(a));
    }),
    r !== void 0 && ob(r, o),
    e
  );
}
function ob(n, t) {
  for (let e = 0; e < n.length; e++) {
    let { ngModule: i, providers: r } = n[e];
    tp(r, (o) => {
      t(o, i);
    });
  }
}
function Ac(n, t, e, i) {
  if (((n = ut(n)), !n)) return !1;
  let r = null,
    o = Th(n),
    s = !o && ri(n);
  if (!o && !s) {
    let l = n.ngModule;
    if (((o = Th(l)), o)) r = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    r = n;
  }
  let a = i.has(r);
  if (s) {
    if (a) return !1;
    if ((i.add(r), s.dependencies)) {
      let l =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of l) Ac(c, t, e, i);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      i.add(r);
      let c;
      try {
        Fc(o.imports, (d) => {
          Ac(d, t, e, i) && ((c ||= []), c.push(d));
        });
      } finally {
      }
      c !== void 0 && ob(c, t);
    }
    if (!a) {
      let c = Pi(r) || (() => new r());
      t({ provide: r, useFactory: c, deps: _t }, r),
        t({ provide: Qh, useValue: r, multi: !0 }, r),
        t({ provide: Vn, useValue: () => A(r), multi: !0 }, r);
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = n;
      tp(l, (d) => {
        t(d, c);
      });
    }
  } else return !1;
  return r !== n && n.providers !== void 0;
}
function tp(n, t) {
  for (let e of n)
    Hh(e) && (e = e.ɵproviders), Array.isArray(e) ? tp(e, t) : t(e);
}
var IM = Te({ provide: String, useValue: Te });
function sb(n) {
  return n !== null && typeof n == "object" && IM in n;
}
function SM(n) {
  return !!(n && n.useExisting);
}
function xM(n) {
  return !!(n && n.useFactory);
}
function Ir(n) {
  return typeof n == "function";
}
function ab(n) {
  return !!n.useClass;
}
var Zs = new y(""),
  Mc = {},
  qy = {},
  Mh;
function Ro() {
  return Mh === void 0 && (Mh = new Ws()), Mh;
}
var Re = class {},
  Sr = class extends Re {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, e, i, r) {
      super(),
        (this.parent = e),
        (this.source = i),
        (this.scopes = r),
        Ph(t, (s) => this.processProvider(s)),
        this.records.set(Zh, xo(void 0, this)),
        r.has("environment") && this.records.set(Re, xo(void 0, this));
      let o = this.records.get(Zs);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Qh, _t, { self: !0 })));
    }
    retrieve(t, e) {
      let i = Cr(e) || 0;
      try {
        return this.get(t, Dr, i);
      } catch (r) {
        if (pr(r)) return r;
        throw r;
      }
    }
    destroy() {
      $s(this), (this._destroyed = !0);
      let t = z(null);
      try {
        for (let i of this._ngOnDestroyHooks) i.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let i of e) i();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          z(t);
      }
    }
    onDestroy(t) {
      return (
        $s(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      $s(this);
      let e = kn(this),
        i = St(void 0),
        r;
      try {
        return t();
      } finally {
        kn(e), St(i);
      }
    }
    get(t, e = Dr, i) {
      if (($s(this), t.hasOwnProperty(Gy))) return t[Gy](this);
      let r = Cr(i),
        o,
        s = kn(this),
        a = St(void 0);
      try {
        if (!(r & 4)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let d = NM(t) && Ys(t);
            d && this.injectableDefInScope(d)
              ? (c = xo(kh(t), Mc))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c, r);
        }
        let l = r & 2 ? Ro() : this.parent;
        return (e = r & 8 && e === Dr ? null : e), l.get(t, e);
      } catch (l) {
        if (pr(l)) {
          if (((l[Rc] = l[Rc] || []).unshift(Pt(t)), s)) throw l;
          return EM(l, t, "R3InjectorError", this.source);
        } else throw l;
      } finally {
        St(a), kn(s);
      }
    }
    resolveInjectorInitializers() {
      let t = z(null),
        e = kn(this),
        i = St(void 0),
        r;
      try {
        let o = this.get(Vn, _t, { self: !0 });
        for (let s of o) s();
      } finally {
        kn(e), St(i), z(t);
      }
    }
    toString() {
      let t = [],
        e = this.records;
      for (let i of e.keys()) t.push(Pt(i));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = ut(t);
      let e = Ir(t) ? t : ut(t && t.provide),
        i = TM(t);
      if (!Ir(t) && t.multi === !0) {
        let r = this.records.get(e);
        r ||
          ((r = xo(void 0, Mc, !0)),
          (r.factory = () => Oh(r.multi)),
          this.records.set(e, r)),
          (e = t),
          r.multi.push(t);
      }
      this.records.set(e, i);
    }
    hydrate(t, e, i) {
      let r = z(null);
      try {
        return (
          e.value === qy
            ? Wh(Pt(t))
            : e.value === Mc &&
              ((e.value = qy), (e.value = e.factory(void 0, i))),
          typeof e.value == "object" &&
            e.value &&
            AM(e.value) &&
            this._ngOnDestroyHooks.add(e.value),
          e.value
        );
      } finally {
        z(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let e = ut(t.providedIn);
      return typeof e == "string"
        ? e === "any" || this.scopes.has(e)
        : this.injectorDefTypes.has(e);
    }
    removeOnDestroy(t) {
      let e = this._onDestroyHooks.indexOf(t);
      e !== -1 && this._onDestroyHooks.splice(e, 1);
    }
  };
function kh(n) {
  let t = Ys(n),
    e = t !== null ? t.factory : Pi(n);
  if (e !== null) return e;
  if (n instanceof y) throw new v(204, !1);
  if (n instanceof Function) return MM(n);
  throw new v(204, !1);
}
function MM(n) {
  if (n.length > 0) throw new v(204, !1);
  let e = pM(n);
  return e !== null ? () => e.factory(n) : () => new n();
}
function TM(n) {
  if (sb(n)) return xo(void 0, n.useValue);
  {
    let t = np(n);
    return xo(t, Mc);
  }
}
function np(n, t, e) {
  let i;
  if (Ir(n)) {
    let r = ut(n);
    return Pi(r) || kh(r);
  } else if (sb(n)) i = () => ut(n.useValue);
  else if (xM(n)) i = () => n.useFactory(...Oh(n.deps || []));
  else if (SM(n))
    i = (r, o) => A(ut(n.useExisting), o !== void 0 && o & 8 ? 8 : void 0);
  else {
    let r = ut(n && (n.useClass || n.provide));
    if (RM(n)) i = () => new r(...Oh(n.deps));
    else return Pi(r) || kh(r);
  }
  return i;
}
function $s(n) {
  if (n.destroyed) throw new v(205, !1);
}
function xo(n, t, e = !1) {
  return { factory: n, value: t, multi: e ? [] : void 0 };
}
function RM(n) {
  return !!n.deps;
}
function AM(n) {
  return (
    n !== null && typeof n == "object" && typeof n.ngOnDestroy == "function"
  );
}
function NM(n) {
  return (
    typeof n == "function" ||
    (typeof n == "object" && n.ngMetadataName === "InjectionToken")
  );
}
function Ph(n, t) {
  for (let e of n)
    Array.isArray(e) ? Ph(e, t) : e && Hh(e) ? Ph(e.ɵproviders, t) : t(e);
}
function yt(n, t) {
  let e;
  n instanceof Sr ? ($s(n), (e = n)) : (e = new Nh(n));
  let i,
    r = kn(e),
    o = St(void 0);
  try {
    return t();
  } finally {
    kn(r), St(o);
  }
}
function lb() {
  return Qy() !== void 0 || Fl() != null;
}
var gn = 0,
  F = 1,
  V = 2,
  st = 3,
  nn = 4,
  xt = 5,
  Ao = 6,
  No = 7,
  ht = 8,
  Tr = 9,
  si = 10,
  Ee = 11,
  Oo = 12,
  ip = 13,
  Rr = 14,
  Ft = 15,
  Vi = 16,
  Ar = 17,
  jn = 18,
  Qs = 19,
  rp = 20,
  ii = 21,
  jc = 22,
  ai = 23,
  Wt = 24,
  Nr = 25,
  Fe = 26,
  cb = 1;
var ji = 7,
  Xs = 8,
  Or = 9,
  bt = 10;
function Bn(n) {
  return Array.isArray(n) && typeof n[cb] == "object";
}
function vn(n) {
  return Array.isArray(n) && n[cb] === !0;
}
function op(n) {
  return (n.flags & 4) !== 0;
}
function Bi(n) {
  return n.componentOffset > -1;
}
function Js(n) {
  return (n.flags & 1) === 1;
}
function Hn(n) {
  return !!n.template;
}
function ko(n) {
  return (n[V] & 512) !== 0;
}
function kr(n) {
  return (n[V] & 256) === 256;
}
var sp = "svg",
  db = "math";
function rn(n) {
  for (; Array.isArray(n); ) n = n[gn];
  return n;
}
function ap(n, t) {
  return rn(t[n]);
}
function _n(n, t) {
  return rn(t[n.index]);
}
function ea(n, t) {
  return n.data[t];
}
function Bc(n, t) {
  return n[t];
}
function lp(n, t, e, i) {
  e >= n.data.length && ((n.data[e] = null), (n.blueprint[e] = null)),
    (t[e] = i);
}
function on(n, t) {
  let e = t[n];
  return Bn(e) ? e : e[gn];
}
function ub(n) {
  return (n[V] & 4) === 4;
}
function Hc(n) {
  return (n[V] & 128) === 128;
}
function fb(n) {
  return vn(n[st]);
}
function yn(n, t) {
  return t == null ? null : n[t];
}
function cp(n) {
  n[Ar] = 0;
}
function dp(n) {
  n[V] & 1024 || ((n[V] |= 1024), Hc(n) && Hi(n));
}
function hb(n, t) {
  for (; n > 0; ) (t = t[Rr]), n--;
  return t;
}
function ta(n) {
  return !!(n[V] & 9216 || n[Wt]?.dirty);
}
function Uc(n) {
  n[si].changeDetectionScheduler?.notify(8),
    n[V] & 64 && (n[V] |= 1024),
    ta(n) && Hi(n);
}
function Hi(n) {
  n[si].changeDetectionScheduler?.notify(0);
  let t = Fi(n);
  for (; t !== null && !(t[V] & 8192 || ((t[V] |= 8192), !Hc(t))); ) t = Fi(t);
}
function up(n, t) {
  if (kr(n)) throw new v(911, !1);
  n[ii] === null && (n[ii] = []), n[ii].push(t);
}
function pb(n, t) {
  if (n[ii] === null) return;
  let e = n[ii].indexOf(t);
  e !== -1 && n[ii].splice(e, 1);
}
function Fi(n) {
  let t = n[st];
  return vn(t) ? t[st] : t;
}
function fp(n) {
  return (n[No] ??= []);
}
function hp(n) {
  return (n.cleanup ??= []);
}
function mb(n, t, e, i) {
  let r = fp(t);
  r.push(e), n.firstCreatePass && hp(n).push(i, r.length - 1);
}
var ee = {
    lFrame: xb(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null,
  },
  na = (function (n) {
    return (
      (n[(n.Off = 0)] = "Off"),
      (n[(n.Exhaustive = 1)] = "Exhaustive"),
      (n[(n.OnlyDirtyViews = 2)] = "OnlyDirtyViews"),
      n
    );
  })(na || {}),
  OM = 0,
  Fh = !1;
function gb() {
  return ee.lFrame.elementDepthCount;
}
function vb() {
  ee.lFrame.elementDepthCount++;
}
function pp() {
  ee.lFrame.elementDepthCount--;
}
function mp() {
  return ee.bindingsEnabled;
}
function gp() {
  return ee.skipHydrationRootTNode !== null;
}
function vp(n) {
  return ee.skipHydrationRootTNode === n;
}
function _p() {
  ee.skipHydrationRootTNode = null;
}
function G() {
  return ee.lFrame.lView;
}
function Ae() {
  return ee.lFrame.tView;
}
function Je(n) {
  return (ee.lFrame.contextLView = n), n[ht];
}
function et(n) {
  return (ee.lFrame.contextLView = null), n;
}
function tt() {
  let n = yp();
  for (; n !== null && n.type === 64; ) n = n.parent;
  return n;
}
function yp() {
  return ee.lFrame.currentTNode;
}
function _b() {
  let n = ee.lFrame,
    t = n.currentTNode;
  return n.isParent ? t : t.parent;
}
function Po(n, t) {
  let e = ee.lFrame;
  (e.currentTNode = n), (e.isParent = t);
}
function bp() {
  return ee.lFrame.isParent;
}
function wp() {
  ee.lFrame.isParent = !1;
}
function yb() {
  return ee.lFrame.contextLView;
}
function Ep(n) {
  Ky("Must never be called in production mode"), (OM = n);
}
function Dp() {
  return Fh;
}
function Fo(n) {
  let t = Fh;
  return (Fh = n), t;
}
function Cp() {
  let n = ee.lFrame,
    t = n.bindingRootIndex;
  return t === -1 && (t = n.bindingRootIndex = n.tView.bindingStartIndex), t;
}
function bb() {
  return ee.lFrame.bindingIndex;
}
function wb(n) {
  return (ee.lFrame.bindingIndex = n);
}
function Pr() {
  return ee.lFrame.bindingIndex++;
}
function zc(n) {
  let t = ee.lFrame,
    e = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + n), e;
}
function Eb() {
  return ee.lFrame.inI18n;
}
function Db(n, t) {
  let e = ee.lFrame;
  (e.bindingIndex = e.bindingRootIndex = n), $c(t);
}
function Cb() {
  return ee.lFrame.currentDirectiveIndex;
}
function $c(n) {
  ee.lFrame.currentDirectiveIndex = n;
}
function Ib(n) {
  let t = ee.lFrame.currentDirectiveIndex;
  return t === -1 ? null : n[t];
}
function Gc() {
  return ee.lFrame.currentQueryIndex;
}
function ia(n) {
  ee.lFrame.currentQueryIndex = n;
}
function kM(n) {
  let t = n[F];
  return t.type === 2 ? t.declTNode : t.type === 1 ? n[xt] : null;
}
function Ip(n, t, e) {
  if (e & 4) {
    let r = t,
      o = n;
    for (; (r = r.parent), r === null && !(e & 1); )
      if (((r = kM(o)), r === null || ((o = o[Rr]), r.type & 10))) break;
    if (r === null) return !1;
    (t = r), (n = o);
  }
  let i = (ee.lFrame = Sb());
  return (i.currentTNode = t), (i.lView = n), !0;
}
function Wc(n) {
  let t = Sb(),
    e = n[F];
  (ee.lFrame = t),
    (t.currentTNode = e.firstChild),
    (t.lView = n),
    (t.tView = e),
    (t.contextLView = n),
    (t.bindingIndex = e.bindingStartIndex),
    (t.inI18n = !1);
}
function Sb() {
  let n = ee.lFrame,
    t = n === null ? null : n.child;
  return t === null ? xb(n) : t;
}
function xb(n) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: n,
    child: null,
    inI18n: !1,
  };
  return n !== null && (n.child = t), t;
}
function Mb() {
  let n = ee.lFrame;
  return (ee.lFrame = n.parent), (n.currentTNode = null), (n.lView = null), n;
}
var Sp = Mb;
function qc() {
  let n = Mb();
  (n.isParent = !0),
    (n.tView = null),
    (n.selectedIndex = -1),
    (n.contextLView = null),
    (n.elementDepthCount = 0),
    (n.currentDirectiveIndex = -1),
    (n.currentNamespace = null),
    (n.bindingRootIndex = -1),
    (n.bindingIndex = -1),
    (n.currentQueryIndex = 0);
}
function Tb(n) {
  return (ee.lFrame.contextLView = hb(n, ee.lFrame.contextLView))[ht];
}
function li() {
  return ee.lFrame.selectedIndex;
}
function Ui(n) {
  ee.lFrame.selectedIndex = n;
}
function ra() {
  let n = ee.lFrame;
  return ea(n.tView, n.selectedIndex);
}
function oa() {
  ee.lFrame.currentNamespace = sp;
}
function Rb() {
  return ee.lFrame.currentNamespace;
}
var Ab = !0;
function Yc() {
  return Ab;
}
function Kc(n) {
  Ab = n;
}
function Lh(n, t = null, e = null, i) {
  let r = xp(n, t, e, i);
  return r.resolveInjectorInitializers(), r;
}
function xp(n, t = null, e = null, i, r = new Set()) {
  let o = [e || _t, rb(n)];
  return (
    (i = i || (typeof n == "object" ? void 0 : Pt(n))),
    new Sr(o, t || Ro(), i || null, r)
  );
}
var te = class n {
    static THROW_IF_NOT_FOUND = Dr;
    static NULL = new Ws();
    static create(t, e) {
      if (Array.isArray(t)) return Lh({ name: "" }, e, t, "");
      {
        let i = t.name ?? "";
        return Lh({ name: i }, t.parent, t.providers, i);
      }
    }
    static ɵprov = b({ token: n, providedIn: "any", factory: () => A(Zh) });
    static __NG_ELEMENT_ID__ = -1;
  },
  O = new y(""),
  qt = (() => {
    class n {
      static __NG_ELEMENT_ID__ = PM;
      static __NG_ENV_ID__ = (e) => e;
    }
    return n;
  })(),
  qs = class extends qt {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    get destroyed() {
      return kr(this._lView);
    }
    onDestroy(t) {
      let e = this._lView;
      return up(e, t), () => pb(e, t);
    }
  };
function PM() {
  return new qs(G());
}
var ft = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  Yt = new y("", {
    providedIn: "root",
    factory: () => {
      let n = f(Re),
        t;
      return (e) => {
        n.destroyed && !t
          ? setTimeout(() => {
              throw e;
            })
          : ((t ??= n.get(ft)), t.handleError(e));
      };
    },
  }),
  Nb = { provide: Vn, useValue: () => void f(ft), multi: !0 },
  FM = new y("", {
    providedIn: "root",
    factory: () => {
      let n = f(O).defaultView;
      if (!n) return;
      let t = f(Yt),
        e = (o) => {
          t(o.reason), o.preventDefault();
        },
        i = (o) => {
          o.error ? t(o.error) : t(new Error(o.message, { cause: o })),
            o.preventDefault();
        },
        r = () => {
          n.addEventListener("unhandledrejection", e),
            n.addEventListener("error", i);
        };
      typeof Zone < "u" ? Zone.root.run(r) : r(),
        f(qt).onDestroy(() => {
          n.removeEventListener("error", i),
            n.removeEventListener("unhandledrejection", e);
        });
    },
  });
function Mp() {
  return oi([ib(() => void f(FM))]);
}
function zi(n) {
  return typeof n == "function" && n[Ze] !== void 0;
}
function Ne(n, t) {
  let [e, i, r] = fh(n, t?.equal),
    o = e,
    s = o[Ze];
  return (o.set = i), (o.update = r), (o.asReadonly = Tp.bind(o)), o;
}
function Tp() {
  let n = this[Ze];
  if (n.readonlyFn === void 0) {
    let t = () => this();
    (t[Ze] = n), (n.readonlyFn = t);
  }
  return n.readonlyFn;
}
function Rp(n) {
  return zi(n) && typeof n.set == "function";
}
var tn = class {},
  Lo = new y("", { providedIn: "root", factory: () => !1 });
var Ap = new y(""),
  Zc = new y("");
var Fr = (() => {
  class n {
    view;
    node;
    constructor(e, i) {
      (this.view = e), (this.node = i);
    }
    static __NG_ELEMENT_ID__ = LM;
  }
  return n;
})();
function LM() {
  return new Fr(G(), tt());
}
var $i = (() => {
  class n {
    taskId = 0;
    pendingTasks = new Set();
    destroyed = !1;
    pendingTask = new je(!1);
    get hasPendingTasks() {
      return this.destroyed ? !1 : this.pendingTask.value;
    }
    get hasPendingTasksObservable() {
      return this.destroyed
        ? new H((e) => {
            e.next(!1), e.complete();
          })
        : this.pendingTask;
    }
    add() {
      !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
      let e = this.taskId++;
      return this.pendingTasks.add(e), e;
    }
    has(e) {
      return this.pendingTasks.has(e);
    }
    remove(e) {
      this.pendingTasks.delete(e),
        this.pendingTasks.size === 0 &&
          this.hasPendingTasks &&
          this.pendingTask.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this.hasPendingTasks && this.pendingTask.next(!1),
        (this.destroyed = !0),
        this.pendingTask.unsubscribe();
    }
    static ɵprov = b({ token: n, providedIn: "root", factory: () => new n() });
  }
  return n;
})();
function Lr(...n) {}
var sa = (() => {
    class n {
      static ɵprov = b({
        token: n,
        providedIn: "root",
        factory: () => new Vh(),
      });
    }
    return n;
  })(),
  Vh = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      this.enqueue(t), this.schedule(t);
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let e = t.zone,
        i = this.queues.get(e);
      i.has(t) && (i.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let e = t.zone;
      this.queues.has(e) || this.queues.set(e, new Set());
      let i = this.queues.get(e);
      i.has(t) || i.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = !1;
        for (let [e, i] of this.queues)
          e === null
            ? (t ||= this.flushQueue(i))
            : (t ||= e.run(() => this.flushQueue(i)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let e = !1;
      for (let i of t) i.dirty && (this.dirtyEffectCount--, (e = !0), i.run());
      return e;
    }
  };
function zo(n) {
  return { toString: n }.toString();
}
var Qc = "__parameters__";
function $M(n) {
  return function (...e) {
    if (n) {
      let i = n(...e);
      for (let r in i) this[r] = i[r];
    }
  };
}
function dw(n, t, e) {
  return zo(() => {
    let i = $M(t);
    function r(...o) {
      if (this instanceof r) return i.apply(this, o), this;
      let s = new r(...o);
      return (a.annotation = s), a;
      function a(l, c, d) {
        let u = l.hasOwnProperty(Qc)
          ? l[Qc]
          : Object.defineProperty(l, Qc, { value: [] })[Qc];
        for (; u.length <= d; ) u.push(null);
        return (u[d] = u[d] || []).push(s), l;
      }
    }
    return (r.prototype.ngMetadataName = n), (r.annotationCls = r), r;
  });
}
var ma = Yh(dw("Optional"), 8);
var Em = Yh(dw("SkipSelf"), 4);
function GM(n) {
  return typeof n == "function";
}
var sd = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, e, i) {
    (this.previousValue = t), (this.currentValue = e), (this.firstChange = i);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function uw(n, t, e, i) {
  t !== null ? t.applyValueToInputSignal(t, i) : (n[e] = i);
}
var wt = (() => {
  let n = () => fw;
  return (n.ngInherit = !0), n;
})();
function fw(n) {
  return n.type.prototype.ngOnChanges && (n.setInput = qM), WM;
}
function WM() {
  let n = pw(this),
    t = n?.current;
  if (t) {
    let e = n.previous;
    if (e === Li) n.previous = t;
    else for (let i in t) e[i] = t[i];
    (n.current = null), this.ngOnChanges(t);
  }
}
function qM(n, t, e, i, r) {
  let o = this.declaredInputs[i],
    s = pw(n) || YM(n, { previous: Li, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  (a[o] = new sd(c && c.currentValue, e, l === Li)), uw(n, t, r, e);
}
var hw = "__ngSimpleChanges__";
function pw(n) {
  return n[hw] || null;
}
function YM(n, t) {
  return (n[hw] = t);
}
var Ob = [];
var ge = function (n, t = null, e) {
  for (let i = 0; i < Ob.length; i++) {
    let r = Ob[i];
    r(n, t, e);
  }
};
function KM(n, t, e) {
  let { ngOnChanges: i, ngOnInit: r, ngDoCheck: o } = t.type.prototype;
  if (i) {
    let s = fw(t);
    (e.preOrderHooks ??= []).push(n, s),
      (e.preOrderCheckHooks ??= []).push(n, s);
  }
  r && (e.preOrderHooks ??= []).push(0 - n, r),
    o &&
      ((e.preOrderHooks ??= []).push(n, o),
      (e.preOrderCheckHooks ??= []).push(n, o));
}
function mw(n, t) {
  for (let e = t.directiveStart, i = t.directiveEnd; e < i; e++) {
    let o = n.data[e].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: d,
      } = o;
    s && (n.contentHooks ??= []).push(-e, s),
      a &&
        ((n.contentHooks ??= []).push(e, a),
        (n.contentCheckHooks ??= []).push(e, a)),
      l && (n.viewHooks ??= []).push(-e, l),
      c &&
        ((n.viewHooks ??= []).push(e, c), (n.viewCheckHooks ??= []).push(e, c)),
      d != null && (n.destroyHooks ??= []).push(e, d);
  }
}
function td(n, t, e) {
  gw(n, t, 3, e);
}
function nd(n, t, e, i) {
  (n[V] & 3) === e && gw(n, t, e, i);
}
function Np(n, t) {
  let e = n[V];
  (e & 3) === t && ((e &= 16383), (e += 1), (n[V] = e));
}
function gw(n, t, e, i) {
  let r = i !== void 0 ? n[Ar] & 65535 : 0,
    o = i ?? -1,
    s = t.length - 1,
    a = 0;
  for (let l = r; l < s; l++)
    if (typeof t[l + 1] == "number") {
      if (((a = t[l]), i != null && a >= i)) break;
    } else
      t[l] < 0 && (n[Ar] += 65536),
        (a < o || o == -1) &&
          (ZM(n, e, t, l), (n[Ar] = (n[Ar] & 4294901760) + l + 2)),
        l++;
}
function kb(n, t) {
  ge(4, n, t);
  let e = z(null);
  try {
    t.call(n);
  } finally {
    z(e), ge(5, n, t);
  }
}
function ZM(n, t, e, i) {
  let r = e[i] < 0,
    o = e[i + 1],
    s = r ? -e[i] : e[i],
    a = n[s];
  r
    ? n[V] >> 14 < n[Ar] >> 16 &&
      (n[V] & 3) === t &&
      ((n[V] += 16384), kb(a, o))
    : kb(a, o);
}
var jo = -1,
  Br = class {
    factory;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, e, i) {
      (this.factory = t), (this.canSeeViewProviders = e), (this.injectImpl = i);
    }
  };
function QM(n) {
  return (n.flags & 8) !== 0;
}
function XM(n) {
  return (n.flags & 16) !== 0;
}
function JM(n, t, e) {
  let i = 0;
  for (; i < e.length; ) {
    let r = e[i];
    if (typeof r == "number") {
      if (r !== 0) break;
      i++;
      let o = e[i++],
        s = e[i++],
        a = e[i++];
      n.setAttribute(t, s, a, o);
    } else {
      let o = r,
        s = e[++i];
      eT(o) ? n.setProperty(t, o, s) : n.setAttribute(t, o, s), i++;
    }
  }
  return i;
}
function vw(n) {
  return n === 3 || n === 4 || n === 6;
}
function eT(n) {
  return n.charCodeAt(0) === 64;
}
function Bo(n, t) {
  if (!(t === null || t.length === 0))
    if (n === null || n.length === 0) n = t.slice();
    else {
      let e = -1;
      for (let i = 0; i < t.length; i++) {
        let r = t[i];
        typeof r == "number"
          ? (e = r)
          : e === 0 ||
            (e === -1 || e === 2
              ? Pb(n, e, r, null, t[++i])
              : Pb(n, e, r, null, null));
      }
    }
  return n;
}
function Pb(n, t, e, i, r) {
  let o = 0,
    s = n.length;
  if (t === -1) s = -1;
  else
    for (; o < n.length; ) {
      let a = n[o++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < n.length; ) {
    let a = n[o];
    if (typeof a == "number") break;
    if (a === e) {
      r !== null && (n[o + 1] = r);
      return;
    }
    o++, r !== null && o++;
  }
  s !== -1 && (n.splice(s, 0, t), (o = s + 1)),
    n.splice(o++, 0, e),
    r !== null && n.splice(o++, 0, r);
}
function _w(n) {
  return n !== jo;
}
function ad(n) {
  return n & 32767;
}
function tT(n) {
  return n >> 16;
}
function ld(n, t) {
  let e = tT(n),
    i = t;
  for (; e > 0; ) (i = i[Rr]), e--;
  return i;
}
var Up = !0;
function cd(n) {
  let t = Up;
  return (Up = n), t;
}
var nT = 256,
  yw = nT - 1,
  bw = 5,
  iT = 0,
  Un = {};
function rT(n, t, e) {
  let i;
  typeof e == "string"
    ? (i = e.charCodeAt(0) || 0)
    : e.hasOwnProperty(Mr) && (i = e[Mr]),
    i == null && (i = e[Mr] = iT++);
  let r = i & yw,
    o = 1 << r;
  t.data[n + (r >> bw)] |= o;
}
function dd(n, t) {
  let e = ww(n, t);
  if (e !== -1) return e;
  let i = t[F];
  i.firstCreatePass &&
    ((n.injectorIndex = t.length),
    Op(i.data, n),
    Op(t, null),
    Op(i.blueprint, null));
  let r = Dm(n, t),
    o = n.injectorIndex;
  if (_w(r)) {
    let s = ad(r),
      a = ld(r, t),
      l = a[F].data;
    for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | l[s + c];
  }
  return (t[o + 8] = r), o;
}
function Op(n, t) {
  n.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function ww(n, t) {
  return n.injectorIndex === -1 ||
    (n.parent && n.parent.injectorIndex === n.injectorIndex) ||
    t[n.injectorIndex + 8] === null
    ? -1
    : n.injectorIndex;
}
function Dm(n, t) {
  if (n.parent && n.parent.injectorIndex !== -1) return n.parent.injectorIndex;
  let e = 0,
    i = null,
    r = t;
  for (; r !== null; ) {
    if (((i = Sw(r)), i === null)) return jo;
    if ((e++, (r = r[Rr]), i.injectorIndex !== -1))
      return i.injectorIndex | (e << 16);
  }
  return jo;
}
function zp(n, t, e) {
  rT(n, t, e);
}
function oT(n, t) {
  if (t === "class") return n.classes;
  if (t === "style") return n.styles;
  let e = n.attrs;
  if (e) {
    let i = e.length,
      r = 0;
    for (; r < i; ) {
      let o = e[r];
      if (vw(o)) break;
      if (o === 0) r = r + 2;
      else if (typeof o == "number")
        for (r++; r < i && typeof e[r] == "string"; ) r++;
      else {
        if (o === t) return e[r + 1];
        r = r + 2;
      }
    }
  }
  return null;
}
function Ew(n, t, e) {
  if (e & 8 || n !== void 0) return n;
  Pc(t, "NodeInjector");
}
function Dw(n, t, e, i) {
  if ((e & 8 && i === void 0 && (i = null), (e & 3) === 0)) {
    let r = n[Tr],
      o = St(void 0);
    try {
      return r ? r.get(t, i, e & 8) : qh(t, i, e & 8);
    } finally {
      St(o);
    }
  }
  return Ew(i, t, e);
}
function Cw(n, t, e, i = 0, r) {
  if (n !== null) {
    if (t[V] & 2048 && !(i & 2)) {
      let s = cT(n, t, e, i, Un);
      if (s !== Un) return s;
    }
    let o = Iw(n, t, e, i, Un);
    if (o !== Un) return o;
  }
  return Dw(t, e, i, r);
}
function Iw(n, t, e, i, r) {
  let o = aT(e);
  if (typeof o == "function") {
    if (!Ip(t, n, i)) return i & 1 ? Ew(r, e, i) : Dw(t, e, i, r);
    try {
      let s;
      if (((s = o(i)), s == null && !(i & 8))) Pc(e);
      else return s;
    } finally {
      Sp();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = ww(n, t),
      l = jo,
      c = i & 1 ? t[Ft][xt] : null;
    for (
      (a === -1 || i & 4) &&
      ((l = a === -1 ? Dm(n, t) : t[a + 8]),
      l === jo || !Lb(i, !1)
        ? (a = -1)
        : ((s = t[F]), (a = ad(l)), (t = ld(l, t))));
      a !== -1;

    ) {
      let d = t[F];
      if (Fb(o, a, d.data)) {
        let u = sT(a, t, e, s, i, c);
        if (u !== Un) return u;
      }
      (l = t[a + 8]),
        l !== jo && Lb(i, t[F].data[a + 8] === c) && Fb(o, a, t)
          ? ((s = d), (a = ad(l)), (t = ld(l, t)))
          : (a = -1);
    }
  }
  return r;
}
function sT(n, t, e, i, r, o) {
  let s = t[F],
    a = s.data[n + 8],
    l = i == null ? Bi(a) && Up : i != s && (a.type & 3) !== 0,
    c = r & 1 && o === a,
    d = id(a, s, e, l, c);
  return d !== null ? ca(t, s, d, a, r) : Un;
}
function id(n, t, e, i, r) {
  let o = n.providerIndexes,
    s = t.data,
    a = o & 1048575,
    l = n.directiveStart,
    c = n.directiveEnd,
    d = o >> 20,
    u = i ? a : a + d,
    p = r ? a + d : c;
  for (let h = u; h < p; h++) {
    let m = s[h];
    if ((h < l && e === m) || (h >= l && m.type === e)) return h;
  }
  if (r) {
    let h = s[l];
    if (h && Hn(h) && h.type === e) return l;
  }
  return null;
}
function ca(n, t, e, i, r) {
  let o = n[e],
    s = t.data;
  if (o instanceof Br) {
    let a = o;
    a.resolving && Wh(Zy(s[e]));
    let l = cd(a.canSeeViewProviders);
    a.resolving = !0;
    let c = s[e].type || s[e],
      d,
      u = a.injectImpl ? St(a.injectImpl) : null,
      p = Ip(n, i, 0);
    try {
      (o = n[e] = a.factory(void 0, r, s, n, i)),
        t.firstCreatePass && e >= i.directiveStart && KM(e, s[e], t);
    } finally {
      u !== null && St(u), cd(l), (a.resolving = !1), Sp();
    }
  }
  return o;
}
function aT(n) {
  if (typeof n == "string") return n.charCodeAt(0) || 0;
  let t = n.hasOwnProperty(Mr) ? n[Mr] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & yw : lT) : t;
}
function Fb(n, t, e) {
  let i = 1 << n;
  return !!(e[t + (n >> bw)] & i);
}
function Lb(n, t) {
  return !(n & 2) && !(n & 1 && t);
}
var jr = class {
  _tNode;
  _lView;
  constructor(t, e) {
    (this._tNode = t), (this._lView = e);
  }
  get(t, e, i) {
    return Cw(this._tNode, this._lView, t, Cr(i), e);
  }
};
function lT() {
  return new jr(tt(), G());
}
function Cn(n) {
  return zo(() => {
    let t = n.prototype.constructor,
      e = t[Gs] || $p(t),
      i = Object.prototype,
      r = Object.getPrototypeOf(n.prototype).constructor;
    for (; r && r !== i; ) {
      let o = r[Gs] || $p(r);
      if (o && o !== e) return o;
      r = Object.getPrototypeOf(r);
    }
    return (o) => new o();
  });
}
function $p(n) {
  return jh(n)
    ? () => {
        let t = $p(ut(n));
        return t && t();
      }
    : Pi(n);
}
function cT(n, t, e, i, r) {
  let o = n,
    s = t;
  for (; o !== null && s !== null && s[V] & 2048 && !ko(s); ) {
    let a = Iw(o, s, e, i | 2, Un);
    if (a !== Un) return a;
    let l = o.parent;
    if (!l) {
      let c = s[rp];
      if (c) {
        let d = c.get(e, Un, i);
        if (d !== Un) return d;
      }
      (l = Sw(s)), (s = s[Rr]);
    }
    o = l;
  }
  return r;
}
function Sw(n) {
  let t = n[F],
    e = t.type;
  return e === 2 ? t.declTNode : e === 1 ? n[xt] : null;
}
function Cm(n) {
  return oT(tt(), n);
}
function dT() {
  return $o(tt(), G());
}
function $o(n, t) {
  return new K(_n(n, t));
}
var K = (() => {
  class n {
    nativeElement;
    constructor(e) {
      this.nativeElement = e;
    }
    static __NG_ELEMENT_ID__ = dT;
  }
  return n;
})();
function xw(n) {
  return n instanceof K ? n.nativeElement : n;
}
function uT() {
  return this._results[Symbol.iterator]();
}
var En = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new E());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, e) {
    return this._results.reduce(t, e);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, e) {
    this.dirty = !1;
    let i = Jy(t);
    (this._changesDetected = !Xy(this._results, i, e)) &&
      ((this._results = i),
      (this.length = i.length),
      (this.last = i[this.length - 1]),
      (this.first = i[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = uT;
};
function Mw(n) {
  return (n.flags & 128) === 128;
}
var Im = (function (n) {
    return (n[(n.OnPush = 0)] = "OnPush"), (n[(n.Default = 1)] = "Default"), n;
  })(Im || {}),
  Tw = new Map(),
  fT = 0;
function hT() {
  return fT++;
}
function pT(n) {
  Tw.set(n[Qs], n);
}
function Gp(n) {
  Tw.delete(n[Qs]);
}
var Vb = "__ngContext__";
function Ho(n, t) {
  Bn(t) ? ((n[Vb] = t[Qs]), pT(t)) : (n[Vb] = t);
}
function Rw(n) {
  return Nw(n[Oo]);
}
function Aw(n) {
  return Nw(n[nn]);
}
function Nw(n) {
  for (; n !== null && !vn(n); ) n = n[nn];
  return n;
}
var Wp;
function Sm(n) {
  Wp = n;
}
function Ow() {
  if (Wp !== void 0) return Wp;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var Go = new y("", { providedIn: "root", factory: () => mT }),
  mT = "ng",
  Dd = new y(""),
  Wi = new y("", { providedIn: "platform", factory: () => "unknown" });
var qi = new y(""),
  Wo = new y("", {
    providedIn: "root",
    factory: () =>
      Ow().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
var gT = "h",
  vT = "b";
var kw = !1,
  Pw = new y("", { providedIn: "root", factory: () => kw });
var _T = (n, t, e, i) => {};
function yT(n, t, e, i) {
  _T(n, t, e, i);
}
function Cd(n) {
  return (n.flags & 32) === 32;
}
var bT = () => null;
function Fw(n, t, e = !1) {
  return bT(n, t, e);
}
function Lw(n, t) {
  let e = n.contentQueries;
  if (e !== null) {
    let i = z(null);
    try {
      for (let r = 0; r < e.length; r += 2) {
        let o = e[r],
          s = e[r + 1];
        if (s !== -1) {
          let a = n.data[s];
          ia(o), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      z(i);
    }
  }
}
function qp(n, t, e) {
  ia(0);
  let i = z(null);
  try {
    t(n, e);
  } finally {
    z(i);
  }
}
function Vw(n, t, e) {
  if (op(t)) {
    let i = z(null);
    try {
      let r = t.directiveStart,
        o = t.directiveEnd;
      for (let s = r; s < o; s++) {
        let a = n.data[s];
        if (a.contentQueries) {
          let l = e[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      z(i);
    }
  }
}
var ci = (function (n) {
    return (
      (n[(n.Emulated = 0)] = "Emulated"),
      (n[(n.None = 2)] = "None"),
      (n[(n.ShadowDom = 3)] = "ShadowDom"),
      n
    );
  })(ci || {}),
  Xc;
function wT() {
  if (Xc === void 0 && ((Xc = null), Ln.trustedTypes))
    try {
      Xc = Ln.trustedTypes.createPolicy("angular", {
        createHTML: (n) => n,
        createScript: (n) => n,
        createScriptURL: (n) => n,
      });
    } catch {}
  return Xc;
}
function Id(n) {
  return wT()?.createHTML(n) || n;
}
var di = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) {
      this.changingThisBreaksApplicationSecurity = t;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Nc})`;
    }
  },
  Yp = class extends di {
    getTypeName() {
      return "HTML";
    }
  },
  Kp = class extends di {
    getTypeName() {
      return "Style";
    }
  },
  Zp = class extends di {
    getTypeName() {
      return "Script";
    }
  },
  Qp = class extends di {
    getTypeName() {
      return "URL";
    }
  },
  Xp = class extends di {
    getTypeName() {
      return "ResourceURL";
    }
  };
function fi(n) {
  return n instanceof di ? n.changingThisBreaksApplicationSecurity : n;
}
function zr(n, t) {
  let e = jw(n);
  if (e != null && e !== t) {
    if (e === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${e} (see ${Nc})`);
  }
  return e === t;
}
function jw(n) {
  return (n instanceof di && n.getTypeName()) || null;
}
function xm(n) {
  return new Yp(n);
}
function Mm(n) {
  return new Kp(n);
}
function Tm(n) {
  return new Zp(n);
}
function Rm(n) {
  return new Qp(n);
}
function Am(n) {
  return new Xp(n);
}
function ET(n) {
  let t = new em(n);
  return DT() ? new Jp(t) : t;
}
var Jp = class {
    inertDocumentHelper;
    constructor(t) {
      this.inertDocumentHelper = t;
    }
    getInertBodyElement(t) {
      t = "<body><remove></remove>" + t;
      try {
        let e = new window.DOMParser().parseFromString(Id(t), "text/html").body;
        return e === null
          ? this.inertDocumentHelper.getInertBodyElement(t)
          : (e.firstChild?.remove(), e);
      } catch {
        return null;
      }
    }
  },
  em = class {
    defaultDoc;
    inertDocument;
    constructor(t) {
      (this.defaultDoc = t),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            "sanitization-inert"
          ));
    }
    getInertBodyElement(t) {
      let e = this.inertDocument.createElement("template");
      return (e.innerHTML = Id(t)), e;
    }
  };
function DT() {
  try {
    return !!new window.DOMParser().parseFromString(Id(""), "text/html");
  } catch {
    return !1;
  }
}
var CT = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Sd(n) {
  return (n = String(n)), n.match(CT) ? n : "unsafe:" + n;
}
function hi(n) {
  let t = {};
  for (let e of n.split(",")) t[e] = !0;
  return t;
}
function ga(...n) {
  let t = {};
  for (let e of n) for (let i in e) e.hasOwnProperty(i) && (t[i] = !0);
  return t;
}
var Bw = hi("area,br,col,hr,img,wbr"),
  Hw = hi("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  Uw = hi("rp,rt"),
  IT = ga(Uw, Hw),
  ST = ga(
    Hw,
    hi(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
    )
  ),
  xT = ga(
    Uw,
    hi(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
    )
  ),
  jb = ga(Bw, ST, xT, IT),
  zw = hi("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  MT = hi(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
  ),
  TT = hi(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
  ),
  RT = ga(zw, MT, TT),
  AT = hi("script,style,template"),
  tm = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) {
      let e = t.firstChild,
        i = !0,
        r = [];
      for (; e; ) {
        if (
          (e.nodeType === Node.ELEMENT_NODE
            ? (i = this.startElement(e))
            : e.nodeType === Node.TEXT_NODE
            ? this.chars(e.nodeValue)
            : (this.sanitizedSomething = !0),
          i && e.firstChild)
        ) {
          r.push(e), (e = kT(e));
          continue;
        }
        for (; e; ) {
          e.nodeType === Node.ELEMENT_NODE && this.endElement(e);
          let o = OT(e);
          if (o) {
            e = o;
            break;
          }
          e = r.pop();
        }
      }
      return this.buf.join("");
    }
    startElement(t) {
      let e = Bb(t).toLowerCase();
      if (!jb.hasOwnProperty(e))
        return (this.sanitizedSomething = !0), !AT.hasOwnProperty(e);
      this.buf.push("<"), this.buf.push(e);
      let i = t.attributes;
      for (let r = 0; r < i.length; r++) {
        let o = i.item(r),
          s = o.name,
          a = s.toLowerCase();
        if (!RT.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let l = o.value;
        zw[a] && (l = Sd(l)), this.buf.push(" ", s, '="', Hb(l), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(t) {
      let e = Bb(t).toLowerCase();
      jb.hasOwnProperty(e) &&
        !Bw.hasOwnProperty(e) &&
        (this.buf.push("</"), this.buf.push(e), this.buf.push(">"));
    }
    chars(t) {
      this.buf.push(Hb(t));
    }
  };
function NT(n, t) {
  return (
    (n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function OT(n) {
  let t = n.nextSibling;
  if (t && n !== t.previousSibling) throw $w(t);
  return t;
}
function kT(n) {
  let t = n.firstChild;
  if (t && NT(n, t)) throw $w(t);
  return t;
}
function Bb(n) {
  let t = n.nodeName;
  return typeof t == "string" ? t : "FORM";
}
function $w(n) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${n.outerHTML}`
  );
}
var PT = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  FT = /([^\#-~ |!])/g;
function Hb(n) {
  return n
    .replace(/&/g, "&amp;")
    .replace(PT, function (t) {
      let e = t.charCodeAt(0),
        i = t.charCodeAt(1);
      return "&#" + ((e - 55296) * 1024 + (i - 56320) + 65536) + ";";
    })
    .replace(FT, function (t) {
      return "&#" + t.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var Jc;
function Nm(n, t) {
  let e = null;
  try {
    Jc = Jc || ET(n);
    let i = t ? String(t) : "";
    e = Jc.getInertBodyElement(i);
    let r = 5,
      o = i;
    do {
      if (r === 0)
        throw new Error(
          "Failed to sanitize html because the input is unstable"
        );
      r--, (i = o), (o = e.innerHTML), (e = Jc.getInertBodyElement(i));
    } while (i !== o);
    let a = new tm().sanitizeChildren(Ub(e) || e);
    return Id(a);
  } finally {
    if (e) {
      let i = Ub(e) || e;
      for (; i.firstChild; ) i.firstChild.remove();
    }
  }
}
function Ub(n) {
  return "content" in n && LT(n) ? n.content : null;
}
function LT(n) {
  return n.nodeType === Node.ELEMENT_NODE && n.nodeName === "TEMPLATE";
}
var Mt = (function (n) {
  return (
    (n[(n.NONE = 0)] = "NONE"),
    (n[(n.HTML = 1)] = "HTML"),
    (n[(n.STYLE = 2)] = "STYLE"),
    (n[(n.SCRIPT = 3)] = "SCRIPT"),
    (n[(n.URL = 4)] = "URL"),
    (n[(n.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    n
  );
})(Mt || {});
function Gw(n) {
  return n instanceof Function ? n() : n;
}
function VT(n, t, e) {
  let i = n.length;
  for (;;) {
    let r = n.indexOf(t, e);
    if (r === -1) return r;
    if (r === 0 || n.charCodeAt(r - 1) <= 32) {
      let o = t.length;
      if (r + o === i || n.charCodeAt(r + o) <= 32) return r;
    }
    e = r + 1;
  }
}
var Ww = "ng-template";
function jT(n, t, e, i) {
  let r = 0;
  if (i) {
    for (; r < t.length && typeof t[r] == "string"; r += 2)
      if (t[r] === "class" && VT(t[r + 1].toLowerCase(), e, 0) !== -1)
        return !0;
  } else if (Om(n)) return !1;
  if (((r = t.indexOf(1, r)), r > -1)) {
    let o;
    for (; ++r < t.length && typeof (o = t[r]) == "string"; )
      if (o.toLowerCase() === e) return !0;
  }
  return !1;
}
function Om(n) {
  return n.type === 4 && n.value !== Ww;
}
function BT(n, t, e) {
  let i = n.type === 4 && !e ? Ww : n.value;
  return t === i;
}
function HT(n, t, e) {
  let i = 4,
    r = n.attrs,
    o = r !== null ? $T(r) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let l = t[a];
    if (typeof l == "number") {
      if (!s && !bn(i) && !bn(l)) return !1;
      if (s && bn(l)) continue;
      (s = !1), (i = l | (i & 1));
      continue;
    }
    if (!s)
      if (i & 4) {
        if (
          ((i = 2 | (i & 1)),
          (l !== "" && !BT(n, l, e)) || (l === "" && t.length === 1))
        ) {
          if (bn(i)) return !1;
          s = !0;
        }
      } else if (i & 8) {
        if (r === null || !jT(n, r, l, e)) {
          if (bn(i)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          d = UT(l, r, Om(n), e);
        if (d === -1) {
          if (bn(i)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let u;
          if (
            (d > o ? (u = "") : (u = r[d + 1].toLowerCase()), i & 2 && c !== u)
          ) {
            if (bn(i)) return !1;
            s = !0;
          }
        }
      }
  }
  return bn(i) || s;
}
function bn(n) {
  return (n & 1) === 0;
}
function UT(n, t, e, i) {
  if (t === null) return -1;
  let r = 0;
  if (i || !e) {
    let o = !1;
    for (; r < t.length; ) {
      let s = t[r];
      if (s === n) return r;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = t[++r];
        for (; typeof a == "string"; ) a = t[++r];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          r += 4;
          continue;
        }
      }
      r += o ? 1 : 2;
    }
    return -1;
  } else return GT(t, n);
}
function qw(n, t, e = !1) {
  for (let i = 0; i < t.length; i++) if (HT(n, t[i], e)) return !0;
  return !1;
}
function zT(n) {
  let t = n.attrs;
  if (t != null) {
    let e = t.indexOf(5);
    if ((e & 1) === 0) return t[e + 1];
  }
  return null;
}
function $T(n) {
  for (let t = 0; t < n.length; t++) {
    let e = n[t];
    if (vw(e)) return t;
  }
  return n.length;
}
function GT(n, t) {
  let e = n.indexOf(4);
  if (e > -1)
    for (e++; e < n.length; ) {
      let i = n[e];
      if (typeof i == "number") return -1;
      if (i === t) return e;
      e++;
    }
  return -1;
}
function WT(n, t) {
  e: for (let e = 0; e < t.length; e++) {
    let i = t[e];
    if (n.length === i.length) {
      for (let r = 0; r < n.length; r++) if (n[r] !== i[r]) continue e;
      return !0;
    }
  }
  return !1;
}
function zb(n, t) {
  return n ? ":not(" + t.trim() + ")" : t;
}
function qT(n) {
  let t = n[0],
    e = 1,
    i = 2,
    r = "",
    o = !1;
  for (; e < n.length; ) {
    let s = n[e];
    if (typeof s == "string")
      if (i & 2) {
        let a = n[++e];
        r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else i & 8 ? (r += "." + s) : i & 4 && (r += " " + s);
    else
      r !== "" && !bn(s) && ((t += zb(o, r)), (r = "")),
        (i = s),
        (o = o || !bn(i));
    e++;
  }
  return r !== "" && (t += zb(o, r)), t;
}
function YT(n) {
  return n.map(qT).join(",");
}
function KT(n) {
  let t = [],
    e = [],
    i = 1,
    r = 2;
  for (; i < n.length; ) {
    let o = n[i];
    if (typeof o == "string")
      r === 2 ? o !== "" && t.push(o, n[++i]) : r === 8 && e.push(o);
    else {
      if (!bn(r)) break;
      r = o;
    }
    i++;
  }
  return e.length && t.push(1, ...e), t;
}
var Vt = {};
function ZT(n, t) {
  return n.createText(t);
}
function QT(n, t, e) {
  n.setValue(t, e);
}
function Yw(n, t, e) {
  return n.createElement(t, e);
}
function ud(n, t, e, i, r) {
  n.insertBefore(t, e, i, r);
}
function Kw(n, t, e) {
  n.appendChild(t, e);
}
function $b(n, t, e, i, r) {
  i !== null ? ud(n, t, e, i, r) : Kw(n, t, e);
}
function XT(n, t, e) {
  n.removeChild(null, t, e);
}
function JT(n, t, e) {
  n.setAttribute(t, "style", e);
}
function eR(n, t, e) {
  e === "" ? n.removeAttribute(t, "class") : n.setAttribute(t, "class", e);
}
function Zw(n, t, e) {
  let { mergedAttrs: i, classes: r, styles: o } = e;
  i !== null && JM(n, t, i),
    r !== null && eR(n, t, r),
    o !== null && JT(n, t, o);
}
function km(n, t, e, i, r, o, s, a, l, c, d) {
  let u = Fe + i,
    p = u + r,
    h = tR(u, p),
    m = typeof c == "function" ? c() : c;
  return (h[F] = {
    type: n,
    blueprint: h,
    template: e,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: h.slice().fill(null, u),
    bindingStartIndex: u,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: l,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: d,
  });
}
function tR(n, t) {
  let e = [];
  for (let i = 0; i < t; i++) e.push(i < n ? null : Vt);
  return e;
}
function nR(n) {
  let t = n.tView;
  return t === null || t.incompleteFirstPass
    ? (n.tView = km(
        1,
        null,
        n.template,
        n.decls,
        n.vars,
        n.directiveDefs,
        n.pipeDefs,
        n.viewQuery,
        n.schemas,
        n.consts,
        n.id
      ))
    : t;
}
function Pm(n, t, e, i, r, o, s, a, l, c, d) {
  let u = t.blueprint.slice();
  return (
    (u[gn] = r),
    (u[V] = i | 4 | 128 | 8 | 64 | 1024),
    (c !== null || (n && n[V] & 2048)) && (u[V] |= 2048),
    cp(u),
    (u[st] = u[Rr] = n),
    (u[ht] = e),
    (u[si] = s || (n && n[si])),
    (u[Ee] = a || (n && n[Ee])),
    (u[Tr] = l || (n && n[Tr]) || null),
    (u[xt] = o),
    (u[Qs] = hT()),
    (u[Ao] = d),
    (u[rp] = c),
    (u[Ft] = t.type == 2 ? n[Ft] : u),
    u
  );
}
function iR(n, t, e) {
  let i = _n(t, n),
    r = nR(e),
    o = n[si].rendererFactory,
    s = Fm(
      n,
      Pm(
        n,
        r,
        null,
        Qw(e),
        i,
        t,
        null,
        o.createRenderer(i, e),
        null,
        null,
        null
      )
    );
  return (n[t.index] = s);
}
function Qw(n) {
  let t = 16;
  return n.signals ? (t = 4096) : n.onPush && (t = 64), t;
}
function Xw(n, t, e, i) {
  if (e === 0) return -1;
  let r = t.length;
  for (let o = 0; o < e; o++) t.push(i), n.blueprint.push(i), n.data.push(null);
  return r;
}
function Fm(n, t) {
  return n[Oo] ? (n[ip][nn] = t) : (n[Oo] = t), (n[ip] = t), t;
}
function x(n = 1) {
  Jw(Ae(), G(), li() + n, !1);
}
function Jw(n, t, e, i) {
  if (!i)
    if ((t[V] & 3) === 3) {
      let o = n.preOrderCheckHooks;
      o !== null && td(t, o, e);
    } else {
      let o = n.preOrderHooks;
      o !== null && nd(t, o, 0, e);
    }
  Ui(e);
}
var xd = (function (n) {
  return (
    (n[(n.None = 0)] = "None"),
    (n[(n.SignalBased = 1)] = "SignalBased"),
    (n[(n.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    n
  );
})(xd || {});
function nm(n, t, e, i) {
  let r = z(null);
  try {
    let [o, s, a] = n.inputs[e],
      l = null;
    (s & xd.SignalBased) !== 0 && (l = t[o][Ze]),
      l !== null && l.transformFn !== void 0
        ? (i = l.transformFn(i))
        : a !== null && (i = a.call(t, i)),
      n.setInput !== null ? n.setInput(t, l, i, e, o) : uw(t, l, o, i);
  } finally {
    z(r);
  }
}
var zn = (function (n) {
    return (
      (n[(n.Important = 1)] = "Important"),
      (n[(n.DashCase = 2)] = "DashCase"),
      n
    );
  })(zn || {}),
  rR;
function Lm(n, t) {
  return rR(n, t);
}
function Vo(n, t, e, i, r) {
  if (i != null) {
    let o,
      s = !1;
    vn(i) ? (o = i) : Bn(i) && ((s = !0), (i = i[gn]));
    let a = rn(i);
    n === 0 && e !== null
      ? r == null
        ? Kw(t, e, a)
        : ud(t, e, a, r || null, !0)
      : n === 1 && e !== null
      ? ud(t, e, a, r || null, !0)
      : n === 2
      ? XT(t, a, s)
      : n === 3 && t.destroyNode(a),
      o != null && pR(t, n, o, e, r);
  }
}
function oR(n, t) {
  eE(n, t), (t[gn] = null), (t[xt] = null);
}
function sR(n, t, e, i, r, o) {
  (i[gn] = r), (i[xt] = t), Md(n, i, e, 1, r, o);
}
function eE(n, t) {
  t[si].changeDetectionScheduler?.notify(9), Md(n, t, t[Ee], 2, null, null);
}
function aR(n) {
  let t = n[Oo];
  if (!t) return kp(n[F], n);
  for (; t; ) {
    let e = null;
    if (Bn(t)) e = t[Oo];
    else {
      let i = t[bt];
      i && (e = i);
    }
    if (!e) {
      for (; t && !t[nn] && t !== n; ) Bn(t) && kp(t[F], t), (t = t[st]);
      t === null && (t = n), Bn(t) && kp(t[F], t), (e = t && t[nn]);
    }
    t = e;
  }
}
function Vm(n, t) {
  let e = n[Or],
    i = e.indexOf(t);
  e.splice(i, 1);
}
function jm(n, t) {
  if (kr(t)) return;
  let e = t[Ee];
  e.destroyNode && Md(n, t, e, 3, null, null), aR(t);
}
function kp(n, t) {
  if (kr(t)) return;
  let e = z(null);
  try {
    (t[V] &= -129),
      (t[V] |= 256),
      t[Wt] && ho(t[Wt]),
      cR(n, t),
      lR(n, t),
      t[F].type === 1 && t[Ee].destroy();
    let i = t[Vi];
    if (i !== null && vn(t[st])) {
      i !== t[st] && Vm(i, t);
      let r = t[jn];
      r !== null && r.detachView(n);
    }
    Gp(t);
  } finally {
    z(e);
  }
}
function lR(n, t) {
  let e = n.cleanup,
    i = t[No];
  if (e !== null)
    for (let s = 0; s < e.length - 1; s += 2)
      if (typeof e[s] == "string") {
        let a = e[s + 3];
        a >= 0 ? i[a]() : i[-a].unsubscribe(), (s += 2);
      } else {
        let a = i[e[s + 1]];
        e[s].call(a);
      }
  i !== null && (t[No] = null);
  let r = t[ii];
  if (r !== null) {
    t[ii] = null;
    for (let s = 0; s < r.length; s++) {
      let a = r[s];
      a();
    }
  }
  let o = t[ai];
  if (o !== null) {
    t[ai] = null;
    for (let s of o) s.destroy();
  }
}
function cR(n, t) {
  let e;
  if (n != null && (e = n.destroyHooks) != null)
    for (let i = 0; i < e.length; i += 2) {
      let r = t[e[i]];
      if (!(r instanceof Br)) {
        let o = e[i + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = r[o[s]],
              l = o[s + 1];
            ge(4, a, l);
            try {
              l.call(a);
            } finally {
              ge(5, a, l);
            }
          }
        else {
          ge(4, r, o);
          try {
            o.call(r);
          } finally {
            ge(5, r, o);
          }
        }
      }
    }
}
function tE(n, t, e) {
  return dR(n, t.parent, e);
}
function dR(n, t, e) {
  let i = t;
  for (; i !== null && i.type & 168; ) (t = i), (i = t.parent);
  if (i === null) return e[gn];
  if (Bi(i)) {
    let { encapsulation: r } = n.data[i.directiveStart + i.componentOffset];
    if (r === ci.None || r === ci.Emulated) return null;
  }
  return _n(i, e);
}
function nE(n, t, e) {
  return fR(n, t, e);
}
function uR(n, t, e) {
  return n.type & 40 ? _n(n, e) : null;
}
var fR = uR,
  Gb;
function Bm(n, t, e, i) {
  let r = tE(n, i, t),
    o = t[Ee],
    s = i.parent || t[xt],
    a = nE(s, i, t);
  if (r != null)
    if (Array.isArray(e))
      for (let l = 0; l < e.length; l++) $b(o, r, e[l], a, !1);
    else $b(o, r, e, a, !1);
  Gb !== void 0 && Gb(o, i, t, e, r);
}
function aa(n, t) {
  if (t !== null) {
    let e = t.type;
    if (e & 3) return _n(t, n);
    if (e & 4) return im(-1, n[t.index]);
    if (e & 8) {
      let i = t.child;
      if (i !== null) return aa(n, i);
      {
        let r = n[t.index];
        return vn(r) ? im(-1, r) : rn(r);
      }
    } else {
      if (e & 128) return aa(n, t.next);
      if (e & 32) return Lm(t, n)() || rn(n[t.index]);
      {
        let i = iE(n, t);
        if (i !== null) {
          if (Array.isArray(i)) return i[0];
          let r = Fi(n[Ft]);
          return aa(r, i);
        } else return aa(n, t.next);
      }
    }
  }
  return null;
}
function iE(n, t) {
  if (t !== null) {
    let i = n[Ft][xt],
      r = t.projection;
    return i.projection[r];
  }
  return null;
}
function im(n, t) {
  let e = bt + n + 1;
  if (e < t.length) {
    let i = t[e],
      r = i[F].firstChild;
    if (r !== null) return aa(i, r);
  }
  return t[ji];
}
function Hm(n, t, e, i, r, o, s) {
  for (; e != null; ) {
    if (e.type === 128) {
      e = e.next;
      continue;
    }
    let a = i[e.index],
      l = e.type;
    if ((s && t === 0 && (a && Ho(rn(a), i), (e.flags |= 2)), !Cd(e)))
      if (l & 8) Hm(n, t, e.child, i, r, o, !1), Vo(t, n, r, a, o);
      else if (l & 32) {
        let c = Lm(e, i),
          d;
        for (; (d = c()); ) Vo(t, n, r, d, o);
        Vo(t, n, r, a, o);
      } else l & 16 ? rE(n, t, i, e, r, o) : Vo(t, n, r, a, o);
    e = s ? e.projectionNext : e.next;
  }
}
function Md(n, t, e, i, r, o) {
  Hm(e, i, n.firstChild, t, r, o, !1);
}
function hR(n, t, e) {
  let i = t[Ee],
    r = tE(n, e, t),
    o = e.parent || t[xt],
    s = nE(o, e, t);
  rE(i, 0, t, e, r, s);
}
function rE(n, t, e, i, r, o) {
  let s = e[Ft],
    l = s[xt].projection[i.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let d = l[c];
      Vo(t, n, r, d, o);
    }
  else {
    let c = l,
      d = s[st];
    Mw(i) && (c.flags |= 128), Hm(n, t, c, d, r, o, !0);
  }
}
function pR(n, t, e, i, r) {
  let o = e[ji],
    s = rn(e);
  o !== s && Vo(t, n, i, o, r);
  for (let a = bt; a < e.length; a++) {
    let l = e[a];
    Md(l[F], l, n, t, i, o);
  }
}
function mR(n, t, e, i, r) {
  if (t) r ? n.addClass(e, i) : n.removeClass(e, i);
  else {
    let o = i.indexOf("-") === -1 ? void 0 : zn.DashCase;
    r == null
      ? n.removeStyle(e, i, o)
      : (typeof r == "string" &&
          r.endsWith("!important") &&
          ((r = r.slice(0, -10)), (o |= zn.Important)),
        n.setStyle(e, i, r, o));
  }
}
function oE(n, t, e, i, r) {
  let o = li(),
    s = i & 2;
  try {
    Ui(-1),
      s && t.length > Fe && Jw(n, t, Fe, !1),
      ge(s ? 2 : 0, r, e),
      e(i, r);
  } finally {
    Ui(o), ge(s ? 3 : 1, r, e);
  }
}
function Um(n, t, e) {
  wR(n, t, e), (e.flags & 64) === 64 && ER(n, t, e);
}
function Td(n, t, e = _n) {
  let i = t.localNames;
  if (i !== null) {
    let r = t.index + 1;
    for (let o = 0; o < i.length; o += 2) {
      let s = i[o + 1],
        a = s === -1 ? e(t, n) : n[s];
      n[r++] = a;
    }
  }
}
function gR(n, t, e, i) {
  let o = i.get(Pw, kw) || e === ci.ShadowDom,
    s = n.selectRootElement(t, o);
  return vR(s), s;
}
function vR(n) {
  _R(n);
}
var _R = () => null;
function yR(n) {
  return n === "class"
    ? "className"
    : n === "for"
    ? "htmlFor"
    : n === "formaction"
    ? "formAction"
    : n === "innerHtml"
    ? "innerHTML"
    : n === "readonly"
    ? "readOnly"
    : n === "tabindex"
    ? "tabIndex"
    : n;
}
function sE(n, t, e, i, r, o) {
  let s = t[F];
  if (zm(n, s, t, e, i)) {
    Bi(n) && bR(t, n.index);
    return;
  }
  n.type & 3 && (e = yR(e)), aE(n, t, e, i, r, o);
}
function aE(n, t, e, i, r, o) {
  if (n.type & 3) {
    let s = _n(n, t);
    (i = o != null ? o(i, n.value || "", e) : i), r.setProperty(s, e, i);
  } else n.type & 12;
}
function bR(n, t) {
  let e = on(t, n);
  e[V] & 16 || (e[V] |= 64);
}
function wR(n, t, e) {
  let i = e.directiveStart,
    r = e.directiveEnd;
  Bi(e) && iR(t, e, n.data[i + e.componentOffset]),
    n.firstCreatePass || dd(e, t);
  let o = e.initialInputs;
  for (let s = i; s < r; s++) {
    let a = n.data[s],
      l = ca(t, n, s, e);
    if ((Ho(l, t), o !== null && SR(t, s - i, l, a, e, o), Hn(a))) {
      let c = on(e.index, t);
      c[ht] = ca(t, n, s, e);
    }
  }
}
function ER(n, t, e) {
  let i = e.directiveStart,
    r = e.directiveEnd,
    o = e.index,
    s = Cb();
  try {
    Ui(o);
    for (let a = i; a < r; a++) {
      let l = n.data[a],
        c = t[a];
      $c(a),
        (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) &&
          DR(l, c);
    }
  } finally {
    Ui(-1), $c(s);
  }
}
function DR(n, t) {
  n.hostBindings !== null && n.hostBindings(1, t);
}
function lE(n, t) {
  let e = n.directiveRegistry,
    i = null;
  if (e)
    for (let r = 0; r < e.length; r++) {
      let o = e[r];
      qw(t, o.selectors, !1) && ((i ??= []), Hn(o) ? i.unshift(o) : i.push(o));
    }
  return i;
}
function CR(n, t, e, i, r, o) {
  let s = _n(n, t);
  IR(t[Ee], s, o, n.value, e, i, r);
}
function IR(n, t, e, i, r, o, s) {
  if (o == null) n.removeAttribute(t, r, e);
  else {
    let a = s == null ? Mo(o) : s(o, i || "", r);
    n.setAttribute(t, r, a, e);
  }
}
function SR(n, t, e, i, r, o) {
  let s = o[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let l = s[a],
        c = s[a + 1];
      nm(i, e, l, c);
    }
}
function cE(n, t, e, i, r) {
  let o = Fe + e,
    s = t[F],
    a = r(s, t, n, i, e);
  (t[o] = a), Po(n, !0);
  let l = n.type === 2;
  return (
    l ? (Zw(t[Ee], a, n), (gb() === 0 || Js(n)) && Ho(a, t), vb()) : Ho(a, t),
    Yc() && (!l || !Cd(n)) && Bm(s, t, a, n),
    n
  );
}
function dE(n) {
  let t = n;
  return bp() ? wp() : ((t = t.parent), Po(t, !1)), t;
}
function xR(n, t) {
  let e = n[Tr];
  if (!e) return;
  e.get(Yt, null)?.(t);
}
function zm(n, t, e, i, r) {
  let o = n.inputs?.[i],
    s = n.hostDirectiveInputs?.[i],
    a = !1;
  if (s)
    for (let l = 0; l < s.length; l += 2) {
      let c = s[l],
        d = s[l + 1],
        u = t.data[c];
      nm(u, e[c], d, r), (a = !0);
    }
  if (o)
    for (let l of o) {
      let c = e[l],
        d = t.data[l];
      nm(d, c, i, r), (a = !0);
    }
  return a;
}
function MR(n, t) {
  let e = on(t, n),
    i = e[F];
  TR(i, e);
  let r = e[gn];
  r !== null && e[Ao] === null && (e[Ao] = Fw(r, e[Tr])),
    ge(18),
    $m(i, e, e[ht]),
    ge(19, e[ht]);
}
function TR(n, t) {
  for (let e = t.length; e < n.blueprint.length; e++) t.push(n.blueprint[e]);
}
function $m(n, t, e) {
  Wc(t);
  try {
    let i = n.viewQuery;
    i !== null && qp(1, i, e);
    let r = n.template;
    r !== null && oE(n, t, r, 1, e),
      n.firstCreatePass && (n.firstCreatePass = !1),
      t[jn]?.finishViewCreation(n),
      n.staticContentQueries && Lw(n, t),
      n.staticViewQueries && qp(2, n.viewQuery, e);
    let o = n.components;
    o !== null && RR(t, o);
  } catch (i) {
    throw (
      (n.firstCreatePass &&
        ((n.incompleteFirstPass = !0), (n.firstCreatePass = !1)),
      i)
    );
  } finally {
    (t[V] &= -5), qc();
  }
}
function RR(n, t) {
  for (let e = 0; e < t.length; e++) MR(n, t[e]);
}
function Gm(n, t, e, i) {
  let r = z(null);
  try {
    let o = t.tView,
      a = n[V] & 4096 ? 4096 : 16,
      l = Pm(
        n,
        o,
        e,
        a,
        null,
        t,
        null,
        null,
        i?.injector ?? null,
        i?.embeddedViewInjector ?? null,
        i?.dehydratedView ?? null
      ),
      c = n[t.index];
    l[Vi] = c;
    let d = n[jn];
    return d !== null && (l[jn] = d.createEmbeddedView(o)), $m(o, l, e), l;
  } finally {
    z(r);
  }
}
function fd(n, t) {
  return !t || t.firstChild === null || Mw(n);
}
var Wb = !1,
  AR = new y("");
function da(n, t, e, i, r = !1) {
  for (; e !== null; ) {
    if (e.type === 128) {
      e = r ? e.projectionNext : e.next;
      continue;
    }
    let o = t[e.index];
    o !== null && i.push(rn(o)), vn(o) && uE(o, i);
    let s = e.type;
    if (s & 8) da(n, t, e.child, i);
    else if (s & 32) {
      let a = Lm(e, t),
        l;
      for (; (l = a()); ) i.push(l);
    } else if (s & 16) {
      let a = iE(t, e);
      if (Array.isArray(a)) i.push(...a);
      else {
        let l = Fi(t[Ft]);
        da(l[F], l, a, i, !0);
      }
    }
    e = r ? e.projectionNext : e.next;
  }
  return i;
}
function uE(n, t) {
  for (let e = bt; e < n.length; e++) {
    let i = n[e],
      r = i[F].firstChild;
    r !== null && da(i[F], i, r, t);
  }
  n[ji] !== n[gn] && t.push(n[ji]);
}
function fE(n) {
  if (n[Nr] !== null) {
    for (let t of n[Nr]) t.impl.addSequence(t);
    n[Nr].length = 0;
  }
}
var hE = [];
function NR(n) {
  return n[Wt] ?? OR(n);
}
function OR(n) {
  let t = hE.pop() ?? Object.create(PR);
  return (t.lView = n), t;
}
function kR(n) {
  n.lView[Wt] !== n && ((n.lView = null), hE.push(n));
}
var PR = B(_({}, Mi), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (n) => {
    Hi(n.lView);
  },
  consumerOnSignalRead() {
    this.lView[Wt] = this;
  },
});
function FR(n) {
  let t = n[Wt] ?? Object.create(LR);
  return (t.lView = n), t;
}
var LR = B(_({}, Mi), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (n) => {
    let t = Fi(n.lView);
    for (; t && !pE(t[F]); ) t = Fi(t);
    t && dp(t);
  },
  consumerOnSignalRead() {
    this.lView[Wt] = this;
  },
});
function pE(n) {
  return n.type !== 2;
}
function mE(n) {
  if (n[ai] === null) return;
  let t = !0;
  for (; t; ) {
    let e = !1;
    for (let i of n[ai])
      i.dirty &&
        ((e = !0),
        i.zone === null || Zone.current === i.zone
          ? i.run()
          : i.zone.run(() => i.run()));
    t = e && !!(n[V] & 8192);
  }
}
var VR = 100;
function Wm(n, t = 0) {
  let i = n[si].rendererFactory,
    r = !1;
  r || i.begin?.();
  try {
    jR(n, t);
  } finally {
    r || i.end?.();
  }
}
function jR(n, t) {
  let e = Dp();
  try {
    Fo(!0), rm(n, t);
    let i = 0;
    for (; ta(n); ) {
      if (i === VR) throw new v(103, !1);
      i++, rm(n, 1);
    }
  } finally {
    Fo(e);
  }
}
function gE(n, t) {
  Ep(t ? na.Exhaustive : na.OnlyDirtyViews);
  try {
    Wm(n);
  } finally {
    Ep(na.Off);
  }
}
function BR(n, t, e, i) {
  if (kr(t)) return;
  let r = t[V],
    o = !1,
    s = !1;
  Wc(t);
  let a = !0,
    l = null,
    c = null;
  o ||
    (pE(n)
      ? ((c = NR(t)), (l = Jn(c)))
      : Ul() === null
      ? ((a = !1), (c = FR(t)), (l = Jn(c)))
      : t[Wt] && (ho(t[Wt]), (t[Wt] = null)));
  try {
    cp(t), wb(n.bindingStartIndex), e !== null && oE(n, t, e, 2, i);
    let d = (r & 3) === 3;
    if (!o)
      if (d) {
        let h = n.preOrderCheckHooks;
        h !== null && td(t, h, null);
      } else {
        let h = n.preOrderHooks;
        h !== null && nd(t, h, 0, null), Np(t, 0);
      }
    if (
      (s || HR(t), mE(t), vE(t, 0), n.contentQueries !== null && Lw(n, t), !o)
    )
      if (d) {
        let h = n.contentCheckHooks;
        h !== null && td(t, h);
      } else {
        let h = n.contentHooks;
        h !== null && nd(t, h, 1), Np(t, 1);
      }
    zR(n, t);
    let u = n.components;
    u !== null && yE(t, u, 0);
    let p = n.viewQuery;
    if ((p !== null && qp(2, p, i), !o))
      if (d) {
        let h = n.viewCheckHooks;
        h !== null && td(t, h);
      } else {
        let h = n.viewHooks;
        h !== null && nd(t, h, 2), Np(t, 2);
      }
    if ((n.firstUpdatePass === !0 && (n.firstUpdatePass = !1), t[jc])) {
      for (let h of t[jc]) h();
      t[jc] = null;
    }
    o || (fE(t), (t[V] &= -73));
  } catch (d) {
    throw (o || Hi(t), d);
  } finally {
    c !== null && (Ti(c, l), a && kR(c)), qc();
  }
}
function vE(n, t) {
  for (let e = Rw(n); e !== null; e = Aw(e))
    for (let i = bt; i < e.length; i++) {
      let r = e[i];
      _E(r, t);
    }
}
function HR(n) {
  for (let t = Rw(n); t !== null; t = Aw(t)) {
    if (!(t[V] & 2)) continue;
    let e = t[Or];
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      dp(r);
    }
  }
}
function UR(n, t, e) {
  ge(18);
  let i = on(t, n);
  _E(i, e), ge(19, i[ht]);
}
function _E(n, t) {
  Hc(n) && rm(n, t);
}
function rm(n, t) {
  let i = n[F],
    r = n[V],
    o = n[Wt],
    s = !!(t === 0 && r & 16);
  if (
    ((s ||= !!(r & 64 && t === 0)),
    (s ||= !!(r & 1024)),
    (s ||= !!(o?.dirty && gr(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (n[V] &= -9217),
    s)
  )
    BR(i, n, i.template, n[ht]);
  else if (r & 8192) {
    let a = z(null);
    try {
      mE(n), vE(n, 1);
      let l = i.components;
      l !== null && yE(n, l, 1), fE(n);
    } finally {
      z(a);
    }
  }
}
function yE(n, t, e) {
  for (let i = 0; i < t.length; i++) UR(n, t[i], e);
}
function zR(n, t) {
  let e = n.hostBindingOpCodes;
  if (e !== null)
    try {
      for (let i = 0; i < e.length; i++) {
        let r = e[i];
        if (r < 0) Ui(~r);
        else {
          let o = r,
            s = e[++i],
            a = e[++i];
          Db(s, o);
          let l = t[o];
          ge(24, l), a(2, l), ge(25, l);
        }
      }
    } finally {
      Ui(-1);
    }
}
function qm(n, t) {
  let e = Dp() ? 64 : 1088;
  for (n[si].changeDetectionScheduler?.notify(t); n; ) {
    n[V] |= e;
    let i = Fi(n);
    if (ko(n) && !i) return n;
    n = i;
  }
  return null;
}
function bE(n, t, e, i) {
  return [n, !0, 0, t, null, i, null, e, null, null];
}
function $R(n, t) {
  let e = bt + t;
  if (e < n.length) return n[e];
}
function Ym(n, t, e, i = !0) {
  let r = t[F];
  if ((WR(r, t, n, e), i)) {
    let s = im(e, n),
      a = t[Ee],
      l = a.parentNode(n[ji]);
    l !== null && sR(r, n[xt], a, t, l, s);
  }
  let o = t[Ao];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function GR(n, t) {
  let e = hd(n, t);
  return e !== void 0 && jm(e[F], e), e;
}
function hd(n, t) {
  if (n.length <= bt) return;
  let e = bt + t,
    i = n[e];
  if (i) {
    let r = i[Vi];
    r !== null && r !== n && Vm(r, i), t > 0 && (n[e - 1][nn] = i[nn]);
    let o = Ks(n, bt + t);
    oR(i[F], i);
    let s = o[jn];
    s !== null && s.detachView(o[F]),
      (i[st] = null),
      (i[nn] = null),
      (i[V] &= -129);
  }
  return i;
}
function WR(n, t, e, i) {
  let r = bt + i,
    o = e.length;
  i > 0 && (e[r - 1][nn] = t),
    i < o - bt
      ? ((t[nn] = e[r]), Kh(e, bt + i, t))
      : (e.push(t), (t[nn] = null)),
    (t[st] = e);
  let s = t[Vi];
  s !== null && e !== s && wE(s, t);
  let a = t[jn];
  a !== null && a.insertView(n), Uc(t), (t[V] |= 128);
}
function wE(n, t) {
  let e = n[Or],
    i = t[st];
  if (Bn(i)) n[V] |= 2;
  else {
    let r = i[st][Ft];
    t[Ft] !== r && (n[V] |= 2);
  }
  e === null ? (n[Or] = [t]) : e.push(t);
}
var Gi = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      e = t[F];
    return da(e, t, e.firstChild, []);
  }
  constructor(t, e) {
    (this._lView = t), (this._cdRefInjectingView = e);
  }
  get context() {
    return this._lView[ht];
  }
  set context(t) {
    this._lView[ht] = t;
  }
  get destroyed() {
    return kr(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[st];
      if (vn(t)) {
        let e = t[Xs],
          i = e ? e.indexOf(this) : -1;
        i > -1 && (hd(t, i), Ks(e, i));
      }
      this._attachedToViewContainer = !1;
    }
    jm(this._lView[F], this._lView);
  }
  onDestroy(t) {
    up(this._lView, t);
  }
  markForCheck() {
    qm(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[V] &= -129;
  }
  reattach() {
    Uc(this._lView), (this._lView[V] |= 128);
  }
  detectChanges() {
    (this._lView[V] |= 1024), Wm(this._lView);
  }
  checkNoChanges() {
    return;
    try {
      this.exhaustive ??= this._lView[Tr].get(AR, Wb);
    } catch {
      this.exhaustive = Wb;
    }
  }
  attachToViewContainerRef() {
    if (this._appRef) throw new v(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = ko(this._lView),
      e = this._lView[Vi];
    e !== null && !t && Vm(e, this._lView), eE(this._lView[F], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new v(902, !1);
    this._appRef = t;
    let e = ko(this._lView),
      i = this._lView[Vi];
    i !== null && !e && wE(i, this._lView), Uc(this._lView);
  }
};
var Lt = (() => {
  class n {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = qR;
    constructor(e, i, r) {
      (this._declarationLView = e),
        (this._declarationTContainer = i),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, i) {
      return this.createEmbeddedViewImpl(e, i);
    }
    createEmbeddedViewImpl(e, i, r) {
      let o = Gm(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: i,
        dehydratedView: r,
      });
      return new Gi(o);
    }
  }
  return n;
})();
function qR() {
  return Rd(tt(), G());
}
function Rd(n, t) {
  return n.type & 4 ? new Lt(t, n, $o(n, t)) : null;
}
function qo(n, t, e, i, r) {
  let o = n.data[t];
  if (o === null) (o = YR(n, t, e, i, r)), Eb() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = e), (o.value = i), (o.attrs = r);
    let s = _b();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Po(o, !0), o;
}
function YR(n, t, e, i, r) {
  let o = yp(),
    s = bp(),
    a = s ? o : o && o.parent,
    l = (n.data[t] = ZR(n, a, e, t, i, r));
  return KR(n, l, o, s), l;
}
function KR(n, t, e, i) {
  n.firstChild === null && (n.firstChild = t),
    e !== null &&
      (i
        ? e.child == null && t.parent !== null && (e.child = t)
        : e.next === null && ((e.next = t), (t.prev = e)));
}
function ZR(n, t, e, i, r, o) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    gp() && (a |= 128),
    {
      type: e,
      index: i,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: r,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var S8 = new RegExp(`^(\\d+)*(${vT}|${gT})*(.*)`);
var QR = () => null,
  XR = () => null;
function om(n, t) {
  return QR(n, t);
}
function JR(n, t, e) {
  return XR(n, t, e);
}
var EE = class {},
  Ad = class {},
  sm = class {
    resolveComponentFactory(t) {
      throw new v(917, !1);
    }
  },
  va = class {
    static NULL = new sm();
  },
  Se = class {},
  pt = (() => {
    class n {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => eA();
    }
    return n;
  })();
function eA() {
  let n = G(),
    t = tt(),
    e = on(t.index, n);
  return (Bn(e) ? e : n)[Ee];
}
var DE = (() => {
  class n {
    static ɵprov = b({ token: n, providedIn: "root", factory: () => null });
  }
  return n;
})();
var rd = {},
  am = class {
    injector;
    parentInjector;
    constructor(t, e) {
      (this.injector = t), (this.parentInjector = e);
    }
    get(t, e, i) {
      let r = this.injector.get(t, rd, i);
      return r !== rd || e === rd ? r : this.parentInjector.get(t, e, i);
    }
  };
function pd(n, t, e) {
  let i = e ? n.styles : null,
    r = e ? n.classes : null,
    o = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") o = a;
      else if (o == 1) r = Oc(r, a);
      else if (o == 2) {
        let l = a,
          c = t[++s];
        i = Oc(i, l + ": " + c + ";");
      }
    }
  e ? (n.styles = i) : (n.stylesWithoutHost = i),
    e ? (n.classes = r) : (n.classesWithoutHost = r);
}
function ie(n, t = 0) {
  let e = G();
  if (e === null) return A(n, t);
  let i = tt();
  return Cw(i, e, ut(n), t);
}
function Km() {
  let n = "invalid";
  throw new Error(n);
}
function CE(n, t, e, i, r) {
  let o = i === null ? null : { "": -1 },
    s = r(n, e);
  if (s !== null) {
    let a = s,
      l = null,
      c = null;
    for (let d of s)
      if (d.resolveHostDirectives !== null) {
        [a, l, c] = d.resolveHostDirectives(s);
        break;
      }
    iA(n, t, e, a, o, l, c);
  }
  o !== null && i !== null && tA(e, i, o);
}
function tA(n, t, e) {
  let i = (n.localNames = []);
  for (let r = 0; r < t.length; r += 2) {
    let o = e[t[r + 1]];
    if (o == null) throw new v(-301, !1);
    i.push(t[r], o);
  }
}
function nA(n, t, e) {
  (t.componentOffset = e), (n.components ??= []).push(t.index);
}
function iA(n, t, e, i, r, o, s) {
  let a = i.length,
    l = !1;
  for (let p = 0; p < a; p++) {
    let h = i[p];
    !l && Hn(h) && ((l = !0), nA(n, e, p)), zp(dd(e, t), n, h.type);
  }
  cA(e, n.data.length, a);
  for (let p = 0; p < a; p++) {
    let h = i[p];
    h.providersResolver && h.providersResolver(h);
  }
  let c = !1,
    d = !1,
    u = Xw(n, t, a, null);
  a > 0 && (e.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let h = i[p];
    if (
      ((e.mergedAttrs = Bo(e.mergedAttrs, h.hostAttrs)),
      oA(n, e, t, u, h),
      lA(u, h, r),
      s !== null && s.has(h))
    ) {
      let [g, w] = s.get(h);
      e.directiveToIndex.set(h.type, [
        u,
        g + e.directiveStart,
        w + e.directiveStart,
      ]);
    } else (o === null || !o.has(h)) && e.directiveToIndex.set(h.type, u);
    h.contentQueries !== null && (e.flags |= 4),
      (h.hostBindings !== null || h.hostAttrs !== null || h.hostVars !== 0) &&
        (e.flags |= 64);
    let m = h.type.prototype;
    !c &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((n.preOrderHooks ??= []).push(e.index), (c = !0)),
      !d &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((n.preOrderCheckHooks ??= []).push(e.index), (d = !0)),
      u++;
  }
  rA(n, e, o);
}
function rA(n, t, e) {
  for (let i = t.directiveStart; i < t.directiveEnd; i++) {
    let r = n.data[i];
    if (e === null || !e.has(r)) qb(0, t, r, i), qb(1, t, r, i), Kb(t, i, !1);
    else {
      let o = e.get(r);
      Yb(0, t, o, i), Yb(1, t, o, i), Kb(t, i, !0);
    }
  }
}
function qb(n, t, e, i) {
  let r = n === 0 ? e.inputs : e.outputs;
  for (let o in r)
    if (r.hasOwnProperty(o)) {
      let s;
      n === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[o] ??= []),
        s[o].push(i),
        IE(t, o);
    }
}
function Yb(n, t, e, i) {
  let r = n === 0 ? e.inputs : e.outputs;
  for (let o in r)
    if (r.hasOwnProperty(o)) {
      let s = r[o],
        a;
      n === 0
        ? (a = t.hostDirectiveInputs ??= {})
        : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(i, o),
        IE(t, s);
    }
}
function IE(n, t) {
  t === "class" ? (n.flags |= 8) : t === "style" && (n.flags |= 16);
}
function Kb(n, t, e) {
  let { attrs: i, inputs: r, hostDirectiveInputs: o } = n;
  if (i === null || (!e && r === null) || (e && o === null) || Om(n)) {
    (n.initialInputs ??= []), n.initialInputs.push(null);
    return;
  }
  let s = null,
    a = 0;
  for (; a < i.length; ) {
    let l = i[a];
    if (l === 0) {
      a += 4;
      continue;
    } else if (l === 5) {
      a += 2;
      continue;
    } else if (typeof l == "number") break;
    if (!e && r.hasOwnProperty(l)) {
      let c = r[l];
      for (let d of c)
        if (d === t) {
          (s ??= []), s.push(l, i[a + 1]);
          break;
        }
    } else if (e && o.hasOwnProperty(l)) {
      let c = o[l];
      for (let d = 0; d < c.length; d += 2)
        if (c[d] === t) {
          (s ??= []), s.push(c[d + 1], i[a + 1]);
          break;
        }
    }
    a += 2;
  }
  (n.initialInputs ??= []), n.initialInputs.push(s);
}
function oA(n, t, e, i, r) {
  n.data[i] = r;
  let o = r.factory || (r.factory = Pi(r.type, !0)),
    s = new Br(o, Hn(r), ie);
  (n.blueprint[i] = s), (e[i] = s), sA(n, t, i, Xw(n, e, r.hostVars, Vt), r);
}
function sA(n, t, e, i, r) {
  let o = r.hostBindings;
  if (o) {
    let s = n.hostBindingOpCodes;
    s === null && (s = n.hostBindingOpCodes = []);
    let a = ~t.index;
    aA(s) != a && s.push(a), s.push(e, i, o);
  }
}
function aA(n) {
  let t = n.length;
  for (; t > 0; ) {
    let e = n[--t];
    if (typeof e == "number" && e < 0) return e;
  }
  return 0;
}
function lA(n, t, e) {
  if (e) {
    if (t.exportAs)
      for (let i = 0; i < t.exportAs.length; i++) e[t.exportAs[i]] = n;
    Hn(t) && (e[""] = n);
  }
}
function cA(n, t, e) {
  (n.flags |= 1),
    (n.directiveStart = t),
    (n.directiveEnd = t + e),
    (n.providerIndexes = t);
}
function SE(n, t, e, i, r, o, s, a) {
  let l = t[F],
    c = l.consts,
    d = yn(c, s),
    u = qo(l, n, e, i, d);
  return (
    o && CE(l, t, u, yn(c, a), r),
    (u.mergedAttrs = Bo(u.mergedAttrs, u.attrs)),
    u.attrs !== null && pd(u, u.attrs, !1),
    u.mergedAttrs !== null && pd(u, u.mergedAttrs, !0),
    l.queries !== null && l.queries.elementStart(l, u),
    u
  );
}
function xE(n, t) {
  mw(n, t), op(t) && n.queries.elementEnd(t);
}
function dA(n, t, e, i, r, o) {
  let s = t.consts,
    a = yn(s, r),
    l = qo(t, n, e, i, a);
  if (((l.mergedAttrs = Bo(l.mergedAttrs, l.attrs)), o != null)) {
    let c = yn(s, o);
    l.localNames = [];
    for (let d = 0; d < c.length; d += 2) l.localNames.push(c[d], -1);
  }
  return (
    l.attrs !== null && pd(l, l.attrs, !1),
    l.mergedAttrs !== null && pd(l, l.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, l),
    l
  );
}
function Zm(n) {
  return TE(n)
    ? Array.isArray(n) || (!(n instanceof Map) && Symbol.iterator in n)
    : !1;
}
function ME(n, t) {
  if (Array.isArray(n)) for (let e = 0; e < n.length; e++) t(n[e]);
  else {
    let e = n[Symbol.iterator](),
      i;
    for (; !(i = e.next()).done; ) t(i.value);
  }
}
function TE(n) {
  return n !== null && (typeof n == "function" || typeof n == "object");
}
function RE(n, t, e) {
  return (n[t] = e);
}
function Dn(n, t, e) {
  if (e === Vt) return !1;
  let i = n[t];
  return Object.is(i, e) ? !1 : ((n[t] = e), !0);
}
function AE(n, t, e, i) {
  let r = Dn(n, t, e);
  return Dn(n, t + 1, i) || r;
}
function od(n, t, e) {
  return function i(r) {
    let o = Bi(n) ? on(n.index, t) : t;
    qm(o, 5);
    let s = t[ht],
      a = Zb(t, s, e, r),
      l = i.__ngNextListenerFn__;
    for (; l; ) (a = Zb(t, s, l, r) && a), (l = l.__ngNextListenerFn__);
    return a;
  };
}
function Zb(n, t, e, i) {
  let r = z(null);
  try {
    return ge(6, t, e), e(i) !== !1;
  } catch (o) {
    return xR(n, o), !1;
  } finally {
    ge(7, t, e), z(r);
  }
}
function NE(n, t, e, i, r, o, s, a) {
  let l = Js(n),
    c = !1,
    d = null;
  if ((!i && l && (d = uA(t, e, o, n.index)), d !== null)) {
    let u = d.__ngLastListenerFn__ || d;
    (u.__ngNextListenerFn__ = s), (d.__ngLastListenerFn__ = s), (c = !0);
  } else {
    let u = _n(n, e),
      p = i ? i(u) : u;
    yT(e, p, o, a);
    let h = r.listen(p, o, a),
      m = i ? (g) => i(rn(g[n.index])) : n.index;
    OE(m, t, e, o, a, h, !1);
  }
  return c;
}
function uA(n, t, e, i) {
  let r = n.cleanup;
  if (r != null)
    for (let o = 0; o < r.length - 1; o += 2) {
      let s = r[o];
      if (s === e && r[o + 1] === i) {
        let a = t[No],
          l = r[o + 2];
        return a && a.length > l ? a[l] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function OE(n, t, e, i, r, o, s) {
  let a = t.firstCreatePass ? hp(t) : null,
    l = fp(e),
    c = l.length;
  l.push(r, o), a && a.push(i, n, c, (c + 1) * (s ? -1 : 1));
}
function Qb(n, t, e, i, r, o) {
  let s = t[e],
    a = t[F],
    c = a.data[e].outputs[i],
    u = s[c].subscribe(o);
  OE(n.index, a, t, r, o, u, !0);
}
var lm = Symbol("BINDING");
var md = class extends va {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let e = ri(t);
    return new Hr(e, this.ngModule);
  }
};
function fA(n) {
  return Object.keys(n).map((t) => {
    let [e, i, r] = n[t],
      o = {
        propName: e,
        templateName: t,
        isSignal: (i & xd.SignalBased) !== 0,
      };
    return r && (o.transform = r), o;
  });
}
function hA(n) {
  return Object.keys(n).map((t) => ({ propName: n[t], templateName: t }));
}
function pA(n, t, e) {
  let i = t instanceof Re ? t : t?.injector;
  return (
    i &&
      n.getStandaloneInjector !== null &&
      (i = n.getStandaloneInjector(i) || i),
    i ? new am(e, i) : e
  );
}
function mA(n) {
  let t = n.get(Se, null);
  if (t === null) throw new v(407, !1);
  let e = n.get(DE, null),
    i = n.get(tn, null);
  return {
    rendererFactory: t,
    sanitizer: e,
    changeDetectionScheduler: i,
    ngReflect: !1,
  };
}
function gA(n, t) {
  let e = (n.selectors[0][0] || "div").toLowerCase();
  return Yw(t, e, e === "svg" ? sp : e === "math" ? db : null);
}
var Hr = class extends Ad {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return (
      (this.cachedInputs ??= fA(this.componentDef.inputs)), this.cachedInputs
    );
  }
  get outputs() {
    return (
      (this.cachedOutputs ??= hA(this.componentDef.outputs)), this.cachedOutputs
    );
  }
  constructor(t, e) {
    super(),
      (this.componentDef = t),
      (this.ngModule = e),
      (this.componentType = t.type),
      (this.selector = YT(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!e);
  }
  create(t, e, i, r, o, s) {
    ge(22);
    let a = z(null);
    try {
      let l = this.componentDef,
        c = vA(i, l, s, o),
        d = pA(l, r || this.ngModule, t),
        u = mA(d),
        p = u.rendererFactory.createRenderer(null, l),
        h = i ? gR(p, i, l.encapsulation, d) : gA(l, p),
        m =
          s?.some(Xb) ||
          o?.some((S) => typeof S != "function" && S.bindings.some(Xb)),
        g = Pm(
          null,
          c,
          null,
          512 | Qw(l),
          null,
          null,
          u,
          p,
          d,
          null,
          Fw(h, d, !0)
        );
      (g[Fe] = h), Wc(g);
      let w = null;
      try {
        let S = SE(Fe, g, 2, "#host", () => c.directiveRegistry, !0, 0);
        h && (Zw(p, h, S), Ho(h, g)),
          Um(c, g, S),
          Vw(c, S, g),
          xE(c, S),
          e !== void 0 && yA(S, this.ngContentSelectors, e),
          (w = on(S.index, g)),
          (g[ht] = w[ht]),
          $m(c, g, null);
      } catch (S) {
        throw (w !== null && Gp(w), Gp(g), S);
      } finally {
        ge(23), qc();
      }
      return new gd(this.componentType, g, !!m);
    } finally {
      z(a);
    }
  }
};
function vA(n, t, e, i) {
  let r = n ? ["ng-version", "20.1.0"] : KT(t.selectors[0]),
    o = null,
    s = null,
    a = 0;
  if (e)
    for (let d of e)
      (a += d[lm].requiredVars),
        d.create && ((d.targetIdx = 0), (o ??= []).push(d)),
        d.update && ((d.targetIdx = 0), (s ??= []).push(d));
  if (i)
    for (let d = 0; d < i.length; d++) {
      let u = i[d];
      if (typeof u != "function")
        for (let p of u.bindings) {
          a += p[lm].requiredVars;
          let h = d + 1;
          p.create && ((p.targetIdx = h), (o ??= []).push(p)),
            p.update && ((p.targetIdx = h), (s ??= []).push(p));
        }
    }
  let l = [t];
  if (i)
    for (let d of i) {
      let u = typeof d == "function" ? d : d.type,
        p = Jh(u);
      l.push(p);
    }
  return km(0, null, _A(o, s), 1, a, l, null, null, null, [r], null);
}
function _A(n, t) {
  return !n && !t
    ? null
    : (e) => {
        if (e & 1 && n) for (let i of n) i.create();
        if (e & 2 && t) for (let i of t) i.update();
      };
}
function Xb(n) {
  let t = n[lm].kind;
  return t === "input" || t === "twoWay";
}
var gd = class extends EE {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, e, i) {
    super(),
      (this._rootLView = e),
      (this._hasInputBindings = i),
      (this._tNode = ea(e[F], Fe)),
      (this.location = $o(this._tNode, e)),
      (this.instance = on(this._tNode.index, e)[ht]),
      (this.hostView = this.changeDetectorRef = new Gi(e, void 0)),
      (this.componentType = t);
  }
  setInput(t, e) {
    this._hasInputBindings;
    let i = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) &&
        Object.is(this.previousInputValues.get(t), e))
    )
      return;
    let r = this._rootLView,
      o = zm(i, r[F], r, t, e);
    this.previousInputValues.set(t, e);
    let s = on(i.index, r);
    qm(s, 1);
  }
  get injector() {
    return new jr(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function yA(n, t, e) {
  let i = (n.projection = []);
  for (let r = 0; r < t.length; r++) {
    let o = e[r];
    i.push(o != null && o.length ? Array.from(o) : null);
  }
}
var mt = (() => {
  class n {
    static __NG_ELEMENT_ID__ = bA;
  }
  return n;
})();
function bA() {
  let n = tt();
  return PE(n, G());
}
var wA = mt,
  kE = class extends wA {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, e, i) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = e),
        (this._hostLView = i);
    }
    get element() {
      return $o(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new jr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Dm(this._hostTNode, this._hostLView);
      if (_w(t)) {
        let e = ld(t, this._hostLView),
          i = ad(t),
          r = e[F].data[i + 8];
        return new jr(r, e);
      } else return new jr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let e = Jb(this._lContainer);
      return (e !== null && e[t]) || null;
    }
    get length() {
      return this._lContainer.length - bt;
    }
    createEmbeddedView(t, e, i) {
      let r, o;
      typeof i == "number"
        ? (r = i)
        : i != null && ((r = i.index), (o = i.injector));
      let s = om(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(e || {}, o, s);
      return this.insertImpl(a, r, fd(this._hostTNode, s)), a;
    }
    createComponent(t, e, i, r, o, s, a) {
      let l = t && !GM(t),
        c;
      if (l) c = e;
      else {
        let w = e || {};
        (c = w.index),
          (i = w.injector),
          (r = w.projectableNodes),
          (o = w.environmentInjector || w.ngModuleRef),
          (s = w.directives),
          (a = w.bindings);
      }
      let d = l ? t : new Hr(ri(t)),
        u = i || this.parentInjector;
      if (!o && d.ngModule == null) {
        let S = (l ? u : this.parentInjector).get(Re, null);
        S && (o = S);
      }
      let p = ri(d.componentType ?? {}),
        h = om(this._lContainer, p?.id ?? null),
        m = h?.firstChild ?? null,
        g = d.create(u, r, m, o, s, a);
      return this.insertImpl(g.hostView, c, fd(this._hostTNode, h)), g;
    }
    insert(t, e) {
      return this.insertImpl(t, e, !0);
    }
    insertImpl(t, e, i) {
      let r = t._lView;
      if (fb(r)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let l = r[st],
            c = new kE(l, l[xt], l[st]);
          c.detach(c.indexOf(t));
        }
      }
      let o = this._adjustIndex(e),
        s = this._lContainer;
      return Ym(s, r, o, i), t.attachToViewContainerRef(), Kh(Pp(s), o, t), t;
    }
    move(t, e) {
      return this.insert(t, e);
    }
    indexOf(t) {
      let e = Jb(this._lContainer);
      return e !== null ? e.indexOf(t) : -1;
    }
    remove(t) {
      let e = this._adjustIndex(t, -1),
        i = hd(this._lContainer, e);
      i && (Ks(Pp(this._lContainer), e), jm(i[F], i));
    }
    detach(t) {
      let e = this._adjustIndex(t, -1),
        i = hd(this._lContainer, e);
      return i && Ks(Pp(this._lContainer), e) != null ? new Gi(i) : null;
    }
    _adjustIndex(t, e = 0) {
      return t ?? this.length + e;
    }
  };
function Jb(n) {
  return n[Xs];
}
function Pp(n) {
  return n[Xs] || (n[Xs] = []);
}
function PE(n, t) {
  let e,
    i = t[n.index];
  return (
    vn(i) ? (e = i) : ((e = bE(i, t, null, n)), (t[n.index] = e), Fm(t, e)),
    DA(e, t, n, i),
    new kE(e, n, t)
  );
}
function EA(n, t) {
  let e = n[Ee],
    i = e.createComment(""),
    r = _n(t, n),
    o = e.parentNode(r);
  return ud(e, o, i, e.nextSibling(r), !1), i;
}
var DA = SA,
  CA = () => !1;
function IA(n, t, e) {
  return CA(n, t, e);
}
function SA(n, t, e, i) {
  if (n[ji]) return;
  let r;
  e.type & 8 ? (r = rn(i)) : (r = EA(t, e)), (n[ji] = r);
}
var cm = class n {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new n(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  dm = class n {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let e = t.queries;
      if (e !== null) {
        let i = t.contentQueries !== null ? t.contentQueries[0] : e.length,
          r = [];
        for (let o = 0; o < i; o++) {
          let s = e.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          r.push(a.clone());
        }
        return new n(r);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let e = 0; e < this.queries.length; e++)
        Xm(t, e).matches !== null && this.queries[e].setDirty();
    }
  },
  vd = class {
    flags;
    read;
    predicate;
    constructor(t, e, i = null) {
      (this.flags = e),
        (this.read = i),
        typeof t == "string" ? (this.predicate = AA(t)) : (this.predicate = t);
    }
  },
  um = class n {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, e) {
      for (let i = 0; i < this.queries.length; i++)
        this.queries[i].elementStart(t, e);
    }
    elementEnd(t) {
      for (let e = 0; e < this.queries.length; e++)
        this.queries[e].elementEnd(t);
    }
    embeddedTView(t) {
      let e = null;
      for (let i = 0; i < this.length; i++) {
        let r = e !== null ? e.length : 0,
          o = this.getByIndex(i).embeddedTView(t, r);
        o &&
          ((o.indexInDeclarationView = i), e !== null ? e.push(o) : (e = [o]));
      }
      return e !== null ? new n(e) : null;
    }
    template(t, e) {
      for (let i = 0; i < this.queries.length; i++)
        this.queries[i].template(t, e);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  fm = class n {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, e = -1) {
      (this.metadata = t), (this._declarationNodeIndex = e);
    }
    elementStart(t, e) {
      this.isApplyingToNode(e) && this.matchTNode(t, e);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, e) {
      this.elementStart(t, e);
    }
    embeddedTView(t, e) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-t.index, e),
          new n(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let e = this._declarationNodeIndex,
          i = t.parent;
        for (; i !== null && i.type & 8 && i.index !== e; ) i = i.parent;
        return e === (i !== null ? i.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, e) {
      let i = this.metadata.predicate;
      if (Array.isArray(i))
        for (let r = 0; r < i.length; r++) {
          let o = i[r];
          this.matchTNodeWithReadOption(t, e, xA(e, o)),
            this.matchTNodeWithReadOption(t, e, id(e, t, o, !1, !1));
        }
      else
        i === Lt
          ? e.type & 4 && this.matchTNodeWithReadOption(t, e, -1)
          : this.matchTNodeWithReadOption(t, e, id(e, t, i, !1, !1));
    }
    matchTNodeWithReadOption(t, e, i) {
      if (i !== null) {
        let r = this.metadata.read;
        if (r !== null)
          if (r === K || r === mt || (r === Lt && e.type & 4))
            this.addMatch(e.index, -2);
          else {
            let o = id(e, t, r, !1, !1);
            o !== null && this.addMatch(e.index, o);
          }
        else this.addMatch(e.index, i);
      }
    }
    addMatch(t, e) {
      this.matches === null ? (this.matches = [t, e]) : this.matches.push(t, e);
    }
  };
function xA(n, t) {
  let e = n.localNames;
  if (e !== null) {
    for (let i = 0; i < e.length; i += 2) if (e[i] === t) return e[i + 1];
  }
  return null;
}
function MA(n, t) {
  return n.type & 11 ? $o(n, t) : n.type & 4 ? Rd(n, t) : null;
}
function TA(n, t, e, i) {
  return e === -1 ? MA(t, n) : e === -2 ? RA(n, t, i) : ca(n, n[F], e, t);
}
function RA(n, t, e) {
  if (e === K) return $o(t, n);
  if (e === Lt) return Rd(t, n);
  if (e === mt) return PE(t, n);
}
function FE(n, t, e, i) {
  let r = t[jn].queries[i];
  if (r.matches === null) {
    let o = n.data,
      s = e.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let d = o[c];
        a.push(TA(t, d, s[l + 1], e.metadata.read));
      }
    }
    r.matches = a;
  }
  return r.matches;
}
function hm(n, t, e, i) {
  let r = n.queries.getByIndex(e),
    o = r.matches;
  if (o !== null) {
    let s = FE(n, t, r, e);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) i.push(s[a / 2]);
      else {
        let c = o[a + 1],
          d = t[-l];
        for (let u = bt; u < d.length; u++) {
          let p = d[u];
          p[Vi] === p[st] && hm(p[F], p, c, i);
        }
        if (d[Or] !== null) {
          let u = d[Or];
          for (let p = 0; p < u.length; p++) {
            let h = u[p];
            hm(h[F], h, c, i);
          }
        }
      }
    }
  }
  return i;
}
function Qm(n, t) {
  return n[jn].queries[t].queryList;
}
function LE(n, t, e) {
  let i = new En((e & 4) === 4);
  return (
    mb(n, t, i, i.destroy), (t[jn] ??= new dm()).queries.push(new cm(i)) - 1
  );
}
function VE(n, t, e) {
  let i = Ae();
  return (
    i.firstCreatePass &&
      (BE(i, new vd(n, t, e), -1), (t & 2) === 2 && (i.staticViewQueries = !0)),
    LE(i, G(), t)
  );
}
function jE(n, t, e, i) {
  let r = Ae();
  if (r.firstCreatePass) {
    let o = tt();
    BE(r, new vd(t, e, i), o.index),
      NA(r, n),
      (e & 2) === 2 && (r.staticContentQueries = !0);
  }
  return LE(r, G(), e);
}
function AA(n) {
  return n.split(",").map((t) => t.trim());
}
function BE(n, t, e) {
  n.queries === null && (n.queries = new um()), n.queries.track(new fm(t, e));
}
function NA(n, t) {
  let e = n.contentQueries || (n.contentQueries = []),
    i = e.length ? e[e.length - 1] : -1;
  t !== i && e.push(n.queries.length - 1, t);
}
function Xm(n, t) {
  return n.queries.getByIndex(t);
}
function HE(n, t) {
  let e = n[F],
    i = Xm(e, t);
  return i.crossesNgTemplate ? hm(e, n, t, []) : FE(e, n, i, t);
}
function UE(n, t, e) {
  let i,
    r = Ps(() => {
      i._dirtyCounter();
      let o = OA(i, n);
      if (t && o === void 0) throw new v(-951, !1);
      return o;
    });
  return (i = r[Ze]), (i._dirtyCounter = Ne(0)), (i._flatValue = void 0), r;
}
function Jm(n) {
  return UE(!0, !1, n);
}
function eg(n) {
  return UE(!0, !0, n);
}
function zE(n, t) {
  let e = n[Ze];
  (e._lView = G()),
    (e._queryIndex = t),
    (e._queryList = Qm(e._lView, t)),
    e._queryList.onDirty(() => e._dirtyCounter.update((i) => i + 1));
}
function OA(n, t) {
  let e = n._lView,
    i = n._queryIndex;
  if (e === void 0 || i === void 0 || e[V] & 4) return t ? void 0 : _t;
  let r = Qm(e, i),
    o = HE(e, i);
  return (
    r.reset(o, xw),
    t
      ? r.first
      : r._changesDetected || n._flatValue === void 0
      ? (n._flatValue = r.toArray())
      : n._flatValue
  );
}
var ew = new Set();
function $n(n) {
  ew.has(n) ||
    (ew.add(n),
    performance?.mark?.("mark_feature_usage", { detail: { feature: n } }));
}
var ui = class {},
  Nd = class {};
var _d = class extends ui {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new md(this);
    constructor(t, e, i, r = !0) {
      super(), (this.ngModuleType = t), (this._parent = e);
      let o = Xh(t);
      (this._bootstrapComponents = Gw(o.bootstrap)),
        (this._r3Injector = xp(
          t,
          e,
          [
            { provide: ui, useValue: this },
            { provide: va, useValue: this.componentFactoryResolver },
            ...i,
          ],
          Pt(t),
          new Set(["environment"])
        )),
        r && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((e) => e()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  yd = class extends Nd {
    moduleType;
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new _d(this.moduleType, t, []);
    }
  };
var ua = class extends ui {
  injector;
  componentFactoryResolver = new md(this);
  instance = null;
  constructor(t) {
    super();
    let e = new Sr(
      [
        ...t.providers,
        { provide: ui, useValue: this },
        { provide: va, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ro(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = e),
      t.runEnvironmentInitializers && e.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function _a(n, t, e = null) {
  return new ua({
    providers: n,
    parent: t,
    debugName: e,
    runEnvironmentInitializers: !0,
  }).injector;
}
var kA = (() => {
  class n {
    _injector;
    cachedInjectors = new Map();
    constructor(e) {
      this._injector = e;
    }
    getOrCreateStandaloneInjector(e) {
      if (!e.standalone) return null;
      if (!this.cachedInjectors.has(e)) {
        let i = ep(!1, e.type),
          r =
            i.length > 0
              ? _a([i], this._injector, `Standalone[${e.type.name}]`)
              : null;
        this.cachedInjectors.set(e, r);
      }
      return this.cachedInjectors.get(e);
    }
    ngOnDestroy() {
      try {
        for (let e of this.cachedInjectors.values()) e !== null && e.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = b({
      token: n,
      providedIn: "environment",
      factory: () => new n(A(Re)),
    });
  }
  return n;
})();
function Z(n) {
  return zo(() => {
    let t = $E(n),
      e = B(_({}, t), {
        decls: n.decls,
        vars: n.vars,
        template: n.template,
        consts: n.consts || null,
        ngContentSelectors: n.ngContentSelectors,
        onPush: n.changeDetection === Im.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && n.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (r) => r.get(kA).getOrCreateStandaloneInjector(e)
          : null,
        getExternalStyles: null,
        signals: n.signals ?? !1,
        data: n.data || {},
        encapsulation: n.encapsulation || ci.Emulated,
        styles: n.styles || _t,
        _: null,
        schemas: n.schemas || null,
        tView: null,
        id: "",
      });
    t.standalone && $n("NgStandalone"), GE(e);
    let i = n.dependencies;
    return (
      (e.directiveDefs = tw(i, PA)), (e.pipeDefs = tw(i, nb)), (e.id = VA(e)), e
    );
  });
}
function PA(n) {
  return ri(n) || Jh(n);
}
function X(n) {
  return zo(() => ({
    type: n.type,
    bootstrap: n.bootstrap || _t,
    declarations: n.declarations || _t,
    imports: n.imports || _t,
    exports: n.exports || _t,
    transitiveCompileScopes: null,
    schemas: n.schemas || null,
    id: n.id || null,
  }));
}
function FA(n, t) {
  if (n == null) return Li;
  let e = {};
  for (let i in n)
    if (n.hasOwnProperty(i)) {
      let r = n[i],
        o,
        s,
        a,
        l;
      Array.isArray(r)
        ? ((a = r[0]), (o = r[1]), (s = r[2] ?? o), (l = r[3] || null))
        : ((o = r), (s = r), (a = xd.None), (l = null)),
        (e[o] = [i, a, l]),
        (t[o] = s);
    }
  return e;
}
function LA(n) {
  if (n == null) return Li;
  let t = {};
  for (let e in n) n.hasOwnProperty(e) && (t[n[e]] = e);
  return t;
}
function L(n) {
  return zo(() => {
    let t = $E(n);
    return GE(t), t;
  });
}
function Od(n) {
  return {
    type: n.type,
    name: n.name,
    factory: null,
    pure: n.pure !== !1,
    standalone: n.standalone ?? !0,
    onDestroy: n.type.prototype.ngOnDestroy || null,
  };
}
function $E(n) {
  let t = {};
  return {
    type: n.type,
    providersResolver: null,
    factory: null,
    hostBindings: n.hostBindings || null,
    hostVars: n.hostVars || 0,
    hostAttrs: n.hostAttrs || null,
    contentQueries: n.contentQueries || null,
    declaredInputs: t,
    inputConfig: n.inputs || Li,
    exportAs: n.exportAs || null,
    standalone: n.standalone ?? !0,
    signals: n.signals === !0,
    selectors: n.selectors || _t,
    viewQuery: n.viewQuery || null,
    features: n.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: FA(n.inputs, t),
    outputs: LA(n.outputs),
    debugInfo: null,
  };
}
function GE(n) {
  n.features?.forEach((t) => t(n));
}
function tw(n, t) {
  return n
    ? () => {
        let e = typeof n == "function" ? n() : n,
          i = [];
        for (let r of e) {
          let o = t(r);
          o !== null && i.push(o);
        }
        return i;
      }
    : null;
}
function VA(n) {
  let t = 0,
    e = typeof n.consts == "function" ? "" : n.consts,
    i = [
      n.selectors,
      n.ngContentSelectors,
      n.hostVars,
      n.hostAttrs,
      e,
      n.vars,
      n.decls,
      n.encapsulation,
      n.standalone,
      n.signals,
      n.exportAs,
      JSON.stringify(n.inputs),
      JSON.stringify(n.outputs),
      Object.getOwnPropertyNames(n.type.prototype),
      !!n.contentQueries,
      !!n.viewQuery,
    ];
  for (let o of i.join("|")) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function jA(n) {
  return Object.getPrototypeOf(n.prototype).constructor;
}
function at(n) {
  let t = jA(n.type),
    e = !0,
    i = [n];
  for (; t; ) {
    let r;
    if (Hn(n)) r = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new v(903, !1);
      r = t.ɵdir;
    }
    if (r) {
      if (e) {
        i.push(r);
        let s = n;
        (s.inputs = Fp(n.inputs)),
          (s.declaredInputs = Fp(n.declaredInputs)),
          (s.outputs = Fp(n.outputs));
        let a = r.hostBindings;
        a && $A(n, a);
        let l = r.viewQuery,
          c = r.contentQueries;
        if (
          (l && UA(n, l),
          c && zA(n, c),
          BA(n, r),
          Yy(n.outputs, r.outputs),
          Hn(r) && r.data.animation)
        ) {
          let d = n.data;
          d.animation = (d.animation || []).concat(r.data.animation);
        }
      }
      let o = r.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(n), a === at && (e = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  HA(i);
}
function BA(n, t) {
  for (let e in t.inputs) {
    if (!t.inputs.hasOwnProperty(e) || n.inputs.hasOwnProperty(e)) continue;
    let i = t.inputs[e];
    i !== void 0 &&
      ((n.inputs[e] = i), (n.declaredInputs[e] = t.declaredInputs[e]));
  }
}
function HA(n) {
  let t = 0,
    e = null;
  for (let i = n.length - 1; i >= 0; i--) {
    let r = n[i];
    (r.hostVars = t += r.hostVars),
      (r.hostAttrs = Bo(r.hostAttrs, (e = Bo(e, r.hostAttrs))));
  }
}
function Fp(n) {
  return n === Li ? {} : n === _t ? [] : n;
}
function UA(n, t) {
  let e = n.viewQuery;
  e
    ? (n.viewQuery = (i, r) => {
        t(i, r), e(i, r);
      })
    : (n.viewQuery = t);
}
function zA(n, t) {
  let e = n.contentQueries;
  e
    ? (n.contentQueries = (i, r, o) => {
        t(i, r, o), e(i, r, o);
      })
    : (n.contentQueries = t);
}
function $A(n, t) {
  let e = n.hostBindings;
  e
    ? (n.hostBindings = (i, r) => {
        t(i, r), e(i, r);
      })
    : (n.hostBindings = t);
}
function WE(n, t, e, i, r, o, s, a) {
  if (e.firstCreatePass) {
    n.mergedAttrs = Bo(n.mergedAttrs, n.attrs);
    let d = (n.tView = km(
      2,
      n,
      r,
      o,
      s,
      e.directiveRegistry,
      e.pipeRegistry,
      null,
      e.schemas,
      e.consts,
      null
    ));
    e.queries !== null &&
      (e.queries.template(e, n), (d.queries = e.queries.embeddedTView(n)));
  }
  a && (n.flags |= a), Po(n, !1);
  let l = WA(e, t, n, i);
  Yc() && Bm(e, t, l, n), Ho(l, t);
  let c = bE(l, t, l, n);
  (t[i + Fe] = c), Fm(t, c), IA(c, n, t);
}
function GA(n, t, e, i, r, o, s, a, l, c, d) {
  let u = e + Fe,
    p;
  return (
    t.firstCreatePass
      ? ((p = qo(t, u, 4, s || null, a || null)),
        mp() && CE(t, n, p, yn(t.consts, c), lE),
        mw(t, p))
      : (p = t.data[u]),
    WE(p, n, t, e, i, r, o, l),
    Js(p) && Um(t, n, p),
    c != null && Td(n, p, d),
    p
  );
}
function kd(n, t, e, i, r, o, s, a, l, c, d) {
  let u = e + Fe,
    p;
  if (t.firstCreatePass) {
    if (((p = qo(t, u, 4, s || null, a || null)), c != null)) {
      let h = yn(t.consts, c);
      p.localNames = [];
      for (let m = 0; m < h.length; m += 2) p.localNames.push(h[m], -1);
    }
  } else p = t.data[u];
  return WE(p, n, t, e, i, r, o, l), c != null && Td(n, p, d), p;
}
function nt(n, t, e, i, r, o, s, a) {
  let l = G(),
    c = Ae(),
    d = yn(c.consts, o);
  return GA(l, c, n, t, e, i, r, d, void 0, s, a), nt;
}
function Pd(n, t, e, i, r, o, s, a) {
  let l = G(),
    c = Ae(),
    d = yn(c.consts, o);
  return kd(l, c, n, t, e, i, r, d, void 0, s, a), Pd;
}
var WA = qA;
function qA(n, t, e, i) {
  return Kc(!0), t[Ee].createComment("");
}
var Fd = (function (n) {
    return (
      (n[(n.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (n[(n.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      n
    );
  })(Fd || {}),
  Yi = new y(""),
  qE = !1,
  pm = class extends E {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        lb() &&
          ((this.destroyRef = f(qt, { optional: !0 }) ?? void 0),
          (this.pendingTasks = f($i, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let e = z(null);
      try {
        super.next(t);
      } finally {
        z(e);
      }
    }
    subscribe(t, e, i) {
      let r = t,
        o = e || (() => null),
        s = i;
      if (t && typeof t == "object") {
        let l = t;
        (r = l.next?.bind(l)),
          (o = l.error?.bind(l)),
          (s = l.complete?.bind(l));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        r && (r = this.wrapInTimeout(r)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: r, error: o, complete: s });
      return t instanceof W && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (e) => {
        let i = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(e);
          } finally {
            i !== void 0 && this.pendingTasks?.remove(i);
          }
        });
      };
    }
  },
  j = pm;
function YE(n) {
  let t, e;
  function i() {
    n = Lr;
    try {
      e !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(e),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      n(), i();
    })),
    typeof requestAnimationFrame == "function" &&
      (e = requestAnimationFrame(() => {
        n(), i();
      })),
    () => i()
  );
}
function nw(n) {
  return (
    queueMicrotask(() => n()),
    () => {
      n = Lr;
    }
  );
}
var tg = "isAngularZone",
  bd = tg + "_ID",
  YA = 0,
  M = class n {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new j(!1);
    onMicrotaskEmpty = new j(!1);
    onStable = new j(!1);
    onError = new j(!1);
    constructor(t) {
      let {
        enableLongStackTrace: e = !1,
        shouldCoalesceEventChangeDetection: i = !1,
        shouldCoalesceRunChangeDetection: r = !1,
        scheduleInRootZone: o = qE,
      } = t;
      if (typeof Zone > "u") throw new v(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !r && i),
        (s.shouldCoalesceRunChangeDetection = r),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = o),
        QA(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(tg) === !0;
    }
    static assertInAngularZone() {
      if (!n.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (n.isInAngularZone()) throw new v(909, !1);
    }
    run(t, e, i) {
      return this._inner.run(t, e, i);
    }
    runTask(t, e, i, r) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + r, t, KA, Lr, Lr);
      try {
        return o.runTask(s, e, i);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(t, e, i) {
      return this._inner.runGuarded(t, e, i);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  KA = {};
function ng(n) {
  if (n._nesting == 0 && !n.hasPendingMicrotasks && !n.isStable)
    try {
      n._nesting++, n.onMicrotaskEmpty.emit(null);
    } finally {
      if ((n._nesting--, !n.hasPendingMicrotasks))
        try {
          n.runOutsideAngular(() => n.onStable.emit(null));
        } finally {
          n.isStable = !0;
        }
    }
}
function ZA(n) {
  if (n.isCheckStableRunning || n.callbackScheduled) return;
  n.callbackScheduled = !0;
  function t() {
    YE(() => {
      (n.callbackScheduled = !1),
        mm(n),
        (n.isCheckStableRunning = !0),
        ng(n),
        (n.isCheckStableRunning = !1);
    });
  }
  n.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : n._outer.run(() => {
        t();
      }),
    mm(n);
}
function QA(n) {
  let t = () => {
      ZA(n);
    },
    e = YA++;
  n._inner = n._inner.fork({
    name: "angular",
    properties: { [tg]: !0, [bd]: e, [bd + e]: !0 },
    onInvokeTask: (i, r, o, s, a, l) => {
      if (XA(l)) return i.invokeTask(o, s, a, l);
      try {
        return iw(n), i.invokeTask(o, s, a, l);
      } finally {
        ((n.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          n.shouldCoalesceRunChangeDetection) &&
          t(),
          rw(n);
      }
    },
    onInvoke: (i, r, o, s, a, l, c) => {
      try {
        return iw(n), i.invoke(o, s, a, l, c);
      } finally {
        n.shouldCoalesceRunChangeDetection &&
          !n.callbackScheduled &&
          !JA(l) &&
          t(),
          rw(n);
      }
    },
    onHasTask: (i, r, o, s) => {
      i.hasTask(o, s),
        r === o &&
          (s.change == "microTask"
            ? ((n._hasPendingMicrotasks = s.microTask), mm(n), ng(n))
            : s.change == "macroTask" &&
              (n.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (i, r, o, s) => (
      i.handleError(o, s), n.runOutsideAngular(() => n.onError.emit(s)), !1
    ),
  });
}
function mm(n) {
  n._hasPendingMicrotasks ||
  ((n.shouldCoalesceEventChangeDetection ||
    n.shouldCoalesceRunChangeDetection) &&
    n.callbackScheduled === !0)
    ? (n.hasPendingMicrotasks = !0)
    : (n.hasPendingMicrotasks = !1);
}
function iw(n) {
  n._nesting++, n.isStable && ((n.isStable = !1), n.onUnstable.emit(null));
}
function rw(n) {
  n._nesting--, ng(n);
}
var fa = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new j();
  onMicrotaskEmpty = new j();
  onStable = new j();
  onError = new j();
  run(t, e, i) {
    return t.apply(e, i);
  }
  runGuarded(t, e, i) {
    return t.apply(e, i);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, e, i, r) {
    return t.apply(e, i);
  }
};
function XA(n) {
  return KE(n, "__ignore_ng_zone__");
}
function JA(n) {
  return KE(n, "__scheduler_tick__");
}
function KE(n, t) {
  return !Array.isArray(n) || n.length !== 1 ? !1 : n[0]?.data?.[t] === !0;
}
var Ld = (() => {
    class n {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = b({
        token: n,
        providedIn: "root",
        factory: () => new n(),
      });
    }
    return n;
  })(),
  ig = [0, 1, 2, 3],
  rg = (() => {
    class n {
      ngZone = f(M);
      scheduler = f(tn);
      errorHandler = f(ft, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        f(Yi, { optional: !0 });
      }
      execute() {
        let e = this.sequences.size > 0;
        e && ge(16), (this.executing = !0);
        for (let i of ig)
          for (let r of this.sequences)
            if (!(r.erroredOrDestroyed || !r.hooks[i]))
              try {
                r.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let o = r.hooks[i];
                    return o(r.pipelinedValue);
                  }, r.snapshot)
                );
              } catch (o) {
                (r.erroredOrDestroyed = !0), this.errorHandler?.handleError(o);
              }
        this.executing = !1;
        for (let i of this.sequences)
          i.afterRun(), i.once && (this.sequences.delete(i), i.destroy());
        for (let i of this.deferredRegistrations) this.sequences.add(i);
        this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          e && ge(17);
      }
      register(e) {
        let { view: i } = e;
        i !== void 0
          ? ((i[Nr] ??= []).push(e), Hi(i), (i[V] |= 8192))
          : this.executing
          ? this.deferredRegistrations.add(e)
          : this.addSequence(e);
      }
      addSequence(e) {
        this.sequences.add(e), this.scheduler.notify(7);
      }
      unregister(e) {
        this.executing && this.sequences.has(e)
          ? ((e.erroredOrDestroyed = !0),
            (e.pipelinedValue = void 0),
            (e.once = !0))
          : (this.sequences.delete(e), this.deferredRegistrations.delete(e));
      }
      maybeTrace(e, i) {
        return i ? i.run(Fd.AFTER_NEXT_RENDER, e) : e();
      }
      static ɵprov = b({
        token: n,
        providedIn: "root",
        factory: () => new n(),
      });
    }
    return n;
  })(),
  ha = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, e, i, r, o, s = null) {
      (this.impl = t),
        (this.hooks = e),
        (this.view = i),
        (this.once = r),
        (this.snapshot = s),
        (this.unregisterOnDestroy = o?.onDestroy(() => this.destroy()));
    }
    afterRun() {
      (this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null);
    }
    destroy() {
      this.impl.unregister(this), this.unregisterOnDestroy?.();
      let t = this.view?.[Nr];
      t && (this.view[Nr] = t.filter((e) => e !== this));
    }
  };
function Kt(n, t) {
  let e = t?.injector ?? f(te);
  return $n("NgAfterNextRender"), tN(n, e, t, !0);
}
function eN(n) {
  return n instanceof Function
    ? [void 0, void 0, n, void 0]
    : [n.earlyRead, n.write, n.mixedReadWrite, n.read];
}
function tN(n, t, e, i) {
  let r = t.get(Ld);
  r.impl ??= t.get(rg);
  let o = t.get(Yi, null, { optional: !0 }),
    s = e?.manualCleanup !== !0 ? t.get(qt) : null,
    a = t.get(Fr, null, { optional: !0 }),
    l = new ha(r.impl, eN(n), a?.view, i, s, o?.snapshot(null));
  return r.impl.register(l), l;
}
var Vd = (() => {
  class n {
    log(e) {
      console.log(e);
    }
    warn(e) {
      console.warn(e);
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "platform" });
  }
  return n;
})();
var og = new y("");
function Ki(n) {
  return !!n && typeof n.then == "function";
}
function sg(n) {
  return !!n && typeof n.subscribe == "function";
}
var ZE = new y("");
var ag = (() => {
    class n {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((e, i) => {
        (this.resolve = e), (this.reject = i);
      });
      appInits = f(ZE, { optional: !0 }) ?? [];
      injector = f(te);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let e = [];
        for (let r of this.appInits) {
          let o = yt(this.injector, r);
          if (Ki(o)) e.push(o);
          else if (sg(o)) {
            let s = new Promise((a, l) => {
              o.subscribe({ complete: a, error: l });
            });
            e.push(s);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(e)
          .then(() => {
            i();
          })
          .catch((r) => {
            this.reject(r);
          }),
          e.length === 0 && i(),
          (this.initialized = !0);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  jd = new y("");
function QE() {
  uh(() => {
    let n = "";
    throw new v(600, n);
  });
}
function XE(n) {
  return n.isBoundToModule;
}
var nN = 10;
var jt = (() => {
  class n {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = f(Yt);
    afterRenderManager = f(Ld);
    zonelessEnabled = f(Lo);
    rootEffectScheduler = f(sa);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new E();
    get allViews() {
      return [
        ...(this.includeAllTestViews
          ? this.allTestViews
          : this.autoDetectTestViews
        ).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = f($i);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(
        R((e) => !e)
      );
    }
    constructor() {
      f(Yi, { optional: !0 });
    }
    whenStable() {
      let e;
      return new Promise((i) => {
        e = this.isStable.subscribe({
          next: (r) => {
            r && i();
          },
        });
      }).finally(() => {
        e.unsubscribe();
      });
    }
    _injector = f(Re);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(e, i) {
      return this.bootstrapImpl(e, i);
    }
    bootstrapImpl(e, i, r = te.NULL) {
      return this._injector.get(M).run(() => {
        ge(10);
        let s = e instanceof Ad;
        if (!this._injector.get(ag).done) {
          let m = "";
          throw new v(405, m);
        }
        let l;
        s ? (l = e) : (l = this._injector.get(va).resolveComponentFactory(e)),
          this.componentTypes.push(l.componentType);
        let c = XE(l) ? void 0 : this._injector.get(ui),
          d = i || l.selector,
          u = l.create(r, [], d, c),
          p = u.location.nativeElement,
          h = u.injector.get(og, null);
        return (
          h?.registerApplication(p),
          u.onDestroy(() => {
            this.detachView(u.hostView),
              la(this.components, u),
              h?.unregisterApplication(p);
          }),
          this._loadComponent(u),
          ge(11, u),
          u
        );
      });
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      ge(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Fd.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl();
    }
    tickImpl = () => {
      if (this._runningTick) throw new v(101, !1);
      let e = z(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } finally {
        (this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          z(e),
          this.afterTick.next(),
          ge(13);
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Se, null, {
          optional: !0,
        }));
      let e = 0;
      for (; this.dirtyFlags !== 0 && e++ < nN; )
        ge(14), this.synchronizeOnce(), ge(15);
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 &&
        ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let e = !1;
      if (this.dirtyFlags & 7) {
        let i = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: r } of this.allViews) {
          if (!i && !ta(r)) continue;
          let o = i && !this.zonelessEnabled ? 0 : 1;
          Wm(r, o), (e = !0);
        }
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      }
      e || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 &&
          ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: e }) => ta(e))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(e) {
      let i = e;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(e) {
      let i = e;
      la(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(e) {
      this.attachView(e.hostView);
      try {
        this.tick();
      } catch (r) {
        this.internalErrorHandler(r);
      }
      this.components.push(e), this._injector.get(jd, []).forEach((r) => r(e));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((e) => e()),
            this._views.slice().forEach((e) => e.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(e) {
      return (
        this._destroyListeners.push(e), () => la(this._destroyListeners, e)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let e = this._injector;
      e.destroy && !e.destroyed && e.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
function la(n, t) {
  let e = n.indexOf(t);
  e > -1 && n.splice(e, 1);
}
function De(n, t, e, i) {
  let r = G(),
    o = Pr();
  if (Dn(r, o, t)) {
    let s = Ae(),
      a = ra();
    CR(a, r, n, t, e, i);
  }
  return De;
}
function Ge(n, t, e, i, r, o, s, a) {
  $n("NgControlFlow");
  let l = G(),
    c = Ae(),
    d = yn(c.consts, o);
  return kd(l, c, n, t, e, i, r, d, 256, s, a), lg;
}
function lg(n, t, e, i, r, o, s, a) {
  $n("NgControlFlow");
  let l = G(),
    c = Ae(),
    d = yn(c.consts, o);
  return kd(l, c, n, t, e, i, r, d, 512, s, a), lg;
}
function We(n, t) {
  $n("NgControlFlow");
  let e = G(),
    i = Pr(),
    r = e[i] !== Vt ? e[i] : -1,
    o = r !== -1 ? ow(e, Fe + r) : void 0,
    s = 0;
  if (Dn(e, i, n)) {
    let a = z(null);
    try {
      if ((o !== void 0 && GR(o, s), n !== -1)) {
        let l = Fe + n,
          c = ow(e, l),
          d = iN(e[F], l),
          u = JR(c, d, e),
          p = Gm(e, d, t, { dehydratedView: u });
        Ym(c, p, s, fd(d, u));
      }
    } finally {
      z(a);
    }
  } else if (o !== void 0) {
    let a = $R(o, s);
    a !== void 0 && (a[ht] = t);
  }
}
function ow(n, t) {
  return n[t];
}
function iN(n, t) {
  return ea(n, t);
}
function le(n, t, e) {
  let i = G(),
    r = Pr();
  if (Dn(i, r, t)) {
    let o = Ae(),
      s = ra();
    sE(s, i, n, t, i[Ee], e);
  }
  return le;
}
function gm(n, t, e, i, r) {
  zm(t, n, e, r ? "class" : "style", i);
}
function D(n, t, e, i) {
  let r = G(),
    o = r[F],
    s = n + Fe,
    a = o.firstCreatePass ? SE(s, r, 2, t, lE, mp(), e, i) : o.data[s];
  if ((cE(a, r, n, t, JE), Js(a))) {
    let l = r[F];
    Um(l, r, a), Vw(l, a, r);
  }
  return i != null && Td(r, a), D;
}
function C() {
  let n = Ae(),
    t = tt(),
    e = dE(t);
  return (
    n.firstCreatePass && xE(n, e),
    vp(e) && _p(),
    pp(),
    e.classesWithoutHost != null &&
      QM(e) &&
      gm(n, e, G(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      XM(e) &&
      gm(n, e, G(), e.stylesWithoutHost, !1),
    C
  );
}
function Le(n, t, e, i) {
  return D(n, t, e, i), C(), Le;
}
function Tt(n, t, e, i) {
  let r = G(),
    o = r[F],
    s = n + Fe,
    a = o.firstCreatePass ? dA(s, o, 2, t, e, i) : o.data[s];
  return cE(a, r, n, t, JE), i != null && Td(r, a), Tt;
}
function Bt() {
  let n = tt(),
    t = dE(n);
  return vp(t) && _p(), pp(), Bt;
}
function sn(n, t, e, i) {
  return Tt(n, t, e, i), Bt(), sn;
}
var JE = (n, t, e, i, r) => (Kc(!0), Yw(t[Ee], i, Rb()));
function Gn() {
  return G();
}
function Wn(n, t, e) {
  let i = G(),
    r = Pr();
  if (Dn(i, r, t)) {
    let o = Ae(),
      s = ra();
    aE(s, i, n, t, i[Ee], e);
  }
  return Wn;
}
var Vr = void 0;
function rN(n) {
  let t = Math.floor(Math.abs(n)),
    e = n.toString().replace(/^[^.]*\.?/, "").length;
  return t === 1 && e === 0 ? 1 : 5;
}
var oN = [
    "en",
    [["a", "p"], ["AM", "PM"], Vr],
    [["AM", "PM"], Vr, Vr],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    Vr,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    Vr,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", Vr, "{1} 'at' {0}", Vr],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    rN,
  ],
  Lp = {};
function Zt(n) {
  let t = sN(n),
    e = sw(t);
  if (e) return e;
  let i = t.split("-")[0];
  if (((e = sw(i)), e)) return e;
  if (i === "en") return oN;
  throw new v(701, !1);
}
function sw(n) {
  return (
    n in Lp ||
      (Lp[n] =
        Ln.ng &&
        Ln.ng.common &&
        Ln.ng.common.locales &&
        Ln.ng.common.locales[n]),
    Lp[n]
  );
}
var He = (function (n) {
  return (
    (n[(n.LocaleId = 0)] = "LocaleId"),
    (n[(n.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (n[(n.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (n[(n.DaysFormat = 3)] = "DaysFormat"),
    (n[(n.DaysStandalone = 4)] = "DaysStandalone"),
    (n[(n.MonthsFormat = 5)] = "MonthsFormat"),
    (n[(n.MonthsStandalone = 6)] = "MonthsStandalone"),
    (n[(n.Eras = 7)] = "Eras"),
    (n[(n.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (n[(n.WeekendRange = 9)] = "WeekendRange"),
    (n[(n.DateFormat = 10)] = "DateFormat"),
    (n[(n.TimeFormat = 11)] = "TimeFormat"),
    (n[(n.DateTimeFormat = 12)] = "DateTimeFormat"),
    (n[(n.NumberSymbols = 13)] = "NumberSymbols"),
    (n[(n.NumberFormats = 14)] = "NumberFormats"),
    (n[(n.CurrencyCode = 15)] = "CurrencyCode"),
    (n[(n.CurrencySymbol = 16)] = "CurrencySymbol"),
    (n[(n.CurrencyName = 17)] = "CurrencyName"),
    (n[(n.Currencies = 18)] = "Currencies"),
    (n[(n.Directionality = 19)] = "Directionality"),
    (n[(n.PluralCase = 20)] = "PluralCase"),
    (n[(n.ExtraData = 21)] = "ExtraData"),
    n
  );
})(He || {});
function sN(n) {
  return n.toLowerCase().replace(/_/g, "-");
}
var ya = "en-US";
var aN = ya;
function eD(n) {
  typeof n == "string" && (aN = n.toLowerCase().replace(/_/g, "-"));
}
function me(n, t, e) {
  let i = G(),
    r = Ae(),
    o = tt();
  return tD(r, i, i[Ee], o, n, t, e), me;
}
function Bd(n, t, e) {
  let i = G(),
    r = Ae(),
    o = tt();
  return (o.type & 3 || e) && NE(o, r, i, e, i[Ee], n, t, od(o, i, t)), Bd;
}
function tD(n, t, e, i, r, o, s) {
  let a = !0,
    l = null;
  if (
    ((i.type & 3 || s) &&
      ((l ??= od(i, t, o)), NE(i, n, t, s, e, r, o, l) && (a = !1)),
    a)
  ) {
    let c = i.outputs?.[r],
      d = i.hostDirectiveOutputs?.[r];
    if (d && d.length)
      for (let u = 0; u < d.length; u += 2) {
        let p = d[u],
          h = d[u + 1];
        (l ??= od(i, t, o)), Qb(i, t, p, h, r, l);
      }
    if (c && c.length)
      for (let u of c) (l ??= od(i, t, o)), Qb(i, t, u, r, r, l);
  }
}
function de(n = 1) {
  return Tb(n);
}
function lN(n, t) {
  let e = null,
    i = zT(n);
  for (let r = 0; r < t.length; r++) {
    let o = t[r];
    if (o === "*") {
      e = r;
      continue;
    }
    if (i === null ? qw(n, o, !0) : WT(i, o)) return r;
  }
  return e;
}
function qe(n) {
  let t = G()[Ft][xt];
  if (!t.projection) {
    let e = n ? n.length : 1,
      i = (t.projection = eb(e, null)),
      r = i.slice(),
      o = t.child;
    for (; o !== null; ) {
      if (o.type !== 128) {
        let s = n ? lN(o, n) : 0;
        s !== null &&
          (r[s] ? (r[s].projectionNext = o) : (i[s] = o), (r[s] = o));
      }
      o = o.next;
    }
  }
}
function oe(n, t = 0, e, i, r, o) {
  let s = G(),
    a = Ae(),
    l = i ? n + 1 : null;
  l !== null && kd(s, a, l, i, r, o, null, e);
  let c = qo(a, Fe + n, 16, null, e || null);
  c.projection === null && (c.projection = t), wp();
  let u = !s[Ao] || gp();
  s[Ft][xt].projection[c.projection] === null && l !== null
    ? cN(s, a, l)
    : u && !Cd(c) && hR(a, s, c);
}
function cN(n, t, e) {
  let i = Fe + e,
    r = t.data[i],
    o = n[i],
    s = om(o, r.tView.ssrId),
    a = Gm(n, r, void 0, { dehydratedView: s });
  Ym(o, a, 0, fd(r, s));
}
function Ue(n, t, e, i) {
  jE(n, t, e, i);
}
function Et(n, t, e) {
  VE(n, t, e);
}
function ue(n) {
  let t = G(),
    e = Ae(),
    i = Gc();
  ia(i + 1);
  let r = Xm(e, i);
  if (n.dirty && ub(t) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null) n.reset([]);
    else {
      let o = HE(t, i);
      n.reset(o, xw), n.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function fe() {
  return Qm(G(), Gc());
}
function cg(n, t, e, i, r) {
  zE(t, jE(n, e, i, r));
}
function Yo(n, t, e, i) {
  zE(n, VE(t, e, i));
}
function Hd(n = 1) {
  ia(Gc() + n);
}
function Ko(n) {
  let t = yb();
  return Bc(t, Fe + n);
}
function ed(n, t) {
  return (n << 17) | (t << 2);
}
function Ur(n) {
  return (n >> 17) & 32767;
}
function dN(n) {
  return (n & 2) == 2;
}
function uN(n, t) {
  return (n & 131071) | (t << 17);
}
function vm(n) {
  return n | 2;
}
function Uo(n) {
  return (n & 131068) >> 2;
}
function Vp(n, t) {
  return (n & -131069) | (t << 2);
}
function fN(n) {
  return (n & 1) === 1;
}
function _m(n) {
  return n | 1;
}
function hN(n, t, e, i, r, o) {
  let s = o ? t.classBindings : t.styleBindings,
    a = Ur(s),
    l = Uo(s);
  n[i] = e;
  let c = !1,
    d;
  if (Array.isArray(e)) {
    let u = e;
    (d = u[1]), (d === null || To(u, d) > 0) && (c = !0);
  } else d = e;
  if (r)
    if (l !== 0) {
      let p = Ur(n[a + 1]);
      (n[i + 1] = ed(p, a)),
        p !== 0 && (n[p + 1] = Vp(n[p + 1], i)),
        (n[a + 1] = uN(n[a + 1], i));
    } else
      (n[i + 1] = ed(a, 0)), a !== 0 && (n[a + 1] = Vp(n[a + 1], i)), (a = i);
  else
    (n[i + 1] = ed(l, 0)),
      a === 0 ? (a = i) : (n[l + 1] = Vp(n[l + 1], i)),
      (l = i);
  c && (n[i + 1] = vm(n[i + 1])),
    aw(n, d, i, !0),
    aw(n, d, i, !1),
    pN(t, d, n, i, o),
    (s = ed(a, l)),
    o ? (t.classBindings = s) : (t.styleBindings = s);
}
function pN(n, t, e, i, r) {
  let o = r ? n.residualClasses : n.residualStyles;
  o != null &&
    typeof t == "string" &&
    To(o, t) >= 0 &&
    (e[i + 1] = _m(e[i + 1]));
}
function aw(n, t, e, i) {
  let r = n[e + 1],
    o = t === null,
    s = i ? Ur(r) : Uo(r),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = n[s],
      c = n[s + 1];
    mN(l, t) && ((a = !0), (n[s + 1] = i ? _m(c) : vm(c))),
      (s = i ? Ur(c) : Uo(c));
  }
  a && (n[e + 1] = i ? vm(r) : _m(r));
}
function mN(n, t) {
  return n === null || t == null || (Array.isArray(n) ? n[1] : n) === t
    ? !0
    : Array.isArray(n) && typeof t == "string"
    ? To(n, t) >= 0
    : !1;
}
var wn = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function gN(n) {
  return n.substring(wn.key, wn.keyEnd);
}
function vN(n) {
  return _N(n), nD(n, iD(n, 0, wn.textEnd));
}
function nD(n, t) {
  let e = wn.textEnd;
  return e === t ? -1 : ((t = wn.keyEnd = yN(n, (wn.key = t), e)), iD(n, t, e));
}
function _N(n) {
  (wn.key = 0),
    (wn.keyEnd = 0),
    (wn.value = 0),
    (wn.valueEnd = 0),
    (wn.textEnd = n.length);
}
function iD(n, t, e) {
  for (; t < e && n.charCodeAt(t) <= 32; ) t++;
  return t;
}
function yN(n, t, e) {
  for (; t < e && n.charCodeAt(t) > 32; ) t++;
  return t;
}
function pi(n, t, e) {
  return rD(n, t, e, !1), pi;
}
function re(n, t) {
  return rD(n, t, null, !0), re;
}
function In(n) {
  wN(xN, bN, n, !0);
}
function bN(n, t) {
  for (let e = vN(t); e >= 0; e = nD(t, e)) Lc(n, gN(t), !0);
}
function rD(n, t, e, i) {
  let r = G(),
    o = Ae(),
    s = zc(2);
  if ((o.firstUpdatePass && sD(o, n, s, i), t !== Vt && Dn(r, s, t))) {
    let a = o.data[li()];
    aD(o, a, r, r[Ee], n, (r[s + 1] = TN(t, e)), i, s);
  }
}
function wN(n, t, e, i) {
  let r = Ae(),
    o = zc(2);
  r.firstUpdatePass && sD(r, null, o, i);
  let s = G();
  if (e !== Vt && Dn(s, o, e)) {
    let a = r.data[li()];
    if (lD(a, i) && !oD(r, o)) {
      let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
      l !== null && (e = Oc(l, e || "")), gm(r, a, s, e, i);
    } else MN(r, a, s, s[Ee], s[o + 1], (s[o + 1] = SN(n, t, e)), i, o);
  }
}
function oD(n, t) {
  return t >= n.expandoStartIndex;
}
function sD(n, t, e, i) {
  let r = n.data;
  if (r[e + 1] === null) {
    let o = r[li()],
      s = oD(n, e);
    lD(o, i) && t === null && !s && (t = !1),
      (t = EN(r, o, t, i)),
      hN(r, o, t, e, s, i);
  }
}
function EN(n, t, e, i) {
  let r = Ib(n),
    o = i ? t.residualClasses : t.residualStyles;
  if (r === null)
    (i ? t.classBindings : t.styleBindings) === 0 &&
      ((e = jp(null, n, t, e, i)), (e = pa(e, t.attrs, i)), (o = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || n[s] !== r)
      if (((e = jp(r, n, t, e, i)), o === null)) {
        let l = DN(n, t, i);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = jp(null, n, t, l[1], i)),
          (l = pa(l, t.attrs, i)),
          CN(n, t, i, l));
      } else o = IN(n, t, i);
  }
  return (
    o !== void 0 && (i ? (t.residualClasses = o) : (t.residualStyles = o)), e
  );
}
function DN(n, t, e) {
  let i = e ? t.classBindings : t.styleBindings;
  if (Uo(i) !== 0) return n[Ur(i)];
}
function CN(n, t, e, i) {
  let r = e ? t.classBindings : t.styleBindings;
  n[Ur(r)] = i;
}
function IN(n, t, e) {
  let i,
    r = t.directiveEnd;
  for (let o = 1 + t.directiveStylingLast; o < r; o++) {
    let s = n[o].hostAttrs;
    i = pa(i, s, e);
  }
  return pa(i, t.attrs, e);
}
function jp(n, t, e, i, r) {
  let o = null,
    s = e.directiveEnd,
    a = e.directiveStylingLast;
  for (
    a === -1 ? (a = e.directiveStart) : a++;
    a < s && ((o = t[a]), (i = pa(i, o.hostAttrs, r)), o !== n);

  )
    a++;
  return n !== null && (e.directiveStylingLast = a), i;
}
function pa(n, t, e) {
  let i = e ? 1 : 2,
    r = -1;
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let s = t[o];
      typeof s == "number"
        ? (r = s)
        : r === i &&
          (Array.isArray(n) || (n = n === void 0 ? [] : ["", n]),
          Lc(n, s, e ? !0 : t[++o]));
    }
  return n === void 0 ? null : n;
}
function SN(n, t, e) {
  if (e == null || e === "") return _t;
  let i = [],
    r = fi(e);
  if (Array.isArray(r)) for (let o = 0; o < r.length; o++) n(i, r[o], !0);
  else if (typeof r == "object")
    for (let o in r) r.hasOwnProperty(o) && n(i, o, r[o]);
  else typeof r == "string" && t(i, r);
  return i;
}
function xN(n, t, e) {
  let i = String(t);
  i !== "" && !i.includes(" ") && Lc(n, i, e);
}
function MN(n, t, e, i, r, o, s, a) {
  r === Vt && (r = _t);
  let l = 0,
    c = 0,
    d = 0 < r.length ? r[0] : null,
    u = 0 < o.length ? o[0] : null;
  for (; d !== null || u !== null; ) {
    let p = l < r.length ? r[l + 1] : void 0,
      h = c < o.length ? o[c + 1] : void 0,
      m = null,
      g;
    d === u
      ? ((l += 2), (c += 2), p !== h && ((m = u), (g = h)))
      : u === null || (d !== null && d < u)
      ? ((l += 2), (m = d))
      : ((c += 2), (m = u), (g = h)),
      m !== null && aD(n, t, e, i, m, g, s, a),
      (d = l < r.length ? r[l] : null),
      (u = c < o.length ? o[c] : null);
  }
}
function aD(n, t, e, i, r, o, s, a) {
  if (!(t.type & 3)) return;
  let l = n.data,
    c = l[a + 1],
    d = fN(c) ? lw(l, t, e, r, Uo(c), s) : void 0;
  if (!wd(d)) {
    wd(o) || (dN(c) && (o = lw(l, null, e, r, a, s)));
    let u = ap(li(), e);
    mR(i, s, u, r, o);
  }
}
function lw(n, t, e, i, r, o) {
  let s = t === null,
    a;
  for (; r > 0; ) {
    let l = n[r],
      c = Array.isArray(l),
      d = c ? l[1] : l,
      u = d === null,
      p = e[r + 1];
    p === Vt && (p = u ? _t : void 0);
    let h = u ? Vc(p, i) : d === i ? p : void 0;
    if ((c && !wd(h) && (h = Vc(l, i)), wd(h) && ((a = h), s))) return a;
    let m = n[r + 1];
    r = s ? Ur(m) : Uo(m);
  }
  if (t !== null) {
    let l = o ? t.residualClasses : t.residualStyles;
    l != null && (a = Vc(l, i));
  }
  return a;
}
function wd(n) {
  return n !== void 0;
}
function TN(n, t) {
  return (
    n == null ||
      n === "" ||
      (typeof t == "string"
        ? (n = n + t)
        : typeof n == "object" && (n = Pt(fi(n)))),
    n
  );
}
function lD(n, t) {
  return (n.flags & (t ? 8 : 16)) !== 0;
}
function U(n, t = "") {
  let e = G(),
    i = Ae(),
    r = n + Fe,
    o = i.firstCreatePass ? qo(i, r, 1, t, null) : i.data[r],
    s = RN(i, e, o, t, n);
  (e[r] = s), Yc() && Bm(i, e, s, o), Po(o, !1);
}
var RN = (n, t, e, i, r) => (Kc(!0), ZT(t[Ee], i));
function AN(n, t, e, i = "") {
  return Dn(n, Pr(), e) ? t + Mo(e) + i : Vt;
}
function NN(n, t, e, i, r, o = "") {
  let s = bb(),
    a = AE(n, s, e, r);
  return zc(2), a ? t + Mo(e) + i + Mo(r) + o : Vt;
}
function Oe(n) {
  return $r("", n), Oe;
}
function $r(n, t, e) {
  let i = G(),
    r = AN(i, n, t, e);
  return r !== Vt && cD(i, li(), r), $r;
}
function Ud(n, t, e, i, r) {
  let o = G(),
    s = NN(o, n, t, e, i, r);
  return s !== Vt && cD(o, li(), s), Ud;
}
function cD(n, t, e) {
  let i = ap(t, n);
  QT(n[Ee], i, e);
}
function zd(n, t, e) {
  Rp(t) && (t = t());
  let i = G(),
    r = Pr();
  if (Dn(i, r, t)) {
    let o = Ae(),
      s = ra();
    sE(s, i, n, t, i[Ee], e);
  }
  return zd;
}
function dg(n, t) {
  let e = Rp(n);
  return e && n.set(t), e;
}
function $d(n, t) {
  let e = G(),
    i = Ae(),
    r = tt();
  return tD(i, e, e[Ee], r, n, t), $d;
}
function ON(n, t, e) {
  let i = Ae();
  if (i.firstCreatePass) {
    let r = Hn(n);
    ym(e, i.data, i.blueprint, r, !0), ym(t, i.data, i.blueprint, r, !1);
  }
}
function ym(n, t, e, i, r) {
  if (((n = ut(n)), Array.isArray(n)))
    for (let o = 0; o < n.length; o++) ym(n[o], t, e, i, r);
  else {
    let o = Ae(),
      s = G(),
      a = tt(),
      l = Ir(n) ? n : ut(n.provide),
      c = np(n),
      d = a.providerIndexes & 1048575,
      u = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (Ir(n) || !n.multi) {
      let h = new Br(c, r, ie),
        m = Hp(l, t, r ? d : d + p, u);
      m === -1
        ? (zp(dd(a, s), o, l),
          Bp(o, n, t.length),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(h),
          s.push(h))
        : ((e[m] = h), (s[m] = h));
    } else {
      let h = Hp(l, t, d + p, u),
        m = Hp(l, t, d, d + p),
        g = h >= 0 && e[h],
        w = m >= 0 && e[m];
      if ((r && !w) || (!r && !g)) {
        zp(dd(a, s), o, l);
        let S = FN(r ? PN : kN, e.length, r, i, c);
        !r && w && (e[m].providerFactory = S),
          Bp(o, n, t.length, 0),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(S),
          s.push(S);
      } else {
        let S = dD(e[r ? m : h], c, !r && i);
        Bp(o, n, h > -1 ? h : m, S);
      }
      !r && i && w && e[m].componentProviders++;
    }
  }
}
function Bp(n, t, e, i) {
  let r = Ir(t),
    o = ab(t);
  if (r || o) {
    let l = (o ? ut(t.useClass) : t).prototype.ngOnDestroy;
    if (l) {
      let c = n.destroyHooks || (n.destroyHooks = []);
      if (!r && t.multi) {
        let d = c.indexOf(e);
        d === -1 ? c.push(e, [i, l]) : c[d + 1].push(i, l);
      } else c.push(e, l);
    }
  }
}
function dD(n, t, e) {
  return e && n.componentProviders++, n.multi.push(t) - 1;
}
function Hp(n, t, e, i) {
  for (let r = e; r < i; r++) if (t[r] === n) return r;
  return -1;
}
function kN(n, t, e, i, r) {
  return bm(this.multi, []);
}
function PN(n, t, e, i, r) {
  let o = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      l = ca(i, i[F], this.providerFactory.index, r);
    (s = l.slice(0, a)), bm(o, s);
    for (let c = a; c < l.length; c++) s.push(l[c]);
  } else (s = []), bm(o, s);
  return s;
}
function bm(n, t) {
  for (let e = 0; e < n.length; e++) {
    let i = n[e];
    t.push(i());
  }
  return t;
}
function FN(n, t, e, i, r) {
  let o = new Br(n, e, ie);
  return (
    (o.multi = []),
    (o.index = t),
    (o.componentProviders = 0),
    dD(o, r, i && !e),
    o
  );
}
function ze(n, t = []) {
  return (e) => {
    e.providersResolver = (i, r) => ON(i, r ? r(n) : n, t);
  };
}
function uD(n, t) {
  let e = n[t];
  return e === Vt ? void 0 : e;
}
function LN(n, t, e, i, r, o) {
  let s = t + e;
  return Dn(n, s, r) ? RE(n, s + 1, o ? i.call(o, r) : i(r)) : uD(n, s + 1);
}
function VN(n, t, e, i, r, o, s) {
  let a = t + e;
  return AE(n, a, r, o)
    ? RE(n, a + 2, s ? i.call(s, r, o) : i(r, o))
    : uD(n, a + 2);
}
function ba(n, t) {
  let e = Ae(),
    i,
    r = n + Fe;
  e.firstCreatePass
    ? ((i = jN(t, e.pipeRegistry)),
      (e.data[r] = i),
      i.onDestroy && (e.destroyHooks ??= []).push(r, i.onDestroy))
    : (i = e.data[r]);
  let o = i.factory || (i.factory = Pi(i.type, !0)),
    s,
    a = St(ie);
  try {
    let l = cd(!1),
      c = o();
    return cd(l), lp(e, G(), r, c), c;
  } finally {
    St(a);
  }
}
function jN(n, t) {
  if (t)
    for (let e = t.length - 1; e >= 0; e--) {
      let i = t[e];
      if (n === i.name) return i;
    }
}
function ug(n, t, e) {
  let i = n + Fe,
    r = G(),
    o = Bc(r, i);
  return fD(r, i) ? LN(r, Cp(), t, o.transform, e, o) : o.transform(e);
}
function fg(n, t, e, i) {
  let r = n + Fe,
    o = G(),
    s = Bc(o, r);
  return fD(o, r) ? VN(o, Cp(), t, s.transform, e, i, s) : s.transform(e, i);
}
function fD(n, t) {
  return n[F].data[t].pure;
}
function hg(n, t) {
  return Rd(n, t);
}
var Ed = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, e) {
      (this.ngModuleFactory = t), (this.componentFactories = e);
    }
  },
  pg = (() => {
    class n {
      compileModuleSync(e) {
        return new yd(e);
      }
      compileModuleAsync(e) {
        return Promise.resolve(this.compileModuleSync(e));
      }
      compileModuleAndAllComponentsSync(e) {
        let i = this.compileModuleSync(e),
          r = Xh(e),
          o = Gw(r.declarations).reduce((s, a) => {
            let l = ri(a);
            return l && s.push(new Hr(l)), s;
          }, []);
        return new Ed(i, o);
      }
      compileModuleAndAllComponentsAsync(e) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(e));
      }
      clearCache() {}
      clearCacheFor(e) {}
      getModuleId(e) {}
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var BN = (() => {
  class n {
    zone = f(M);
    changeDetectionScheduler = f(tn);
    applicationRef = f(jt);
    applicationErrorHandler = f(Yt);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  try {
                    (this.applicationRef.dirtyFlags |= 1),
                      this.applicationRef._tick();
                  } catch (e) {
                    this.applicationErrorHandler(e);
                  }
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
function hD({
  ngZoneFactory: n,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: e,
}) {
  return (
    (n ??= () => new M(B(_({}, pD()), { scheduleInRootZone: e }))),
    [
      { provide: M, useFactory: n },
      {
        provide: Vn,
        multi: !0,
        useFactory: () => {
          let i = f(BN, { optional: !0 });
          return () => i.initialize();
        },
      },
      {
        provide: Vn,
        multi: !0,
        useFactory: () => {
          let i = f(HN);
          return () => {
            i.initialize();
          };
        },
      },
      t === !0 ? { provide: Ap, useValue: !0 } : [],
      { provide: Zc, useValue: e ?? qE },
      {
        provide: Yt,
        useFactory: () => {
          let i = f(M),
            r = f(Re),
            o;
          return (s) => {
            i.runOutsideAngular(() => {
              r.destroyed && !o
                ? setTimeout(() => {
                    throw s;
                  })
                : ((o ??= r.get(ft)), o.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function pD(n) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: n?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: n?.runCoalescing ?? !1,
  };
}
var HN = (() => {
  class n {
    subscription = new W();
    initialized = !1;
    zone = f(M);
    pendingTasks = f($i);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let e = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (e = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              M.assertNotInAngularZone(),
                queueMicrotask(() => {
                  e !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(e), (e = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            M.assertInAngularZone(), (e ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var mg = (() => {
  class n {
    applicationErrorHandler = f(Yt);
    appRef = f(jt);
    taskService = f($i);
    ngZone = f(M);
    zonelessEnabled = f(Lo);
    tracing = f(Yi, { optional: !0 });
    disableScheduling = f(Ap, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new W();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(bd) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (f(Zc, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof fa || !this.zoneIsDefined));
    }
    notify(e) {
      if (!this.zonelessEnabled && e === 5) return;
      let i = !1;
      switch (e) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (i = !0);
          break;
        }
        case 12: {
          (this.appRef.dirtyFlags |= 16), (i = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 2), (i = !0);
          break;
        }
        case 11: {
          i = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(i))
      )
        return;
      let r = this.useMicrotaskScheduler ? nw : YE;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              r(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick())
            ));
    }
    shouldScheduleTick(e) {
      return !(
        (this.disableScheduling && !e) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(bd + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let e = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (i) {
        this.taskService.remove(e), this.applicationErrorHandler(i);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        nw(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(e);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let e = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(e);
      }
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
function gg() {
  return (
    $n("NgZoneless"),
    oi([
      { provide: tn, useExisting: mg },
      { provide: M, useClass: fa },
      { provide: Lo, useValue: !0 },
      { provide: Zc, useValue: !1 },
      [],
    ])
  );
}
function UN() {
  return (typeof $localize < "u" && $localize.locale) || ya;
}
var wa = new y("", {
  providedIn: "root",
  factory: () => f(wa, { optional: !0, skipSelf: !0 }) || UN(),
});
function an(n) {
  return $y(n);
}
function Sn(n, t) {
  return Ps(n, t?.equal);
}
var vg = class {
  [Ze];
  constructor(t) {
    this[Ze] = t;
  }
  destroy() {
    this[Ze].destroy();
  }
};
function Ea(n, t) {
  let e = t?.injector ?? f(te),
    i = t?.manualCleanup !== !0 ? e.get(qt) : null,
    r,
    o = e.get(Fr, null, { optional: !0 }),
    s = e.get(tn);
  return (
    o !== null
      ? ((r = GN(o.view, s, n)),
        i instanceof qs && i._lView === o.view && (i = null))
      : (r = WN(n, e.get(sa), s)),
    (r.injector = e),
    i !== null && (r.onDestroyFn = i.onDestroy(() => r.destroy())),
    new vg(r)
  );
}
var mD = B(_({}, Mi), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    dirty: !0,
    hasRun: !1,
    cleanupFns: void 0,
    zone: null,
    kind: "effect",
    onDestroyFn: Lr,
    run() {
      if (((this.dirty = !1), this.hasRun && !gr(this))) return;
      this.hasRun = !0;
      let n = (i) => (this.cleanupFns ??= []).push(i),
        t = Jn(this),
        e = Fo(!1);
      try {
        this.maybeCleanup(), this.fn(n);
      } finally {
        Fo(e), Ti(this, t);
      }
    },
    maybeCleanup() {
      if (!this.cleanupFns?.length) return;
      let n = z(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        (this.cleanupFns = []), z(n);
      }
    },
  }),
  zN = B(_({}, mD), {
    consumerMarkedDirty() {
      this.scheduler.schedule(this), this.notifier.notify(12);
    },
    destroy() {
      ho(this),
        this.onDestroyFn(),
        this.maybeCleanup(),
        this.scheduler.remove(this);
    },
  }),
  $N = B(_({}, mD), {
    consumerMarkedDirty() {
      (this.view[V] |= 8192), Hi(this.view), this.notifier.notify(13);
    },
    destroy() {
      ho(this),
        this.onDestroyFn(),
        this.maybeCleanup(),
        this.view[ai]?.delete(this);
    },
  });
function GN(n, t, e) {
  let i = Object.create($N);
  return (
    (i.view = n),
    (i.zone = typeof Zone < "u" ? Zone.current : null),
    (i.notifier = t),
    (i.fn = e),
    (n[ai] ??= new Set()),
    n[ai].add(i),
    i.consumerMarkedDirty(i),
    i
  );
}
function WN(n, t, e) {
  let i = Object.create(zN);
  return (
    (i.fn = n),
    (i.scheduler = t),
    (i.notifier = e),
    (i.zone = typeof Zone < "u" ? Zone.current : null),
    i.scheduler.add(i),
    i.notifier.notify(12),
    i
  );
}
var wD = Symbol("InputSignalNode#UNSET"),
  oO = B(_({}, Fs), {
    transformFn: void 0,
    applyValueToInputSignal(n, t) {
      po(n, t);
    },
  });
function ED(n, t) {
  let e = Object.create(oO);
  (e.value = n), (e.transformFn = t?.transform);
  function i() {
    if ((mr(e), e.value === wD)) {
      let r = null;
      throw new v(-950, r);
    }
    return e.value;
  }
  return (i[Ze] = e), i;
}
var Ca = class {
    attributeName;
    constructor(t) {
      this.attributeName = t;
    }
    __NG_ELEMENT_ID__ = () => Cm(this.attributeName);
    toString() {
      return `HostAttributeToken ${this.attributeName}`;
    }
  },
  Ig = new y("");
Ig.__NG_ELEMENT_ID__ = (n) => {
  let t = tt();
  if (t === null) throw new v(204, !1);
  if (t.type & 2) return t.value;
  if (n & 8) return null;
  throw new v(204, !1);
};
function gD(n, t) {
  return ED(n, t);
}
function sO(n) {
  return ED(wD, n);
}
var DD = ((gD.required = sO), gD);
function vD(n, t) {
  return Jm(t);
}
function aO(n, t) {
  return eg(t);
}
var Sa = ((vD.required = aO), vD);
function _D(n, t) {
  return Jm(t);
}
function lO(n, t) {
  return eg(t);
}
var CD = ((_D.required = lO), _D);
var yg = new y(""),
  cO = new y("");
function Da(n) {
  return !n.moduleRef;
}
function dO(n) {
  let t = Da(n) ? n.r3Injector : n.moduleRef.injector,
    e = t.get(M);
  return e.run(() => {
    Da(n)
      ? n.r3Injector.resolveInjectorInitializers()
      : n.moduleRef.resolveInjectorInitializers();
    let i = t.get(Yt),
      r;
    if (
      (e.runOutsideAngular(() => {
        r = e.onError.subscribe({ next: i });
      }),
      Da(n))
    ) {
      let o = () => t.destroy(),
        s = n.platformInjector.get(yg);
      s.add(o),
        t.onDestroy(() => {
          r.unsubscribe(), s.delete(o);
        });
    } else {
      let o = () => n.moduleRef.destroy(),
        s = n.platformInjector.get(yg);
      s.add(o),
        n.moduleRef.onDestroy(() => {
          la(n.allPlatformModules, n.moduleRef), r.unsubscribe(), s.delete(o);
        });
    }
    return fO(i, e, () => {
      let o = t.get(ag);
      return (
        o.runInitializers(),
        o.donePromise.then(() => {
          let s = t.get(wa, ya);
          if ((eD(s || ya), !t.get(cO, !0)))
            return Da(n)
              ? t.get(jt)
              : (n.allPlatformModules.push(n.moduleRef), n.moduleRef);
          if (Da(n)) {
            let l = t.get(jt);
            return (
              n.rootComponent !== void 0 && l.bootstrap(n.rootComponent), l
            );
          } else return uO?.(n.moduleRef, n.allPlatformModules), n.moduleRef;
        })
      );
    });
  });
}
var uO;
function fO(n, t, e) {
  try {
    let i = e();
    return Ki(i)
      ? i.catch((r) => {
          throw (t.runOutsideAngular(() => n(r)), r);
        })
      : i;
  } catch (i) {
    throw (t.runOutsideAngular(() => n(i)), i);
  }
}
var Gd = null;
function hO(n = [], t) {
  return te.create({
    name: t,
    providers: [
      { provide: Zs, useValue: "platform" },
      { provide: yg, useValue: new Set([() => (Gd = null)]) },
      ...n,
    ],
  });
}
function pO(n = []) {
  if (Gd) return Gd;
  let t = hO(n);
  return (Gd = t), QE(), mO(t), t;
}
function mO(n) {
  let t = n.get(Dd, null);
  yt(n, () => {
    t?.forEach((e) => e());
  });
}
var lt = (() => {
  class n {
    static __NG_ELEMENT_ID__ = gO;
  }
  return n;
})();
function gO(n) {
  return vO(tt(), G(), (n & 16) === 16);
}
function vO(n, t, e) {
  if (Bi(n) && !e) {
    let i = on(n.index, t);
    return new Gi(i, i);
  } else if (n.type & 175) {
    let i = t[Ft];
    return new Gi(i, t);
  }
  return null;
}
var bg = class {
    constructor() {}
    supports(t) {
      return Zm(t);
    }
    create(t) {
      return new wg(t);
    }
  },
  _O = (n, t) => t,
  wg = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) {
      this._trackByFn = t || _O;
    }
    forEachItem(t) {
      let e;
      for (e = this._itHead; e !== null; e = e._next) t(e);
    }
    forEachOperation(t) {
      let e = this._itHead,
        i = this._removalsHead,
        r = 0,
        o = null;
      for (; e || i; ) {
        let s = !i || (e && e.currentIndex < yD(i, r, o)) ? e : i,
          a = yD(s, r, o),
          l = s.currentIndex;
        if (s === i) r--, (i = i._nextRemoved);
        else if (((e = e._next), s.previousIndex == null)) r++;
        else {
          o || (o = []);
          let c = a - r,
            d = l - r;
          if (c != d) {
            for (let p = 0; p < c; p++) {
              let h = p < o.length ? o[p] : (o[p] = 0),
                m = h + p;
              d <= m && m < c && (o[p] = h + 1);
            }
            let u = s.previousIndex;
            o[u] = d - c;
          }
        }
        a !== l && t(s, a, l);
      }
    }
    forEachPreviousItem(t) {
      let e;
      for (e = this._previousItHead; e !== null; e = e._nextPrevious) t(e);
    }
    forEachAddedItem(t) {
      let e;
      for (e = this._additionsHead; e !== null; e = e._nextAdded) t(e);
    }
    forEachMovedItem(t) {
      let e;
      for (e = this._movesHead; e !== null; e = e._nextMoved) t(e);
    }
    forEachRemovedItem(t) {
      let e;
      for (e = this._removalsHead; e !== null; e = e._nextRemoved) t(e);
    }
    forEachIdentityChange(t) {
      let e;
      for (e = this._identityChangesHead; e !== null; e = e._nextIdentityChange)
        t(e);
    }
    diff(t) {
      if ((t == null && (t = []), !Zm(t))) throw new v(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let e = this._itHead,
        i = !1,
        r,
        o,
        s;
      if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
          (o = t[a]),
            (s = this._trackByFn(a, o)),
            e === null || !Object.is(e.trackById, s)
              ? ((e = this._mismatch(e, o, s, a)), (i = !0))
              : (i && (e = this._verifyReinsertion(e, o, s, a)),
                Object.is(e.item, o) || this._addIdentityChange(e, o)),
            (e = e._next);
      } else
        (r = 0),
          ME(t, (a) => {
            (s = this._trackByFn(r, a)),
              e === null || !Object.is(e.trackById, s)
                ? ((e = this._mismatch(e, a, s, r)), (i = !0))
                : (i && (e = this._verifyReinsertion(e, a, s, r)),
                  Object.is(e.item, a) || this._addIdentityChange(e, a)),
              (e = e._next),
              r++;
          }),
          (this.length = r);
      return this._truncate(e), (this.collection = t), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
          t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
          t.previousIndex = t.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, t = this._movesHead;
          t !== null;
          t = t._nextMoved
        )
          t.previousIndex = t.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(t, e, i, r) {
      let o;
      return (
        t === null ? (o = this._itTail) : ((o = t._prev), this._remove(t)),
        (t =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(i, null)),
        t !== null
          ? (Object.is(t.item, e) || this._addIdentityChange(t, e),
            this._reinsertAfter(t, o, r))
          : ((t =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(i, r)),
            t !== null
              ? (Object.is(t.item, e) || this._addIdentityChange(t, e),
                this._moveAfter(t, o, r))
              : (t = this._addAfter(new Eg(e, i), o, r))),
        t
      );
    }
    _verifyReinsertion(t, e, i, r) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(i, null);
      return (
        o !== null
          ? (t = this._reinsertAfter(o, t._prev, r))
          : t.currentIndex != r &&
            ((t.currentIndex = r), this._addToMoves(t, r)),
        t
      );
    }
    _truncate(t) {
      for (; t !== null; ) {
        let e = t._next;
        this._addToRemovals(this._unlink(t)), (t = e);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(t, e, i) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
      let r = t._prevRemoved,
        o = t._nextRemoved;
      return (
        r === null ? (this._removalsHead = o) : (r._nextRemoved = o),
        o === null ? (this._removalsTail = r) : (o._prevRemoved = r),
        this._insertAfter(t, e, i),
        this._addToMoves(t, i),
        t
      );
    }
    _moveAfter(t, e, i) {
      return (
        this._unlink(t), this._insertAfter(t, e, i), this._addToMoves(t, i), t
      );
    }
    _addAfter(t, e, i) {
      return (
        this._insertAfter(t, e, i),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = t)
          : (this._additionsTail = this._additionsTail._nextAdded = t),
        t
      );
    }
    _insertAfter(t, e, i) {
      let r = e === null ? this._itHead : e._next;
      return (
        (t._next = r),
        (t._prev = e),
        r === null ? (this._itTail = t) : (r._prev = t),
        e === null ? (this._itHead = t) : (e._next = t),
        this._linkedRecords === null && (this._linkedRecords = new Wd()),
        this._linkedRecords.put(t),
        (t.currentIndex = i),
        t
      );
    }
    _remove(t) {
      return this._addToRemovals(this._unlink(t));
    }
    _unlink(t) {
      this._linkedRecords !== null && this._linkedRecords.remove(t);
      let e = t._prev,
        i = t._next;
      return (
        e === null ? (this._itHead = i) : (e._next = i),
        i === null ? (this._itTail = e) : (i._prev = e),
        t
      );
    }
    _addToMoves(t, e) {
      return (
        t.previousIndex === e ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = t)
            : (this._movesTail = this._movesTail._nextMoved = t)),
        t
      );
    }
    _addToRemovals(t) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Wd()),
        this._unlinkedRecords.put(t),
        (t.currentIndex = null),
        (t._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = t),
            (t._prevRemoved = null))
          : ((t._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = t)),
        t
      );
    }
    _addIdentityChange(t, e) {
      return (
        (t.item = e),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = t)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                t),
        t
      );
    }
  },
  Eg = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, e) {
      (this.item = t), (this.trackById = e);
    }
  },
  Dg = class {
    _head = null;
    _tail = null;
    add(t) {
      this._head === null
        ? ((this._head = this._tail = t),
          (t._nextDup = null),
          (t._prevDup = null))
        : ((this._tail._nextDup = t),
          (t._prevDup = this._tail),
          (t._nextDup = null),
          (this._tail = t));
    }
    get(t, e) {
      let i;
      for (i = this._head; i !== null; i = i._nextDup)
        if ((e === null || e <= i.currentIndex) && Object.is(i.trackById, t))
          return i;
      return null;
    }
    remove(t) {
      let e = t._prevDup,
        i = t._nextDup;
      return (
        e === null ? (this._head = i) : (e._nextDup = i),
        i === null ? (this._tail = e) : (i._prevDup = e),
        this._head === null
      );
    }
  },
  Wd = class {
    map = new Map();
    put(t) {
      let e = t.trackById,
        i = this.map.get(e);
      i || ((i = new Dg()), this.map.set(e, i)), i.add(t);
    }
    get(t, e) {
      let i = t,
        r = this.map.get(i);
      return r ? r.get(t, e) : null;
    }
    remove(t) {
      let e = t.trackById;
      return this.map.get(e).remove(t) && this.map.delete(e), t;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function yD(n, t, e) {
  let i = n.previousIndex;
  if (i === null) return i;
  let r = 0;
  return e && i < e.length && (r = e[i]), i + t + r;
}
function bD() {
  return new qd([new bg()]);
}
var qd = (() => {
  class n {
    factories;
    static ɵprov = b({ token: n, providedIn: "root", factory: bD });
    constructor(e) {
      this.factories = e;
    }
    static create(e, i) {
      if (i != null) {
        let r = i.factories.slice();
        e = e.concat(r);
      }
      return new n(e);
    }
    static extend(e) {
      return {
        provide: n,
        useFactory: (i) => n.create(e, i || bD()),
        deps: [[n, new Em(), new ma()]],
      };
    }
    find(e) {
      let i = this.factories.find((r) => r.supports(e));
      if (i != null) return i;
      throw new v(901, !1);
    }
  }
  return n;
})();
function ID(n) {
  ge(8);
  try {
    let { rootComponent: t, appProviders: e, platformProviders: i } = n,
      r = pO(i),
      o = [hD({}), { provide: tn, useExisting: mg }, Nb, ...(e || [])],
      s = new ua({
        providers: o,
        parent: r,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return dO({
      r3Injector: s.injector,
      platformInjector: r,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  } finally {
    ge(9);
  }
}
function se(n) {
  return typeof n == "boolean" ? n : n != null && n !== "false";
}
function Gr(n, t = NaN) {
  return !isNaN(parseFloat(n)) && !isNaN(Number(n)) ? Number(n) : t;
}
var _g = Symbol("NOT_SET"),
  SD = new Set(),
  yO = B(_({}, Fs), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    value: _g,
    cleanup: null,
    consumerMarkedDirty() {
      if (this.sequence.impl.executing) {
        if (
          this.sequence.lastPhase === null ||
          this.sequence.lastPhase < this.phase
        )
          return;
        this.sequence.erroredOrDestroyed = !0;
      }
      this.sequence.scheduler.notify(7);
    },
    phaseFn(n) {
      if (((this.sequence.lastPhase = this.phase), !this.dirty))
        return this.signal;
      if (((this.dirty = !1), this.value !== _g && !gr(this)))
        return this.signal;
      try {
        for (let r of this.cleanup ?? SD) r();
      } finally {
        this.cleanup?.clear();
      }
      let t = [];
      n !== void 0 && t.push(n), t.push(this.registerCleanupFn);
      let e = Jn(this),
        i;
      try {
        i = this.userFn.apply(null, t);
      } finally {
        Ti(this, e);
      }
      return (
        (this.value === _g || !this.equal(this.value, i)) &&
          ((this.value = i), this.version++),
        this.signal
      );
    },
  }),
  Cg = class extends ha {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    constructor(t, e, i, r, o, s = null) {
      super(t, [void 0, void 0, void 0, void 0], i, !1, o, s),
        (this.scheduler = r);
      for (let a of ig) {
        let l = e[a];
        if (l === void 0) continue;
        let c = Object.create(yO);
        (c.sequence = this),
          (c.phase = a),
          (c.userFn = l),
          (c.dirty = !0),
          (c.signal = () => (mr(c), c.value)),
          (c.signal[Ze] = c),
          (c.registerCleanupFn = (d) => (c.cleanup ??= new Set()).add(d)),
          (this.nodes[a] = c),
          (this.hooks[a] = (d) => c.phaseFn(d));
      }
    }
    afterRun() {
      super.afterRun(), (this.lastPhase = null);
    }
    destroy() {
      super.destroy();
      for (let t of this.nodes) for (let e of t?.cleanup ?? SD) e();
    }
  };
function xD(n, t) {
  let e = t?.injector ?? f(te),
    i = e.get(tn),
    r = e.get(Ld),
    o = e.get(Yi, null, { optional: !0 });
  r.impl ??= e.get(rg);
  let s = n;
  typeof s == "function" && (s = { mixedReadWrite: n });
  let a = e.get(Fr, null, { optional: !0 }),
    l = new Cg(
      r.impl,
      [s.earlyRead, s.write, s.mixedReadWrite, s.read],
      a?.view,
      i,
      e.get(qt),
      o?.snapshot(null)
    );
  return r.impl.register(l), l;
}
function Yd(n, t) {
  let e = ri(n),
    i = t.elementInjector || Ro();
  return new Hr(e).create(
    i,
    t.projectableNodes,
    t.hostElement,
    t.environmentInjector,
    t.directives,
    t.bindings
  );
}
var RD = null;
function ln() {
  return RD;
}
function Sg(n) {
  RD ??= n;
}
var xa = class {},
  xg = (() => {
    class n {
      historyGo(e) {
        throw new Error("");
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({
        token: n,
        factory: () => f(AD),
        providedIn: "platform",
      });
    }
    return n;
  })();
var AD = (() => {
  class n extends xg {
    _location;
    _history;
    _doc = f(O);
    constructor() {
      super(),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return ln().getBaseHref(this._doc);
    }
    onPopState(e) {
      let i = ln().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", e, !1),
        () => i.removeEventListener("popstate", e)
      );
    }
    onHashChange(e) {
      let i = ln().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", e, !1),
        () => i.removeEventListener("hashchange", e)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(e) {
      this._location.pathname = e;
    }
    pushState(e, i, r) {
      this._history.pushState(e, i, r);
    }
    replaceState(e, i, r) {
      this._history.replaceState(e, i, r);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(e = 0) {
      this._history.go(e);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({
      token: n,
      factory: () => new n(),
      providedIn: "platform",
    });
  }
  return n;
})();
function ND(n, t) {
  return n
    ? t
      ? n.endsWith("/")
        ? t.startsWith("/")
          ? n + t.slice(1)
          : n + t
        : t.startsWith("/")
        ? n + t
        : `${n}/${t}`
      : n
    : t;
}
function MD(n) {
  let t = n.search(/#|\?|$/);
  return n[t - 1] === "/" ? n.slice(0, t - 1) + n.slice(t) : n;
}
function Zi(n) {
  return n && n[0] !== "?" ? `?${n}` : n;
}
var Kd = (() => {
    class n {
      historyGo(e) {
        throw new Error("");
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: () => f(kD), providedIn: "root" });
    }
    return n;
  })(),
  OD = new y(""),
  kD = (() => {
    class n extends Kd {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(e, i) {
        super(),
          (this._platformLocation = e),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            f(O).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(e) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(e),
          this._platformLocation.onHashChange(e)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(e) {
        return ND(this._baseHref, e);
      }
      path(e = !1) {
        let i =
            this._platformLocation.pathname + Zi(this._platformLocation.search),
          r = this._platformLocation.hash;
        return r && e ? `${i}${r}` : i;
      }
      pushState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + Zi(o));
        this._platformLocation.pushState(e, i, s);
      }
      replaceState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + Zi(o));
        this._platformLocation.replaceState(e, i, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(e = 0) {
        this._platformLocation.historyGo?.(e);
      }
      static ɵfac = function (i) {
        return new (i || n)(A(xg), A(OD, 8));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  Qi = (() => {
    class n {
      _subject = new E();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(e) {
        this._locationStrategy = e;
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = EO(MD(TD(i)))),
          this._locationStrategy.onPopState((r) => {
            this._subject.next({
              url: this.path(!0),
              pop: !0,
              state: r.state,
              type: r.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(e = !1) {
        return this.normalize(this._locationStrategy.path(e));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(e, i = "") {
        return this.path() == this.normalize(e + Zi(i));
      }
      normalize(e) {
        return n.stripTrailingSlash(wO(this._basePath, TD(e)));
      }
      prepareExternalUrl(e) {
        return (
          e && e[0] !== "/" && (e = "/" + e),
          this._locationStrategy.prepareExternalUrl(e)
        );
      }
      go(e, i = "", r = null) {
        this._locationStrategy.pushState(r, "", e, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(e + Zi(i)), r);
      }
      replaceState(e, i = "", r = null) {
        this._locationStrategy.replaceState(r, "", e, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(e + Zi(i)), r);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(e = 0) {
        this._locationStrategy.historyGo?.(e);
      }
      onUrlChange(e) {
        return (
          this._urlChangeListeners.push(e),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(e);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(e = "", i) {
        this._urlChangeListeners.forEach((r) => r(e, i));
      }
      subscribe(e, i, r) {
        return this._subject.subscribe({
          next: e,
          error: i ?? void 0,
          complete: r ?? void 0,
        });
      }
      static normalizeQueryParams = Zi;
      static joinWithSlash = ND;
      static stripTrailingSlash = MD;
      static ɵfac = function (i) {
        return new (i || n)(A(Kd));
      };
      static ɵprov = b({ token: n, factory: () => bO(), providedIn: "root" });
    }
    return n;
  })();
function bO() {
  return new Qi(A(Kd));
}
function wO(n, t) {
  if (!n || !t.startsWith(n)) return t;
  let e = t.substring(n.length);
  return e === "" || ["/", ";", "?", "#"].includes(e[0]) ? e : t;
}
function TD(n) {
  return n.replace(/\/index.html$/, "");
}
function EO(n) {
  if (new RegExp("^(https?:)?//").test(n)) {
    let [, e] = n.split(/\/\/[^\/]+/);
    return e;
  }
  return n;
}
var Dt = (function (n) {
    return (
      (n[(n.Format = 0)] = "Format"), (n[(n.Standalone = 1)] = "Standalone"), n
    );
  })(Dt || {}),
  _e = (function (n) {
    return (
      (n[(n.Narrow = 0)] = "Narrow"),
      (n[(n.Abbreviated = 1)] = "Abbreviated"),
      (n[(n.Wide = 2)] = "Wide"),
      (n[(n.Short = 3)] = "Short"),
      n
    );
  })(_e || {}),
  Ht = (function (n) {
    return (
      (n[(n.Short = 0)] = "Short"),
      (n[(n.Medium = 1)] = "Medium"),
      (n[(n.Long = 2)] = "Long"),
      (n[(n.Full = 3)] = "Full"),
      n
    );
  })(Ht || {}),
  gi = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
  };
function VD(n) {
  return Zt(n)[He.LocaleId];
}
function jD(n, t, e) {
  let i = Zt(n),
    r = [i[He.DayPeriodsFormat], i[He.DayPeriodsStandalone]],
    o = cn(r, t);
  return cn(o, e);
}
function BD(n, t, e) {
  let i = Zt(n),
    r = [i[He.DaysFormat], i[He.DaysStandalone]],
    o = cn(r, t);
  return cn(o, e);
}
function HD(n, t, e) {
  let i = Zt(n),
    r = [i[He.MonthsFormat], i[He.MonthsStandalone]],
    o = cn(r, t);
  return cn(o, e);
}
function UD(n, t) {
  let i = Zt(n)[He.Eras];
  return cn(i, t);
}
function Ma(n, t) {
  let e = Zt(n);
  return cn(e[He.DateFormat], t);
}
function Ta(n, t) {
  let e = Zt(n);
  return cn(e[He.TimeFormat], t);
}
function Ra(n, t) {
  let i = Zt(n)[He.DateTimeFormat];
  return cn(i, t);
}
function Aa(n, t) {
  let e = Zt(n),
    i = e[He.NumberSymbols][t];
  if (typeof i > "u") {
    if (t === gi.CurrencyDecimal) return e[He.NumberSymbols][gi.Decimal];
    if (t === gi.CurrencyGroup) return e[He.NumberSymbols][gi.Group];
  }
  return i;
}
function zD(n) {
  if (!n[He.ExtraData]) throw new v(2303, !1);
}
function $D(n) {
  let t = Zt(n);
  return (
    zD(t),
    (t[He.ExtraData][2] || []).map((i) =>
      typeof i == "string" ? Mg(i) : [Mg(i[0]), Mg(i[1])]
    )
  );
}
function GD(n, t, e) {
  let i = Zt(n);
  zD(i);
  let r = [i[He.ExtraData][0], i[He.ExtraData][1]],
    o = cn(r, t) || [];
  return cn(o, e) || [];
}
function cn(n, t) {
  for (let e = t; e > -1; e--) if (typeof n[e] < "u") return n[e];
  throw new v(2304, !1);
}
function Mg(n) {
  let [t, e] = n.split(":");
  return { hours: +t, minutes: +e };
}
var DO =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  Zd = {},
  CO =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
function WD(n, t, e, i) {
  let r = OO(n);
  t = mi(e, t) || t;
  let s = [],
    a;
  for (; t; )
    if (((a = CO.exec(t)), a)) {
      s = s.concat(a.slice(1));
      let d = s.pop();
      if (!d) break;
      t = d;
    } else {
      s.push(t);
      break;
    }
  let l = r.getTimezoneOffset();
  i && ((l = YD(i, l)), (r = NO(r, i)));
  let c = "";
  return (
    s.forEach((d) => {
      let u = RO(d);
      c += u
        ? u(r, e, l)
        : d === "''"
        ? "'"
        : d.replace(/(^'|'$)/g, "").replace(/''/g, "'");
    }),
    c
  );
}
function tu(n, t, e) {
  let i = new Date(0);
  return i.setFullYear(n, t, e), i.setHours(0, 0, 0), i;
}
function mi(n, t) {
  let e = VD(n);
  if (((Zd[e] ??= {}), Zd[e][t])) return Zd[e][t];
  let i = "";
  switch (t) {
    case "shortDate":
      i = Ma(n, Ht.Short);
      break;
    case "mediumDate":
      i = Ma(n, Ht.Medium);
      break;
    case "longDate":
      i = Ma(n, Ht.Long);
      break;
    case "fullDate":
      i = Ma(n, Ht.Full);
      break;
    case "shortTime":
      i = Ta(n, Ht.Short);
      break;
    case "mediumTime":
      i = Ta(n, Ht.Medium);
      break;
    case "longTime":
      i = Ta(n, Ht.Long);
      break;
    case "fullTime":
      i = Ta(n, Ht.Full);
      break;
    case "short":
      let r = mi(n, "shortTime"),
        o = mi(n, "shortDate");
      i = Qd(Ra(n, Ht.Short), [r, o]);
      break;
    case "medium":
      let s = mi(n, "mediumTime"),
        a = mi(n, "mediumDate");
      i = Qd(Ra(n, Ht.Medium), [s, a]);
      break;
    case "long":
      let l = mi(n, "longTime"),
        c = mi(n, "longDate");
      i = Qd(Ra(n, Ht.Long), [l, c]);
      break;
    case "full":
      let d = mi(n, "fullTime"),
        u = mi(n, "fullDate");
      i = Qd(Ra(n, Ht.Full), [d, u]);
      break;
  }
  return i && (Zd[e][t] = i), i;
}
function Qd(n, t) {
  return (
    t &&
      (n = n.replace(/\{([^}]+)}/g, function (e, i) {
        return t != null && i in t ? t[i] : e;
      })),
    n
  );
}
function xn(n, t, e = "-", i, r) {
  let o = "";
  (n < 0 || (r && n <= 0)) && (r ? (n = -n + 1) : ((n = -n), (o = e)));
  let s = String(n);
  for (; s.length < t; ) s = "0" + s;
  return i && (s = s.slice(s.length - t)), o + s;
}
function IO(n, t) {
  return xn(n, 3).substring(0, t);
}
function Ye(n, t, e = 0, i = !1, r = !1) {
  return function (o, s) {
    let a = SO(n, o);
    if (((e > 0 || a > -e) && (a += e), n === 3))
      a === 0 && e === -12 && (a = 12);
    else if (n === 6) return IO(a, t);
    let l = Aa(s, gi.MinusSign);
    return xn(a, t, l, i, r);
  };
}
function SO(n, t) {
  switch (n) {
    case 0:
      return t.getFullYear();
    case 1:
      return t.getMonth();
    case 2:
      return t.getDate();
    case 3:
      return t.getHours();
    case 4:
      return t.getMinutes();
    case 5:
      return t.getSeconds();
    case 6:
      return t.getMilliseconds();
    case 7:
      return t.getDay();
    default:
      throw new v(2301, !1);
  }
}
function Ce(n, t, e = Dt.Format, i = !1) {
  return function (r, o) {
    return xO(r, o, n, t, e, i);
  };
}
function xO(n, t, e, i, r, o) {
  switch (e) {
    case 2:
      return HD(t, r, i)[n.getMonth()];
    case 1:
      return BD(t, r, i)[n.getDay()];
    case 0:
      let s = n.getHours(),
        a = n.getMinutes();
      if (o) {
        let c = $D(t),
          d = GD(t, r, i),
          u = c.findIndex((p) => {
            if (Array.isArray(p)) {
              let [h, m] = p,
                g = s >= h.hours && a >= h.minutes,
                w = s < m.hours || (s === m.hours && a < m.minutes);
              if (h.hours < m.hours) {
                if (g && w) return !0;
              } else if (g || w) return !0;
            } else if (p.hours === s && p.minutes === a) return !0;
            return !1;
          });
        if (u !== -1) return d[u];
      }
      return jD(t, r, i)[s < 12 ? 0 : 1];
    case 3:
      return UD(t, i)[n.getFullYear() <= 0 ? 0 : 1];
    default:
      let l = e;
      throw new v(2302, !1);
  }
}
function Xd(n) {
  return function (t, e, i) {
    let r = -1 * i,
      o = Aa(e, gi.MinusSign),
      s = r > 0 ? Math.floor(r / 60) : Math.ceil(r / 60);
    switch (n) {
      case 0:
        return (r >= 0 ? "+" : "") + xn(s, 2, o) + xn(Math.abs(r % 60), 2, o);
      case 1:
        return "GMT" + (r >= 0 ? "+" : "") + xn(s, 1, o);
      case 2:
        return (
          "GMT" +
          (r >= 0 ? "+" : "") +
          xn(s, 2, o) +
          ":" +
          xn(Math.abs(r % 60), 2, o)
        );
      case 3:
        return i === 0
          ? "Z"
          : (r >= 0 ? "+" : "") +
              xn(s, 2, o) +
              ":" +
              xn(Math.abs(r % 60), 2, o);
      default:
        throw new v(2302, !1);
    }
  };
}
var MO = 0,
  eu = 4;
function TO(n) {
  let t = tu(n, MO, 1).getDay();
  return tu(n, 0, 1 + (t <= eu ? eu : eu + 7) - t);
}
function qD(n) {
  let t = n.getDay(),
    e = t === 0 ? -3 : eu - t;
  return tu(n.getFullYear(), n.getMonth(), n.getDate() + e);
}
function Tg(n, t = !1) {
  return function (e, i) {
    let r;
    if (t) {
      let o = new Date(e.getFullYear(), e.getMonth(), 1).getDay() - 1,
        s = e.getDate();
      r = 1 + Math.floor((s + o) / 7);
    } else {
      let o = qD(e),
        s = TO(o.getFullYear()),
        a = o.getTime() - s.getTime();
      r = 1 + Math.round(a / 6048e5);
    }
    return xn(r, n, Aa(i, gi.MinusSign));
  };
}
function Jd(n, t = !1) {
  return function (e, i) {
    let o = qD(e).getFullYear();
    return xn(o, n, Aa(i, gi.MinusSign), t);
  };
}
var Rg = {};
function RO(n) {
  if (Rg[n]) return Rg[n];
  let t;
  switch (n) {
    case "G":
    case "GG":
    case "GGG":
      t = Ce(3, _e.Abbreviated);
      break;
    case "GGGG":
      t = Ce(3, _e.Wide);
      break;
    case "GGGGG":
      t = Ce(3, _e.Narrow);
      break;
    case "y":
      t = Ye(0, 1, 0, !1, !0);
      break;
    case "yy":
      t = Ye(0, 2, 0, !0, !0);
      break;
    case "yyy":
      t = Ye(0, 3, 0, !1, !0);
      break;
    case "yyyy":
      t = Ye(0, 4, 0, !1, !0);
      break;
    case "Y":
      t = Jd(1);
      break;
    case "YY":
      t = Jd(2, !0);
      break;
    case "YYY":
      t = Jd(3);
      break;
    case "YYYY":
      t = Jd(4);
      break;
    case "M":
    case "L":
      t = Ye(1, 1, 1);
      break;
    case "MM":
    case "LL":
      t = Ye(1, 2, 1);
      break;
    case "MMM":
      t = Ce(2, _e.Abbreviated);
      break;
    case "MMMM":
      t = Ce(2, _e.Wide);
      break;
    case "MMMMM":
      t = Ce(2, _e.Narrow);
      break;
    case "LLL":
      t = Ce(2, _e.Abbreviated, Dt.Standalone);
      break;
    case "LLLL":
      t = Ce(2, _e.Wide, Dt.Standalone);
      break;
    case "LLLLL":
      t = Ce(2, _e.Narrow, Dt.Standalone);
      break;
    case "w":
      t = Tg(1);
      break;
    case "ww":
      t = Tg(2);
      break;
    case "W":
      t = Tg(1, !0);
      break;
    case "d":
      t = Ye(2, 1);
      break;
    case "dd":
      t = Ye(2, 2);
      break;
    case "c":
    case "cc":
      t = Ye(7, 1);
      break;
    case "ccc":
      t = Ce(1, _e.Abbreviated, Dt.Standalone);
      break;
    case "cccc":
      t = Ce(1, _e.Wide, Dt.Standalone);
      break;
    case "ccccc":
      t = Ce(1, _e.Narrow, Dt.Standalone);
      break;
    case "cccccc":
      t = Ce(1, _e.Short, Dt.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      t = Ce(1, _e.Abbreviated);
      break;
    case "EEEE":
      t = Ce(1, _e.Wide);
      break;
    case "EEEEE":
      t = Ce(1, _e.Narrow);
      break;
    case "EEEEEE":
      t = Ce(1, _e.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      t = Ce(0, _e.Abbreviated);
      break;
    case "aaaa":
      t = Ce(0, _e.Wide);
      break;
    case "aaaaa":
      t = Ce(0, _e.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      t = Ce(0, _e.Abbreviated, Dt.Standalone, !0);
      break;
    case "bbbb":
      t = Ce(0, _e.Wide, Dt.Standalone, !0);
      break;
    case "bbbbb":
      t = Ce(0, _e.Narrow, Dt.Standalone, !0);
      break;
    case "B":
    case "BB":
    case "BBB":
      t = Ce(0, _e.Abbreviated, Dt.Format, !0);
      break;
    case "BBBB":
      t = Ce(0, _e.Wide, Dt.Format, !0);
      break;
    case "BBBBB":
      t = Ce(0, _e.Narrow, Dt.Format, !0);
      break;
    case "h":
      t = Ye(3, 1, -12);
      break;
    case "hh":
      t = Ye(3, 2, -12);
      break;
    case "H":
      t = Ye(3, 1);
      break;
    case "HH":
      t = Ye(3, 2);
      break;
    case "m":
      t = Ye(4, 1);
      break;
    case "mm":
      t = Ye(4, 2);
      break;
    case "s":
      t = Ye(5, 1);
      break;
    case "ss":
      t = Ye(5, 2);
      break;
    case "S":
      t = Ye(6, 1);
      break;
    case "SS":
      t = Ye(6, 2);
      break;
    case "SSS":
      t = Ye(6, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      t = Xd(0);
      break;
    case "ZZZZZ":
      t = Xd(3);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      t = Xd(1);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      t = Xd(2);
      break;
    default:
      return null;
  }
  return (Rg[n] = t), t;
}
function YD(n, t) {
  n = n.replace(/:/g, "");
  let e = Date.parse("Jan 01, 1970 00:00:00 " + n) / 6e4;
  return isNaN(e) ? t : e;
}
function AO(n, t) {
  return (n = new Date(n.getTime())), n.setMinutes(n.getMinutes() + t), n;
}
function NO(n, t, e) {
  let r = n.getTimezoneOffset(),
    o = YD(t, r);
  return AO(n, -1 * (o - r));
}
function OO(n) {
  if (PD(n)) return n;
  if (typeof n == "number" && !isNaN(n)) return new Date(n);
  if (typeof n == "string") {
    if (((n = n.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(n))) {
      let [r, o = 1, s = 1] = n.split("-").map((a) => +a);
      return tu(r, o - 1, s);
    }
    let e = parseFloat(n);
    if (!isNaN(n - e)) return new Date(e);
    let i;
    if ((i = n.match(DO))) return kO(i);
  }
  let t = new Date(n);
  if (!PD(t)) throw new v(2302, !1);
  return t;
}
function kO(n) {
  let t = new Date(0),
    e = 0,
    i = 0,
    r = n[8] ? t.setUTCFullYear : t.setFullYear,
    o = n[8] ? t.setUTCHours : t.setHours;
  n[9] && ((e = Number(n[9] + n[10])), (i = Number(n[9] + n[11]))),
    r.call(t, Number(n[1]), Number(n[2]) - 1, Number(n[3]));
  let s = Number(n[4] || 0) - e,
    a = Number(n[5] || 0) - i,
    l = Number(n[6] || 0),
    c = Math.floor(parseFloat("0." + (n[7] || 0)) * 1e3);
  return o.call(t, s, a, l, c), t;
}
function PD(n) {
  return n instanceof Date && !isNaN(n.valueOf());
}
var nu = class {
    $implicit;
    ngForOf;
    index;
    count;
    constructor(t, e, i, r) {
      (this.$implicit = t),
        (this.ngForOf = e),
        (this.index = i),
        (this.count = r);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Xi = (() => {
    class n {
      _viewContainer;
      _template;
      _differs;
      set ngForOf(e) {
        (this._ngForOf = e), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(e) {
        this._trackByFn = e;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      _ngForOf = null;
      _ngForOfDirty = !0;
      _differ = null;
      _trackByFn;
      constructor(e, i, r) {
        (this._viewContainer = e), (this._template = i), (this._differs = r);
      }
      set ngForTemplate(e) {
        e && (this._template = e);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let e = this._ngForOf;
          !this._differ &&
            e &&
            (this._differ = this._differs.find(e).create(this.ngForTrackBy));
        }
        if (this._differ) {
          let e = this._differ.diff(this._ngForOf);
          e && this._applyChanges(e);
        }
      }
      _applyChanges(e) {
        let i = this._viewContainer;
        e.forEachOperation((r, o, s) => {
          if (r.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new nu(r.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s
            );
          else if (s == null) i.remove(o === null ? void 0 : o);
          else if (o !== null) {
            let a = i.get(o);
            i.move(a, s), FD(a, r);
          }
        });
        for (let r = 0, o = i.length; r < o; r++) {
          let a = i.get(r).context;
          (a.index = r), (a.count = o), (a.ngForOf = this._ngForOf);
        }
        e.forEachIdentityChange((r) => {
          let o = i.get(r.currentIndex);
          FD(o, r);
        });
      }
      static ngTemplateContextGuard(e, i) {
        return !0;
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(mt), ie(Lt), ie(qd));
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
      });
    }
    return n;
  })();
function FD(n, t) {
  n.context.$implicit = t.item;
}
var vi = (() => {
    class n {
      _viewContainer;
      _context = new iu();
      _thenTemplateRef = null;
      _elseTemplateRef = null;
      _thenViewRef = null;
      _elseViewRef = null;
      constructor(e, i) {
        (this._viewContainer = e), (this._thenTemplateRef = i);
      }
      set ngIf(e) {
        (this._context.$implicit = this._context.ngIf = e), this._updateView();
      }
      set ngIfThen(e) {
        LD(e, !1),
          (this._thenTemplateRef = e),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(e) {
        LD(e, !1),
          (this._elseTemplateRef = e),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngIfUseIfTypeGuard;
      static ngTemplateGuard_ngIf;
      static ngTemplateContextGuard(e, i) {
        return !0;
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(mt), ie(Lt));
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
      });
    }
    return n;
  })(),
  iu = class {
    $implicit = null;
    ngIf = null;
  };
function LD(n, t) {
  if (n && !n.createEmbeddedView) throw new v(2020, !1);
}
var Ag = (() => {
  class n {
    _viewContainerRef;
    _viewRef = null;
    ngTemplateOutletContext = null;
    ngTemplateOutlet = null;
    ngTemplateOutletInjector = null;
    constructor(e) {
      this._viewContainerRef = e;
    }
    ngOnChanges(e) {
      if (this._shouldRecreateView(e)) {
        let i = this._viewContainerRef;
        if (
          (this._viewRef && i.remove(i.indexOf(this._viewRef)),
          !this.ngTemplateOutlet)
        ) {
          this._viewRef = null;
          return;
        }
        let r = this._createContextForwardProxy();
        this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, r, {
          injector: this.ngTemplateOutletInjector ?? void 0,
        });
      }
    }
    _shouldRecreateView(e) {
      return !!e.ngTemplateOutlet || !!e.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (e, i, r) =>
            this.ngTemplateOutletContext
              ? Reflect.set(this.ngTemplateOutletContext, i, r)
              : !1,
          get: (e, i, r) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, i, r);
          },
        }
      );
    }
    static ɵfac = function (i) {
      return new (i || n)(ie(mt));
    };
    static ɵdir = L({
      type: n,
      selectors: [["", "ngTemplateOutlet", ""]],
      inputs: {
        ngTemplateOutletContext: "ngTemplateOutletContext",
        ngTemplateOutlet: "ngTemplateOutlet",
        ngTemplateOutletInjector: "ngTemplateOutletInjector",
      },
      features: [wt],
    });
  }
  return n;
})();
function KD(n, t) {
  return new v(2100, !1);
}
var PO =
    /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g,
  Ng = (() => {
    class n {
      transform(e) {
        if (e == null) return null;
        if (typeof e != "string") throw KD(n, e);
        return e.replace(
          PO,
          (i) => i[0].toUpperCase() + i.slice(1).toLowerCase()
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵpipe = Od({ name: "titlecase", type: n, pure: !0 });
    }
    return n;
  })();
var FO = "mediumDate",
  ZD = new y(""),
  QD = new y(""),
  Og = (() => {
    class n {
      locale;
      defaultTimezone;
      defaultOptions;
      constructor(e, i, r) {
        (this.locale = e),
          (this.defaultTimezone = i),
          (this.defaultOptions = r);
      }
      transform(e, i, r, o) {
        if (e == null || e === "" || e !== e) return null;
        try {
          let s = i ?? this.defaultOptions?.dateFormat ?? FO,
            a =
              r ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return WD(e, s, o || this.locale, a);
        } catch (s) {
          throw KD(n, s.message);
        }
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(wa, 16), ie(ZD, 24), ie(QD, 24));
      };
      static ɵpipe = Od({ name: "date", type: n, pure: !0 });
    }
    return n;
  })();
var qn = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({});
  }
  return n;
})();
function kg(n, t) {
  t = encodeURIComponent(t);
  for (let e of n.split(";")) {
    let i = e.indexOf("="),
      [r, o] = i == -1 ? [e, ""] : [e.slice(0, i), e.slice(i + 1)];
    if (r.trim() === t) return decodeURIComponent(o);
  }
  return null;
}
var Na = class {};
var Pg = "browser";
function XD(n) {
  return n === Pg;
}
var su = new y(""),
  Bg = (() => {
    class n {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(e, i) {
        (this._zone = i),
          e.forEach((r) => {
            r.manager = this;
          }),
          (this._plugins = e.slice().reverse());
      }
      addEventListener(e, i, r, o) {
        return this._findPluginFor(i).addEventListener(e, i, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(e) {
        let i = this._eventNameToPlugin.get(e);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(e))), !i))
          throw new v(5101, !1);
        return this._eventNameToPlugin.set(e, i), i;
      }
      static ɵfac = function (i) {
        return new (i || n)(A(su), A(M));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  Oa = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  Fg = "ng-app-id";
function JD(n) {
  for (let t of n) t.remove();
}
function eC(n, t) {
  let e = t.createElement("style");
  return (e.textContent = n), e;
}
function LO(n, t, e, i) {
  let r = n.head?.querySelectorAll(`style[${Fg}="${t}"],link[${Fg}="${t}"]`);
  if (r)
    for (let o of r)
      o.removeAttribute(Fg),
        o instanceof HTMLLinkElement
          ? i.set(o.href.slice(o.href.lastIndexOf("/") + 1), {
              usage: 0,
              elements: [o],
            })
          : o.textContent && e.set(o.textContent, { usage: 0, elements: [o] });
}
function Vg(n, t) {
  let e = t.createElement("link");
  return e.setAttribute("rel", "stylesheet"), e.setAttribute("href", n), e;
}
var Hg = (() => {
    class n {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(e, i, r, o = {}) {
        (this.doc = e),
          (this.appId = i),
          (this.nonce = r),
          LO(e, i, this.inline, this.external),
          this.hosts.add(e.head);
      }
      addStyles(e, i) {
        for (let r of e) this.addUsage(r, this.inline, eC);
        i?.forEach((r) => this.addUsage(r, this.external, Vg));
      }
      removeStyles(e, i) {
        for (let r of e) this.removeUsage(r, this.inline);
        i?.forEach((r) => this.removeUsage(r, this.external));
      }
      addUsage(e, i, r) {
        let o = i.get(e);
        o
          ? o.usage++
          : i.set(e, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, r(e, this.doc))
              ),
            });
      }
      removeUsage(e, i) {
        let r = i.get(e);
        r && (r.usage--, r.usage <= 0 && (JD(r.elements), i.delete(e)));
      }
      ngOnDestroy() {
        for (let [, { elements: e }] of [...this.inline, ...this.external])
          JD(e);
        this.hosts.clear();
      }
      addHost(e) {
        this.hosts.add(e);
        for (let [i, { elements: r }] of this.inline)
          r.push(this.addElement(e, eC(i, this.doc)));
        for (let [i, { elements: r }] of this.external)
          r.push(this.addElement(e, Vg(i, this.doc)));
      }
      removeHost(e) {
        this.hosts.delete(e);
      }
      addElement(e, i) {
        return (
          this.nonce && i.setAttribute("nonce", this.nonce), e.appendChild(i)
        );
      }
      static ɵfac = function (i) {
        return new (i || n)(A(O), A(Go), A(Wo, 8), A(Wi));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  Lg = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Ug = /%COMP%/g;
var nC = "%COMP%",
  VO = `_nghost-${nC}`,
  jO = `_ngcontent-${nC}`,
  BO = !0,
  HO = new y("", { providedIn: "root", factory: () => BO });
function UO(n) {
  return jO.replace(Ug, n);
}
function zO(n) {
  return VO.replace(Ug, n);
}
function iC(n, t) {
  return t.map((e) => e.replace(Ug, n));
}
var Fa = (() => {
    class n {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(e, i, r, o, s, a, l, c = null, d = null) {
        (this.eventManager = e),
          (this.sharedStylesHost = i),
          (this.appId = r),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = l),
          (this.nonce = c),
          (this.tracingService = d),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new ka(
            e,
            s,
            l,
            this.platformIsServer,
            this.tracingService
          ));
      }
      createRenderer(e, i) {
        if (!e || !i) return this.defaultRenderer;
        let r = this.getOrCreateRenderer(e, i);
        return (
          r instanceof ou
            ? r.applyToHost(e)
            : r instanceof Pa && r.applyStyles(),
          r
        );
      }
      getOrCreateRenderer(e, i) {
        let r = this.rendererByCompId,
          o = r.get(i.id);
        if (!o) {
          let s = this.doc,
            a = this.ngZone,
            l = this.eventManager,
            c = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            u = this.platformIsServer,
            p = this.tracingService;
          switch (i.encapsulation) {
            case ci.Emulated:
              o = new ou(l, c, i, this.appId, d, s, a, u, p);
              break;
            case ci.ShadowDom:
              return new jg(l, c, e, i, s, a, this.nonce, u, p);
            default:
              o = new Pa(l, c, i, d, s, a, u, p);
              break;
          }
          r.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(e) {
        this.rendererByCompId.delete(e);
      }
      static ɵfac = function (i) {
        return new (i || n)(
          A(Bg),
          A(Hg),
          A(Go),
          A(HO),
          A(O),
          A(Wi),
          A(M),
          A(Wo),
          A(Yi, 8)
        );
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  ka = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, e, i, r, o) {
      (this.eventManager = t),
        (this.doc = e),
        (this.ngZone = i),
        (this.platformIsServer = r),
        (this.tracingService = o);
    }
    destroy() {}
    destroyNode = null;
    createElement(t, e) {
      return e
        ? this.doc.createElementNS(Lg[e] || e, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, e) {
      (tC(t) ? t.content : t).appendChild(e);
    }
    insertBefore(t, e, i) {
      t && (tC(t) ? t.content : t).insertBefore(e, i);
    }
    removeChild(t, e) {
      e.remove();
    }
    selectRootElement(t, e) {
      let i = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!i) throw new v(-5104, !1);
      return e || (i.textContent = ""), i;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, e, i, r) {
      if (r) {
        e = r + ":" + e;
        let o = Lg[r];
        o ? t.setAttributeNS(o, e, i) : t.setAttribute(e, i);
      } else t.setAttribute(e, i);
    }
    removeAttribute(t, e, i) {
      if (i) {
        let r = Lg[i];
        r ? t.removeAttributeNS(r, e) : t.removeAttribute(`${i}:${e}`);
      } else t.removeAttribute(e);
    }
    addClass(t, e) {
      t.classList.add(e);
    }
    removeClass(t, e) {
      t.classList.remove(e);
    }
    setStyle(t, e, i, r) {
      r & (zn.DashCase | zn.Important)
        ? t.style.setProperty(e, i, r & zn.Important ? "important" : "")
        : (t.style[e] = i);
    }
    removeStyle(t, e, i) {
      i & zn.DashCase ? t.style.removeProperty(e) : (t.style[e] = "");
    }
    setProperty(t, e, i) {
      t != null && (t[e] = i);
    }
    setValue(t, e) {
      t.nodeValue = e;
    }
    listen(t, e, i, r) {
      if (
        typeof t == "string" &&
        ((t = ln().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new v(5102, !1);
      let o = this.decoratePreventDefault(i);
      return (
        this.tracingService?.wrapEventListener &&
          (o = this.tracingService.wrapEventListener(t, e, o)),
        this.eventManager.addEventListener(t, e, o, r)
      );
    }
    decoratePreventDefault(t) {
      return (e) => {
        if (e === "__ngUnwrap__") return t;
        t(e) === !1 && e.preventDefault();
      };
    }
  };
function tC(n) {
  return n.tagName === "TEMPLATE" && n.content !== void 0;
}
var jg = class extends ka {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, e, i, r, o, s, a, l, c) {
      super(t, o, s, l, c),
        (this.sharedStylesHost = e),
        (this.hostEl = i),
        (this.shadowRoot = i.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let d = r.styles;
      d = iC(r.id, d);
      for (let p of d) {
        let h = document.createElement("style");
        a && h.setAttribute("nonce", a),
          (h.textContent = p),
          this.shadowRoot.appendChild(h);
      }
      let u = r.getExternalStyles?.();
      if (u)
        for (let p of u) {
          let h = Vg(p, o);
          a && h.setAttribute("nonce", a), this.shadowRoot.appendChild(h);
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, e) {
      return super.appendChild(this.nodeOrShadowRoot(t), e);
    }
    insertBefore(t, e, i) {
      return super.insertBefore(this.nodeOrShadowRoot(t), e, i);
    }
    removeChild(t, e) {
      return super.removeChild(null, e);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Pa = class extends ka {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(t, e, i, r, o, s, a, l, c) {
      super(t, o, s, a, l),
        (this.sharedStylesHost = e),
        (this.removeStylesOnCompDestroy = r);
      let d = i.styles;
      (this.styles = c ? iC(c, d) : d),
        (this.styleUrls = i.getExternalStyles?.(c));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  ou = class extends Pa {
    contentAttr;
    hostAttr;
    constructor(t, e, i, r, o, s, a, l, c) {
      let d = r + "-" + i.id;
      super(t, e, i, o, s, a, l, c, d),
        (this.contentAttr = UO(d)),
        (this.hostAttr = zO(d));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, e) {
      let i = super.createElement(t, e);
      return super.setAttribute(i, this.contentAttr, ""), i;
    }
  };
var au = class n extends xa {
    supportsDOMEvents = !0;
    static makeCurrent() {
      Sg(new n());
    }
    onAndCancel(t, e, i, r) {
      return (
        t.addEventListener(e, i, r),
        () => {
          t.removeEventListener(e, i, r);
        }
      );
    }
    dispatchEvent(t, e) {
      t.dispatchEvent(e);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, e) {
      return (e = e || this.getDefaultDocument()), e.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, e) {
      return e === "window"
        ? window
        : e === "document"
        ? t
        : e === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let e = $O();
      return e == null ? null : GO(e);
    }
    resetBaseElement() {
      La = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return kg(document.cookie, t);
    }
  },
  La = null;
function $O() {
  return (
    (La = La || document.head.querySelector("base")),
    La ? La.getAttribute("href") : null
  );
}
function GO(n) {
  return new URL(n, document.baseURI).pathname;
}
var WO = (() => {
    class n {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  oC = (() => {
    class n extends Oa {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return !0;
      }
      addEventListener(e, i, r, o) {
        return (
          e.addEventListener(i, r, o),
          () => this.removeEventListener(e, i, r, o)
        );
      }
      removeEventListener(e, i, r, o) {
        return e.removeEventListener(i, r, o);
      }
      static ɵfac = function (i) {
        return new (i || n)(A(O));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  rC = ["alt", "control", "meta", "shift"],
  qO = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  YO = {
    alt: (n) => n.altKey,
    control: (n) => n.ctrlKey,
    meta: (n) => n.metaKey,
    shift: (n) => n.shiftKey,
  },
  sC = (() => {
    class n extends Oa {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return n.parseEventName(e) != null;
      }
      addEventListener(e, i, r, o) {
        let s = n.parseEventName(i),
          a = n.eventCallback(s.fullKey, r, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => ln().onAndCancel(e, s.domEventName, a, o));
      }
      static parseEventName(e) {
        let i = e.toLowerCase().split("."),
          r = i.shift();
        if (i.length === 0 || !(r === "keydown" || r === "keyup")) return null;
        let o = n._normalizeKey(i.pop()),
          s = "",
          a = i.indexOf("code");
        if (
          (a > -1 && (i.splice(a, 1), (s = "code.")),
          rC.forEach((c) => {
            let d = i.indexOf(c);
            d > -1 && (i.splice(d, 1), (s += c + "."));
          }),
          (s += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = r), (l.fullKey = s), l;
      }
      static matchEventFullKeyCode(e, i) {
        let r = qO[e.key] || e.key,
          o = "";
        return (
          i.indexOf("code.") > -1 && ((r = e.code), (o = "code.")),
          r == null || !r
            ? !1
            : ((r = r.toLowerCase()),
              r === " " ? (r = "space") : r === "." && (r = "dot"),
              rC.forEach((s) => {
                if (s !== r) {
                  let a = YO[s];
                  a(e) && (o += s + ".");
                }
              }),
              (o += r),
              o === i)
        );
      }
      static eventCallback(e, i, r) {
        return (o) => {
          n.matchEventFullKeyCode(o, e) && r.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(e) {
        return e === "esc" ? "escape" : e;
      }
      static ɵfac = function (i) {
        return new (i || n)(A(O));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })();
function zg(n, t) {
  return ID(_({ rootComponent: n }, KO(t)));
}
function KO(n) {
  return {
    appProviders: [...ek, ...(n?.providers ?? [])],
    platformProviders: JO,
  };
}
function ZO() {
  au.makeCurrent();
}
function QO() {
  return new ft();
}
function XO() {
  return Sm(document), document;
}
var JO = [
  { provide: Wi, useValue: Pg },
  { provide: Dd, useValue: ZO, multi: !0 },
  { provide: O, useFactory: XO },
];
var ek = [
  { provide: Zs, useValue: "root" },
  { provide: ft, useFactory: QO },
  { provide: su, useClass: oC, multi: !0, deps: [O] },
  { provide: su, useClass: sC, multi: !0, deps: [O] },
  Fa,
  Hg,
  Bg,
  { provide: Se, useExisting: Fa },
  { provide: Na, useClass: WO },
  [],
];
var Gg = class {};
var Wr = class n {
  headers;
  normalizedNames = new Map();
  lazyInit;
  lazyUpdate = null;
  constructor(t) {
    t
      ? typeof t == "string"
        ? (this.lazyInit = () => {
            (this.headers = new Map()),
              t
                .split(
                  `
`
                )
                .forEach((e) => {
                  let i = e.indexOf(":");
                  if (i > 0) {
                    let r = e.slice(0, i),
                      o = e.slice(i + 1).trim();
                    this.addHeaderEntry(r, o);
                  }
                });
          })
        : typeof Headers < "u" && t instanceof Headers
        ? ((this.headers = new Map()),
          t.forEach((e, i) => {
            this.addHeaderEntry(i, e);
          }))
        : (this.lazyInit = () => {
            (this.headers = new Map()),
              Object.entries(t).forEach(([e, i]) => {
                this.setHeaderEntries(e, i);
              });
          })
      : (this.headers = new Map());
  }
  has(t) {
    return this.init(), this.headers.has(t.toLowerCase());
  }
  get(t) {
    this.init();
    let e = this.headers.get(t.toLowerCase());
    return e && e.length > 0 ? e[0] : null;
  }
  keys() {
    return this.init(), Array.from(this.normalizedNames.values());
  }
  getAll(t) {
    return this.init(), this.headers.get(t.toLowerCase()) || null;
  }
  append(t, e) {
    return this.clone({ name: t, value: e, op: "a" });
  }
  set(t, e) {
    return this.clone({ name: t, value: e, op: "s" });
  }
  delete(t, e) {
    return this.clone({ name: t, value: e, op: "d" });
  }
  maybeSetNormalizedName(t, e) {
    this.normalizedNames.has(e) || this.normalizedNames.set(e, t);
  }
  init() {
    this.lazyInit &&
      (this.lazyInit instanceof n
        ? this.copyFrom(this.lazyInit)
        : this.lazyInit(),
      (this.lazyInit = null),
      this.lazyUpdate &&
        (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
        (this.lazyUpdate = null)));
  }
  copyFrom(t) {
    t.init(),
      Array.from(t.headers.keys()).forEach((e) => {
        this.headers.set(e, t.headers.get(e)),
          this.normalizedNames.set(e, t.normalizedNames.get(e));
      });
  }
  clone(t) {
    let e = new n();
    return (
      (e.lazyInit =
        this.lazyInit && this.lazyInit instanceof n ? this.lazyInit : this),
      (e.lazyUpdate = (this.lazyUpdate || []).concat([t])),
      e
    );
  }
  applyUpdate(t) {
    let e = t.name.toLowerCase();
    switch (t.op) {
      case "a":
      case "s":
        let i = t.value;
        if ((typeof i == "string" && (i = [i]), i.length === 0)) return;
        this.maybeSetNormalizedName(t.name, e);
        let r = (t.op === "a" ? this.headers.get(e) : void 0) || [];
        r.push(...i), this.headers.set(e, r);
        break;
      case "d":
        let o = t.value;
        if (!o) this.headers.delete(e), this.normalizedNames.delete(e);
        else {
          let s = this.headers.get(e);
          if (!s) return;
          (s = s.filter((a) => o.indexOf(a) === -1)),
            s.length === 0
              ? (this.headers.delete(e), this.normalizedNames.delete(e))
              : this.headers.set(e, s);
        }
        break;
    }
  }
  addHeaderEntry(t, e) {
    let i = t.toLowerCase();
    this.maybeSetNormalizedName(t, i),
      this.headers.has(i)
        ? this.headers.get(i).push(e)
        : this.headers.set(i, [e]);
  }
  setHeaderEntries(t, e) {
    let i = (Array.isArray(e) ? e : [e]).map((o) => o.toString()),
      r = t.toLowerCase();
    this.headers.set(r, i), this.maybeSetNormalizedName(t, r);
  }
  forEach(t) {
    this.init(),
      Array.from(this.normalizedNames.keys()).forEach((e) =>
        t(this.normalizedNames.get(e), this.headers.get(e))
      );
  }
};
var Wg = class {
  encodeKey(t) {
    return aC(t);
  }
  encodeValue(t) {
    return aC(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function tk(n, t) {
  let e = new Map();
  return (
    n.length > 0 &&
      n
        .replace(/^\?/, "")
        .split("&")
        .forEach((r) => {
          let o = r.indexOf("="),
            [s, a] =
              o == -1
                ? [t.decodeKey(r), ""]
                : [t.decodeKey(r.slice(0, o)), t.decodeValue(r.slice(o + 1))],
            l = e.get(s) || [];
          l.push(a), e.set(s, l);
        }),
    e
  );
}
var nk = /%(\d[a-f0-9])/gi,
  ik = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function aC(n) {
  return encodeURIComponent(n).replace(nk, (t, e) => ik[e] ?? t);
}
function lu(n) {
  return `${n}`;
}
var _i = class n {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new Wg()), t.fromString)) {
      if (t.fromObject) throw new v(2805, !1);
      this.map = tk(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((e) => {
            let i = t.fromObject[e],
              r = Array.isArray(i) ? i.map(lu) : [lu(i)];
            this.map.set(e, r);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let e = this.map.get(t);
    return e ? e[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, e) {
    return this.clone({ param: t, value: e, op: "a" });
  }
  appendAll(t) {
    let e = [];
    return (
      Object.keys(t).forEach((i) => {
        let r = t[i];
        Array.isArray(r)
          ? r.forEach((o) => {
              e.push({ param: i, value: o, op: "a" });
            })
          : e.push({ param: i, value: r, op: "a" });
      }),
      this.clone(e)
    );
  }
  set(t, e) {
    return this.clone({ param: t, value: e, op: "s" });
  }
  delete(t, e) {
    return this.clone({ param: t, value: e, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let e = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((i) => e + "=" + this.encoder.encodeValue(i))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let e = new n({ encoder: this.encoder });
    return (
      (e.cloneFrom = this.cloneFrom || this),
      (e.updates = (this.updates || []).concat(t)),
      e
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let e = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              e.push(lu(t.value)), this.map.set(t.param, e);
              break;
            case "d":
              if (t.value !== void 0) {
                let i = this.map.get(t.param) || [],
                  r = i.indexOf(lu(t.value));
                r !== -1 && i.splice(r, 1),
                  i.length > 0
                    ? this.map.set(t.param, i)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var qg = class {
  map = new Map();
  set(t, e) {
    return this.map.set(t, e), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function rk(n) {
  switch (n) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function lC(n) {
  return typeof ArrayBuffer < "u" && n instanceof ArrayBuffer;
}
function cC(n) {
  return typeof Blob < "u" && n instanceof Blob;
}
function dC(n) {
  return typeof FormData < "u" && n instanceof FormData;
}
function ok(n) {
  return typeof URLSearchParams < "u" && n instanceof URLSearchParams;
}
var sk = "X-Request-URL",
  uC = "text/plain",
  fC = "application/json",
  c9 = `${fC}, ${uC}, */*`,
  Zo = class n {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    responseType = "json";
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(t, e, i, r) {
      (this.url = e), (this.method = t.toUpperCase());
      let o;
      if (
        (rk(this.method) || r
          ? ((this.body = i !== void 0 ? i : null), (o = r))
          : (o = i),
        o)
      ) {
        if (
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          (this.keepalive = !!o.keepalive),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          o.priority && (this.priority = o.priority),
          o.cache && (this.cache = o.cache),
          o.credentials && (this.credentials = o.credentials),
          typeof o.timeout == "number")
        ) {
          if (o.timeout < 1 || !Number.isInteger(o.timeout))
            throw new Error("");
          this.timeout = o.timeout;
        }
        o.mode && (this.mode = o.mode),
          o.redirect && (this.redirect = o.redirect),
          (this.transferCache = o.transferCache);
      }
      if (
        ((this.headers ??= new Wr()), (this.context ??= new qg()), !this.params)
      )
        (this.params = new _i()), (this.urlWithParams = e);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = e;
        else {
          let a = e.indexOf("?"),
            l = a === -1 ? "?" : a < e.length - 1 ? "&" : "";
          this.urlWithParams = e + l + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          lC(this.body) ||
          cC(this.body) ||
          dC(this.body) ||
          ok(this.body)
        ? this.body
        : this.body instanceof _i
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || dC(this.body)
        ? null
        : cC(this.body)
        ? this.body.type || null
        : lC(this.body)
        ? null
        : typeof this.body == "string"
        ? uC
        : this.body instanceof _i
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? fC
        : null;
    }
    clone(t = {}) {
      let e = t.method || this.method,
        i = t.url || this.url,
        r = t.responseType || this.responseType,
        o = t.keepalive ?? this.keepalive,
        s = t.priority || this.priority,
        a = t.cache || this.cache,
        l = t.mode || this.mode,
        c = t.redirect || this.redirect,
        d = t.credentials || this.credentials,
        u = t.transferCache ?? this.transferCache,
        p = t.timeout ?? this.timeout,
        h = t.body !== void 0 ? t.body : this.body,
        m = t.withCredentials ?? this.withCredentials,
        g = t.reportProgress ?? this.reportProgress,
        w = t.headers || this.headers,
        S = t.params || this.params,
        ae = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (w = Object.keys(t.setHeaders).reduce(
            (he, be) => he.set(be, t.setHeaders[be]),
            w
          )),
        t.setParams &&
          (S = Object.keys(t.setParams).reduce(
            (he, be) => he.set(be, t.setParams[be]),
            S
          )),
        new n(e, i, h, {
          params: S,
          headers: w,
          context: ae,
          reportProgress: g,
          responseType: r,
          withCredentials: m,
          transferCache: u,
          keepalive: o,
          cache: a,
          priority: s,
          timeout: p,
          mode: l,
          redirect: c,
          credentials: d,
        })
      );
    }
  },
  Kg = (function (n) {
    return (
      (n[(n.Sent = 0)] = "Sent"),
      (n[(n.UploadProgress = 1)] = "UploadProgress"),
      (n[(n.ResponseHeader = 2)] = "ResponseHeader"),
      (n[(n.DownloadProgress = 3)] = "DownloadProgress"),
      (n[(n.Response = 4)] = "Response"),
      (n[(n.User = 5)] = "User"),
      n
    );
  })(Kg || {}),
  Yg = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    constructor(t, e = 200, i = "OK") {
      (this.headers = t.headers || new Wr()),
        (this.status = t.status !== void 0 ? t.status : e),
        (this.statusText = t.statusText || i),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var cu = class n extends Yg {
  body;
  constructor(t = {}) {
    super(t), (this.body = t.body !== void 0 ? t.body : null);
  }
  type = Kg.Response;
  clone(t = {}) {
    return new n({
      body: t.body !== void 0 ? t.body : this.body,
      headers: t.headers || this.headers,
      status: t.status !== void 0 ? t.status : this.status,
      statusText: t.statusText || this.statusText,
      url: t.url || this.url || void 0,
    });
  }
};
function $g(n, t) {
  return {
    body: t,
    headers: n.headers,
    context: n.context,
    observe: n.observe,
    params: n.params,
    reportProgress: n.reportProgress,
    responseType: n.responseType,
    withCredentials: n.withCredentials,
    transferCache: n.transferCache,
    keepalive: n.keepalive,
    priority: n.priority,
    cache: n.cache,
    mode: n.mode,
    redirect: n.redirect,
  };
}
var Zg = (() => {
  class n {
    handler;
    constructor(e) {
      this.handler = e;
    }
    request(e, i, r = {}) {
      let o;
      if (e instanceof Zo) o = e;
      else {
        let l;
        r.headers instanceof Wr ? (l = r.headers) : (l = new Wr(r.headers));
        let c;
        r.params &&
          (r.params instanceof _i
            ? (c = r.params)
            : (c = new _i({ fromObject: r.params }))),
          (o = new Zo(e, i, r.body !== void 0 ? r.body : null, {
            headers: l,
            context: r.context,
            params: c,
            reportProgress: r.reportProgress,
            responseType: r.responseType || "json",
            withCredentials: r.withCredentials,
            transferCache: r.transferCache,
            keepalive: r.keepalive,
            priority: r.priority,
            cache: r.cache,
            mode: r.mode,
            redirect: r.redirect,
            credentials: r.credentials,
          }));
      }
      let s = I(o).pipe(Ni((l) => this.handler.handle(l)));
      if (e instanceof Zo || r.observe === "events") return s;
      let a = s.pipe(ve((l) => l instanceof cu));
      switch (r.observe || "body") {
        case "body":
          switch (o.responseType) {
            case "arraybuffer":
              return a.pipe(
                R((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new v(2806, !1);
                  return l.body;
                })
              );
            case "blob":
              return a.pipe(
                R((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new v(2807, !1);
                  return l.body;
                })
              );
            case "text":
              return a.pipe(
                R((l) => {
                  if (l.body !== null && typeof l.body != "string")
                    throw new v(2808, !1);
                  return l.body;
                })
              );
            case "json":
            default:
              return a.pipe(R((l) => l.body));
          }
        case "response":
          return a;
        default:
          throw new v(2809, !1);
      }
    }
    delete(e, i = {}) {
      return this.request("DELETE", e, i);
    }
    get(e, i = {}) {
      return this.request("GET", e, i);
    }
    head(e, i = {}) {
      return this.request("HEAD", e, i);
    }
    jsonp(e, i) {
      return this.request("JSONP", e, {
        params: new _i().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(e, i = {}) {
      return this.request("OPTIONS", e, i);
    }
    patch(e, i, r = {}) {
      return this.request("PATCH", e, $g(r, i));
    }
    post(e, i, r = {}) {
      return this.request("POST", e, $g(r, i));
    }
    put(e, i, r = {}) {
      return this.request("PUT", e, $g(r, i));
    }
    static ɵfac = function (i) {
      return new (i || n)(A(Gg));
    };
    static ɵprov = b({ token: n, factory: n.ɵfac });
  }
  return n;
})();
var d9 = RegExp(`^${sk}:`, "m");
var hC = (() => {
  class n {
    _doc;
    constructor(e) {
      this._doc = e;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(e) {
      this._doc.title = e || "";
    }
    static ɵfac = function (i) {
      return new (i || n)(A(O));
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var Qg = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({
        token: n,
        factory: function (i) {
          let r = null;
          return i ? (r = new (i || n)()) : (r = A(ck)), r;
        },
        providedIn: "root",
      });
    }
    return n;
  })(),
  ck = (() => {
    class n extends Qg {
      _doc;
      constructor(e) {
        super(), (this._doc = e);
      }
      sanitize(e, i) {
        if (i == null) return null;
        switch (e) {
          case Mt.NONE:
            return i;
          case Mt.HTML:
            return zr(i, "HTML") ? fi(i) : Nm(this._doc, String(i)).toString();
          case Mt.STYLE:
            return zr(i, "Style") ? fi(i) : i;
          case Mt.SCRIPT:
            if (zr(i, "Script")) return fi(i);
            throw new v(5200, !1);
          case Mt.URL:
            return zr(i, "URL") ? fi(i) : Sd(String(i));
          case Mt.RESOURCE_URL:
            if (zr(i, "ResourceURL")) return fi(i);
            throw new v(5201, !1);
          default:
            throw new v(5202, !1);
        }
      }
      bypassSecurityTrustHtml(e) {
        return xm(e);
      }
      bypassSecurityTrustStyle(e) {
        return Mm(e);
      }
      bypassSecurityTrustScript(e) {
        return Tm(e);
      }
      bypassSecurityTrustUrl(e) {
        return Rm(e);
      }
      bypassSecurityTrustResourceUrl(e) {
        return Am(e);
      }
      static ɵfac = function (i) {
        return new (i || n)(A(O));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var J = "primary",
  Xa = Symbol("RouteTitle"),
  nv = class {
    params;
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let e = this.params[t];
        return Array.isArray(e) ? e[0] : e;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let e = this.params[t];
        return Array.isArray(e) ? e : [e];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Kr(n) {
  return new nv(n);
}
function EC(n, t, e) {
  let i = e.path.split("/");
  if (
    i.length > n.length ||
    (e.pathMatch === "full" && (t.hasChildren() || i.length < n.length))
  )
    return null;
  let r = {};
  for (let o = 0; o < i.length; o++) {
    let s = i[o],
      a = n[o];
    if (s[0] === ":") r[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: n.slice(0, i.length), posParams: r };
}
function dk(n, t) {
  if (n.length !== t.length) return !1;
  for (let e = 0; e < n.length; ++e) if (!Yn(n[e], t[e])) return !1;
  return !0;
}
function Yn(n, t) {
  let e = n ? iv(n) : void 0,
    i = t ? iv(t) : void 0;
  if (!e || !i || e.length != i.length) return !1;
  let r;
  for (let o = 0; o < e.length; o++)
    if (((r = e[o]), !DC(n[r], t[r]))) return !1;
  return !0;
}
function iv(n) {
  return [...Object.keys(n), ...Object.getOwnPropertySymbols(n)];
}
function DC(n, t) {
  if (Array.isArray(n) && Array.isArray(t)) {
    if (n.length !== t.length) return !1;
    let e = [...n].sort(),
      i = [...t].sort();
    return e.every((r, o) => i[o] === r);
  } else return n === t;
}
function CC(n) {
  return n.length > 0 ? n[n.length - 1] : null;
}
function wi(n) {
  return vc(n) ? n : Ki(n) ? Me(Promise.resolve(n)) : I(n);
}
var uk = { exact: SC, subset: xC },
  IC = { exact: fk, subset: hk, ignored: () => !0 };
function mC(n, t, e) {
  return (
    uk[e.paths](n.root, t.root, e.matrixParams) &&
    IC[e.queryParams](n.queryParams, t.queryParams) &&
    !(e.fragment === "exact" && n.fragment !== t.fragment)
  );
}
function fk(n, t) {
  return Yn(n, t);
}
function SC(n, t, e) {
  if (
    !qr(n.segments, t.segments) ||
    !fu(n.segments, t.segments, e) ||
    n.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let i in t.children)
    if (!n.children[i] || !SC(n.children[i], t.children[i], e)) return !1;
  return !0;
}
function hk(n, t) {
  return (
    Object.keys(t).length <= Object.keys(n).length &&
    Object.keys(t).every((e) => DC(n[e], t[e]))
  );
}
function xC(n, t, e) {
  return MC(n, t, t.segments, e);
}
function MC(n, t, e, i) {
  if (n.segments.length > e.length) {
    let r = n.segments.slice(0, e.length);
    return !(!qr(r, e) || t.hasChildren() || !fu(r, e, i));
  } else if (n.segments.length === e.length) {
    if (!qr(n.segments, e) || !fu(n.segments, e, i)) return !1;
    for (let r in t.children)
      if (!n.children[r] || !xC(n.children[r], t.children[r], i)) return !1;
    return !0;
  } else {
    let r = e.slice(0, n.segments.length),
      o = e.slice(n.segments.length);
    return !qr(n.segments, r) || !fu(n.segments, r, i) || !n.children[J]
      ? !1
      : MC(n.children[J], t, o, i);
  }
}
function fu(n, t, e) {
  return t.every((i, r) => IC[e](n[r].parameters, i.parameters));
}
var Zn = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(t = new pe([], {}), e = {}, i = null) {
      (this.root = t), (this.queryParams = e), (this.fragment = i);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Kr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return gk.serialize(this);
    }
  },
  pe = class {
    segments;
    children;
    parent = null;
    constructor(t, e) {
      (this.segments = t),
        (this.children = e),
        Object.values(e).forEach((i) => (i.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return hu(this);
    }
  },
  Ji = class {
    path;
    parameters;
    _parameterMap;
    constructor(t, e) {
      (this.path = t), (this.parameters = e);
    }
    get parameterMap() {
      return (this._parameterMap ??= Kr(this.parameters)), this._parameterMap;
    }
    toString() {
      return RC(this);
    }
  };
function pk(n, t) {
  return qr(n, t) && n.every((e, i) => Yn(e.parameters, t[i].parameters));
}
function qr(n, t) {
  return n.length !== t.length ? !1 : n.every((e, i) => e.path === t[i].path);
}
function mk(n, t) {
  let e = [];
  return (
    Object.entries(n.children).forEach(([i, r]) => {
      i === J && (e = e.concat(t(r, i)));
    }),
    Object.entries(n.children).forEach(([i, r]) => {
      i !== J && (e = e.concat(t(r, i)));
    }),
    e
  );
}
var Ja = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({
        token: n,
        factory: () => new Zr(),
        providedIn: "root",
      });
    }
    return n;
  })(),
  Zr = class {
    parse(t) {
      let e = new ov(t);
      return new Zn(
        e.parseRootSegment(),
        e.parseQueryParams(),
        e.parseFragment()
      );
    }
    serialize(t) {
      let e = `/${Va(t.root, !0)}`,
        i = yk(t.queryParams),
        r = typeof t.fragment == "string" ? `#${vk(t.fragment)}` : "";
      return `${e}${i}${r}`;
    }
  },
  gk = new Zr();
function hu(n) {
  return n.segments.map((t) => RC(t)).join("/");
}
function Va(n, t) {
  if (!n.hasChildren()) return hu(n);
  if (t) {
    let e = n.children[J] ? Va(n.children[J], !1) : "",
      i = [];
    return (
      Object.entries(n.children).forEach(([r, o]) => {
        r !== J && i.push(`${r}:${Va(o, !1)}`);
      }),
      i.length > 0 ? `${e}(${i.join("//")})` : e
    );
  } else {
    let e = mk(n, (i, r) =>
      r === J ? [Va(n.children[J], !1)] : [`${r}:${Va(i, !1)}`]
    );
    return Object.keys(n.children).length === 1 && n.children[J] != null
      ? `${hu(n)}/${e[0]}`
      : `${hu(n)}/(${e.join("//")})`;
  }
}
function TC(n) {
  return encodeURIComponent(n)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function du(n) {
  return TC(n).replace(/%3B/gi, ";");
}
function vk(n) {
  return encodeURI(n);
}
function rv(n) {
  return TC(n)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function pu(n) {
  return decodeURIComponent(n);
}
function gC(n) {
  return pu(n.replace(/\+/g, "%20"));
}
function RC(n) {
  return `${rv(n.path)}${_k(n.parameters)}`;
}
function _k(n) {
  return Object.entries(n)
    .map(([t, e]) => `;${rv(t)}=${rv(e)}`)
    .join("");
}
function yk(n) {
  let t = Object.entries(n)
    .map(([e, i]) =>
      Array.isArray(i)
        ? i.map((r) => `${du(e)}=${du(r)}`).join("&")
        : `${du(e)}=${du(i)}`
    )
    .filter((e) => e);
  return t.length ? `?${t.join("&")}` : "";
}
var bk = /^[^\/()?;#]+/;
function Xg(n) {
  let t = n.match(bk);
  return t ? t[0] : "";
}
var wk = /^[^\/()?;=#]+/;
function Ek(n) {
  let t = n.match(wk);
  return t ? t[0] : "";
}
var Dk = /^[^=?&#]+/;
function Ck(n) {
  let t = n.match(Dk);
  return t ? t[0] : "";
}
var Ik = /^[^&#]+/;
function Sk(n) {
  let t = n.match(Ik);
  return t ? t[0] : "";
}
var ov = class {
  url;
  remaining;
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new pe([], {})
        : new pe([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let e = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (e = this.parseParens(!0)));
    let i = {};
    return (
      this.peekStartsWith("(") && (i = this.parseParens(!1)),
      (t.length > 0 || Object.keys(e).length > 0) && (i[J] = new pe(t, e)),
      i
    );
  }
  parseSegment() {
    let t = Xg(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(t), new Ji(pu(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let e = Ek(this.remaining);
    if (!e) return;
    this.capture(e);
    let i = "";
    if (this.consumeOptional("=")) {
      let r = Xg(this.remaining);
      r && ((i = r), this.capture(i));
    }
    t[pu(e)] = pu(i);
  }
  parseQueryParam(t) {
    let e = Ck(this.remaining);
    if (!e) return;
    this.capture(e);
    let i = "";
    if (this.consumeOptional("=")) {
      let s = Sk(this.remaining);
      s && ((i = s), this.capture(i));
    }
    let r = gC(e),
      o = gC(i);
    if (t.hasOwnProperty(r)) {
      let s = t[r];
      Array.isArray(s) || ((s = [s]), (t[r] = s)), s.push(o);
    } else t[r] = o;
  }
  parseParens(t) {
    let e = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let i = Xg(this.remaining),
        r = this.remaining[i.length];
      if (r !== "/" && r !== ")" && r !== ";") throw new v(4010, !1);
      let o;
      i.indexOf(":") > -1
        ? ((o = i.slice(0, i.indexOf(":"))), this.capture(o), this.capture(":"))
        : t && (o = J);
      let s = this.parseChildren();
      (e[o] = Object.keys(s).length === 1 ? s[J] : new pe([], s)),
        this.consumeOptional("//");
    }
    return e;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new v(4011, !1);
  }
};
function AC(n) {
  return n.segments.length > 0 ? new pe([], { [J]: n }) : n;
}
function NC(n) {
  let t = {};
  for (let [i, r] of Object.entries(n.children)) {
    let o = NC(r);
    if (i === J && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) t[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (t[i] = o);
  }
  let e = new pe(n.segments, t);
  return xk(e);
}
function xk(n) {
  if (n.numberOfChildren === 1 && n.children[J]) {
    let t = n.children[J];
    return new pe(n.segments.concat(t.segments), t.children);
  }
  return n;
}
function ts(n) {
  return n instanceof Zn;
}
function OC(n, t, e = null, i = null) {
  let r = kC(n);
  return PC(r, t, e, i);
}
function kC(n) {
  let t;
  function e(o) {
    let s = {};
    for (let l of o.children) {
      let c = e(l);
      s[l.outlet] = c;
    }
    let a = new pe(o.url, s);
    return o === n && (t = a), a;
  }
  let i = e(n.root),
    r = AC(i);
  return t ?? r;
}
function PC(n, t, e, i) {
  let r = n;
  for (; r.parent; ) r = r.parent;
  if (t.length === 0) return Jg(r, r, r, e, i);
  let o = Mk(t);
  if (o.toRoot()) return Jg(r, r, new pe([], {}), e, i);
  let s = Tk(o, r, n),
    a = s.processChildren
      ? Ba(s.segmentGroup, s.index, o.commands)
      : LC(s.segmentGroup, s.index, o.commands);
  return Jg(r, s.segmentGroup, a, e, i);
}
function mu(n) {
  return typeof n == "object" && n != null && !n.outlets && !n.segmentPath;
}
function za(n) {
  return typeof n == "object" && n != null && n.outlets;
}
function Jg(n, t, e, i, r) {
  let o = {};
  i &&
    Object.entries(i).forEach(([l, c]) => {
      o[l] = Array.isArray(c) ? c.map((d) => `${d}`) : `${c}`;
    });
  let s;
  n === t ? (s = e) : (s = FC(n, t, e));
  let a = AC(NC(s));
  return new Zn(a, o, r);
}
function FC(n, t, e) {
  let i = {};
  return (
    Object.entries(n.children).forEach(([r, o]) => {
      o === t ? (i[r] = e) : (i[r] = FC(o, t, e));
    }),
    new pe(n.segments, i)
  );
}
var gu = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(t, e, i) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = e),
      (this.commands = i),
      t && i.length > 0 && mu(i[0]))
    )
      throw new v(4003, !1);
    let r = i.find(za);
    if (r && r !== CC(i)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function Mk(n) {
  if (typeof n[0] == "string" && n.length === 1 && n[0] === "/")
    return new gu(!0, 0, n);
  let t = 0,
    e = !1,
    i = n.reduce((r, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([l, c]) => {
              a[l] = typeof c == "string" ? c.split("/") : c;
            }),
            [...r, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...r, o.segmentPath];
      }
      return typeof o != "string"
        ? [...r, o]
        : s === 0
        ? (o.split("/").forEach((a, l) => {
            (l == 0 && a === ".") ||
              (l == 0 && a === ""
                ? (e = !0)
                : a === ".."
                ? t++
                : a != "" && r.push(a));
          }),
          r)
        : [...r, o];
    }, []);
  return new gu(e, t, i);
}
var Jo = class {
  segmentGroup;
  processChildren;
  index;
  constructor(t, e, i) {
    (this.segmentGroup = t), (this.processChildren = e), (this.index = i);
  }
};
function Tk(n, t, e) {
  if (n.isAbsolute) return new Jo(t, !0, 0);
  if (!e) return new Jo(t, !1, NaN);
  if (e.parent === null) return new Jo(e, !0, 0);
  let i = mu(n.commands[0]) ? 0 : 1,
    r = e.segments.length - 1 + i;
  return Rk(e, r, n.numberOfDoubleDots);
}
function Rk(n, t, e) {
  let i = n,
    r = t,
    o = e;
  for (; o > r; ) {
    if (((o -= r), (i = i.parent), !i)) throw new v(4005, !1);
    r = i.segments.length;
  }
  return new Jo(i, !1, r - o);
}
function Ak(n) {
  return za(n[0]) ? n[0].outlets : { [J]: n };
}
function LC(n, t, e) {
  if (((n ??= new pe([], {})), n.segments.length === 0 && n.hasChildren()))
    return Ba(n, t, e);
  let i = Nk(n, t, e),
    r = e.slice(i.commandIndex);
  if (i.match && i.pathIndex < n.segments.length) {
    let o = new pe(n.segments.slice(0, i.pathIndex), {});
    return (
      (o.children[J] = new pe(n.segments.slice(i.pathIndex), n.children)),
      Ba(o, 0, r)
    );
  } else
    return i.match && r.length === 0
      ? new pe(n.segments, {})
      : i.match && !n.hasChildren()
      ? sv(n, t, e)
      : i.match
      ? Ba(n, 0, r)
      : sv(n, t, e);
}
function Ba(n, t, e) {
  if (e.length === 0) return new pe(n.segments, {});
  {
    let i = Ak(e),
      r = {};
    if (
      Object.keys(i).some((o) => o !== J) &&
      n.children[J] &&
      n.numberOfChildren === 1 &&
      n.children[J].segments.length === 0
    ) {
      let o = Ba(n.children[J], t, e);
      return new pe(n.segments, o.children);
    }
    return (
      Object.entries(i).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (r[o] = LC(n.children[o], t, s));
      }),
      Object.entries(n.children).forEach(([o, s]) => {
        i[o] === void 0 && (r[o] = s);
      }),
      new pe(n.segments, r)
    );
  }
}
function Nk(n, t, e) {
  let i = 0,
    r = t,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; r < n.segments.length; ) {
    if (i >= e.length) return o;
    let s = n.segments[r],
      a = e[i];
    if (za(a)) break;
    let l = `${a}`,
      c = i < e.length - 1 ? e[i + 1] : null;
    if (r > 0 && l === void 0) break;
    if (l && c && typeof c == "object" && c.outlets === void 0) {
      if (!_C(l, c, s)) return o;
      i += 2;
    } else {
      if (!_C(l, {}, s)) return o;
      i++;
    }
    r++;
  }
  return { match: !0, pathIndex: r, commandIndex: i };
}
function sv(n, t, e) {
  let i = n.segments.slice(0, t),
    r = 0;
  for (; r < e.length; ) {
    let o = e[r];
    if (za(o)) {
      let l = Ok(o.outlets);
      return new pe(i, l);
    }
    if (r === 0 && mu(e[0])) {
      let l = n.segments[t];
      i.push(new Ji(l.path, vC(e[0]))), r++;
      continue;
    }
    let s = za(o) ? o.outlets[J] : `${o}`,
      a = r < e.length - 1 ? e[r + 1] : null;
    s && a && mu(a)
      ? (i.push(new Ji(s, vC(a))), (r += 2))
      : (i.push(new Ji(s, {})), r++);
  }
  return new pe(i, {});
}
function Ok(n) {
  let t = {};
  return (
    Object.entries(n).forEach(([e, i]) => {
      typeof i == "string" && (i = [i]),
        i !== null && (t[e] = sv(new pe([], {}), 0, i));
    }),
    t
  );
}
function vC(n) {
  let t = {};
  return Object.entries(n).forEach(([e, i]) => (t[e] = `${i}`)), t;
}
function _C(n, t, e) {
  return n == e.path && Yn(t, e.parameters);
}
var Ha = "imperative",
  ct = (function (n) {
    return (
      (n[(n.NavigationStart = 0)] = "NavigationStart"),
      (n[(n.NavigationEnd = 1)] = "NavigationEnd"),
      (n[(n.NavigationCancel = 2)] = "NavigationCancel"),
      (n[(n.NavigationError = 3)] = "NavigationError"),
      (n[(n.RoutesRecognized = 4)] = "RoutesRecognized"),
      (n[(n.ResolveStart = 5)] = "ResolveStart"),
      (n[(n.ResolveEnd = 6)] = "ResolveEnd"),
      (n[(n.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (n[(n.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (n[(n.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (n[(n.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (n[(n.ChildActivationStart = 11)] = "ChildActivationStart"),
      (n[(n.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (n[(n.ActivationStart = 13)] = "ActivationStart"),
      (n[(n.ActivationEnd = 14)] = "ActivationEnd"),
      (n[(n.Scroll = 15)] = "Scroll"),
      (n[(n.NavigationSkipped = 16)] = "NavigationSkipped"),
      n
    );
  })(ct || {}),
  Xt = class {
    id;
    url;
    constructor(t, e) {
      (this.id = t), (this.url = e);
    }
  },
  Qr = class extends Xt {
    type = ct.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(t, e, i = "imperative", r = null) {
      super(t, e), (this.navigationTrigger = i), (this.restoredState = r);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  yi = class extends Xt {
    urlAfterRedirects;
    type = ct.NavigationEnd;
    constructor(t, e, i) {
      super(t, e), (this.urlAfterRedirects = i);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Rt = (function (n) {
    return (
      (n[(n.Redirect = 0)] = "Redirect"),
      (n[(n.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (n[(n.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (n[(n.GuardRejected = 3)] = "GuardRejected"),
      (n[(n.Aborted = 4)] = "Aborted"),
      n
    );
  })(Rt || {}),
  $a = (function (n) {
    return (
      (n[(n.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (n[(n.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      n
    );
  })($a || {}),
  Kn = class extends Xt {
    reason;
    code;
    type = ct.NavigationCancel;
    constructor(t, e, i, r) {
      super(t, e), (this.reason = i), (this.code = r);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  bi = class extends Xt {
    reason;
    code;
    type = ct.NavigationSkipped;
    constructor(t, e, i, r) {
      super(t, e), (this.reason = i), (this.code = r);
    }
  },
  ns = class extends Xt {
    error;
    target;
    type = ct.NavigationError;
    constructor(t, e, i, r) {
      super(t, e), (this.error = i), (this.target = r);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ga = class extends Xt {
    urlAfterRedirects;
    state;
    type = ct.RoutesRecognized;
    constructor(t, e, i, r) {
      super(t, e), (this.urlAfterRedirects = i), (this.state = r);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  vu = class extends Xt {
    urlAfterRedirects;
    state;
    type = ct.GuardsCheckStart;
    constructor(t, e, i, r) {
      super(t, e), (this.urlAfterRedirects = i), (this.state = r);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  _u = class extends Xt {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = ct.GuardsCheckEnd;
    constructor(t, e, i, r, o) {
      super(t, e),
        (this.urlAfterRedirects = i),
        (this.state = r),
        (this.shouldActivate = o);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  yu = class extends Xt {
    urlAfterRedirects;
    state;
    type = ct.ResolveStart;
    constructor(t, e, i, r) {
      super(t, e), (this.urlAfterRedirects = i), (this.state = r);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  bu = class extends Xt {
    urlAfterRedirects;
    state;
    type = ct.ResolveEnd;
    constructor(t, e, i, r) {
      super(t, e), (this.urlAfterRedirects = i), (this.state = r);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  wu = class {
    route;
    type = ct.RouteConfigLoadStart;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Eu = class {
    route;
    type = ct.RouteConfigLoadEnd;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Du = class {
    snapshot;
    type = ct.ChildActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Cu = class {
    snapshot;
    type = ct.ChildActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Iu = class {
    snapshot;
    type = ct.ActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Su = class {
    snapshot;
    type = ct.ActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Wa = class {},
  is = class {
    url;
    navigationBehaviorOptions;
    constructor(t, e) {
      (this.url = t), (this.navigationBehaviorOptions = e);
    }
  };
function kk(n) {
  return !(n instanceof Wa) && !(n instanceof is);
}
function Pk(n, t) {
  return (
    n.providers &&
      !n._injector &&
      (n._injector = _a(n.providers, t, `Route: ${n.path}`)),
    n._injector ?? t
  );
}
function Mn(n) {
  return n.outlet || J;
}
function Fk(n, t) {
  let e = n.filter((i) => Mn(i) === t);
  return e.push(...n.filter((i) => Mn(i) !== t)), e;
}
function ss(n) {
  if (!n) return null;
  if (n.routeConfig?._injector) return n.routeConfig._injector;
  for (let t = n.parent; t; t = t.parent) {
    let e = t.routeConfig;
    if (e?._loadedInjector) return e._loadedInjector;
    if (e?._injector) return e._injector;
  }
  return null;
}
var xu = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return ss(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(t) {
      (this.rootInjector = t), (this.children = new as(this.rootInjector));
    }
  },
  as = (() => {
    class n {
      rootInjector;
      contexts = new Map();
      constructor(e) {
        this.rootInjector = e;
      }
      onChildOutletCreated(e, i) {
        let r = this.getOrCreateContext(e);
        (r.outlet = i), this.contexts.set(e, r);
      }
      onChildOutletDestroyed(e) {
        let i = this.getContext(e);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let e = this.contexts;
        return (this.contexts = new Map()), e;
      }
      onOutletReAttached(e) {
        this.contexts = e;
      }
      getOrCreateContext(e) {
        let i = this.getContext(e);
        return (
          i || ((i = new xu(this.rootInjector)), this.contexts.set(e, i)), i
        );
      }
      getContext(e) {
        return this.contexts.get(e) || null;
      }
      static ɵfac = function (i) {
        return new (i || n)(A(Re));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  Mu = class {
    _root;
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let e = this.pathFromRoot(t);
      return e.length > 1 ? e[e.length - 2] : null;
    }
    children(t) {
      let e = av(t, this._root);
      return e ? e.children.map((i) => i.value) : [];
    }
    firstChild(t) {
      let e = av(t, this._root);
      return e && e.children.length > 0 ? e.children[0].value : null;
    }
    siblings(t) {
      let e = lv(t, this._root);
      return e.length < 2
        ? []
        : e[e.length - 2].children.map((r) => r.value).filter((r) => r !== t);
    }
    pathFromRoot(t) {
      return lv(t, this._root).map((e) => e.value);
    }
  };
function av(n, t) {
  if (n === t.value) return t;
  for (let e of t.children) {
    let i = av(n, e);
    if (i) return i;
  }
  return null;
}
function lv(n, t) {
  if (n === t.value) return [t];
  for (let e of t.children) {
    let i = lv(n, e);
    if (i.length) return i.unshift(t), i;
  }
  return [];
}
var Qt = class {
  value;
  children;
  constructor(t, e) {
    (this.value = t), (this.children = e);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Xo(n) {
  let t = {};
  return n && n.children.forEach((e) => (t[e.value.outlet] = e)), t;
}
var qa = class extends Mu {
  snapshot;
  constructor(t, e) {
    super(t), (this.snapshot = e), gv(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function VC(n) {
  let t = Lk(n),
    e = new je([new Ji("", {})]),
    i = new je({}),
    r = new je({}),
    o = new je({}),
    s = new je(""),
    a = new er(e, i, o, s, r, J, n, t.root);
  return (a.snapshot = t.root), new qa(new Qt(a, []), t);
}
function Lk(n) {
  let t = {},
    e = {},
    i = {},
    r = "",
    o = new Yr([], t, i, r, e, J, n, null, {});
  return new Ya("", new Qt(o, []));
}
var er = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(t, e, i, r, o, s, a, l) {
    (this.urlSubject = t),
      (this.paramsSubject = e),
      (this.queryParamsSubject = i),
      (this.fragmentSubject = r),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(R((c) => c[Xa])) ?? I(void 0)),
      (this.url = t),
      (this.params = e),
      (this.queryParams = i),
      (this.fragment = r),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(R((t) => Kr(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(R((t) => Kr(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Tu(n, t, e = "emptyOnly") {
  let i,
    { routeConfig: r } = n;
  return (
    t !== null &&
    (e === "always" ||
      r?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (i = {
          params: _(_({}, t.params), n.params),
          data: _(_({}, t.data), n.data),
          resolve: _(_(_(_({}, n.data), t.data), r?.data), n._resolvedData),
        })
      : (i = {
          params: _({}, n.params),
          data: _({}, n.data),
          resolve: _(_({}, n.data), n._resolvedData ?? {}),
        }),
    r && BC(r) && (i.resolve[Xa] = r.title),
    i
  );
}
var Yr = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    get title() {
      return this.data?.[Xa];
    }
    constructor(t, e, i, r, o, s, a, l, c) {
      (this.url = t),
        (this.params = e),
        (this.queryParams = i),
        (this.fragment = r),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Kr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Kr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((i) => i.toString()).join("/"),
        e = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${e}')`;
    }
  },
  Ya = class extends Mu {
    url;
    constructor(t, e) {
      super(e), (this.url = t), gv(this, e);
    }
    toString() {
      return jC(this._root);
    }
  };
function gv(n, t) {
  (t.value._routerState = n), t.children.forEach((e) => gv(n, e));
}
function jC(n) {
  let t = n.children.length > 0 ? ` { ${n.children.map(jC).join(", ")} } ` : "";
  return `${n.value}${t}`;
}
function ev(n) {
  if (n.snapshot) {
    let t = n.snapshot,
      e = n._futureSnapshot;
    (n.snapshot = e),
      Yn(t.queryParams, e.queryParams) ||
        n.queryParamsSubject.next(e.queryParams),
      t.fragment !== e.fragment && n.fragmentSubject.next(e.fragment),
      Yn(t.params, e.params) || n.paramsSubject.next(e.params),
      dk(t.url, e.url) || n.urlSubject.next(e.url),
      Yn(t.data, e.data) || n.dataSubject.next(e.data);
  } else
    (n.snapshot = n._futureSnapshot),
      n.dataSubject.next(n._futureSnapshot.data);
}
function cv(n, t) {
  let e = Yn(n.params, t.params) && pk(n.url, t.url),
    i = !n.parent != !t.parent;
  return e && !i && (!n.parent || cv(n.parent, t.parent));
}
function BC(n) {
  return typeof n.title == "string" || n.title === null;
}
var HC = new y(""),
  el = (() => {
    class n {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = J;
      activateEvents = new j();
      deactivateEvents = new j();
      attachEvents = new j();
      detachEvents = new j();
      routerOutletData = DD(void 0);
      parentContexts = f(as);
      location = f(mt);
      changeDetector = f(lt);
      inputBinder = f(Ou, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(e) {
        if (e.name) {
          let { firstChange: i, previousValue: r } = e.name;
          if (i) return;
          this.isTrackedInParentContexts(r) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(r)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(e) {
        return this.parentContexts.getContext(e)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let e = this.parentContexts.getContext(this.name);
        e?.route &&
          (e.attachRef
            ? this.attach(e.attachRef, e.route)
            : this.activateWith(e.route, e.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let e = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(e.instance),
          e
        );
      }
      attach(e, i) {
        (this.activated = e),
          (this._activatedRoute = i),
          this.location.insert(e.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(e.instance);
      }
      deactivate() {
        if (this.activated) {
          let e = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(e);
        }
      }
      activateWith(e, i) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = e;
        let r = this.location,
          s = e.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          l = new dv(e, a, r.injector, this.routerOutletData);
        (this.activated = r.createComponent(s, {
          index: r.length,
          injector: l,
          environmentInjector: i,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["router-outlet"]],
        inputs: { name: "name", routerOutletData: [1, "routerOutletData"] },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        features: [wt],
      });
    }
    return n;
  })(),
  dv = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(t, e, i, r) {
      (this.route = t),
        (this.childContexts = e),
        (this.parent = i),
        (this.outletData = r);
    }
    get(t, e) {
      return t === er
        ? this.route
        : t === as
        ? this.childContexts
        : t === HC
        ? this.outletData
        : this.parent.get(t, e);
    }
  },
  Ou = new y("");
var vv = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵcmp = Z({
      type: n,
      selectors: [["ng-component"]],
      exportAs: ["emptyRouterOutlet"],
      decls: 1,
      vars: 0,
      template: function (i, r) {
        i & 1 && Le(0, "router-outlet");
      },
      dependencies: [el],
      encapsulation: 2,
    });
  }
  return n;
})();
function _v(n) {
  let t = n.children && n.children.map(_v),
    e = t ? B(_({}, n), { children: t }) : _({}, n);
  return (
    !e.component &&
      !e.loadComponent &&
      (t || e.loadChildren) &&
      e.outlet &&
      e.outlet !== J &&
      (e.component = vv),
    e
  );
}
function Vk(n, t, e) {
  let i = Ka(n, t._root, e ? e._root : void 0);
  return new qa(i, t);
}
function Ka(n, t, e) {
  if (e && n.shouldReuseRoute(t.value, e.value.snapshot)) {
    let i = e.value;
    i._futureSnapshot = t.value;
    let r = jk(n, t, e);
    return new Qt(i, r);
  } else {
    if (n.shouldAttach(t.value)) {
      let o = n.retrieve(t.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Ka(n, a))),
          s
        );
      }
    }
    let i = Bk(t.value),
      r = t.children.map((o) => Ka(n, o));
    return new Qt(i, r);
  }
}
function jk(n, t, e) {
  return t.children.map((i) => {
    for (let r of e.children)
      if (n.shouldReuseRoute(i.value, r.value.snapshot)) return Ka(n, i, r);
    return Ka(n, i);
  });
}
function Bk(n) {
  return new er(
    new je(n.url),
    new je(n.params),
    new je(n.queryParams),
    new je(n.fragment),
    new je(n.data),
    n.outlet,
    n.component,
    n
  );
}
var rs = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(t, e) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = e);
    }
  },
  UC = "ngNavigationCancelingError";
function Ru(n, t) {
  let { redirectTo: e, navigationBehaviorOptions: i } = ts(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    r = zC(!1, Rt.Redirect);
  return (r.url = e), (r.navigationBehaviorOptions = i), r;
}
function zC(n, t) {
  let e = new Error(`NavigationCancelingError: ${n || ""}`);
  return (e[UC] = !0), (e.cancellationCode = t), e;
}
function Hk(n) {
  return $C(n) && ts(n.url);
}
function $C(n) {
  return !!n && n[UC];
}
var Uk = (n, t, e, i) =>
    R(
      (r) => (
        new uv(t, r.targetRouterState, r.currentRouterState, e, i).activate(n),
        r
      )
    ),
  uv = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(t, e, i, r, o) {
      (this.routeReuseStrategy = t),
        (this.futureState = e),
        (this.currState = i),
        (this.forwardEvent = r),
        (this.inputBindingEnabled = o);
    }
    activate(t) {
      let e = this.futureState._root,
        i = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(e, i, t),
        ev(this.futureState.root),
        this.activateChildRoutes(e, i, t);
    }
    deactivateChildRoutes(t, e, i) {
      let r = Xo(e);
      t.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, r[s], i), delete r[s];
      }),
        Object.values(r).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, i);
        });
    }
    deactivateRoutes(t, e, i) {
      let r = t.value,
        o = e ? e.value : null;
      if (r === o)
        if (r.component) {
          let s = i.getContext(r.outlet);
          s && this.deactivateChildRoutes(t, e, s.children);
        } else this.deactivateChildRoutes(t, e, i);
      else o && this.deactivateRouteAndItsChildren(e, i);
    }
    deactivateRouteAndItsChildren(t, e) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, e)
        : this.deactivateRouteAndOutlet(t, e);
    }
    detachAndStoreRouteSubtree(t, e) {
      let i = e.getContext(t.value.outlet),
        r = i && t.value.component ? i.children : e,
        o = Xo(t);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
      if (i && i.outlet) {
        let s = i.outlet.detach(),
          a = i.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, e) {
      let i = e.getContext(t.value.outlet),
        r = i && t.value.component ? i.children : e,
        o = Xo(t);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
      i &&
        (i.outlet && (i.outlet.deactivate(), i.children.onOutletDeactivated()),
        (i.attachRef = null),
        (i.route = null));
    }
    activateChildRoutes(t, e, i) {
      let r = Xo(e);
      t.children.forEach((o) => {
        this.activateRoutes(o, r[o.value.outlet], i),
          this.forwardEvent(new Su(o.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new Cu(t.value.snapshot));
    }
    activateRoutes(t, e, i) {
      let r = t.value,
        o = e ? e.value : null;
      if ((ev(r), r === o))
        if (r.component) {
          let s = i.getOrCreateContext(r.outlet);
          this.activateChildRoutes(t, e, s.children);
        } else this.activateChildRoutes(t, e, i);
      else if (r.component) {
        let s = i.getOrCreateContext(r.outlet);
        if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(r.snapshot);
          this.routeReuseStrategy.store(r.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            ev(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = r),
            s.outlet && s.outlet.activateWith(r, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, i);
    }
  },
  Au = class {
    path;
    route;
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  es = class {
    component;
    route;
    constructor(t, e) {
      (this.component = t), (this.route = e);
    }
  };
function zk(n, t, e) {
  let i = n._root,
    r = t ? t._root : null;
  return ja(i, r, e, [i.value]);
}
function $k(n) {
  let t = n.routeConfig ? n.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: n, guards: t };
}
function ls(n, t) {
  let e = Symbol(),
    i = t.get(n, e);
  return i === e ? (typeof n == "function" && !Bh(n) ? n : t.get(n)) : i;
}
function ja(
  n,
  t,
  e,
  i,
  r = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = Xo(t);
  return (
    n.children.forEach((s) => {
      Gk(s, o[s.value.outlet], e, i.concat([s.value]), r),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Ua(a, e.getContext(s), r)),
    r
  );
}
function Gk(
  n,
  t,
  e,
  i,
  r = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = n.value,
    s = t ? t.value : null,
    a = e ? e.getContext(n.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let l = Wk(s, o, o.routeConfig.runGuardsAndResolvers);
    l
      ? r.canActivateChecks.push(new Au(i))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? ja(n, t, a ? a.children : null, i, r) : ja(n, t, e, i, r),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        r.canDeactivateChecks.push(new es(a.outlet.component, s));
  } else
    s && Ua(t, a, r),
      r.canActivateChecks.push(new Au(i)),
      o.component
        ? ja(n, null, a ? a.children : null, i, r)
        : ja(n, null, e, i, r);
  return r;
}
function Wk(n, t, e) {
  if (typeof e == "function") return e(n, t);
  switch (e) {
    case "pathParamsChange":
      return !qr(n.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !qr(n.url, t.url) || !Yn(n.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !cv(n, t) || !Yn(n.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !cv(n, t);
  }
}
function Ua(n, t, e) {
  let i = Xo(n),
    r = n.value;
  Object.entries(i).forEach(([o, s]) => {
    r.component
      ? t
        ? Ua(s, t.children.getContext(o), e)
        : Ua(s, null, e)
      : Ua(s, t, e);
  }),
    r.component
      ? t && t.outlet && t.outlet.isActivated
        ? e.canDeactivateChecks.push(new es(t.outlet.component, r))
        : e.canDeactivateChecks.push(new es(null, r))
      : e.canDeactivateChecks.push(new es(null, r));
}
function tl(n) {
  return typeof n == "function";
}
function qk(n) {
  return typeof n == "boolean";
}
function Yk(n) {
  return n && tl(n.canLoad);
}
function Kk(n) {
  return n && tl(n.canActivate);
}
function Zk(n) {
  return n && tl(n.canActivateChild);
}
function Qk(n) {
  return n && tl(n.canDeactivate);
}
function Xk(n) {
  return n && tl(n.canMatch);
}
function GC(n) {
  return n instanceof ti || n?.name === "EmptyError";
}
var uu = Symbol("INITIAL_VALUE");
function os() {
  return Be((n) =>
    Io(n.map((t) => t.pipe(dt(1), Xe(uu)))).pipe(
      R((t) => {
        for (let e of t)
          if (e !== !0) {
            if (e === uu) return uu;
            if (e === !1 || Jk(e)) return e;
          }
        return !0;
      }),
      ve((t) => t !== uu),
      dt(1)
    )
  );
}
function Jk(n) {
  return ts(n) || n instanceof rs;
}
function eP(n, t) {
  return Qe((e) => {
    let {
      targetSnapshot: i,
      currentSnapshot: r,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = e;
    return s.length === 0 && o.length === 0
      ? I(B(_({}, e), { guardsResult: !0 }))
      : tP(s, i, r, n).pipe(
          Qe((a) => (a && qk(a) ? nP(i, o, n, t) : I(a))),
          R((a) => B(_({}, e), { guardsResult: a }))
        );
  });
}
function tP(n, t, e, i) {
  return Me(n).pipe(
    Qe((r) => aP(r.component, r.route, e, t, i)),
    ni((r) => r !== !0, !0)
  );
}
function nP(n, t, e, i) {
  return Me(t).pipe(
    Ni((r) =>
      Ai(
        rP(r.route.parent, i),
        iP(r.route, i),
        sP(n, r.path, e),
        oP(n, r.route, e)
      )
    ),
    ni((r) => r !== !0, !0)
  );
}
function iP(n, t) {
  return n !== null && t && t(new Iu(n)), I(!0);
}
function rP(n, t) {
  return n !== null && t && t(new Du(n)), I(!0);
}
function oP(n, t, e) {
  let i = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!i || i.length === 0) return I(!0);
  let r = i.map((o) =>
    Bs(() => {
      let s = ss(t) ?? e,
        a = ls(o, s),
        l = Kk(a) ? a.canActivate(t, n) : yt(s, () => a(t, n));
      return wi(l).pipe(ni());
    })
  );
  return I(r).pipe(os());
}
function sP(n, t, e) {
  let i = t[t.length - 1],
    o = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => $k(s))
      .filter((s) => s !== null)
      .map((s) =>
        Bs(() => {
          let a = s.guards.map((l) => {
            let c = ss(s.node) ?? e,
              d = ls(l, c),
              u = Zk(d) ? d.canActivateChild(i, n) : yt(c, () => d(i, n));
            return wi(u).pipe(ni());
          });
          return I(a).pipe(os());
        })
      );
  return I(o).pipe(os());
}
function aP(n, t, e, i, r) {
  let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return I(!0);
  let s = o.map((a) => {
    let l = ss(t) ?? r,
      c = ls(a, l),
      d = Qk(c) ? c.canDeactivate(n, t, e, i) : yt(l, () => c(n, t, e, i));
    return wi(d).pipe(ni());
  });
  return I(s).pipe(os());
}
function lP(n, t, e, i) {
  let r = t.canLoad;
  if (r === void 0 || r.length === 0) return I(!0);
  let o = r.map((s) => {
    let a = ls(s, n),
      l = Yk(a) ? a.canLoad(t, e) : yt(n, () => a(t, e));
    return wi(l);
  });
  return I(o).pipe(os(), WC(i));
}
function WC(n) {
  return yh(
    we((t) => {
      if (typeof t != "boolean") throw Ru(n, t);
    }),
    R((t) => t === !0)
  );
}
function cP(n, t, e, i) {
  let r = t.canMatch;
  if (!r || r.length === 0) return I(!0);
  let o = r.map((s) => {
    let a = ls(s, n),
      l = Xk(a) ? a.canMatch(t, e) : yt(n, () => a(t, e));
    return wi(l);
  });
  return I(o).pipe(os(), WC(i));
}
var Za = class {
    segmentGroup;
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Qa = class extends Error {
    urlTree;
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Qo(n) {
  return Ri(new Za(n));
}
function dP(n) {
  return Ri(new v(4e3, !1));
}
function uP(n) {
  return Ri(zC(!1, Rt.GuardRejected));
}
var fv = class {
  urlSerializer;
  urlTree;
  constructor(t, e) {
    (this.urlSerializer = t), (this.urlTree = e);
  }
  lineralizeSegments(t, e) {
    let i = [],
      r = e.root;
    for (;;) {
      if (((i = i.concat(r.segments)), r.numberOfChildren === 0)) return I(i);
      if (r.numberOfChildren > 1 || !r.children[J])
        return dP(`${t.redirectTo}`);
      r = r.children[J];
    }
  }
  applyRedirectCommands(t, e, i, r, o) {
    return fP(e, r, o).pipe(
      R((s) => {
        if (s instanceof Zn) throw new Qa(s);
        let a = this.applyRedirectCreateUrlTree(
          s,
          this.urlSerializer.parse(s),
          t,
          i
        );
        if (s[0] === "/") throw new Qa(a);
        return a;
      })
    );
  }
  applyRedirectCreateUrlTree(t, e, i, r) {
    let o = this.createSegmentGroup(t, e.root, i, r);
    return new Zn(
      o,
      this.createQueryParams(e.queryParams, this.urlTree.queryParams),
      e.fragment
    );
  }
  createQueryParams(t, e) {
    let i = {};
    return (
      Object.entries(t).forEach(([r, o]) => {
        if (typeof o == "string" && o[0] === ":") {
          let a = o.substring(1);
          i[r] = e[a];
        } else i[r] = o;
      }),
      i
    );
  }
  createSegmentGroup(t, e, i, r) {
    let o = this.createSegments(t, e.segments, i, r),
      s = {};
    return (
      Object.entries(e.children).forEach(([a, l]) => {
        s[a] = this.createSegmentGroup(t, l, i, r);
      }),
      new pe(o, s)
    );
  }
  createSegments(t, e, i, r) {
    return e.map((o) =>
      o.path[0] === ":" ? this.findPosParam(t, o, r) : this.findOrReturn(o, i)
    );
  }
  findPosParam(t, e, i) {
    let r = i[e.path.substring(1)];
    if (!r) throw new v(4001, !1);
    return r;
  }
  findOrReturn(t, e) {
    let i = 0;
    for (let r of e) {
      if (r.path === t.path) return e.splice(i), r;
      i++;
    }
    return t;
  }
};
function fP(n, t, e) {
  if (typeof n == "string") return I(n);
  let i = n,
    {
      queryParams: r,
      fragment: o,
      routeConfig: s,
      url: a,
      outlet: l,
      params: c,
      data: d,
      title: u,
    } = t;
  return wi(
    yt(e, () =>
      i({
        params: c,
        data: d,
        queryParams: r,
        fragment: o,
        routeConfig: s,
        url: a,
        outlet: l,
        title: u,
      })
    )
  );
}
var hv = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function hP(n, t, e, i, r) {
  let o = qC(n, t, e);
  return o.matched
    ? ((i = Pk(t, i)),
      cP(i, t, e, r).pipe(R((s) => (s === !0 ? o : _({}, hv)))))
    : I(o);
}
function qC(n, t, e) {
  if (t.path === "**") return pP(e);
  if (t.path === "")
    return t.pathMatch === "full" && (n.hasChildren() || e.length > 0)
      ? _({}, hv)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: e,
          parameters: {},
          positionalParamSegments: {},
        };
  let r = (t.matcher || EC)(e, n, t);
  if (!r) return _({}, hv);
  let o = {};
  Object.entries(r.posParams ?? {}).forEach(([a, l]) => {
    o[a] = l.path;
  });
  let s =
    r.consumed.length > 0
      ? _(_({}, o), r.consumed[r.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: r.consumed,
    remainingSegments: e.slice(r.consumed.length),
    parameters: s,
    positionalParamSegments: r.posParams ?? {},
  };
}
function pP(n) {
  return {
    matched: !0,
    parameters: n.length > 0 ? CC(n).parameters : {},
    consumedSegments: n,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function yC(n, t, e, i) {
  return e.length > 0 && vP(n, e, i)
    ? {
        segmentGroup: new pe(t, gP(i, new pe(e, n.children))),
        slicedSegments: [],
      }
    : e.length === 0 && _P(n, e, i)
    ? {
        segmentGroup: new pe(n.segments, mP(n, e, i, n.children)),
        slicedSegments: e,
      }
    : { segmentGroup: new pe(n.segments, n.children), slicedSegments: e };
}
function mP(n, t, e, i) {
  let r = {};
  for (let o of e)
    if (ku(n, t, o) && !i[Mn(o)]) {
      let s = new pe([], {});
      r[Mn(o)] = s;
    }
  return _(_({}, i), r);
}
function gP(n, t) {
  let e = {};
  e[J] = t;
  for (let i of n)
    if (i.path === "" && Mn(i) !== J) {
      let r = new pe([], {});
      e[Mn(i)] = r;
    }
  return e;
}
function vP(n, t, e) {
  return e.some((i) => ku(n, t, i) && Mn(i) !== J);
}
function _P(n, t, e) {
  return e.some((i) => ku(n, t, i));
}
function ku(n, t, e) {
  return (n.hasChildren() || t.length > 0) && e.pathMatch === "full"
    ? !1
    : e.path === "";
}
function yP(n, t, e) {
  return t.length === 0 && !n.children[e];
}
var pv = class {};
function bP(n, t, e, i, r, o, s = "emptyOnly") {
  return new mv(n, t, e, i, r, s, o).recognize();
}
var wP = 31,
  mv = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(t, e, i, r, o, s, a) {
      (this.injector = t),
        (this.configLoader = e),
        (this.rootComponentType = i),
        (this.config = r),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new fv(this.urlSerializer, this.urlTree));
    }
    noMatchError(t) {
      return new v(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = yC(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        R(({ children: e, rootSnapshot: i }) => {
          let r = new Qt(i, e),
            o = new Ya("", r),
            s = OC(i, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            { state: o, tree: s }
          );
        })
      );
    }
    match(t) {
      let e = new Yr(
        [],
        Object.freeze({}),
        Object.freeze(_({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        J,
        this.rootComponentType,
        null,
        {}
      );
      return this.processSegmentGroup(this.injector, this.config, t, J, e).pipe(
        R((i) => ({ children: i, rootSnapshot: e })),
        Fn((i) => {
          if (i instanceof Qa)
            return (this.urlTree = i.urlTree), this.match(i.urlTree.root);
          throw i instanceof Za ? this.noMatchError(i) : i;
        })
      );
    }
    processSegmentGroup(t, e, i, r, o) {
      return i.segments.length === 0 && i.hasChildren()
        ? this.processChildren(t, e, i, o)
        : this.processSegment(t, e, i, i.segments, r, !0, o).pipe(
            R((s) => (s instanceof Qt ? [s] : []))
          );
    }
    processChildren(t, e, i, r) {
      let o = [];
      for (let s of Object.keys(i.children))
        s === "primary" ? o.unshift(s) : o.push(s);
      return Me(o).pipe(
        Ni((s) => {
          let a = i.children[s],
            l = Fk(e, s);
          return this.processSegmentGroup(t, l, a, s, r);
        }),
        Sh((s, a) => (s.push(...a), s)),
        Oi(null),
        Ih(),
        Qe((s) => {
          if (s === null) return Qo(i);
          let a = YC(s);
          return EP(a), I(a);
        })
      );
    }
    processSegment(t, e, i, r, o, s, a) {
      return Me(e).pipe(
        Ni((l) =>
          this.processSegmentAgainstRoute(
            l._injector ?? t,
            e,
            l,
            i,
            r,
            o,
            s,
            a
          ).pipe(
            Fn((c) => {
              if (c instanceof Za) return I(null);
              throw c;
            })
          )
        ),
        ni((l) => !!l),
        Fn((l) => {
          if (GC(l)) return yP(i, r, o) ? I(new pv()) : Qo(i);
          throw l;
        })
      );
    }
    processSegmentAgainstRoute(t, e, i, r, o, s, a, l) {
      return Mn(i) !== s && (s === J || !ku(r, o, i))
        ? Qo(r)
        : i.redirectTo === void 0
        ? this.matchSegmentAgainstRoute(t, r, i, o, s, l)
        : this.allowRedirects && a
        ? this.expandSegmentAgainstRouteUsingRedirect(t, r, e, i, o, s, l)
        : Qo(r);
    }
    expandSegmentAgainstRouteUsingRedirect(t, e, i, r, o, s, a) {
      let {
        matched: l,
        parameters: c,
        consumedSegments: d,
        positionalParamSegments: u,
        remainingSegments: p,
      } = qC(e, r, o);
      if (!l) return Qo(e);
      typeof r.redirectTo == "string" &&
        r.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > wP && (this.allowRedirects = !1));
      let h = new Yr(
          o,
          c,
          Object.freeze(_({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          bC(r),
          Mn(r),
          r.component ?? r._loadedComponent ?? null,
          r,
          wC(r)
        ),
        m = Tu(h, a, this.paramsInheritanceStrategy);
      return (
        (h.params = Object.freeze(m.params)),
        (h.data = Object.freeze(m.data)),
        this.applyRedirects
          .applyRedirectCommands(d, r.redirectTo, u, h, t)
          .pipe(
            Be((w) => this.applyRedirects.lineralizeSegments(r, w)),
            Qe((w) => this.processSegment(t, i, e, w.concat(p), s, !1, a))
          )
      );
    }
    matchSegmentAgainstRoute(t, e, i, r, o, s) {
      let a = hP(e, i, r, t, this.urlSerializer);
      return (
        i.path === "**" && (e.children = {}),
        a.pipe(
          Be((l) =>
            l.matched
              ? ((t = i._injector ?? t),
                this.getChildConfig(t, i, r).pipe(
                  Be(({ routes: c }) => {
                    let d = i._loadedInjector ?? t,
                      {
                        parameters: u,
                        consumedSegments: p,
                        remainingSegments: h,
                      } = l,
                      m = new Yr(
                        p,
                        u,
                        Object.freeze(_({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        bC(i),
                        Mn(i),
                        i.component ?? i._loadedComponent ?? null,
                        i,
                        wC(i)
                      ),
                      g = Tu(m, s, this.paramsInheritanceStrategy);
                    (m.params = Object.freeze(g.params)),
                      (m.data = Object.freeze(g.data));
                    let { segmentGroup: w, slicedSegments: S } = yC(e, p, h, c);
                    if (S.length === 0 && w.hasChildren())
                      return this.processChildren(d, c, w, m).pipe(
                        R((he) => new Qt(m, he))
                      );
                    if (c.length === 0 && S.length === 0)
                      return I(new Qt(m, []));
                    let ae = Mn(i) === o;
                    return this.processSegment(
                      d,
                      c,
                      w,
                      S,
                      ae ? J : o,
                      !0,
                      m
                    ).pipe(R((he) => new Qt(m, he instanceof Qt ? [he] : [])));
                  })
                ))
              : Qo(e)
          )
        )
      );
    }
    getChildConfig(t, e, i) {
      return e.children
        ? I({ routes: e.children, injector: t })
        : e.loadChildren
        ? e._loadedRoutes !== void 0
          ? I({ routes: e._loadedRoutes, injector: e._loadedInjector })
          : lP(t, e, i, this.urlSerializer).pipe(
              Qe((r) =>
                r
                  ? this.configLoader.loadChildren(t, e).pipe(
                      we((o) => {
                        (e._loadedRoutes = o.routes),
                          (e._loadedInjector = o.injector);
                      })
                    )
                  : uP(e)
              )
            )
        : I({ routes: [], injector: t });
    }
  };
function EP(n) {
  n.sort((t, e) =>
    t.value.outlet === J
      ? -1
      : e.value.outlet === J
      ? 1
      : t.value.outlet.localeCompare(e.value.outlet)
  );
}
function DP(n) {
  let t = n.value.routeConfig;
  return t && t.path === "";
}
function YC(n) {
  let t = [],
    e = new Set();
  for (let i of n) {
    if (!DP(i)) {
      t.push(i);
      continue;
    }
    let r = t.find((o) => i.value.routeConfig === o.value.routeConfig);
    r !== void 0 ? (r.children.push(...i.children), e.add(r)) : t.push(i);
  }
  for (let i of e) {
    let r = YC(i.children);
    t.push(new Qt(i.value, r));
  }
  return t.filter((i) => !e.has(i));
}
function bC(n) {
  return n.data || {};
}
function wC(n) {
  return n.resolve || {};
}
function CP(n, t, e, i, r, o) {
  return Qe((s) =>
    bP(n, t, e, i, s.extractedUrl, r, o).pipe(
      R(({ state: a, tree: l }) =>
        B(_({}, s), { targetSnapshot: a, urlAfterRedirects: l })
      )
    )
  );
}
function IP(n, t) {
  return Qe((e) => {
    let {
      targetSnapshot: i,
      guards: { canActivateChecks: r },
    } = e;
    if (!r.length) return I(e);
    let o = new Set(r.map((l) => l.route)),
      s = new Set();
    for (let l of o) if (!s.has(l)) for (let c of KC(l)) s.add(c);
    let a = 0;
    return Me(s).pipe(
      Ni((l) =>
        o.has(l)
          ? SP(l, i, n, t)
          : ((l.data = Tu(l, l.parent, n).resolve), I(void 0))
      ),
      we(() => a++),
      So(1),
      Qe((l) => (a === s.size ? I(e) : ot))
    );
  });
}
function KC(n) {
  let t = n.children.map((e) => KC(e)).flat();
  return [n, ...t];
}
function SP(n, t, e, i) {
  let r = n.routeConfig,
    o = n._resolve;
  return (
    r?.title !== void 0 && !BC(r) && (o[Xa] = r.title),
    Bs(
      () => (
        (n.data = Tu(n, n.parent, e).resolve),
        xP(o, n, t, i).pipe(
          R(
            (s) => ((n._resolvedData = s), (n.data = _(_({}, n.data), s)), null)
          )
        )
      )
    )
  );
}
function xP(n, t, e, i) {
  let r = iv(n);
  if (r.length === 0) return I({});
  let o = {};
  return Me(r).pipe(
    Qe((s) =>
      MP(n[s], t, e, i).pipe(
        ni(),
        we((a) => {
          if (a instanceof rs) throw Ru(new Zr(), a);
          o[s] = a;
        })
      )
    ),
    So(1),
    R(() => o),
    Fn((s) => (GC(s) ? ot : Ri(s)))
  );
}
function MP(n, t, e, i) {
  let r = ss(t) ?? i,
    o = ls(n, r),
    s = o.resolve ? o.resolve(t, e) : yt(r, () => o(t, e));
  return wi(s);
}
function tv(n) {
  return Be((t) => {
    let e = n(t);
    return e ? Me(e).pipe(R(() => t)) : I(t);
  });
}
var yv = (() => {
    class n {
      buildTitle(e) {
        let i,
          r = e.root;
        for (; r !== void 0; )
          (i = this.getResolvedTitleForRoute(r) ?? i),
            (r = r.children.find((o) => o.outlet === J));
        return i;
      }
      getResolvedTitleForRoute(e) {
        return e.data[Xa];
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: () => f(ZC), providedIn: "root" });
    }
    return n;
  })(),
  ZC = (() => {
    class n extends yv {
      title;
      constructor(e) {
        super(), (this.title = e);
      }
      updateTitle(e) {
        let i = this.buildTitle(e);
        i !== void 0 && this.title.setTitle(i);
      }
      static ɵfac = function (i) {
        return new (i || n)(A(hC));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  nl = new y("", { providedIn: "root", factory: () => ({}) }),
  il = new y(""),
  QC = (() => {
    class n {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = f(pg);
      loadComponent(e, i) {
        if (this.componentLoaders.get(i)) return this.componentLoaders.get(i);
        if (i._loadedComponent) return I(i._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(i);
        let r = wi(yt(e, () => i.loadComponent())).pipe(
            R(JC),
            we((s) => {
              this.onLoadEndListener && this.onLoadEndListener(i),
                (i._loadedComponent = s);
            }),
            ki(() => {
              this.componentLoaders.delete(i);
            })
          ),
          o = new bo(r, () => new E()).pipe(yo());
        return this.componentLoaders.set(i, o), o;
      }
      loadChildren(e, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return I({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let o = XC(i, this.compiler, e, this.onLoadEndListener).pipe(
            ki(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          s = new bo(o, () => new E()).pipe(yo());
        return this.childrenLoaders.set(i, s), s;
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function XC(n, t, e, i) {
  return wi(yt(e, () => n.loadChildren())).pipe(
    R(JC),
    Qe((r) =>
      r instanceof Nd || Array.isArray(r) ? I(r) : Me(t.compileModuleAsync(r))
    ),
    R((r) => {
      i && i(n);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(r)
          ? ((s = r), (a = !0))
          : ((o = r.create(e).injector),
            (s = o.get(il, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(_v), injector: o }
      );
    })
  );
}
function TP(n) {
  return n && typeof n == "object" && "default" in n;
}
function JC(n) {
  return TP(n) ? n.default : n;
}
var Pu = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: () => f(RP), providedIn: "root" });
    }
    return n;
  })(),
  RP = (() => {
    class n {
      shouldProcessUrl(e) {
        return !0;
      }
      extract(e) {
        return e;
      }
      merge(e, i) {
        return e;
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  e0 = new y("");
var t0 = new y(""),
  n0 = (() => {
    class n {
      currentNavigation = null;
      currentTransition = null;
      lastSuccessfulNavigation = null;
      events = new E();
      transitionAbortWithErrorSubject = new E();
      configLoader = f(QC);
      environmentInjector = f(Re);
      destroyRef = f(qt);
      urlSerializer = f(Ja);
      rootContexts = f(as);
      location = f(Qi);
      inputBindingEnabled = f(Ou, { optional: !0 }) !== null;
      titleStrategy = f(yv);
      options = f(nl, { optional: !0 }) || {};
      paramsInheritanceStrategy =
        this.options.paramsInheritanceStrategy || "emptyOnly";
      urlHandlingStrategy = f(Pu);
      createViewTransition = f(e0, { optional: !0 });
      navigationErrorHandler = f(t0, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => I(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let e = (r) => this.events.next(new wu(r)),
          i = (r) => this.events.next(new Eu(r));
        (this.configLoader.onLoadEndListener = i),
          (this.configLoader.onLoadStartListener = e),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          });
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(e) {
        let i = ++this.navigationId;
        this.transitions?.next(
          B(_({}, e), {
            extractedUrl: this.urlHandlingStrategy.extract(e.rawUrl),
            targetSnapshot: null,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
            abortController: new AbortController(),
            id: i,
          })
        );
      }
      setupNavigations(e) {
        return (
          (this.transitions = new je(null)),
          this.transitions.pipe(
            ve((i) => i !== null),
            Be((i) => {
              let r = !1;
              return I(i).pipe(
                Be((o) => {
                  if (this.navigationId > i.id)
                    return (
                      this.cancelNavigationTransition(
                        i,
                        "",
                        Rt.SupersededByNewNavigation
                      ),
                      ot
                    );
                  (this.currentTransition = i),
                    (this.currentNavigation = {
                      id: o.id,
                      initialUrl: o.rawUrl,
                      extractedUrl: o.extractedUrl,
                      targetBrowserUrl:
                        typeof o.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(o.extras.browserUrl)
                          : o.extras.browserUrl,
                      trigger: o.source,
                      extras: o.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? B(_({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                      abort: () => o.abortController.abort(),
                    });
                  let s =
                      !e.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    a = o.extras.onSameUrlNavigation ?? e.onSameUrlNavigation;
                  if (!s && a !== "reload") {
                    let l = "";
                    return (
                      this.events.next(
                        new bi(
                          o.id,
                          this.urlSerializer.serialize(o.rawUrl),
                          l,
                          $a.IgnoredSameUrlNavigation
                        )
                      ),
                      o.resolve(!1),
                      ot
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(o.rawUrl))
                    return I(o).pipe(
                      Be(
                        (l) => (
                          this.events.next(
                            new Qr(
                              l.id,
                              this.urlSerializer.serialize(l.extractedUrl),
                              l.source,
                              l.restoredState
                            )
                          ),
                          l.id !== this.navigationId ? ot : Promise.resolve(l)
                        )
                      ),
                      CP(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        e.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy
                      ),
                      we((l) => {
                        (i.targetSnapshot = l.targetSnapshot),
                          (i.urlAfterRedirects = l.urlAfterRedirects),
                          (this.currentNavigation = B(
                            _({}, this.currentNavigation),
                            { finalUrl: l.urlAfterRedirects }
                          ));
                        let c = new Ga(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot
                        );
                        this.events.next(c);
                      })
                    );
                  if (
                    s &&
                    this.urlHandlingStrategy.shouldProcessUrl(o.currentRawUrl)
                  ) {
                    let {
                        id: l,
                        extractedUrl: c,
                        source: d,
                        restoredState: u,
                        extras: p,
                      } = o,
                      h = new Qr(l, this.urlSerializer.serialize(c), d, u);
                    this.events.next(h);
                    let m = VC(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = i =
                        B(_({}, o), {
                          targetSnapshot: m,
                          urlAfterRedirects: c,
                          extras: B(_({}, p), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = c),
                      I(i)
                    );
                  } else {
                    let l = "";
                    return (
                      this.events.next(
                        new bi(
                          o.id,
                          this.urlSerializer.serialize(o.extractedUrl),
                          l,
                          $a.IgnoredByUrlHandlingStrategy
                        )
                      ),
                      o.resolve(!1),
                      ot
                    );
                  }
                }),
                we((o) => {
                  let s = new vu(
                    o.id,
                    this.urlSerializer.serialize(o.extractedUrl),
                    this.urlSerializer.serialize(o.urlAfterRedirects),
                    o.targetSnapshot
                  );
                  this.events.next(s);
                }),
                R(
                  (o) => (
                    (this.currentTransition = i =
                      B(_({}, o), {
                        guards: zk(
                          o.targetSnapshot,
                          o.currentSnapshot,
                          this.rootContexts
                        ),
                      })),
                    i
                  )
                ),
                eP(this.environmentInjector, (o) => this.events.next(o)),
                we((o) => {
                  if (
                    ((i.guardsResult = o.guardsResult),
                    o.guardsResult && typeof o.guardsResult != "boolean")
                  )
                    throw Ru(this.urlSerializer, o.guardsResult);
                  let s = new _u(
                    o.id,
                    this.urlSerializer.serialize(o.extractedUrl),
                    this.urlSerializer.serialize(o.urlAfterRedirects),
                    o.targetSnapshot,
                    !!o.guardsResult
                  );
                  this.events.next(s);
                }),
                ve((o) =>
                  o.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(o, "", Rt.GuardRejected),
                      !1)
                ),
                tv((o) => {
                  if (o.guards.canActivateChecks.length !== 0)
                    return I(o).pipe(
                      we((s) => {
                        let a = new yu(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      }),
                      Be((s) => {
                        let a = !1;
                        return I(s).pipe(
                          IP(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector
                          ),
                          we({
                            next: () => (a = !0),
                            complete: () => {
                              a ||
                                this.cancelNavigationTransition(
                                  s,
                                  "",
                                  Rt.NoDataFromResolver
                                );
                            },
                          })
                        );
                      }),
                      we((s) => {
                        let a = new bu(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      })
                    );
                }),
                tv((o) => {
                  let s = (a) => {
                    let l = [];
                    if (
                      a.routeConfig?.loadComponent &&
                      !a.routeConfig._loadedComponent
                    ) {
                      let c = ss(a) ?? this.environmentInjector;
                      l.push(
                        this.configLoader.loadComponent(c, a.routeConfig).pipe(
                          we((d) => {
                            a.component = d;
                          }),
                          R(() => {})
                        )
                      );
                    }
                    for (let c of a.children) l.push(...s(c));
                    return l;
                  };
                  return Io(s(o.targetSnapshot.root)).pipe(Oi(null), dt(1));
                }),
                tv(() => this.afterPreactivation()),
                Be(() => {
                  let { currentSnapshot: o, targetSnapshot: s } = i,
                    a = this.createViewTransition?.(
                      this.environmentInjector,
                      o.root,
                      s.root
                    );
                  return a ? Me(a).pipe(R(() => i)) : I(i);
                }),
                R((o) => {
                  let s = Vk(
                    e.routeReuseStrategy,
                    o.targetSnapshot,
                    o.currentRouterState
                  );
                  return (
                    (this.currentTransition = i =
                      B(_({}, o), { targetRouterState: s })),
                    (this.currentNavigation.targetRouterState = s),
                    i
                  );
                }),
                we(() => {
                  this.events.next(new Wa());
                }),
                Uk(
                  this.rootContexts,
                  e.routeReuseStrategy,
                  (o) => this.events.next(o),
                  this.inputBindingEnabled
                ),
                dt(1),
                Ie(
                  new H((o) => {
                    let s = i.abortController.signal,
                      a = () => o.next();
                    return (
                      s.addEventListener("abort", a),
                      () => s.removeEventListener("abort", a)
                    );
                  }).pipe(
                    ve(() => !r && !i.targetRouterState),
                    we(() => {
                      this.cancelNavigationTransition(
                        i,
                        i.abortController.signal.reason + "",
                        Rt.Aborted
                      );
                    })
                  )
                ),
                we({
                  next: (o) => {
                    (r = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new yi(
                          o.id,
                          this.urlSerializer.serialize(o.extractedUrl),
                          this.urlSerializer.serialize(o.urlAfterRedirects)
                        )
                      ),
                      this.titleStrategy?.updateTitle(
                        o.targetRouterState.snapshot
                      ),
                      o.resolve(!0);
                  },
                  complete: () => {
                    r = !0;
                  },
                }),
                Ie(
                  this.transitionAbortWithErrorSubject.pipe(
                    we((o) => {
                      throw o;
                    })
                  )
                ),
                ki(() => {
                  r ||
                    this.cancelNavigationTransition(
                      i,
                      "",
                      Rt.SupersededByNewNavigation
                    ),
                    this.currentTransition?.id === i.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                Fn((o) => {
                  if (this.destroyed) return i.resolve(!1), ot;
                  if (((r = !0), $C(o)))
                    this.events.next(
                      new Kn(
                        i.id,
                        this.urlSerializer.serialize(i.extractedUrl),
                        o.message,
                        o.cancellationCode
                      )
                    ),
                      Hk(o)
                        ? this.events.next(
                            new is(o.url, o.navigationBehaviorOptions)
                          )
                        : i.resolve(!1);
                  else {
                    let s = new ns(
                      i.id,
                      this.urlSerializer.serialize(i.extractedUrl),
                      o,
                      i.targetSnapshot ?? void 0
                    );
                    try {
                      let a = yt(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(s)
                      );
                      if (a instanceof rs) {
                        let { message: l, cancellationCode: c } = Ru(
                          this.urlSerializer,
                          a
                        );
                        this.events.next(
                          new Kn(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            l,
                            c
                          )
                        ),
                          this.events.next(
                            new is(a.redirectTo, a.navigationBehaviorOptions)
                          );
                      } else throw (this.events.next(s), o);
                    } catch (a) {
                      this.options.resolveNavigationPromiseOnError
                        ? i.resolve(!1)
                        : i.reject(a);
                    }
                  }
                  return ot;
                })
              );
            })
          )
        );
      }
      cancelNavigationTransition(e, i, r) {
        let o = new Kn(
          e.id,
          this.urlSerializer.serialize(e.extractedUrl),
          i,
          r
        );
        this.events.next(o), e.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let e = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0))
          ),
          i =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          e.toString() !== i?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function AP(n) {
  return n !== Ha;
}
var i0 = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: () => f(NP), providedIn: "root" });
    }
    return n;
  })(),
  Nu = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, e) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, e) {
      return t.routeConfig === e.routeConfig;
    }
  },
  NP = (() => {
    class n extends Nu {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Cn(n)))(r || n);
        };
      })();
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  r0 = (() => {
    class n {
      urlSerializer = f(Ja);
      options = f(nl, { optional: !0 }) || {};
      canceledNavigationResolution =
        this.options.canceledNavigationResolution || "replace";
      location = f(Qi);
      urlHandlingStrategy = f(Pu);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      currentUrlTree = new Zn();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: e, initialUrl: i, targetBrowserUrl: r }) {
        let o = e !== void 0 ? this.urlHandlingStrategy.merge(e, i) : i,
          s = r ?? o;
        return s instanceof Zn ? this.urlSerializer.serialize(s) : s;
      }
      commitTransition({ targetRouterState: e, finalUrl: i, initialUrl: r }) {
        i && e
          ? ((this.currentUrlTree = i),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(i, r)),
            (this.routerState = e))
          : (this.rawUrlTree = r);
      }
      routerState = VC(null);
      getRouterState() {
        return this.routerState;
      }
      stateMemento = this.createStateMemento();
      updateStateMemento() {
        this.stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      resetInternalState({ finalUrl: e }) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            e ?? this.rawUrlTree
          ));
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: () => f(OP), providedIn: "root" });
    }
    return n;
  })(),
  OP = (() => {
    class n extends r0 {
      currentPageId = 0;
      lastSuccessfulId = -1;
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      registerNonRouterCurrentEntryChangeListener(e) {
        return this.location.subscribe((i) => {
          i.type === "popstate" &&
            setTimeout(() => {
              e(i.url, i.state, "popstate");
            });
        });
      }
      handleRouterEvent(e, i) {
        e instanceof Qr
          ? this.updateStateMemento()
          : e instanceof bi
          ? this.commitTransition(i)
          : e instanceof Ga
          ? this.urlUpdateStrategy === "eager" &&
            (i.extras.skipLocationChange ||
              this.setBrowserUrl(this.createBrowserPath(i), i))
          : e instanceof Wa
          ? (this.commitTransition(i),
            this.urlUpdateStrategy === "deferred" &&
              !i.extras.skipLocationChange &&
              this.setBrowserUrl(this.createBrowserPath(i), i))
          : e instanceof Kn &&
            e.code !== Rt.SupersededByNewNavigation &&
            e.code !== Rt.Redirect
          ? this.restoreHistory(i)
          : e instanceof ns
          ? this.restoreHistory(i, !0)
          : e instanceof yi &&
            ((this.lastSuccessfulId = e.id),
            (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(e, { extras: i, id: r }) {
        let { replaceUrl: o, state: s } = i;
        if (this.location.isCurrentPathEqualTo(e) || o) {
          let a = this.browserPageId,
            l = _(_({}, s), this.generateNgRouterState(r, a));
          this.location.replaceState(e, "", l);
        } else {
          let a = _(
            _({}, s),
            this.generateNgRouterState(r, this.browserPageId + 1)
          );
          this.location.go(e, "", a);
        }
      }
      restoreHistory(e, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let r = this.browserPageId,
            o = this.currentPageId - r;
          o !== 0
            ? this.location.historyGo(o)
            : this.getCurrentUrlTree() === e.finalUrl &&
              o === 0 &&
              (this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(e, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: e, ɵrouterPageId: i }
          : { navigationId: e };
      }
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Cn(n)))(r || n);
        };
      })();
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function bv(n, t) {
  n.events
    .pipe(
      ve(
        (e) =>
          e instanceof yi ||
          e instanceof Kn ||
          e instanceof ns ||
          e instanceof bi
      ),
      R((e) =>
        e instanceof yi || e instanceof bi
          ? 0
          : (
              e instanceof Kn
                ? e.code === Rt.Redirect ||
                  e.code === Rt.SupersededByNewNavigation
                : !1
            )
          ? 2
          : 1
      ),
      ve((e) => e !== 2),
      dt(1)
    )
    .subscribe(() => {
      t();
    });
}
var kP = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  PP = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Fu = (() => {
    class n {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      disposed = !1;
      nonRouterCurrentEntryChangeSubscription;
      console = f(Vd);
      stateManager = f(r0);
      options = f(nl, { optional: !0 }) || {};
      pendingTasks = f($i);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      navigationTransitions = f(n0);
      urlSerializer = f(Ja);
      location = f(Qi);
      urlHandlingStrategy = f(Pu);
      injector = f(Re);
      _events = new E();
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      navigated = !1;
      routeReuseStrategy = f(i0);
      onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
      config = f(il, { optional: !0 })?.flat() ?? [];
      componentInputBindingEnabled = !!f(Ou, { optional: !0 });
      constructor() {
        this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this).subscribe({
            error: (e) => {
              this.console.warn(e);
            },
          }),
          this.subscribeToNavigationEvents();
      }
      eventsSubscription = new W();
      subscribeToNavigationEvents() {
        let e = this.navigationTransitions.events.subscribe((i) => {
          try {
            let r = this.navigationTransitions.currentTransition,
              o = this.navigationTransitions.currentNavigation;
            if (r !== null && o !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, o),
                i instanceof Kn &&
                  i.code !== Rt.Redirect &&
                  i.code !== Rt.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof yi) this.navigated = !0;
              else if (i instanceof is) {
                let s = i.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(i.url, r.currentRawUrl),
                  l = _(
                    {
                      browserUrl: r.extras.browserUrl,
                      info: r.extras.info,
                      skipLocationChange: r.extras.skipLocationChange,
                      replaceUrl:
                        r.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        AP(r.source),
                    },
                    s
                  );
                this.scheduleNavigation(a, Ha, null, l, {
                  resolve: r.resolve,
                  reject: r.reject,
                  promise: r.promise,
                });
              }
            }
            kk(i) && this._events.next(i);
          } catch (r) {
            this.navigationTransitions.transitionAbortWithErrorSubject.next(r);
          }
        });
        this.eventsSubscription.add(e);
      }
      resetRootComponentType(e) {
        (this.routerState.root.component = e),
          (this.navigationTransitions.rootComponentType = e);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Ha,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (e, i, r) => {
              this.navigateToSyncWithBrowser(e, r, i);
            }
          );
      }
      navigateToSyncWithBrowser(e, i, r) {
        let o = { replaceUrl: !0 },
          s = r?.navigationId ? r : null;
        if (r) {
          let l = _({}, r);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (o.state = l);
        }
        let a = this.parseUrl(e);
        this.scheduleNavigation(a, i, s, o).catch((l) => {
          this.disposed || this.injector.get(Yt)(l);
        });
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(e) {
        (this.config = e.map(_v)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this._events.unsubscribe(),
          this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(e, i = {}) {
        let {
            relativeTo: r,
            queryParams: o,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: l,
          } = i,
          c = l ? this.currentUrlTree.fragment : s,
          d = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            d = _(_({}, this.currentUrlTree.queryParams), o);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = o || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let u;
        try {
          let p = r ? r.snapshot : this.routerState.snapshot.root;
          u = kC(p);
        } catch {
          (typeof e[0] != "string" || e[0][0] !== "/") && (e = []),
            (u = this.currentUrlTree.root);
        }
        return PC(u, e, d, c ?? null);
      }
      navigateByUrl(e, i = { skipLocationChange: !1 }) {
        let r = ts(e) ? e : this.parseUrl(e),
          o = this.urlHandlingStrategy.merge(r, this.rawUrlTree);
        return this.scheduleNavigation(o, Ha, null, i);
      }
      navigate(e, i = { skipLocationChange: !1 }) {
        return FP(e), this.navigateByUrl(this.createUrlTree(e, i), i);
      }
      serializeUrl(e) {
        return this.urlSerializer.serialize(e);
      }
      parseUrl(e) {
        try {
          return this.urlSerializer.parse(e);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(e, i) {
        let r;
        if (
          (i === !0 ? (r = _({}, kP)) : i === !1 ? (r = _({}, PP)) : (r = i),
          ts(e))
        )
          return mC(this.currentUrlTree, e, r);
        let o = this.parseUrl(e);
        return mC(this.currentUrlTree, o, r);
      }
      removeEmptyProps(e) {
        return Object.entries(e).reduce(
          (i, [r, o]) => (o != null && (i[r] = o), i),
          {}
        );
      }
      scheduleNavigation(e, i, r, o, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, l, c;
        s
          ? ((a = s.resolve), (l = s.reject), (c = s.promise))
          : (c = new Promise((u, p) => {
              (a = u), (l = p);
            }));
        let d = this.pendingTasks.add();
        return (
          bv(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: r,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: e,
            extras: o,
            resolve: a,
            reject: l,
            promise: c,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          c.catch((u) => Promise.reject(u))
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function FP(n) {
  for (let t = 0; t < n.length; t++) if (n[t] == null) throw new v(4008, !1);
}
var VP = new y("");
function wv(n, ...t) {
  return oi([
    { provide: il, multi: !0, useValue: n },
    [],
    { provide: er, useFactory: jP, deps: [Fu] },
    { provide: jd, multi: !0, useFactory: BP },
    t.map((e) => e.ɵproviders),
  ]);
}
function jP(n) {
  return n.routerState.root;
}
function BP() {
  let n = f(te);
  return (t) => {
    let e = n.get(jt);
    if (t !== e.components[0]) return;
    let i = n.get(Fu),
      r = n.get(HP);
    n.get(UP) === 1 && i.initialNavigation(),
      n.get(zP, null, { optional: !0 })?.setUpPreloading(),
      n.get(VP, null, { optional: !0 })?.init(),
      i.resetRootComponentType(e.componentTypes[0]),
      r.closed || (r.next(), r.complete(), r.unsubscribe());
  };
}
var HP = new y("", { factory: () => new E() }),
  UP = new y("", { providedIn: "root", factory: () => 1 });
var zP = new y("");
var ne = (function (n) {
    return (
      (n[(n.State = 0)] = "State"),
      (n[(n.Transition = 1)] = "Transition"),
      (n[(n.Sequence = 2)] = "Sequence"),
      (n[(n.Group = 3)] = "Group"),
      (n[(n.Animate = 4)] = "Animate"),
      (n[(n.Keyframes = 5)] = "Keyframes"),
      (n[(n.Style = 6)] = "Style"),
      (n[(n.Trigger = 7)] = "Trigger"),
      (n[(n.Reference = 8)] = "Reference"),
      (n[(n.AnimateChild = 9)] = "AnimateChild"),
      (n[(n.AnimateRef = 10)] = "AnimateRef"),
      (n[(n.Query = 11)] = "Query"),
      (n[(n.Stagger = 12)] = "Stagger"),
      n
    );
  })(ne || {}),
  Tn = "*";
function o0(n, t = null) {
  return { type: ne.Sequence, steps: n, options: t };
}
function Ev(n) {
  return { type: ne.Style, styles: n, offset: null };
}
var Ei = class {
    _onDoneFns = [];
    _onStartFns = [];
    _onDestroyFns = [];
    _originalOnDoneFns = [];
    _originalOnStartFns = [];
    _started = !1;
    _destroyed = !1;
    _finished = !1;
    _position = 0;
    parentPlayer = null;
    totalTime;
    constructor(t = 0, e = 0) {
      this.totalTime = t + e;
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    onStart(t) {
      this._originalOnStartFns.push(t), this._onStartFns.push(t);
    }
    onDone(t) {
      this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(t) {
      this._position = this.totalTime ? t * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(t) {
      let e = t == "start" ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  cs = class {
    _onDoneFns = [];
    _onStartFns = [];
    _finished = !1;
    _started = !1;
    _destroyed = !1;
    _onDestroyFns = [];
    parentPlayer = null;
    totalTime = 0;
    players;
    constructor(t) {
      this.players = t;
      let e = 0,
        i = 0,
        r = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++e == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++i == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++r == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((t) => t.init());
    }
    onStart(t) {
      this._onStartFns.push(t);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((t) => t()),
        (this._onStartFns = []));
    }
    onDone(t) {
      this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((t) => t.play());
    }
    pause() {
      this.players.forEach((t) => t.pause());
    }
    restart() {
      this.players.forEach((t) => t.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((t) => t.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((t) => t.destroy()),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((t) => t.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(t) {
      let e = t * this.totalTime;
      this.players.forEach((i) => {
        let r = i.totalTime ? Math.min(1, e / i.totalTime) : 1;
        i.setPosition(r);
      });
    }
    getPosition() {
      let t = this.players.reduce(
        (e, i) => (e === null || i.totalTime > e.totalTime ? i : e),
        null
      );
      return t != null ? t.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((t) => {
        t.beforeDestroy && t.beforeDestroy();
      });
    }
    triggerCallback(t) {
      let e = t == "start" ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  rl = "!";
function s0(n) {
  return new v(3e3, !1);
}
function GP() {
  return new v(3100, !1);
}
function WP() {
  return new v(3101, !1);
}
function qP(n) {
  return new v(3001, !1);
}
function YP(n) {
  return new v(3003, !1);
}
function KP(n) {
  return new v(3004, !1);
}
function l0(n, t) {
  return new v(3005, !1);
}
function c0() {
  return new v(3006, !1);
}
function d0() {
  return new v(3007, !1);
}
function u0(n, t) {
  return new v(3008, !1);
}
function f0(n) {
  return new v(3002, !1);
}
function h0(n, t, e, i, r) {
  return new v(3010, !1);
}
function p0() {
  return new v(3011, !1);
}
function m0() {
  return new v(3012, !1);
}
function g0() {
  return new v(3200, !1);
}
function v0() {
  return new v(3202, !1);
}
function _0() {
  return new v(3013, !1);
}
function y0(n) {
  return new v(3014, !1);
}
function b0(n) {
  return new v(3015, !1);
}
function w0(n) {
  return new v(3016, !1);
}
function E0(n, t) {
  return new v(3404, !1);
}
function ZP(n) {
  return new v(3502, !1);
}
function D0(n) {
  return new v(3503, !1);
}
function C0() {
  return new v(3300, !1);
}
function I0(n) {
  return new v(3504, !1);
}
function S0(n) {
  return new v(3301, !1);
}
function x0(n, t) {
  return new v(3302, !1);
}
function M0(n) {
  return new v(3303, !1);
}
function T0(n, t) {
  return new v(3400, !1);
}
function R0(n) {
  return new v(3401, !1);
}
function A0(n) {
  return new v(3402, !1);
}
function N0(n, t) {
  return new v(3505, !1);
}
function Di(n) {
  switch (n.length) {
    case 0:
      return new Ei();
    case 1:
      return n[0];
    default:
      return new cs(n);
  }
}
function Sv(n, t, e = new Map(), i = new Map()) {
  let r = [],
    o = [],
    s = -1,
    a = null;
  if (
    (t.forEach((l) => {
      let c = l.get("offset"),
        d = c == s,
        u = (d && a) || new Map();
      l.forEach((p, h) => {
        let m = h,
          g = p;
        if (h !== "offset")
          switch (((m = n.normalizePropertyName(m, r)), g)) {
            case rl:
              g = e.get(h);
              break;
            case Tn:
              g = i.get(h);
              break;
            default:
              g = n.normalizeStyleValue(h, m, g, r);
              break;
          }
        u.set(m, g);
      }),
        d || o.push(u),
        (a = u),
        (s = c);
    }),
    r.length)
  )
    throw ZP(r);
  return o;
}
function Lu(n, t, e, i) {
  switch (t) {
    case "start":
      n.onStart(() => i(e && Dv(e, "start", n)));
      break;
    case "done":
      n.onDone(() => i(e && Dv(e, "done", n)));
      break;
    case "destroy":
      n.onDestroy(() => i(e && Dv(e, "destroy", n)));
      break;
  }
}
function Dv(n, t, e) {
  let i = e.totalTime,
    r = !!e.disabled,
    o = Vu(
      n.element,
      n.triggerName,
      n.fromState,
      n.toState,
      t || n.phaseName,
      i ?? n.totalTime,
      r
    ),
    s = n._data;
  return s != null && (o._data = s), o;
}
function Vu(n, t, e, i, r = "", o = 0, s) {
  return {
    element: n,
    triggerName: t,
    fromState: e,
    toState: i,
    phaseName: r,
    totalTime: o,
    disabled: !!s,
  };
}
function Ut(n, t, e) {
  let i = n.get(t);
  return i || n.set(t, (i = e)), i;
}
function xv(n) {
  let t = n.indexOf(":"),
    e = n.substring(1, t),
    i = n.slice(t + 1);
  return [e, i];
}
var QP = typeof document > "u" ? null : document.documentElement;
function ju(n) {
  let t = n.parentNode || n.host || null;
  return t === QP ? null : t;
}
function XP(n) {
  return n.substring(1, 6) == "ebkit";
}
var Xr = null,
  a0 = !1;
function O0(n) {
  Xr ||
    ((Xr = JP() || {}), (a0 = Xr.style ? "WebkitAppearance" in Xr.style : !1));
  let t = !0;
  return (
    Xr.style &&
      !XP(n) &&
      ((t = n in Xr.style),
      !t &&
        a0 &&
        (t = "Webkit" + n.charAt(0).toUpperCase() + n.slice(1) in Xr.style)),
    t
  );
}
function JP() {
  return typeof document < "u" ? document.body : null;
}
function Mv(n, t) {
  for (; t; ) {
    if (t === n) return !0;
    t = ju(t);
  }
  return !1;
}
function Tv(n, t, e) {
  if (e) return Array.from(n.querySelectorAll(t));
  let i = n.querySelector(t);
  return i ? [i] : [];
}
var eF = 1e3,
  Rv = "{{",
  tF = "}}",
  Av = "ng-enter",
  Bu = "ng-leave",
  ol = "ng-trigger",
  sl = ".ng-trigger",
  Nv = "ng-animating",
  Hu = ".ng-animating";
function Qn(n) {
  if (typeof n == "number") return n;
  let t = n.match(/^(-?[\.\d]+)(m?s)/);
  return !t || t.length < 2 ? 0 : Cv(parseFloat(t[1]), t[2]);
}
function Cv(n, t) {
  switch (t) {
    case "s":
      return n * eF;
    default:
      return n;
  }
}
function al(n, t, e) {
  return n.hasOwnProperty("duration") ? n : nF(n, t, e);
}
function nF(n, t, e) {
  let i =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    r,
    o = 0,
    s = "";
  if (typeof n == "string") {
    let a = n.match(i);
    if (a === null) return t.push(s0(n)), { duration: 0, delay: 0, easing: "" };
    r = Cv(parseFloat(a[1]), a[2]);
    let l = a[3];
    l != null && (o = Cv(parseFloat(l), a[4]));
    let c = a[5];
    c && (s = c);
  } else r = n;
  if (!e) {
    let a = !1,
      l = t.length;
    r < 0 && (t.push(GP()), (a = !0)),
      o < 0 && (t.push(WP()), (a = !0)),
      a && t.splice(l, 0, s0(n));
  }
  return { duration: r, delay: o, easing: s };
}
function k0(n) {
  return n.length
    ? n[0] instanceof Map
      ? n
      : n.map((t) => new Map(Object.entries(t)))
    : [];
}
function Rn(n, t, e) {
  t.forEach((i, r) => {
    let o = Uu(r);
    e && !e.has(r) && e.set(r, n.style[o]), (n.style[o] = i);
  });
}
function tr(n, t) {
  t.forEach((e, i) => {
    let r = Uu(i);
    n.style[r] = "";
  });
}
function ds(n) {
  return Array.isArray(n) ? (n.length == 1 ? n[0] : o0(n)) : n;
}
function P0(n, t, e) {
  let i = t.params || {},
    r = Ov(n);
  r.length &&
    r.forEach((o) => {
      i.hasOwnProperty(o) || e.push(qP(o));
    });
}
var Iv = new RegExp(`${Rv}\\s*(.+?)\\s*${tF}`, "g");
function Ov(n) {
  let t = [];
  if (typeof n == "string") {
    let e;
    for (; (e = Iv.exec(n)); ) t.push(e[1]);
    Iv.lastIndex = 0;
  }
  return t;
}
function us(n, t, e) {
  let i = `${n}`,
    r = i.replace(Iv, (o, s) => {
      let a = t[s];
      return a == null && (e.push(YP(s)), (a = "")), a.toString();
    });
  return r == i ? n : r;
}
var iF = /-+([a-z0-9])/g;
function Uu(n) {
  return n.replace(iF, (...t) => t[1].toUpperCase());
}
function F0(n, t) {
  return n === 0 || t === 0;
}
function L0(n, t, e) {
  if (e.size && t.length) {
    let i = t[0],
      r = [];
    if (
      (e.forEach((o, s) => {
        i.has(s) || r.push(s), i.set(s, o);
      }),
      r.length)
    )
      for (let o = 1; o < t.length; o++) {
        let s = t[o];
        r.forEach((a) => s.set(a, zu(n, a)));
      }
  }
  return t;
}
function zt(n, t, e) {
  switch (t.type) {
    case ne.Trigger:
      return n.visitTrigger(t, e);
    case ne.State:
      return n.visitState(t, e);
    case ne.Transition:
      return n.visitTransition(t, e);
    case ne.Sequence:
      return n.visitSequence(t, e);
    case ne.Group:
      return n.visitGroup(t, e);
    case ne.Animate:
      return n.visitAnimate(t, e);
    case ne.Keyframes:
      return n.visitKeyframes(t, e);
    case ne.Style:
      return n.visitStyle(t, e);
    case ne.Reference:
      return n.visitReference(t, e);
    case ne.AnimateChild:
      return n.visitAnimateChild(t, e);
    case ne.AnimateRef:
      return n.visitAnimateRef(t, e);
    case ne.Query:
      return n.visitQuery(t, e);
    case ne.Stagger:
      return n.visitStagger(t, e);
    default:
      throw KP(t.type);
  }
}
function zu(n, t) {
  return window.getComputedStyle(n)[t];
}
var Zv = (() => {
    class n {
      validateStyleProperty(e) {
        return O0(e);
      }
      containsElement(e, i) {
        return Mv(e, i);
      }
      getParentElement(e) {
        return ju(e);
      }
      query(e, i, r) {
        return Tv(e, i, r);
      }
      computeStyle(e, i, r) {
        return r || "";
      }
      animate(e, i, r, o, s, a = [], l) {
        return new Ei(r, o);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac });
    }
    return n;
  })(),
  eo = class {
    static NOOP = new Zv();
  },
  to = class {};
var rF = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  Yu = class extends to {
    normalizePropertyName(t, e) {
      return Uu(t);
    }
    normalizeStyleValue(t, e, i, r) {
      let o = "",
        s = i.toString().trim();
      if (rF.has(e) && i !== 0 && i !== "0")
        if (typeof i == "number") o = "px";
        else {
          let a = i.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && r.push(l0(t, i));
        }
      return s + o;
    }
  };
var Ku = "*";
function oF(n, t) {
  let e = [];
  return (
    typeof n == "string"
      ? n.split(/\s*,\s*/).forEach((i) => sF(i, e, t))
      : e.push(n),
    e
  );
}
function sF(n, t, e) {
  if (n[0] == ":") {
    let l = aF(n, e);
    if (typeof l == "function") {
      t.push(l);
      return;
    }
    n = l;
  }
  let i = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (i == null || i.length < 4) return e.push(b0(n)), t;
  let r = i[1],
    o = i[2],
    s = i[3];
  t.push(V0(r, s));
  let a = r == Ku && s == Ku;
  o[0] == "<" && !a && t.push(V0(s, r));
}
function aF(n, t) {
  switch (n) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (e, i) => parseFloat(i) > parseFloat(e);
    case ":decrement":
      return (e, i) => parseFloat(i) < parseFloat(e);
    default:
      return t.push(w0(n)), "* => *";
  }
}
var $u = new Set(["true", "1"]),
  Gu = new Set(["false", "0"]);
function V0(n, t) {
  let e = $u.has(n) || Gu.has(n),
    i = $u.has(t) || Gu.has(t);
  return (r, o) => {
    let s = n == Ku || n == r,
      a = t == Ku || t == o;
    return (
      !s && e && typeof r == "boolean" && (s = r ? $u.has(n) : Gu.has(n)),
      !a && i && typeof o == "boolean" && (a = o ? $u.has(t) : Gu.has(t)),
      s && a
    );
  };
}
var Y0 = ":self",
  lF = new RegExp(`s*${Y0}s*,?`, "g");
function K0(n, t, e, i) {
  return new jv(n).build(t, e, i);
}
var j0 = "",
  jv = class {
    _driver;
    constructor(t) {
      this._driver = t;
    }
    build(t, e, i) {
      let r = new Bv(e);
      return this._resetContextStyleTimingState(r), zt(this, ds(t), r);
    }
    _resetContextStyleTimingState(t) {
      (t.currentQuerySelector = j0),
        (t.collectedStyles = new Map()),
        t.collectedStyles.set(j0, new Map()),
        (t.currentTime = 0);
    }
    visitTrigger(t, e) {
      let i = (e.queryCount = 0),
        r = (e.depCount = 0),
        o = [],
        s = [];
      return (
        t.name.charAt(0) == "@" && e.errors.push(c0()),
        t.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(e), a.type == ne.State)) {
            let l = a,
              c = l.name;
            c
              .toString()
              .split(/\s*,\s*/)
              .forEach((d) => {
                (l.name = d), o.push(this.visitState(l, e));
              }),
              (l.name = c);
          } else if (a.type == ne.Transition) {
            let l = this.visitTransition(a, e);
            (i += l.queryCount), (r += l.depCount), s.push(l);
          } else e.errors.push(d0());
        }),
        {
          type: ne.Trigger,
          name: t.name,
          states: o,
          transitions: s,
          queryCount: i,
          depCount: r,
          options: null,
        }
      );
    }
    visitState(t, e) {
      let i = this.visitStyle(t.styles, e),
        r = (t.options && t.options.params) || null;
      if (i.containsDynamicStyles) {
        let o = new Set(),
          s = r || {};
        i.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((l) => {
              Ov(l).forEach((c) => {
                s.hasOwnProperty(c) || o.add(c);
              });
            });
        }),
          o.size && e.errors.push(u0(t.name, [...o.values()]));
      }
      return {
        type: ne.State,
        name: t.name,
        style: i,
        options: r ? { params: r } : null,
      };
    }
    visitTransition(t, e) {
      (e.queryCount = 0), (e.depCount = 0);
      let i = zt(this, ds(t.animation), e),
        r = oF(t.expr, e.errors);
      return {
        type: ne.Transition,
        matchers: r,
        animation: i,
        queryCount: e.queryCount,
        depCount: e.depCount,
        options: Jr(t.options),
      };
    }
    visitSequence(t, e) {
      return {
        type: ne.Sequence,
        steps: t.steps.map((i) => zt(this, i, e)),
        options: Jr(t.options),
      };
    }
    visitGroup(t, e) {
      let i = e.currentTime,
        r = 0,
        o = t.steps.map((s) => {
          e.currentTime = i;
          let a = zt(this, s, e);
          return (r = Math.max(r, e.currentTime)), a;
        });
      return (
        (e.currentTime = r),
        { type: ne.Group, steps: o, options: Jr(t.options) }
      );
    }
    visitAnimate(t, e) {
      let i = fF(t.timings, e.errors);
      e.currentAnimateTimings = i;
      let r,
        o = t.styles ? t.styles : Ev({});
      if (o.type == ne.Keyframes) r = this.visitKeyframes(o, e);
      else {
        let s = t.styles,
          a = !1;
        if (!s) {
          a = !0;
          let c = {};
          i.easing && (c.easing = i.easing), (s = Ev(c));
        }
        e.currentTime += i.duration + i.delay;
        let l = this.visitStyle(s, e);
        (l.isEmptyStep = a), (r = l);
      }
      return (
        (e.currentAnimateTimings = null),
        { type: ne.Animate, timings: i, style: r, options: null }
      );
    }
    visitStyle(t, e) {
      let i = this._makeStyleAst(t, e);
      return this._validateStyleAst(i, e), i;
    }
    _makeStyleAst(t, e) {
      let i = [],
        r = Array.isArray(t.styles) ? t.styles : [t.styles];
      for (let a of r)
        typeof a == "string"
          ? a === Tn
            ? i.push(a)
            : e.errors.push(f0(a))
          : i.push(new Map(Object.entries(a)));
      let o = !1,
        s = null;
      return (
        i.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((s = a.get("easing")), a.delete("easing")), !o)
          ) {
            for (let l of a.values())
              if (l.toString().indexOf(Rv) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: ne.Style,
          styles: i,
          easing: s,
          offset: t.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(t, e) {
      let i = e.currentAnimateTimings,
        r = e.currentTime,
        o = e.currentTime;
      i && o > 0 && (o -= i.duration + i.delay),
        t.styles.forEach((s) => {
          typeof s != "string" &&
            s.forEach((a, l) => {
              let c = e.collectedStyles.get(e.currentQuerySelector),
                d = c.get(l),
                u = !0;
              d &&
                (o != r &&
                  o >= d.startTime &&
                  r <= d.endTime &&
                  (e.errors.push(h0(l, d.startTime, d.endTime, o, r)),
                  (u = !1)),
                (o = d.startTime)),
                u && c.set(l, { startTime: o, endTime: r }),
                e.options && P0(a, e.options, e.errors);
            });
        });
    }
    visitKeyframes(t, e) {
      let i = { type: ne.Keyframes, styles: [], options: null };
      if (!e.currentAnimateTimings) return e.errors.push(p0()), i;
      let r = 1,
        o = 0,
        s = [],
        a = !1,
        l = !1,
        c = 0,
        d = t.steps.map((S) => {
          let ae = this._makeStyleAst(S, e),
            he = ae.offset != null ? ae.offset : uF(ae.styles),
            be = 0;
          return (
            he != null && (o++, (be = ae.offset = he)),
            (l = l || be < 0 || be > 1),
            (a = a || be < c),
            (c = be),
            s.push(be),
            ae
          );
        });
      l && e.errors.push(m0()), a && e.errors.push(g0());
      let u = t.steps.length,
        p = 0;
      o > 0 && o < u ? e.errors.push(v0()) : o == 0 && (p = r / (u - 1));
      let h = u - 1,
        m = e.currentTime,
        g = e.currentAnimateTimings,
        w = g.duration;
      return (
        d.forEach((S, ae) => {
          let he = p > 0 ? (ae == h ? 1 : p * ae) : s[ae],
            be = he * w;
          (e.currentTime = m + g.delay + be),
            (g.duration = be),
            this._validateStyleAst(S, e),
            (S.offset = he),
            i.styles.push(S);
        }),
        i
      );
    }
    visitReference(t, e) {
      return {
        type: ne.Reference,
        animation: zt(this, ds(t.animation), e),
        options: Jr(t.options),
      };
    }
    visitAnimateChild(t, e) {
      return e.depCount++, { type: ne.AnimateChild, options: Jr(t.options) };
    }
    visitAnimateRef(t, e) {
      return {
        type: ne.AnimateRef,
        animation: this.visitReference(t.animation, e),
        options: Jr(t.options),
      };
    }
    visitQuery(t, e) {
      let i = e.currentQuerySelector,
        r = t.options || {};
      e.queryCount++, (e.currentQuery = t);
      let [o, s] = cF(t.selector);
      (e.currentQuerySelector = i.length ? i + " " + o : o),
        Ut(e.collectedStyles, e.currentQuerySelector, new Map());
      let a = zt(this, ds(t.animation), e);
      return (
        (e.currentQuery = null),
        (e.currentQuerySelector = i),
        {
          type: ne.Query,
          selector: o,
          limit: r.limit || 0,
          optional: !!r.optional,
          includeSelf: s,
          animation: a,
          originalSelector: t.selector,
          options: Jr(t.options),
        }
      );
    }
    visitStagger(t, e) {
      e.currentQuery || e.errors.push(_0());
      let i =
        t.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : al(t.timings, e.errors, !0);
      return {
        type: ne.Stagger,
        animation: zt(this, ds(t.animation), e),
        timings: i,
        options: null,
      };
    }
  };
function cF(n) {
  let t = !!n.split(/\s*,\s*/).find((e) => e == Y0);
  return (
    t && (n = n.replace(lF, "")),
    (n = n
      .replace(/@\*/g, sl)
      .replace(/@\w+/g, (e) => sl + "-" + e.slice(1))
      .replace(/:animating/g, Hu)),
    [n, t]
  );
}
function dF(n) {
  return n ? _({}, n) : null;
}
var Bv = class {
  errors;
  queryCount = 0;
  depCount = 0;
  currentTransition = null;
  currentQuery = null;
  currentQuerySelector = null;
  currentAnimateTimings = null;
  currentTime = 0;
  collectedStyles = new Map();
  options = null;
  unsupportedCSSPropertiesFound = new Set();
  constructor(t) {
    this.errors = t;
  }
};
function uF(n) {
  if (typeof n == "string") return null;
  let t = null;
  if (Array.isArray(n))
    n.forEach((e) => {
      if (e instanceof Map && e.has("offset")) {
        let i = e;
        (t = parseFloat(i.get("offset"))), i.delete("offset");
      }
    });
  else if (n instanceof Map && n.has("offset")) {
    let e = n;
    (t = parseFloat(e.get("offset"))), e.delete("offset");
  }
  return t;
}
function fF(n, t) {
  if (n.hasOwnProperty("duration")) return n;
  if (typeof n == "number") {
    let o = al(n, t).duration;
    return kv(o, 0, "");
  }
  let e = n;
  if (e.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
    let o = kv(0, 0, "");
    return (o.dynamic = !0), (o.strValue = e), o;
  }
  let r = al(e, t);
  return kv(r.duration, r.delay, r.easing);
}
function Jr(n) {
  return (
    n ? ((n = _({}, n)), n.params && (n.params = dF(n.params))) : (n = {}), n
  );
}
function kv(n, t, e) {
  return { duration: n, delay: t, easing: e };
}
function Qv(n, t, e, i, r, o, s = null, a = !1) {
  return {
    type: 1,
    element: n,
    keyframes: t,
    preStyleProps: e,
    postStyleProps: i,
    duration: r,
    delay: o,
    totalTime: r + o,
    easing: s,
    subTimeline: a,
  };
}
var cl = class {
    _map = new Map();
    get(t) {
      return this._map.get(t) || [];
    }
    append(t, e) {
      let i = this._map.get(t);
      i || this._map.set(t, (i = [])), i.push(...e);
    }
    has(t) {
      return this._map.has(t);
    }
    clear() {
      this._map.clear();
    }
  },
  hF = 1,
  pF = ":enter",
  mF = new RegExp(pF, "g"),
  gF = ":leave",
  vF = new RegExp(gF, "g");
function Z0(n, t, e, i, r, o = new Map(), s = new Map(), a, l, c = []) {
  return new Hv().buildKeyframes(n, t, e, i, r, o, s, a, l, c);
}
var Hv = class {
    buildKeyframes(t, e, i, r, o, s, a, l, c, d = []) {
      c = c || new cl();
      let u = new Uv(t, e, c, r, o, d, []);
      u.options = l;
      let p = l.delay ? Qn(l.delay) : 0;
      u.currentTimeline.delayNextStep(p),
        u.currentTimeline.setStyles([s], null, u.errors, l),
        zt(this, i, u);
      let h = u.timelines.filter((m) => m.containsAnimation());
      if (h.length && a.size) {
        let m;
        for (let g = h.length - 1; g >= 0; g--) {
          let w = h[g];
          if (w.element === e) {
            m = w;
            break;
          }
        }
        m &&
          !m.allowOnlyTimelineStyles() &&
          m.setStyles([a], null, u.errors, l);
      }
      return h.length
        ? h.map((m) => m.buildKeyframes())
        : [Qv(e, [], [], [], 0, p, "", !1)];
    }
    visitTrigger(t, e) {}
    visitState(t, e) {}
    visitTransition(t, e) {}
    visitAnimateChild(t, e) {
      let i = e.subInstructions.get(e.element);
      if (i) {
        let r = e.createSubContext(t.options),
          o = e.currentTimeline.currentTime,
          s = this._visitSubInstructions(i, r, r.options);
        o != s && e.transformIntoNewTimeline(s);
      }
      e.previousNode = t;
    }
    visitAnimateRef(t, e) {
      let i = e.createSubContext(t.options);
      i.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([t.options, t.animation.options], e, i),
        this.visitReference(t.animation, i),
        e.transformIntoNewTimeline(i.currentTimeline.currentTime),
        (e.previousNode = t);
    }
    _applyAnimationRefDelays(t, e, i) {
      for (let r of t) {
        let o = r?.delay;
        if (o) {
          let s =
            typeof o == "number" ? o : Qn(us(o, r?.params ?? {}, e.errors));
          i.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(t, e, i) {
      let o = e.currentTimeline.currentTime,
        s = i.duration != null ? Qn(i.duration) : null,
        a = i.delay != null ? Qn(i.delay) : null;
      return (
        s !== 0 &&
          t.forEach((l) => {
            let c = e.appendInstructionToTimeline(l, s, a);
            o = Math.max(o, c.duration + c.delay);
          }),
        o
      );
    }
    visitReference(t, e) {
      e.updateOptions(t.options, !0),
        zt(this, t.animation, e),
        (e.previousNode = t);
    }
    visitSequence(t, e) {
      let i = e.subContextCount,
        r = e,
        o = t.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((r = e.createSubContext(o)),
        r.transformIntoNewTimeline(),
        o.delay != null)
      ) {
        r.previousNode.type == ne.Style &&
          (r.currentTimeline.snapshotCurrentStyles(), (r.previousNode = Zu));
        let s = Qn(o.delay);
        r.delayNextStep(s);
      }
      t.steps.length &&
        (t.steps.forEach((s) => zt(this, s, r)),
        r.currentTimeline.applyStylesToKeyframe(),
        r.subContextCount > i && r.transformIntoNewTimeline()),
        (e.previousNode = t);
    }
    visitGroup(t, e) {
      let i = [],
        r = e.currentTimeline.currentTime,
        o = t.options && t.options.delay ? Qn(t.options.delay) : 0;
      t.steps.forEach((s) => {
        let a = e.createSubContext(t.options);
        o && a.delayNextStep(o),
          zt(this, s, a),
          (r = Math.max(r, a.currentTimeline.currentTime)),
          i.push(a.currentTimeline);
      }),
        i.forEach((s) => e.currentTimeline.mergeTimelineCollectedStyles(s)),
        e.transformIntoNewTimeline(r),
        (e.previousNode = t);
    }
    _visitTiming(t, e) {
      if (t.dynamic) {
        let i = t.strValue,
          r = e.params ? us(i, e.params, e.errors) : i;
        return al(r, e.errors);
      } else return { duration: t.duration, delay: t.delay, easing: t.easing };
    }
    visitAnimate(t, e) {
      let i = (e.currentAnimateTimings = this._visitTiming(t.timings, e)),
        r = e.currentTimeline;
      i.delay && (e.incrementTime(i.delay), r.snapshotCurrentStyles());
      let o = t.style;
      o.type == ne.Keyframes
        ? this.visitKeyframes(o, e)
        : (e.incrementTime(i.duration),
          this.visitStyle(o, e),
          r.applyStylesToKeyframe()),
        (e.currentAnimateTimings = null),
        (e.previousNode = t);
    }
    visitStyle(t, e) {
      let i = e.currentTimeline,
        r = e.currentAnimateTimings;
      !r && i.hasCurrentStyleProperties() && i.forwardFrame();
      let o = (r && r.easing) || t.easing;
      t.isEmptyStep
        ? i.applyEmptyStep(o)
        : i.setStyles(t.styles, o, e.errors, e.options),
        (e.previousNode = t);
    }
    visitKeyframes(t, e) {
      let i = e.currentAnimateTimings,
        r = e.currentTimeline.duration,
        o = i.duration,
        a = e.createSubContext().currentTimeline;
      (a.easing = i.easing),
        t.styles.forEach((l) => {
          let c = l.offset || 0;
          a.forwardTime(c * o),
            a.setStyles(l.styles, l.easing, e.errors, e.options),
            a.applyStylesToKeyframe();
        }),
        e.currentTimeline.mergeTimelineCollectedStyles(a),
        e.transformIntoNewTimeline(r + o),
        (e.previousNode = t);
    }
    visitQuery(t, e) {
      let i = e.currentTimeline.currentTime,
        r = t.options || {},
        o = r.delay ? Qn(r.delay) : 0;
      o &&
        (e.previousNode.type === ne.Style ||
          (i == 0 && e.currentTimeline.hasCurrentStyleProperties())) &&
        (e.currentTimeline.snapshotCurrentStyles(), (e.previousNode = Zu));
      let s = i,
        a = e.invokeQuery(
          t.selector,
          t.originalSelector,
          t.limit,
          t.includeSelf,
          !!r.optional,
          e.errors
        );
      e.currentQueryTotal = a.length;
      let l = null;
      a.forEach((c, d) => {
        e.currentQueryIndex = d;
        let u = e.createSubContext(t.options, c);
        o && u.delayNextStep(o),
          c === e.element && (l = u.currentTimeline),
          zt(this, t.animation, u),
          u.currentTimeline.applyStylesToKeyframe();
        let p = u.currentTimeline.currentTime;
        s = Math.max(s, p);
      }),
        (e.currentQueryIndex = 0),
        (e.currentQueryTotal = 0),
        e.transformIntoNewTimeline(s),
        l &&
          (e.currentTimeline.mergeTimelineCollectedStyles(l),
          e.currentTimeline.snapshotCurrentStyles()),
        (e.previousNode = t);
    }
    visitStagger(t, e) {
      let i = e.parentContext,
        r = e.currentTimeline,
        o = t.timings,
        s = Math.abs(o.duration),
        a = s * (e.currentQueryTotal - 1),
        l = s * e.currentQueryIndex;
      switch (o.duration < 0 ? "reverse" : o.easing) {
        case "reverse":
          l = a - l;
          break;
        case "full":
          l = i.currentStaggerTime;
          break;
      }
      let d = e.currentTimeline;
      l && d.delayNextStep(l);
      let u = d.currentTime;
      zt(this, t.animation, e),
        (e.previousNode = t),
        (i.currentStaggerTime =
          r.currentTime - u + (r.startTime - i.currentTimeline.startTime));
    }
  },
  Zu = {},
  Uv = class n {
    _driver;
    element;
    subInstructions;
    _enterClassName;
    _leaveClassName;
    errors;
    timelines;
    parentContext = null;
    currentTimeline;
    currentAnimateTimings = null;
    previousNode = Zu;
    subContextCount = 0;
    options = {};
    currentQueryIndex = 0;
    currentQueryTotal = 0;
    currentStaggerTime = 0;
    constructor(t, e, i, r, o, s, a, l) {
      (this._driver = t),
        (this.element = e),
        (this.subInstructions = i),
        (this._enterClassName = r),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.currentTimeline = l || new Qu(this._driver, e, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(t, e) {
      if (!t) return;
      let i = t,
        r = this.options;
      i.duration != null && (r.duration = Qn(i.duration)),
        i.delay != null && (r.delay = Qn(i.delay));
      let o = i.params;
      if (o) {
        let s = r.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!e || !s.hasOwnProperty(a)) && (s[a] = us(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let t = {};
      if (this.options) {
        let e = this.options.params;
        if (e) {
          let i = (t.params = {});
          Object.keys(e).forEach((r) => {
            i[r] = e[r];
          });
        }
      }
      return t;
    }
    createSubContext(t = null, e, i) {
      let r = e || this.element,
        o = new n(
          this._driver,
          r,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(r, i || 0)
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(t),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(t) {
      return (
        (this.previousNode = Zu),
        (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(t, e, i) {
      let r = {
          duration: e ?? t.duration,
          delay: this.currentTimeline.currentTime + (i ?? 0) + t.delay,
          easing: "",
        },
        o = new zv(
          this._driver,
          t.element,
          t.keyframes,
          t.preStyleProps,
          t.postStyleProps,
          r,
          t.stretchStartingKeyframe
        );
      return this.timelines.push(o), r;
    }
    incrementTime(t) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
    }
    delayNextStep(t) {
      t > 0 && this.currentTimeline.delayNextStep(t);
    }
    invokeQuery(t, e, i, r, o, s) {
      let a = [];
      if ((r && a.push(this.element), t.length > 0)) {
        (t = t.replace(mF, "." + this._enterClassName)),
          (t = t.replace(vF, "." + this._leaveClassName));
        let l = i != 1,
          c = this._driver.query(this.element, t, l);
        i !== 0 &&
          (c = i < 0 ? c.slice(c.length + i, c.length) : c.slice(0, i)),
          a.push(...c);
      }
      return !o && a.length == 0 && s.push(y0(e)), a;
    }
  },
  Qu = class n {
    _driver;
    element;
    startTime;
    _elementTimelineStylesLookup;
    duration = 0;
    easing = null;
    _previousKeyframe = new Map();
    _currentKeyframe = new Map();
    _keyframes = new Map();
    _styleSummary = new Map();
    _localTimelineStyles = new Map();
    _globalTimelineStyles;
    _pendingStyles = new Map();
    _backFill = new Map();
    _currentEmptyStepKeyframe = null;
    constructor(t, e, i, r) {
      (this._driver = t),
        (this.element = e),
        (this.startTime = i),
        (this._elementTimelineStylesLookup = r),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(e)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(e, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(t) {
      let e = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || e
        ? (this.forwardTime(this.currentTime + t),
          e && this.snapshotCurrentStyles())
        : (this.startTime += t);
    }
    fork(t, e) {
      return (
        this.applyStylesToKeyframe(),
        new n(
          this._driver,
          t,
          e || this.currentTime,
          this._elementTimelineStylesLookup
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += hF), this._loadKeyframe();
    }
    forwardTime(t) {
      this.applyStylesToKeyframe(), (this.duration = t), this._loadKeyframe();
    }
    _updateStyle(t, e) {
      this._localTimelineStyles.set(t, e),
        this._globalTimelineStyles.set(t, e),
        this._styleSummary.set(t, { time: this.currentTime, value: e });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(t) {
      t && this._previousKeyframe.set("easing", t);
      for (let [e, i] of this._globalTimelineStyles)
        this._backFill.set(e, i || Tn), this._currentKeyframe.set(e, Tn);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(t, e, i, r) {
      e && this._previousKeyframe.set("easing", e);
      let o = (r && r.params) || {},
        s = _F(t, this._globalTimelineStyles);
      for (let [a, l] of s) {
        let c = us(l, o, i);
        this._pendingStyles.set(a, c),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Tn),
          this._updateStyle(a, c);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((t, e) => {
          this._currentKeyframe.set(e, t);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((t, e) => {
          this._currentKeyframe.has(e) || this._currentKeyframe.set(e, t);
        }));
    }
    snapshotCurrentStyles() {
      for (let [t, e] of this._localTimelineStyles)
        this._pendingStyles.set(t, e), this._updateStyle(t, e);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let t = [];
      for (let e in this._currentKeyframe) t.push(e);
      return t;
    }
    mergeTimelineCollectedStyles(t) {
      t._styleSummary.forEach((e, i) => {
        let r = this._styleSummary.get(i);
        (!r || e.time > r.time) && this._updateStyle(i, e.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let t = new Set(),
        e = new Set(),
        i = this._keyframes.size === 1 && this.duration === 0,
        r = [];
      this._keyframes.forEach((a, l) => {
        let c = new Map([...this._backFill, ...a]);
        c.forEach((d, u) => {
          d === rl ? t.add(u) : d === Tn && e.add(u);
        }),
          i || c.set("offset", l / this.duration),
          r.push(c);
      });
      let o = [...t.values()],
        s = [...e.values()];
      if (i) {
        let a = r[0],
          l = new Map(a);
        a.set("offset", 0), l.set("offset", 1), (r = [a, l]);
      }
      return Qv(
        this.element,
        r,
        o,
        s,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  zv = class extends Qu {
    keyframes;
    preStyleProps;
    postStyleProps;
    _stretchStartingKeyframe;
    timings;
    constructor(t, e, i, r, o, s, a = !1) {
      super(t, e, s.delay),
        (this.keyframes = i),
        (this.preStyleProps = r),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let t = this.keyframes,
        { delay: e, duration: i, easing: r } = this.timings;
      if (this._stretchStartingKeyframe && e) {
        let o = [],
          s = i + e,
          a = e / s,
          l = new Map(t[0]);
        l.set("offset", 0), o.push(l);
        let c = new Map(t[0]);
        c.set("offset", B0(a)), o.push(c);
        let d = t.length - 1;
        for (let u = 1; u <= d; u++) {
          let p = new Map(t[u]),
            h = p.get("offset"),
            m = e + h * i;
          p.set("offset", B0(m / s)), o.push(p);
        }
        (i = s), (e = 0), (r = ""), (t = o);
      }
      return Qv(
        this.element,
        t,
        this.preStyleProps,
        this.postStyleProps,
        i,
        e,
        r,
        !0
      );
    }
  };
function B0(n, t = 3) {
  let e = Math.pow(10, t - 1);
  return Math.round(n * e) / e;
}
function _F(n, t) {
  let e = new Map(),
    i;
  return (
    n.forEach((r) => {
      if (r === "*") {
        i ??= t.keys();
        for (let o of i) e.set(o, Tn);
      } else for (let [o, s] of r) e.set(o, s);
    }),
    e
  );
}
function H0(n, t, e, i, r, o, s, a, l, c, d, u, p) {
  return {
    type: 0,
    element: n,
    triggerName: t,
    isRemovalTransition: r,
    fromState: e,
    fromStyles: o,
    toState: i,
    toStyles: s,
    timelines: a,
    queriedElements: l,
    preStyleProps: c,
    postStyleProps: d,
    totalTime: u,
    errors: p,
  };
}
var Pv = {},
  Xu = class {
    _triggerName;
    ast;
    _stateStyles;
    constructor(t, e, i) {
      (this._triggerName = t), (this.ast = e), (this._stateStyles = i);
    }
    match(t, e, i, r) {
      return yF(this.ast.matchers, t, e, i, r);
    }
    buildStyles(t, e, i) {
      let r = this._stateStyles.get("*");
      return (
        t !== void 0 && (r = this._stateStyles.get(t?.toString()) || r),
        r ? r.buildStyles(e, i) : new Map()
      );
    }
    build(t, e, i, r, o, s, a, l, c, d) {
      let u = [],
        p = (this.ast.options && this.ast.options.params) || Pv,
        h = (a && a.params) || Pv,
        m = this.buildStyles(i, h, u),
        g = (l && l.params) || Pv,
        w = this.buildStyles(r, g, u),
        S = new Set(),
        ae = new Map(),
        he = new Map(),
        be = r === "void",
        Xn = { params: Q0(g, p), delay: this.ast.options?.delay },
        Nn = d ? [] : Z0(t, e, this.ast.animation, o, s, m, w, Xn, c, u),
        Ct = 0;
      return (
        Nn.forEach((Nt) => {
          Ct = Math.max(Nt.duration + Nt.delay, Ct);
        }),
        u.length
          ? H0(e, this._triggerName, i, r, be, m, w, [], [], ae, he, Ct, u)
          : (Nn.forEach((Nt) => {
              let ur = Nt.element,
                fo = Ut(ae, ur, new Set());
              Nt.preStyleProps.forEach((fr) => fo.add(fr));
              let iy = Ut(he, ur, new Set());
              Nt.postStyleProps.forEach((fr) => iy.add(fr)),
                ur !== e && S.add(ur);
            }),
            H0(
              e,
              this._triggerName,
              i,
              r,
              be,
              m,
              w,
              Nn,
              [...S.values()],
              ae,
              he,
              Ct
            ))
      );
    }
  };
function yF(n, t, e, i, r) {
  return n.some((o) => o(t, e, i, r));
}
function Q0(n, t) {
  let e = _({}, t);
  return (
    Object.entries(n).forEach(([i, r]) => {
      r != null && (e[i] = r);
    }),
    e
  );
}
var $v = class {
  styles;
  defaultParams;
  normalizer;
  constructor(t, e, i) {
    (this.styles = t), (this.defaultParams = e), (this.normalizer = i);
  }
  buildStyles(t, e) {
    let i = new Map(),
      r = Q0(t, this.defaultParams);
    return (
      this.styles.styles.forEach((o) => {
        typeof o != "string" &&
          o.forEach((s, a) => {
            s && (s = us(s, r, e));
            let l = this.normalizer.normalizePropertyName(a, e);
            (s = this.normalizer.normalizeStyleValue(a, l, s, e)), i.set(a, s);
          });
      }),
      i
    );
  }
};
function bF(n, t, e) {
  return new Gv(n, t, e);
}
var Gv = class {
  name;
  ast;
  _normalizer;
  transitionFactories = [];
  fallbackTransition;
  states = new Map();
  constructor(t, e, i) {
    (this.name = t),
      (this.ast = e),
      (this._normalizer = i),
      e.states.forEach((r) => {
        let o = (r.options && r.options.params) || {};
        this.states.set(r.name, new $v(r.style, o, i));
      }),
      U0(this.states, "true", "1"),
      U0(this.states, "false", "0"),
      e.transitions.forEach((r) => {
        this.transitionFactories.push(new Xu(t, r, this.states));
      }),
      (this.fallbackTransition = wF(t, this.states));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(t, e, i, r) {
    return this.transitionFactories.find((s) => s.match(t, e, i, r)) || null;
  }
  matchStyles(t, e, i) {
    return this.fallbackTransition.buildStyles(t, e, i);
  }
};
function wF(n, t, e) {
  let i = [(s, a) => !0],
    r = { type: ne.Sequence, steps: [], options: null },
    o = {
      type: ne.Transition,
      animation: r,
      matchers: i,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new Xu(n, o, t);
}
function U0(n, t, e) {
  n.has(t) ? n.has(e) || n.set(e, n.get(t)) : n.has(e) && n.set(t, n.get(e));
}
var EF = new cl(),
  Wv = class {
    bodyNode;
    _driver;
    _normalizer;
    _animations = new Map();
    _playersById = new Map();
    players = [];
    constructor(t, e, i) {
      (this.bodyNode = t), (this._driver = e), (this._normalizer = i);
    }
    register(t, e) {
      let i = [],
        r = [],
        o = K0(this._driver, e, i, r);
      if (i.length) throw D0(i);
      this._animations.set(t, o);
    }
    _buildPlayer(t, e, i) {
      let r = t.element,
        o = Sv(this._normalizer, t.keyframes, e, i);
      return this._driver.animate(r, o, t.duration, t.delay, t.easing, [], !0);
    }
    create(t, e, i = {}) {
      let r = [],
        o = this._animations.get(t),
        s,
        a = new Map();
      if (
        (o
          ? ((s = Z0(
              this._driver,
              e,
              o,
              Av,
              Bu,
              new Map(),
              new Map(),
              i,
              EF,
              r
            )),
            s.forEach((d) => {
              let u = Ut(a, d.element, new Map());
              d.postStyleProps.forEach((p) => u.set(p, null));
            }))
          : (r.push(C0()), (s = [])),
        r.length)
      )
        throw I0(r);
      a.forEach((d, u) => {
        d.forEach((p, h) => {
          d.set(h, this._driver.computeStyle(u, h, Tn));
        });
      });
      let l = s.map((d) => {
          let u = a.get(d.element);
          return this._buildPlayer(d, new Map(), u);
        }),
        c = Di(l);
      return (
        this._playersById.set(t, c),
        c.onDestroy(() => this.destroy(t)),
        this.players.push(c),
        c
      );
    }
    destroy(t) {
      let e = this._getPlayer(t);
      e.destroy(), this._playersById.delete(t);
      let i = this.players.indexOf(e);
      i >= 0 && this.players.splice(i, 1);
    }
    _getPlayer(t) {
      let e = this._playersById.get(t);
      if (!e) throw S0(t);
      return e;
    }
    listen(t, e, i, r) {
      let o = Vu(e, "", "", "");
      return Lu(this._getPlayer(t), i, o, r), () => {};
    }
    command(t, e, i, r) {
      if (i == "register") {
        this.register(t, r[0]);
        return;
      }
      if (i == "create") {
        let s = r[0] || {};
        this.create(t, e, s);
        return;
      }
      let o = this._getPlayer(t);
      switch (i) {
        case "play":
          o.play();
          break;
        case "pause":
          o.pause();
          break;
        case "reset":
          o.reset();
          break;
        case "restart":
          o.restart();
          break;
        case "finish":
          o.finish();
          break;
        case "init":
          o.init();
          break;
        case "setPosition":
          o.setPosition(parseFloat(r[0]));
          break;
        case "destroy":
          this.destroy(t);
          break;
      }
    }
  },
  z0 = "ng-animate-queued",
  DF = ".ng-animate-queued",
  Fv = "ng-animate-disabled",
  CF = ".ng-animate-disabled",
  IF = "ng-star-inserted",
  SF = ".ng-star-inserted",
  xF = [],
  X0 = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  MF = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  An = "__ng_removed",
  dl = class {
    namespaceId;
    value;
    options;
    get params() {
      return this.options.params;
    }
    constructor(t, e = "") {
      this.namespaceId = e;
      let i = t && t.hasOwnProperty("value"),
        r = i ? t.value : t;
      if (((this.value = RF(r)), i)) {
        let o = t,
          { value: s } = o,
          a = sh(o, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(t) {
      let e = t.params;
      if (e) {
        let i = this.options.params;
        Object.keys(e).forEach((r) => {
          i[r] == null && (i[r] = e[r]);
        });
      }
    }
  },
  ll = "void",
  Lv = new dl(ll),
  qv = class {
    id;
    hostElement;
    _engine;
    players = [];
    _triggers = new Map();
    _queue = [];
    _elementListeners = new Map();
    _hostClassName;
    constructor(t, e, i) {
      (this.id = t),
        (this.hostElement = e),
        (this._engine = i),
        (this._hostClassName = "ng-tns-" + t),
        dn(e, this._hostClassName);
    }
    listen(t, e, i, r) {
      if (!this._triggers.has(e)) throw x0(i, e);
      if (i == null || i.length == 0) throw M0(e);
      if (!AF(i)) throw T0(i, e);
      let o = Ut(this._elementListeners, t, []),
        s = { name: e, phase: i, callback: r };
      o.push(s);
      let a = Ut(this._engine.statesByElement, t, new Map());
      return (
        a.has(e) || (dn(t, ol), dn(t, ol + "-" + e), a.set(e, Lv)),
        () => {
          this._engine.afterFlush(() => {
            let l = o.indexOf(s);
            l >= 0 && o.splice(l, 1), this._triggers.has(e) || a.delete(e);
          });
        }
      );
    }
    register(t, e) {
      return this._triggers.has(t) ? !1 : (this._triggers.set(t, e), !0);
    }
    _getTrigger(t) {
      let e = this._triggers.get(t);
      if (!e) throw R0(t);
      return e;
    }
    trigger(t, e, i, r = !0) {
      let o = this._getTrigger(e),
        s = new ul(this.id, e, t),
        a = this._engine.statesByElement.get(t);
      a ||
        (dn(t, ol),
        dn(t, ol + "-" + e),
        this._engine.statesByElement.set(t, (a = new Map())));
      let l = a.get(e),
        c = new dl(i, this.id);
      if (
        (!(i && i.hasOwnProperty("value")) && l && c.absorbOptions(l.options),
        a.set(e, c),
        l || (l = Lv),
        !(c.value === ll) && l.value === c.value)
      ) {
        if (!kF(l.params, c.params)) {
          let g = [],
            w = o.matchStyles(l.value, l.params, g),
            S = o.matchStyles(c.value, c.params, g);
          g.length
            ? this._engine.reportError(g)
            : this._engine.afterFlush(() => {
                tr(t, w), Rn(t, S);
              });
        }
        return;
      }
      let p = Ut(this._engine.playersByElement, t, []);
      p.forEach((g) => {
        g.namespaceId == this.id &&
          g.triggerName == e &&
          g.queued &&
          g.destroy();
      });
      let h = o.matchTransition(l.value, c.value, t, c.params),
        m = !1;
      if (!h) {
        if (!r) return;
        (h = o.fallbackTransition), (m = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: t,
          triggerName: e,
          transition: h,
          fromState: l,
          toState: c,
          player: s,
          isFallbackTransition: m,
        }),
        m ||
          (dn(t, z0),
          s.onStart(() => {
            fs(t, z0);
          })),
        s.onDone(() => {
          let g = this.players.indexOf(s);
          g >= 0 && this.players.splice(g, 1);
          let w = this._engine.playersByElement.get(t);
          if (w) {
            let S = w.indexOf(s);
            S >= 0 && w.splice(S, 1);
          }
        }),
        this.players.push(s),
        p.push(s),
        s
      );
    }
    deregister(t) {
      this._triggers.delete(t),
        this._engine.statesByElement.forEach((e) => e.delete(t)),
        this._elementListeners.forEach((e, i) => {
          this._elementListeners.set(
            i,
            e.filter((r) => r.name != t)
          );
        });
    }
    clearElementCache(t) {
      this._engine.statesByElement.delete(t), this._elementListeners.delete(t);
      let e = this._engine.playersByElement.get(t);
      e &&
        (e.forEach((i) => i.destroy()),
        this._engine.playersByElement.delete(t));
    }
    _signalRemovalForInnerTriggers(t, e) {
      let i = this._engine.driver.query(t, sl, !0);
      i.forEach((r) => {
        if (r[An]) return;
        let o = this._engine.fetchNamespacesByElement(r);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(r, e, !1, !0))
          : this.clearElementCache(r);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          i.forEach((r) => this.clearElementCache(r))
        );
    }
    triggerLeaveAnimation(t, e, i, r) {
      let o = this._engine.statesByElement.get(t),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((l, c) => {
            if ((s.set(c, l.value), this._triggers.has(c))) {
              let d = this.trigger(t, c, ll, r);
              d && a.push(d);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, t, !0, e, s),
            i && Di(a).onDone(() => this._engine.processLeaveNode(t)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(t) {
      let e = this._elementListeners.get(t),
        i = this._engine.statesByElement.get(t);
      if (e && i) {
        let r = new Set();
        e.forEach((o) => {
          let s = o.name;
          if (r.has(s)) return;
          r.add(s);
          let l = this._triggers.get(s).fallbackTransition,
            c = i.get(s) || Lv,
            d = new dl(ll),
            u = new ul(this.id, s, t);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: s,
              transition: l,
              fromState: c,
              toState: d,
              player: u,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(t, e) {
      let i = this._engine;
      if (
        (t.childElementCount && this._signalRemovalForInnerTriggers(t, e),
        this.triggerLeaveAnimation(t, e, !0))
      )
        return;
      let r = !1;
      if (i.totalAnimations) {
        let o = i.players.length ? i.playersByQueriedElement.get(t) : [];
        if (o && o.length) r = !0;
        else {
          let s = t;
          for (; (s = s.parentNode); )
            if (i.statesByElement.get(s)) {
              r = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(t), r))
        i.markElementAsRemoved(this.id, t, !1, e);
      else {
        let o = t[An];
        (!o || o === X0) &&
          (i.afterFlush(() => this.clearElementCache(t)),
          i.destroyInnerAnimations(t),
          i._onRemovalComplete(t, e));
      }
    }
    insertNode(t, e) {
      dn(t, this._hostClassName);
    }
    drainQueuedTransitions(t) {
      let e = [];
      return (
        this._queue.forEach((i) => {
          let r = i.player;
          if (r.destroyed) return;
          let o = i.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == i.triggerName) {
                let l = Vu(
                  o,
                  i.triggerName,
                  i.fromState.value,
                  i.toState.value
                );
                (l._data = t), Lu(i.player, a.phase, l, a.callback);
              }
            }),
            r.markedForDestroy
              ? this._engine.afterFlush(() => {
                  r.destroy();
                })
              : e.push(i);
        }),
        (this._queue = []),
        e.sort((i, r) => {
          let o = i.transition.ast.depCount,
            s = r.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(i.element, r.element)
            ? 1
            : -1;
        })
      );
    }
    destroy(t) {
      this.players.forEach((e) => e.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, t);
    }
  },
  Yv = class {
    bodyNode;
    driver;
    _normalizer;
    players = [];
    newHostElements = new Map();
    playersByElement = new Map();
    playersByQueriedElement = new Map();
    statesByElement = new Map();
    disabledNodes = new Set();
    totalAnimations = 0;
    totalQueuedPlayers = 0;
    _namespaceLookup = {};
    _namespaceList = [];
    _flushFns = [];
    _whenQuietFns = [];
    namespacesByHostElement = new Map();
    collectedEnterElements = [];
    collectedLeaveElements = [];
    onRemovalComplete = (t, e) => {};
    _onRemovalComplete(t, e) {
      this.onRemovalComplete(t, e);
    }
    constructor(t, e, i) {
      (this.bodyNode = t), (this.driver = e), (this._normalizer = i);
    }
    get queuedPlayers() {
      let t = [];
      return (
        this._namespaceList.forEach((e) => {
          e.players.forEach((i) => {
            i.queued && t.push(i);
          });
        }),
        t
      );
    }
    createNamespace(t, e) {
      let i = new qv(t, e, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, e)
          ? this._balanceNamespaceList(i, e)
          : (this.newHostElements.set(e, i), this.collectEnterElement(e)),
        (this._namespaceLookup[t] = i)
      );
    }
    _balanceNamespaceList(t, e) {
      let i = this._namespaceList,
        r = this.namespacesByHostElement;
      if (i.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(e);
        for (; a; ) {
          let l = r.get(a);
          if (l) {
            let c = i.indexOf(l);
            i.splice(c + 1, 0, t), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || i.unshift(t);
      } else i.push(t);
      return r.set(e, t), t;
    }
    register(t, e) {
      let i = this._namespaceLookup[t];
      return i || (i = this.createNamespace(t, e)), i;
    }
    registerTrigger(t, e, i) {
      let r = this._namespaceLookup[t];
      r && r.register(e, i) && this.totalAnimations++;
    }
    destroy(t, e) {
      t &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let i = this._fetchNamespace(t);
          this.namespacesByHostElement.delete(i.hostElement);
          let r = this._namespaceList.indexOf(i);
          r >= 0 && this._namespaceList.splice(r, 1),
            i.destroy(e),
            delete this._namespaceLookup[t];
        }));
    }
    _fetchNamespace(t) {
      return this._namespaceLookup[t];
    }
    fetchNamespacesByElement(t) {
      let e = new Set(),
        i = this.statesByElement.get(t);
      if (i) {
        for (let r of i.values())
          if (r.namespaceId) {
            let o = this._fetchNamespace(r.namespaceId);
            o && e.add(o);
          }
      }
      return e;
    }
    trigger(t, e, i, r) {
      if (Wu(e)) {
        let o = this._fetchNamespace(t);
        if (o) return o.trigger(e, i, r), !0;
      }
      return !1;
    }
    insertNode(t, e, i, r) {
      if (!Wu(e)) return;
      let o = e[An];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(e);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (t) {
        let s = this._fetchNamespace(t);
        s && s.insertNode(e, i);
      }
      r && this.collectEnterElement(e);
    }
    collectEnterElement(t) {
      this.collectedEnterElements.push(t);
    }
    markElementAsDisabled(t, e) {
      e
        ? this.disabledNodes.has(t) || (this.disabledNodes.add(t), dn(t, Fv))
        : this.disabledNodes.has(t) &&
          (this.disabledNodes.delete(t), fs(t, Fv));
    }
    removeNode(t, e, i) {
      if (Wu(e)) {
        let r = t ? this._fetchNamespace(t) : null;
        r ? r.removeNode(e, i) : this.markElementAsRemoved(t, e, !1, i);
        let o = this.namespacesByHostElement.get(e);
        o && o.id !== t && o.removeNode(e, i);
      } else this._onRemovalComplete(e, i);
    }
    markElementAsRemoved(t, e, i, r, o) {
      this.collectedLeaveElements.push(e),
        (e[An] = {
          namespaceId: t,
          setForRemoval: r,
          hasAnimation: i,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(t, e, i, r, o) {
      return Wu(e) ? this._fetchNamespace(t).listen(e, i, r, o) : () => {};
    }
    _buildInstruction(t, e, i, r, o) {
      return t.transition.build(
        this.driver,
        t.element,
        t.fromState.value,
        t.toState.value,
        i,
        r,
        t.fromState.options,
        t.toState.options,
        e,
        o
      );
    }
    destroyInnerAnimations(t) {
      let e = this.driver.query(t, sl, !0);
      e.forEach((i) => this.destroyActiveAnimationsForElement(i)),
        this.playersByQueriedElement.size != 0 &&
          ((e = this.driver.query(t, Hu, !0)),
          e.forEach((i) => this.finishActiveQueriedAnimationOnElement(i)));
    }
    destroyActiveAnimationsForElement(t) {
      let e = this.playersByElement.get(t);
      e &&
        e.forEach((i) => {
          i.queued ? (i.markedForDestroy = !0) : i.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(t) {
      let e = this.playersByQueriedElement.get(t);
      e && e.forEach((i) => i.finish());
    }
    whenRenderingDone() {
      return new Promise((t) => {
        if (this.players.length) return Di(this.players).onDone(() => t());
        t();
      });
    }
    processLeaveNode(t) {
      let e = t[An];
      if (e && e.setForRemoval) {
        if (((t[An] = X0), e.namespaceId)) {
          this.destroyInnerAnimations(t);
          let i = this._fetchNamespace(e.namespaceId);
          i && i.clearElementCache(t);
        }
        this._onRemovalComplete(t, e.setForRemoval);
      }
      t.classList?.contains(Fv) && this.markElementAsDisabled(t, !1),
        this.driver.query(t, CF, !0).forEach((i) => {
          this.markElementAsDisabled(i, !1);
        });
    }
    flush(t = -1) {
      let e = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((i, r) =>
            this._balanceNamespaceList(i, r)
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let i = 0; i < this.collectedEnterElements.length; i++) {
          let r = this.collectedEnterElements[i];
          dn(r, IF);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let i = [];
        try {
          e = this._flushAnimations(i, t);
        } finally {
          for (let r = 0; r < i.length; r++) i[r]();
        }
      } else
        for (let i = 0; i < this.collectedLeaveElements.length; i++) {
          let r = this.collectedLeaveElements[i];
          this.processLeaveNode(r);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((i) => i()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let i = this._whenQuietFns;
        (this._whenQuietFns = []),
          e.length
            ? Di(e).onDone(() => {
                i.forEach((r) => r());
              })
            : i.forEach((r) => r());
      }
    }
    reportError(t) {
      throw A0(t);
    }
    _flushAnimations(t, e) {
      let i = new cl(),
        r = [],
        o = new Map(),
        s = [],
        a = new Map(),
        l = new Map(),
        c = new Map(),
        d = new Set();
      this.disabledNodes.forEach((T) => {
        d.add(T);
        let N = this.driver.query(T, DF, !0);
        for (let P = 0; P < N.length; P++) d.add(N[P]);
      });
      let u = this.bodyNode,
        p = Array.from(this.statesByElement.keys()),
        h = W0(p, this.collectedEnterElements),
        m = new Map(),
        g = 0;
      h.forEach((T, N) => {
        let P = Av + g++;
        m.set(N, P), T.forEach((ce) => dn(ce, P));
      });
      let w = [],
        S = new Set(),
        ae = new Set();
      for (let T = 0; T < this.collectedLeaveElements.length; T++) {
        let N = this.collectedLeaveElements[T],
          P = N[An];
        P &&
          P.setForRemoval &&
          (w.push(N),
          S.add(N),
          P.hasAnimation
            ? this.driver.query(N, SF, !0).forEach((ce) => S.add(ce))
            : ae.add(N));
      }
      let he = new Map(),
        be = W0(p, Array.from(S));
      be.forEach((T, N) => {
        let P = Bu + g++;
        he.set(N, P), T.forEach((ce) => dn(ce, P));
      }),
        t.push(() => {
          h.forEach((T, N) => {
            let P = m.get(N);
            T.forEach((ce) => fs(ce, P));
          }),
            be.forEach((T, N) => {
              let P = he.get(N);
              T.forEach((ce) => fs(ce, P));
            }),
            w.forEach((T) => {
              this.processLeaveNode(T);
            });
        });
      let Xn = [],
        Nn = [];
      for (let T = this._namespaceList.length - 1; T >= 0; T--)
        this._namespaceList[T].drainQueuedTransitions(e).forEach((P) => {
          let ce = P.player,
            rt = P.element;
          if ((Xn.push(ce), this.collectedEnterElements.length)) {
            let vt = rt[An];
            if (vt && vt.setForMove) {
              if (
                vt.previousTriggersValues &&
                vt.previousTriggersValues.has(P.triggerName)
              ) {
                let hr = vt.previousTriggersValues.get(P.triggerName),
                  en = this.statesByElement.get(P.element);
                if (en && en.has(P.triggerName)) {
                  let kl = en.get(P.triggerName);
                  (kl.value = hr), en.set(P.triggerName, kl);
                }
              }
              ce.destroy();
              return;
            }
          }
          let On = !u || !this.driver.containsElement(u, rt),
            Gt = he.get(rt),
            xi = m.get(rt),
            Pe = this._buildInstruction(P, i, xi, Gt, On);
          if (Pe.errors && Pe.errors.length) {
            Nn.push(Pe);
            return;
          }
          if (On) {
            ce.onStart(() => tr(rt, Pe.fromStyles)),
              ce.onDestroy(() => Rn(rt, Pe.toStyles)),
              r.push(ce);
            return;
          }
          if (P.isFallbackTransition) {
            ce.onStart(() => tr(rt, Pe.fromStyles)),
              ce.onDestroy(() => Rn(rt, Pe.toStyles)),
              r.push(ce);
            return;
          }
          let sy = [];
          Pe.timelines.forEach((vt) => {
            (vt.stretchStartingKeyframe = !0),
              this.disabledNodes.has(vt.element) || sy.push(vt);
          }),
            (Pe.timelines = sy),
            i.append(rt, Pe.timelines);
          let Ox = { instruction: Pe, player: ce, element: rt };
          s.push(Ox),
            Pe.queriedElements.forEach((vt) => Ut(a, vt, []).push(ce)),
            Pe.preStyleProps.forEach((vt, hr) => {
              if (vt.size) {
                let en = l.get(hr);
                en || l.set(hr, (en = new Set())),
                  vt.forEach((kl, oh) => en.add(oh));
              }
            }),
            Pe.postStyleProps.forEach((vt, hr) => {
              let en = c.get(hr);
              en || c.set(hr, (en = new Set())),
                vt.forEach((kl, oh) => en.add(oh));
            });
        });
      if (Nn.length) {
        let T = [];
        Nn.forEach((N) => {
          T.push(N0(N.triggerName, N.errors));
        }),
          Xn.forEach((N) => N.destroy()),
          this.reportError(T);
      }
      let Ct = new Map(),
        Nt = new Map();
      s.forEach((T) => {
        let N = T.element;
        i.has(N) &&
          (Nt.set(N, N),
          this._beforeAnimationBuild(T.player.namespaceId, T.instruction, Ct));
      }),
        r.forEach((T) => {
          let N = T.element;
          this._getPreviousPlayers(
            N,
            !1,
            T.namespaceId,
            T.triggerName,
            null
          ).forEach((ce) => {
            Ut(Ct, N, []).push(ce), ce.destroy();
          });
        });
      let ur = w.filter((T) => q0(T, l, c)),
        fo = new Map();
      G0(fo, this.driver, ae, c, Tn).forEach((T) => {
        q0(T, l, c) && ur.push(T);
      });
      let fr = new Map();
      h.forEach((T, N) => {
        G0(fr, this.driver, new Set(T), l, rl);
      }),
        ur.forEach((T) => {
          let N = fo.get(T),
            P = fr.get(T);
          fo.set(
            T,
            new Map([...(N?.entries() ?? []), ...(P?.entries() ?? [])])
          );
        });
      let rh = [],
        ry = [],
        oy = {};
      s.forEach((T) => {
        let { element: N, player: P, instruction: ce } = T;
        if (i.has(N)) {
          if (d.has(N)) {
            P.onDestroy(() => Rn(N, ce.toStyles)),
              (P.disabled = !0),
              P.overrideTotalTime(ce.totalTime),
              r.push(P);
            return;
          }
          let rt = oy;
          if (Nt.size > 1) {
            let Gt = N,
              xi = [];
            for (; (Gt = Gt.parentNode); ) {
              let Pe = Nt.get(Gt);
              if (Pe) {
                rt = Pe;
                break;
              }
              xi.push(Gt);
            }
            xi.forEach((Pe) => Nt.set(Pe, rt));
          }
          let On = this._buildAnimation(P.namespaceId, ce, Ct, o, fr, fo);
          if ((P.setRealPlayer(On), rt === oy)) rh.push(P);
          else {
            let Gt = this.playersByElement.get(rt);
            Gt && Gt.length && (P.parentPlayer = Di(Gt)), r.push(P);
          }
        } else
          tr(N, ce.fromStyles),
            P.onDestroy(() => Rn(N, ce.toStyles)),
            ry.push(P),
            d.has(N) && r.push(P);
      }),
        ry.forEach((T) => {
          let N = o.get(T.element);
          if (N && N.length) {
            let P = Di(N);
            T.setRealPlayer(P);
          }
        }),
        r.forEach((T) => {
          T.parentPlayer ? T.syncPlayerEvents(T.parentPlayer) : T.destroy();
        });
      for (let T = 0; T < w.length; T++) {
        let N = w[T],
          P = N[An];
        if ((fs(N, Bu), P && P.hasAnimation)) continue;
        let ce = [];
        if (a.size) {
          let On = a.get(N);
          On && On.length && ce.push(...On);
          let Gt = this.driver.query(N, Hu, !0);
          for (let xi = 0; xi < Gt.length; xi++) {
            let Pe = a.get(Gt[xi]);
            Pe && Pe.length && ce.push(...Pe);
          }
        }
        let rt = ce.filter((On) => !On.destroyed);
        rt.length ? NF(this, N, rt) : this.processLeaveNode(N);
      }
      return (
        (w.length = 0),
        rh.forEach((T) => {
          this.players.push(T),
            T.onDone(() => {
              T.destroy();
              let N = this.players.indexOf(T);
              this.players.splice(N, 1);
            }),
            T.play();
        }),
        rh
      );
    }
    afterFlush(t) {
      this._flushFns.push(t);
    }
    afterFlushAnimationsDone(t) {
      this._whenQuietFns.push(t);
    }
    _getPreviousPlayers(t, e, i, r, o) {
      let s = [];
      if (e) {
        let a = this.playersByQueriedElement.get(t);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(t);
        if (a) {
          let l = !o || o == ll;
          a.forEach((c) => {
            c.queued || (!l && c.triggerName != r) || s.push(c);
          });
        }
      }
      return (
        (i || r) &&
          (s = s.filter(
            (a) => !((i && i != a.namespaceId) || (r && r != a.triggerName))
          )),
        s
      );
    }
    _beforeAnimationBuild(t, e, i) {
      let r = e.triggerName,
        o = e.element,
        s = e.isRemovalTransition ? void 0 : t,
        a = e.isRemovalTransition ? void 0 : r;
      for (let l of e.timelines) {
        let c = l.element,
          d = c !== o,
          u = Ut(i, c, []);
        this._getPreviousPlayers(c, d, s, a, e.toState).forEach((h) => {
          let m = h.getRealPlayer();
          m.beforeDestroy && m.beforeDestroy(), h.destroy(), u.push(h);
        });
      }
      tr(o, e.fromStyles);
    }
    _buildAnimation(t, e, i, r, o, s) {
      let a = e.triggerName,
        l = e.element,
        c = [],
        d = new Set(),
        u = new Set(),
        p = e.timelines.map((m) => {
          let g = m.element;
          d.add(g);
          let w = g[An];
          if (w && w.removedBeforeQueried) return new Ei(m.duration, m.delay);
          let S = g !== l,
            ae = OF((i.get(g) || xF).map((Ct) => Ct.getRealPlayer())).filter(
              (Ct) => {
                let Nt = Ct;
                return Nt.element ? Nt.element === g : !1;
              }
            ),
            he = o.get(g),
            be = s.get(g),
            Xn = Sv(this._normalizer, m.keyframes, he, be),
            Nn = this._buildPlayer(m, Xn, ae);
          if ((m.subTimeline && r && u.add(g), S)) {
            let Ct = new ul(t, a, g);
            Ct.setRealPlayer(Nn), c.push(Ct);
          }
          return Nn;
        });
      c.forEach((m) => {
        Ut(this.playersByQueriedElement, m.element, []).push(m),
          m.onDone(() => TF(this.playersByQueriedElement, m.element, m));
      }),
        d.forEach((m) => dn(m, Nv));
      let h = Di(p);
      return (
        h.onDestroy(() => {
          d.forEach((m) => fs(m, Nv)), Rn(l, e.toStyles);
        }),
        u.forEach((m) => {
          Ut(r, m, []).push(h);
        }),
        h
      );
    }
    _buildPlayer(t, e, i) {
      return e.length > 0
        ? this.driver.animate(t.element, e, t.duration, t.delay, t.easing, i)
        : new Ei(t.duration, t.delay);
    }
  },
  ul = class {
    namespaceId;
    triggerName;
    element;
    _player = new Ei();
    _containsRealPlayer = !1;
    _queuedCallbacks = new Map();
    destroyed = !1;
    parentPlayer = null;
    markedForDestroy = !1;
    disabled = !1;
    queued = !0;
    totalTime = 0;
    constructor(t, e, i) {
      (this.namespaceId = t), (this.triggerName = e), (this.element = i);
    }
    setRealPlayer(t) {
      this._containsRealPlayer ||
        ((this._player = t),
        this._queuedCallbacks.forEach((e, i) => {
          e.forEach((r) => Lu(t, i, void 0, r));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(t.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(t) {
      this.totalTime = t;
    }
    syncPlayerEvents(t) {
      let e = this._player;
      e.triggerCallback && t.onStart(() => e.triggerCallback("start")),
        t.onDone(() => this.finish()),
        t.onDestroy(() => this.destroy());
    }
    _queueEvent(t, e) {
      Ut(this._queuedCallbacks, t, []).push(e);
    }
    onDone(t) {
      this.queued && this._queueEvent("done", t), this._player.onDone(t);
    }
    onStart(t) {
      this.queued && this._queueEvent("start", t), this._player.onStart(t);
    }
    onDestroy(t) {
      this.queued && this._queueEvent("destroy", t), this._player.onDestroy(t);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(t) {
      this.queued || this._player.setPosition(t);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(t) {
      let e = this._player;
      e.triggerCallback && e.triggerCallback(t);
    }
  };
function TF(n, t, e) {
  let i = n.get(t);
  if (i) {
    if (i.length) {
      let r = i.indexOf(e);
      i.splice(r, 1);
    }
    i.length == 0 && n.delete(t);
  }
  return i;
}
function RF(n) {
  return n ?? null;
}
function Wu(n) {
  return n && n.nodeType === 1;
}
function AF(n) {
  return n == "start" || n == "done";
}
function $0(n, t) {
  let e = n.style.display;
  return (n.style.display = t ?? "none"), e;
}
function G0(n, t, e, i, r) {
  let o = [];
  e.forEach((l) => o.push($0(l)));
  let s = [];
  i.forEach((l, c) => {
    let d = new Map();
    l.forEach((u) => {
      let p = t.computeStyle(c, u, r);
      d.set(u, p), (!p || p.length == 0) && ((c[An] = MF), s.push(c));
    }),
      n.set(c, d);
  });
  let a = 0;
  return e.forEach((l) => $0(l, o[a++])), s;
}
function W0(n, t) {
  let e = new Map();
  if ((n.forEach((a) => e.set(a, [])), t.length == 0)) return e;
  let i = 1,
    r = new Set(t),
    o = new Map();
  function s(a) {
    if (!a) return i;
    let l = o.get(a);
    if (l) return l;
    let c = a.parentNode;
    return e.has(c) ? (l = c) : r.has(c) ? (l = i) : (l = s(c)), o.set(a, l), l;
  }
  return (
    t.forEach((a) => {
      let l = s(a);
      l !== i && e.get(l).push(a);
    }),
    e
  );
}
function dn(n, t) {
  n.classList?.add(t);
}
function fs(n, t) {
  n.classList?.remove(t);
}
function NF(n, t, e) {
  Di(e).onDone(() => n.processLeaveNode(t));
}
function OF(n) {
  let t = [];
  return J0(n, t), t;
}
function J0(n, t) {
  for (let e = 0; e < n.length; e++) {
    let i = n[e];
    i instanceof cs ? J0(i.players, t) : t.push(i);
  }
}
function kF(n, t) {
  let e = Object.keys(n),
    i = Object.keys(t);
  if (e.length != i.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r];
    if (!t.hasOwnProperty(o) || n[o] !== t[o]) return !1;
  }
  return !0;
}
function q0(n, t, e) {
  let i = e.get(n);
  if (!i) return !1;
  let r = t.get(n);
  return r ? i.forEach((o) => r.add(o)) : t.set(n, i), e.delete(n), !0;
}
var hs = class {
  _driver;
  _normalizer;
  _transitionEngine;
  _timelineEngine;
  _triggerCache = {};
  onRemovalComplete = (t, e) => {};
  constructor(t, e, i) {
    (this._driver = e),
      (this._normalizer = i),
      (this._transitionEngine = new Yv(t.body, e, i)),
      (this._timelineEngine = new Wv(t.body, e, i)),
      (this._transitionEngine.onRemovalComplete = (r, o) =>
        this.onRemovalComplete(r, o));
  }
  registerTrigger(t, e, i, r, o) {
    let s = t + "-" + r,
      a = this._triggerCache[s];
    if (!a) {
      let l = [],
        c = [],
        d = K0(this._driver, o, l, c);
      if (l.length) throw E0(r, l);
      (a = bF(r, d, this._normalizer)), (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(e, r, a);
  }
  register(t, e) {
    this._transitionEngine.register(t, e);
  }
  destroy(t, e) {
    this._transitionEngine.destroy(t, e);
  }
  onInsert(t, e, i, r) {
    this._transitionEngine.insertNode(t, e, i, r);
  }
  onRemove(t, e, i) {
    this._transitionEngine.removeNode(t, e, i);
  }
  disableAnimations(t, e) {
    this._transitionEngine.markElementAsDisabled(t, e);
  }
  process(t, e, i, r) {
    if (i.charAt(0) == "@") {
      let [o, s] = xv(i),
        a = r;
      this._timelineEngine.command(o, e, s, a);
    } else this._transitionEngine.trigger(t, e, i, r);
  }
  listen(t, e, i, r, o) {
    if (i.charAt(0) == "@") {
      let [s, a] = xv(i);
      return this._timelineEngine.listen(s, e, a, o);
    }
    return this._transitionEngine.listen(t, e, i, r, o);
  }
  flush(t = -1) {
    this._transitionEngine.flush(t);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(t) {
    this._transitionEngine.afterFlushAnimationsDone(t);
  }
};
function PF(n, t) {
  let e = null,
    i = null;
  return (
    Array.isArray(t) && t.length
      ? ((e = Vv(t[0])), t.length > 1 && (i = Vv(t[t.length - 1])))
      : t instanceof Map && (e = Vv(t)),
    e || i ? new FF(n, e, i) : null
  );
}
var FF = (() => {
  class n {
    _element;
    _startStyles;
    _endStyles;
    static initialStylesByElement = new WeakMap();
    _state = 0;
    _initialStyles;
    constructor(e, i, r) {
      (this._element = e), (this._startStyles = i), (this._endStyles = r);
      let o = n.initialStylesByElement.get(e);
      o || n.initialStylesByElement.set(e, (o = new Map())),
        (this._initialStyles = o);
    }
    start() {
      this._state < 1 &&
        (this._startStyles &&
          Rn(this._element, this._startStyles, this._initialStyles),
        (this._state = 1));
    }
    finish() {
      this.start(),
        this._state < 2 &&
          (Rn(this._element, this._initialStyles),
          this._endStyles &&
            (Rn(this._element, this._endStyles), (this._endStyles = null)),
          (this._state = 1));
    }
    destroy() {
      this.finish(),
        this._state < 3 &&
          (n.initialStylesByElement.delete(this._element),
          this._startStyles &&
            (tr(this._element, this._startStyles), (this._endStyles = null)),
          this._endStyles &&
            (tr(this._element, this._endStyles), (this._endStyles = null)),
          Rn(this._element, this._initialStyles),
          (this._state = 3));
    }
  }
  return n;
})();
function Vv(n) {
  let t = null;
  return (
    n.forEach((e, i) => {
      LF(i) && ((t = t || new Map()), t.set(i, e));
    }),
    t
  );
}
function LF(n) {
  return n === "display" || n === "position";
}
var Ju = class {
    element;
    keyframes;
    options;
    _specialStyles;
    _onDoneFns = [];
    _onStartFns = [];
    _onDestroyFns = [];
    _duration;
    _delay;
    _initialized = !1;
    _finished = !1;
    _started = !1;
    _destroyed = !1;
    _finalKeyframe;
    _originalOnDoneFns = [];
    _originalOnStartFns = [];
    domPlayer;
    time = 0;
    parentPlayer = null;
    currentSnapshot = new Map();
    constructor(t, e, i, r) {
      (this.element = t),
        (this.keyframes = e),
        (this.options = i),
        (this._specialStyles = r),
        (this._duration = i.duration),
        (this._delay = i.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let t = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        t,
        this.options
      )),
        (this._finalKeyframe = t.length ? t[t.length - 1] : new Map());
      let e = () => this._onFinish();
      this.domPlayer.addEventListener("finish", e),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", e);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(t) {
      let e = [];
      return (
        t.forEach((i) => {
          e.push(Object.fromEntries(i));
        }),
        e
      );
    }
    _triggerWebAnimation(t, e, i) {
      return t.animate(this._convertKeyframesToObject(e), i);
    }
    onStart(t) {
      this._originalOnStartFns.push(t), this._onStartFns.push(t);
    }
    onDone(t) {
      this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((t) => t()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    setPosition(t) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = t * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let t = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((i, r) => {
          r !== "offset" && t.set(r, this._finished ? i : zu(this.element, r));
        }),
        (this.currentSnapshot = t);
    }
    triggerCallback(t) {
      let e = t === "start" ? this._onStartFns : this._onDoneFns;
      e.forEach((i) => i()), (e.length = 0);
    }
  },
  ef = class {
    validateStyleProperty(t) {
      return !0;
    }
    validateAnimatableStyleProperty(t) {
      return !0;
    }
    containsElement(t, e) {
      return Mv(t, e);
    }
    getParentElement(t) {
      return ju(t);
    }
    query(t, e, i) {
      return Tv(t, e, i);
    }
    computeStyle(t, e, i) {
      return zu(t, e);
    }
    animate(t, e, i, r, o, s = []) {
      let a = r == 0 ? "both" : "forwards",
        l = { duration: i, delay: r, fill: a };
      o && (l.easing = o);
      let c = new Map(),
        d = s.filter((h) => h instanceof Ju);
      F0(i, r) &&
        d.forEach((h) => {
          h.currentSnapshot.forEach((m, g) => c.set(g, m));
        });
      let u = k0(e).map((h) => new Map(h));
      u = L0(t, u, c);
      let p = PF(t, u);
      return new Ju(t, u, l, p);
    }
  };
var qu = "@",
  eI = "@.disabled",
  tf = class {
    namespaceId;
    delegate;
    engine;
    _onDestroy;
    ɵtype = 0;
    constructor(t, e, i, r) {
      (this.namespaceId = t),
        (this.delegate = e),
        (this.engine = i),
        (this._onDestroy = r);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(t) {
      this.delegate.destroyNode?.(t);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(t, e) {
      return this.delegate.createElement(t, e);
    }
    createComment(t) {
      return this.delegate.createComment(t);
    }
    createText(t) {
      return this.delegate.createText(t);
    }
    appendChild(t, e) {
      this.delegate.appendChild(t, e),
        this.engine.onInsert(this.namespaceId, e, t, !1);
    }
    insertBefore(t, e, i, r = !0) {
      this.delegate.insertBefore(t, e, i),
        this.engine.onInsert(this.namespaceId, e, t, r);
    }
    removeChild(t, e, i) {
      this.parentNode(e) &&
        this.engine.onRemove(this.namespaceId, e, this.delegate);
    }
    selectRootElement(t, e) {
      return this.delegate.selectRootElement(t, e);
    }
    parentNode(t) {
      return this.delegate.parentNode(t);
    }
    nextSibling(t) {
      return this.delegate.nextSibling(t);
    }
    setAttribute(t, e, i, r) {
      this.delegate.setAttribute(t, e, i, r);
    }
    removeAttribute(t, e, i) {
      this.delegate.removeAttribute(t, e, i);
    }
    addClass(t, e) {
      this.delegate.addClass(t, e);
    }
    removeClass(t, e) {
      this.delegate.removeClass(t, e);
    }
    setStyle(t, e, i, r) {
      this.delegate.setStyle(t, e, i, r);
    }
    removeStyle(t, e, i) {
      this.delegate.removeStyle(t, e, i);
    }
    setProperty(t, e, i) {
      e.charAt(0) == qu && e == eI
        ? this.disableAnimations(t, !!i)
        : this.delegate.setProperty(t, e, i);
    }
    setValue(t, e) {
      this.delegate.setValue(t, e);
    }
    listen(t, e, i, r) {
      return this.delegate.listen(t, e, i, r);
    }
    disableAnimations(t, e) {
      this.engine.disableAnimations(t, e);
    }
  },
  Kv = class extends tf {
    factory;
    constructor(t, e, i, r, o) {
      super(e, i, r, o), (this.factory = t), (this.namespaceId = e);
    }
    setProperty(t, e, i) {
      e.charAt(0) == qu
        ? e.charAt(1) == "." && e == eI
          ? ((i = i === void 0 ? !0 : !!i), this.disableAnimations(t, i))
          : this.engine.process(this.namespaceId, t, e.slice(1), i)
        : this.delegate.setProperty(t, e, i);
    }
    listen(t, e, i, r) {
      if (e.charAt(0) == qu) {
        let o = VF(t),
          s = e.slice(1),
          a = "";
        return (
          s.charAt(0) != qu && ([s, a] = jF(s)),
          this.engine.listen(this.namespaceId, o, s, a, (l) => {
            let c = l._data || -1;
            this.factory.scheduleListenerCallback(c, i, l);
          })
        );
      }
      return this.delegate.listen(t, e, i, r);
    }
  };
function VF(n) {
  switch (n) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return n;
  }
}
function jF(n) {
  let t = n.indexOf("."),
    e = n.substring(0, t),
    i = n.slice(t + 1);
  return [e, i];
}
var nf = class {
  delegate;
  engine;
  _zone;
  _currentId = 0;
  _microtaskId = 1;
  _animationCallbacksBuffer = [];
  _rendererCache = new Map();
  _cdRecurDepth = 0;
  constructor(t, e, i) {
    (this.delegate = t),
      (this.engine = e),
      (this._zone = i),
      (e.onRemovalComplete = (r, o) => {
        o?.removeChild(null, r);
      });
  }
  createRenderer(t, e) {
    let i = "",
      r = this.delegate.createRenderer(t, e);
    if (!t || !e?.data?.animation) {
      let c = this._rendererCache,
        d = c.get(r);
      if (!d) {
        let u = () => c.delete(r);
        (d = new tf(i, r, this.engine, u)), c.set(r, d);
      }
      return d;
    }
    let o = e.id,
      s = e.id + "-" + this._currentId;
    this._currentId++, this.engine.register(s, t);
    let a = (c) => {
      Array.isArray(c)
        ? c.forEach(a)
        : this.engine.registerTrigger(o, s, t, c.name, c);
    };
    return e.data.animation.forEach(a), new Kv(this, s, r, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(t, e, i) {
    if (t >= 0 && t < this._microtaskId) {
      this._zone.run(() => e(i));
      return;
    }
    let r = this._animationCallbacksBuffer;
    r.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          r.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      r.push([e, i]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
  componentReplaced(t) {
    this.engine.flush(), this.delegate.componentReplaced?.(t);
  }
};
var HF = (() => {
  class n extends hs {
    constructor(e, i, r) {
      super(e, i, r);
    }
    ngOnDestroy() {
      this.flush();
    }
    static ɵfac = function (i) {
      return new (i || n)(A(O), A(eo), A(to));
    };
    static ɵprov = b({ token: n, factory: n.ɵfac });
  }
  return n;
})();
function UF() {
  return new Yu();
}
function zF(n, t, e) {
  return new nf(n, t, e);
}
var tI = [
    { provide: to, useFactory: UF },
    { provide: hs, useClass: HF },
    { provide: Se, useFactory: zF, deps: [Fa, hs, M] },
  ],
  JK = [
    { provide: eo, useClass: Zv },
    { provide: qi, useValue: "NoopAnimations" },
    ...tI,
  ],
  $F = [
    { provide: eo, useFactory: () => new ef() },
    { provide: qi, useFactory: () => "BrowserAnimations" },
    ...tI,
  ];
function nI() {
  return $n("NgEagerAnimations"), [...$F];
}
var iI = [];
var rI = { providers: [Mp(), gg(), wv(iI), nI()] };
var Xv;
function oI() {
  if (Xv == null) {
    let n = typeof document < "u" ? document.head : null;
    Xv = !!(n && (n.createShadowRoot || n.attachShadow));
  }
  return Xv;
}
function no(n) {
  if (oI()) {
    let t = n.getRootNode ? n.getRootNode() : null;
    if (typeof ShadowRoot < "u" && ShadowRoot && t instanceof ShadowRoot)
      return t;
  }
  return null;
}
function it(n) {
  return n.composedPath ? n.composedPath()[0] : n.target;
}
function Ci(n) {
  return n.buttons === 0 || n.detail === 0;
}
function Ii(n) {
  let t =
    (n.touches && n.touches[0]) || (n.changedTouches && n.changedTouches[0]);
  return (
    !!t &&
    t.identifier === -1 &&
    (t.radiusX == null || t.radiusX === 1) &&
    (t.radiusY == null || t.radiusY === 1)
  );
}
function ps(n, t = 0) {
  return sI(n) ? Number(n) : arguments.length === 2 ? t : 0;
}
function sI(n) {
  return !isNaN(parseFloat(n)) && !isNaN(Number(n));
}
function Ve(n) {
  return n instanceof K ? n.nativeElement : n;
}
var rf = new WeakMap(),
  gt = (() => {
    class n {
      _appRef;
      _injector = f(te);
      _environmentInjector = f(Re);
      load(e) {
        let i = (this._appRef = this._appRef || this._injector.get(jt)),
          r = rf.get(i);
        r ||
          ((r = { loaders: new Set(), refs: [] }),
          rf.set(i, r),
          i.onDestroy(() => {
            rf.get(i)?.refs.forEach((o) => o.destroy()), rf.delete(i);
          })),
          r.loaders.has(e) ||
            (r.loaders.add(e),
            r.refs.push(
              Yd(e, { environmentInjector: this._environmentInjector })
            ));
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var Jv;
try {
  Jv = typeof Intl < "u" && Intl.v8BreakIterator;
} catch {
  Jv = !1;
}
var xe = (() => {
  class n {
    _platformId = f(Wi);
    isBrowser = this._platformId
      ? XD(this._platformId)
      : typeof document == "object" && !!document;
    EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    BLINK =
      this.isBrowser &&
      !!(window.chrome || Jv) &&
      typeof CSS < "u" &&
      !this.EDGE &&
      !this.TRIDENT;
    WEBKIT =
      this.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) &&
      !this.BLINK &&
      !this.EDGE &&
      !this.TRIDENT;
    IOS =
      this.isBrowser &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);
    FIREFOX =
      this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    ANDROID =
      this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    SAFARI =
      this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    constructor() {}
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var GF = new y("cdk-dir-doc", { providedIn: "root", factory: WF });
function WF() {
  return f(O);
}
var qF =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function aI(n) {
  let t = n?.toLowerCase() || "";
  return t === "auto" && typeof navigator < "u" && navigator?.language
    ? qF.test(navigator.language)
      ? "rtl"
      : "ltr"
    : t === "rtl"
    ? "rtl"
    : "ltr";
}
var un = (() => {
  class n {
    get value() {
      return this.valueSignal();
    }
    valueSignal = Ne("ltr");
    change = new j();
    constructor() {
      let e = f(GF, { optional: !0 });
      if (e) {
        let i = e.body ? e.body.dir : null,
          r = e.documentElement ? e.documentElement.dir : null;
        this.valueSignal.set(aI(i || r || "ltr"));
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var io;
function lI() {
  if (io == null) {
    if (
      typeof document != "object" ||
      !document ||
      typeof Element != "function" ||
      !Element
    )
      return (io = !1), io;
    if ("scrollBehavior" in document.documentElement.style) io = !0;
    else {
      let n = Element.prototype.scrollTo;
      n ? (io = !/\{\s*\[native code\]\s*\}/.test(n.toString())) : (io = !1);
    }
  }
  return io;
}
var nr = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({});
  }
  return n;
})();
var YF = 20,
  ms = (() => {
    class n {
      _ngZone = f(M);
      _platform = f(xe);
      _renderer = f(Se).createRenderer(null, null);
      _cleanupGlobalListener;
      constructor() {}
      _scrolled = new E();
      _scrolledCount = 0;
      scrollContainers = new Map();
      register(e) {
        this.scrollContainers.has(e) ||
          this.scrollContainers.set(
            e,
            e.elementScrolled().subscribe(() => this._scrolled.next(e))
          );
      }
      deregister(e) {
        let i = this.scrollContainers.get(e);
        i && (i.unsubscribe(), this.scrollContainers.delete(e));
      }
      scrolled(e = YF) {
        return this._platform.isBrowser
          ? new H((i) => {
              this._cleanupGlobalListener ||
                (this._cleanupGlobalListener = this._ngZone.runOutsideAngular(
                  () =>
                    this._renderer.listen("document", "scroll", () =>
                      this._scrolled.next()
                    )
                ));
              let r =
                e > 0
                  ? this._scrolled.pipe(Dc(e)).subscribe(i)
                  : this._scrolled.subscribe(i);
              return (
                this._scrolledCount++,
                () => {
                  r.unsubscribe(),
                    this._scrolledCount--,
                    this._scrolledCount ||
                      (this._cleanupGlobalListener?.(),
                      (this._cleanupGlobalListener = void 0));
                }
              );
            })
          : I();
      }
      ngOnDestroy() {
        this._cleanupGlobalListener?.(),
          (this._cleanupGlobalListener = void 0),
          this.scrollContainers.forEach((e, i) => this.deregister(i)),
          this._scrolled.complete();
      }
      ancestorScrolled(e, i) {
        let r = this.getAncestorScrollContainers(e);
        return this.scrolled(i).pipe(ve((o) => !o || r.indexOf(o) > -1));
      }
      getAncestorScrollContainers(e) {
        let i = [];
        return (
          this.scrollContainers.forEach((r, o) => {
            this._scrollableContainsElement(o, e) && i.push(o);
          }),
          i
        );
      }
      _scrollableContainsElement(e, i) {
        let r = Ve(i),
          o = e.getElementRef().nativeElement;
        do if (r == o) return !0;
        while ((r = r.parentElement));
        return !1;
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var KF = 20,
  ir = (() => {
    class n {
      _platform = f(xe);
      _listeners;
      _viewportSize;
      _change = new E();
      _document = f(O);
      constructor() {
        let e = f(M),
          i = f(Se).createRenderer(null, null);
        e.runOutsideAngular(() => {
          if (this._platform.isBrowser) {
            let r = (o) => this._change.next(o);
            this._listeners = [
              i.listen("window", "resize", r),
              i.listen("window", "orientationchange", r),
            ];
          }
          this.change().subscribe(() => (this._viewportSize = null));
        });
      }
      ngOnDestroy() {
        this._listeners?.forEach((e) => e()), this._change.complete();
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let e = {
          width: this._viewportSize.width,
          height: this._viewportSize.height,
        };
        return this._platform.isBrowser || (this._viewportSize = null), e;
      }
      getViewportRect() {
        let e = this.getViewportScrollPosition(),
          { width: i, height: r } = this.getViewportSize();
        return {
          top: e.top,
          left: e.left,
          bottom: e.top + r,
          right: e.left + i,
          height: r,
          width: i,
        };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let e = this._document,
          i = this._getWindow(),
          r = e.documentElement,
          o = r.getBoundingClientRect(),
          s = -o.top || e.body.scrollTop || i.scrollY || r.scrollTop || 0,
          a = -o.left || e.body.scrollLeft || i.scrollX || r.scrollLeft || 0;
        return { top: s, left: a };
      }
      change(e = KF) {
        return e > 0 ? this._change.pipe(Dc(e)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let e = this._getWindow();
        this._viewportSize = this._platform.isBrowser
          ? { width: e.innerWidth, height: e.innerHeight }
          : { width: 0, height: 0 };
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var fl = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({});
    }
    return n;
  })(),
  e_ = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({ imports: [nr, fl, nr, fl] });
    }
    return n;
  })();
var t_ = {},
  $t = (() => {
    class n {
      _appId = f(Go);
      getId(e) {
        return (
          this._appId !== "ng" && (e += this._appId),
          t_.hasOwnProperty(e) || (t_[e] = 0),
          `${e}${t_[e]++}`
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function rr(n) {
  return Array.isArray(n) ? n : [n];
}
function r_(n) {
  let t = n.cloneNode(!0),
    e = t.querySelectorAll("[id]"),
    i = n.nodeName.toLowerCase();
  t.removeAttribute("id");
  for (let r = 0; r < e.length; r++) e[r].removeAttribute("id");
  return (
    i === "canvas"
      ? uI(n, t)
      : (i === "input" || i === "select" || i === "textarea") && dI(n, t),
    cI("canvas", n, t, uI),
    cI("input, textarea, select", n, t, dI),
    t
  );
}
function cI(n, t, e, i) {
  let r = t.querySelectorAll(n);
  if (r.length) {
    let o = e.querySelectorAll(n);
    for (let s = 0; s < r.length; s++) i(r[s], o[s]);
  }
}
var ZF = 0;
function dI(n, t) {
  t.type !== "file" && (t.value = n.value),
    t.type === "radio" && t.name && (t.name = `mat-clone-${t.name}-${ZF++}`);
}
function uI(n, t) {
  let e = t.getContext("2d");
  if (e)
    try {
      e.drawImage(n, 0, 0);
    } catch {}
}
function u_(n) {
  let t = n.getBoundingClientRect();
  return {
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    left: t.left,
    width: t.width,
    height: t.height,
    x: t.x,
    y: t.y,
  };
}
function o_(n, t, e) {
  let { top: i, bottom: r, left: o, right: s } = n;
  return e >= i && e <= r && t >= o && t <= s;
}
function QF(n, t) {
  let e = t.left < n.left,
    i = t.left + t.width > n.right,
    r = t.top < n.top,
    o = t.top + t.height > n.bottom;
  return e || i || r || o;
}
function ml(n, t, e) {
  (n.top += t),
    (n.bottom = n.top + n.height),
    (n.left += e),
    (n.right = n.left + n.width);
}
function fI(n, t, e, i) {
  let { top: r, right: o, bottom: s, left: a, width: l, height: c } = n,
    d = l * t,
    u = c * t;
  return i > r - u && i < s + u && e > a - d && e < o + d;
}
var of = class {
  _document;
  positions = new Map();
  constructor(t) {
    this._document = t;
  }
  clear() {
    this.positions.clear();
  }
  cache(t) {
    this.clear(),
      this.positions.set(this._document, {
        scrollPosition: this.getViewportScrollPosition(),
      }),
      t.forEach((e) => {
        this.positions.set(e, {
          scrollPosition: { top: e.scrollTop, left: e.scrollLeft },
          clientRect: u_(e),
        });
      });
  }
  handleScroll(t) {
    let e = it(t),
      i = this.positions.get(e);
    if (!i) return null;
    let r = i.scrollPosition,
      o,
      s;
    if (e === this._document) {
      let c = this.getViewportScrollPosition();
      (o = c.top), (s = c.left);
    } else (o = e.scrollTop), (s = e.scrollLeft);
    let a = r.top - o,
      l = r.left - s;
    return (
      this.positions.forEach((c, d) => {
        c.clientRect && e !== d && e.contains(d) && ml(c.clientRect, a, l);
      }),
      (r.top = o),
      (r.left = s),
      { top: a, left: l }
    );
  }
  getViewportScrollPosition() {
    return { top: window.scrollY, left: window.scrollX };
  }
};
function CI(n, t) {
  let e = n.rootNodes;
  if (e.length === 1 && e[0].nodeType === t.ELEMENT_NODE) return e[0];
  let i = t.createElement("div");
  return e.forEach((r) => i.appendChild(r)), i;
}
function f_(n, t, e) {
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      let r = t[i];
      r
        ? n.setProperty(i, r, e?.has(i) ? "important" : "")
        : n.removeProperty(i);
    }
  return n;
}
function gs(n, t) {
  let e = t ? "" : "none";
  f_(n.style, {
    "touch-action": t ? "" : "none",
    "-webkit-user-drag": t ? "" : "none",
    "-webkit-tap-highlight-color": t ? "" : "transparent",
    "user-select": e,
    "-ms-user-select": e,
    "-webkit-user-select": e,
    "-moz-user-select": e,
  });
}
function hI(n, t, e) {
  f_(
    n.style,
    {
      position: t ? "" : "fixed",
      top: t ? "" : "0",
      opacity: t ? "" : "0",
      left: t ? "" : "-999em",
    },
    e
  );
}
function sf(n, t) {
  return t && t != "none" ? n + " " + t : n;
}
function pI(n, t) {
  (n.style.width = `${t.width}px`),
    (n.style.height = `${t.height}px`),
    (n.style.transform = gl(t.left, t.top));
}
function gl(n, t) {
  return `translate3d(${Math.round(n)}px, ${Math.round(t)}px, 0)`;
}
function mI(n) {
  let t = n.toLowerCase().indexOf("ms") > -1 ? 1 : 1e3;
  return parseFloat(n) * t;
}
function XF(n) {
  let t = getComputedStyle(n),
    e = n_(t, "transition-property"),
    i = e.find((a) => a === "transform" || a === "all");
  if (!i) return 0;
  let r = e.indexOf(i),
    o = n_(t, "transition-duration"),
    s = n_(t, "transition-delay");
  return mI(o[r]) + mI(s[r]);
}
function n_(n, t) {
  return n
    .getPropertyValue(t)
    .split(",")
    .map((i) => i.trim());
}
var JF = new Set(["position"]),
  s_ = class {
    _document;
    _rootElement;
    _direction;
    _initialDomRect;
    _previewTemplate;
    _previewClass;
    _pickupPositionOnPage;
    _initialTransform;
    _zIndex;
    _renderer;
    _previewEmbeddedView;
    _preview;
    get element() {
      return this._preview;
    }
    constructor(t, e, i, r, o, s, a, l, c, d) {
      (this._document = t),
        (this._rootElement = e),
        (this._direction = i),
        (this._initialDomRect = r),
        (this._previewTemplate = o),
        (this._previewClass = s),
        (this._pickupPositionOnPage = a),
        (this._initialTransform = l),
        (this._zIndex = c),
        (this._renderer = d);
    }
    attach(t) {
      (this._preview = this._createPreview()),
        t.appendChild(this._preview),
        gI(this._preview) && this._preview.showPopover();
    }
    destroy() {
      this._preview.remove(),
        this._previewEmbeddedView?.destroy(),
        (this._preview = this._previewEmbeddedView = null);
    }
    setTransform(t) {
      this._preview.style.transform = t;
    }
    getBoundingClientRect() {
      return this._preview.getBoundingClientRect();
    }
    addClass(t) {
      this._preview.classList.add(t);
    }
    getTransitionDuration() {
      return XF(this._preview);
    }
    addEventListener(t, e) {
      return this._renderer.listen(this._preview, t, e);
    }
    _createPreview() {
      let t = this._previewTemplate,
        e = this._previewClass,
        i = t ? t.template : null,
        r;
      if (i && t) {
        let o = t.matchSize ? this._initialDomRect : null,
          s = t.viewContainer.createEmbeddedView(i, t.context);
        s.detectChanges(),
          (r = CI(s, this._document)),
          (this._previewEmbeddedView = s),
          t.matchSize
            ? pI(r, o)
            : (r.style.transform = gl(
                this._pickupPositionOnPage.x,
                this._pickupPositionOnPage.y
              ));
      } else
        (r = r_(this._rootElement)),
          pI(r, this._initialDomRect),
          this._initialTransform &&
            (r.style.transform = this._initialTransform);
      return (
        f_(
          r.style,
          {
            "pointer-events": "none",
            margin: gI(r) ? "0 auto 0 0" : "0",
            position: "fixed",
            top: "0",
            left: "0",
            "z-index": this._zIndex + "",
          },
          JF
        ),
        gs(r, !1),
        r.classList.add("cdk-drag-preview"),
        r.setAttribute("popover", "manual"),
        r.setAttribute("dir", this._direction),
        e &&
          (Array.isArray(e)
            ? e.forEach((o) => r.classList.add(o))
            : r.classList.add(e)),
        r
      );
    }
  };
function gI(n) {
  return "showPopover" in n;
}
var e1 = { passive: !0 },
  vI = { passive: !1 },
  t1 = { passive: !1, capture: !0 },
  n1 = 800,
  _I = "cdk-drag-placeholder",
  yI = new Set(["position"]),
  a_ = class {
    _config;
    _document;
    _ngZone;
    _viewportRuler;
    _dragDropRegistry;
    _renderer;
    _rootElementCleanups;
    _cleanupShadowRootSelectStart;
    _preview;
    _previewContainer;
    _placeholderRef;
    _placeholder;
    _pickupPositionInElement;
    _pickupPositionOnPage;
    _marker;
    _anchor = null;
    _passiveTransform = { x: 0, y: 0 };
    _activeTransform = { x: 0, y: 0 };
    _initialTransform;
    _hasStartedDragging = Ne(!1);
    _hasMoved;
    _initialContainer;
    _initialIndex;
    _parentPositions;
    _moveEvents = new E();
    _pointerDirectionDelta;
    _pointerPositionAtLastDirectionChange;
    _lastKnownPointerPosition;
    _rootElement;
    _ownerSVGElement;
    _rootElementTapHighlight;
    _pointerMoveSubscription = W.EMPTY;
    _pointerUpSubscription = W.EMPTY;
    _scrollSubscription = W.EMPTY;
    _resizeSubscription = W.EMPTY;
    _lastTouchEventTime;
    _dragStartTime;
    _boundaryElement = null;
    _nativeInteractionsEnabled = !0;
    _initialDomRect;
    _previewRect;
    _boundaryRect;
    _previewTemplate;
    _placeholderTemplate;
    _handles = [];
    _disabledHandles = new Set();
    _dropContainer;
    _direction = "ltr";
    _parentDragRef;
    _cachedShadowRoot;
    lockAxis;
    dragStartDelay = 0;
    previewClass;
    scale = 1;
    get disabled() {
      return (
        this._disabled ||
        !!(this._dropContainer && this._dropContainer.disabled)
      );
    }
    set disabled(t) {
      t !== this._disabled &&
        ((this._disabled = t),
        this._toggleNativeDragInteractions(),
        this._handles.forEach((e) => gs(e, t)));
    }
    _disabled = !1;
    beforeStarted = new E();
    started = new E();
    released = new E();
    ended = new E();
    entered = new E();
    exited = new E();
    dropped = new E();
    moved = this._moveEvents;
    data;
    constrainPosition;
    constructor(t, e, i, r, o, s, a) {
      (this._config = e),
        (this._document = i),
        (this._ngZone = r),
        (this._viewportRuler = o),
        (this._dragDropRegistry = s),
        (this._renderer = a),
        this.withRootElement(t).withParent(e.parentDragRef || null),
        (this._parentPositions = new of(i)),
        s.registerDragItem(this);
    }
    getPlaceholderElement() {
      return this._placeholder;
    }
    getRootElement() {
      return this._rootElement;
    }
    getVisibleElement() {
      return this.isDragging()
        ? this.getPlaceholderElement()
        : this.getRootElement();
    }
    withHandles(t) {
      (this._handles = t.map((i) => Ve(i))),
        this._handles.forEach((i) => gs(i, this.disabled)),
        this._toggleNativeDragInteractions();
      let e = new Set();
      return (
        this._disabledHandles.forEach((i) => {
          this._handles.indexOf(i) > -1 && e.add(i);
        }),
        (this._disabledHandles = e),
        this
      );
    }
    withPreviewTemplate(t) {
      return (this._previewTemplate = t), this;
    }
    withPlaceholderTemplate(t) {
      return (this._placeholderTemplate = t), this;
    }
    withRootElement(t) {
      let e = Ve(t);
      if (e !== this._rootElement) {
        this._removeRootElementListeners();
        let i = this._renderer;
        (this._rootElementCleanups = this._ngZone.runOutsideAngular(() => [
          i.listen(e, "mousedown", this._pointerDown, vI),
          i.listen(e, "touchstart", this._pointerDown, e1),
          i.listen(e, "dragstart", this._nativeDragStart, vI),
        ])),
          (this._initialTransform = void 0),
          (this._rootElement = e);
      }
      return (
        typeof SVGElement < "u" &&
          this._rootElement instanceof SVGElement &&
          (this._ownerSVGElement = this._rootElement.ownerSVGElement),
        this
      );
    }
    withBoundaryElement(t) {
      return (
        (this._boundaryElement = t ? Ve(t) : null),
        this._resizeSubscription.unsubscribe(),
        t &&
          (this._resizeSubscription = this._viewportRuler
            .change(10)
            .subscribe(() => this._containInsideBoundaryOnResize())),
        this
      );
    }
    withParent(t) {
      return (this._parentDragRef = t), this;
    }
    dispose() {
      this._removeRootElementListeners(),
        this.isDragging() && this._rootElement?.remove(),
        this._marker?.remove(),
        this._destroyPreview(),
        this._destroyPlaceholder(),
        this._dragDropRegistry.removeDragItem(this),
        this._removeListeners(),
        this.beforeStarted.complete(),
        this.started.complete(),
        this.released.complete(),
        this.ended.complete(),
        this.entered.complete(),
        this.exited.complete(),
        this.dropped.complete(),
        this._moveEvents.complete(),
        (this._handles = []),
        this._disabledHandles.clear(),
        (this._dropContainer = void 0),
        this._resizeSubscription.unsubscribe(),
        this._parentPositions.clear(),
        (this._boundaryElement =
          this._rootElement =
          this._ownerSVGElement =
          this._placeholderTemplate =
          this._previewTemplate =
          this._marker =
          this._parentDragRef =
            null);
    }
    isDragging() {
      return (
        this._hasStartedDragging() && this._dragDropRegistry.isDragging(this)
      );
    }
    reset() {
      (this._rootElement.style.transform = this._initialTransform || ""),
        (this._activeTransform = { x: 0, y: 0 }),
        (this._passiveTransform = { x: 0, y: 0 });
    }
    resetToBoundary() {
      if (
        this._boundaryElement &&
        this._rootElement &&
        QF(
          this._boundaryElement.getBoundingClientRect(),
          this._rootElement.getBoundingClientRect()
        )
      ) {
        let t = this._boundaryElement.getBoundingClientRect(),
          e = this._rootElement.getBoundingClientRect(),
          i = 0,
          r = 0;
        e.left < t.left
          ? (i = t.left - e.left)
          : e.right > t.right && (i = t.right - e.right),
          e.top < t.top
            ? (r = t.top - e.top)
            : e.bottom > t.bottom && (r = t.bottom - e.bottom);
        let o = this._activeTransform.x,
          s = this._activeTransform.y,
          a = o + i,
          l = s + r;
        (this._rootElement.style.transform = gl(a, l)),
          (this._activeTransform = { x: a, y: l }),
          (this._passiveTransform = { x: a, y: l });
      }
    }
    disableHandle(t) {
      !this._disabledHandles.has(t) &&
        this._handles.indexOf(t) > -1 &&
        (this._disabledHandles.add(t), gs(t, !0));
    }
    enableHandle(t) {
      this._disabledHandles.has(t) &&
        (this._disabledHandles.delete(t), gs(t, this.disabled));
    }
    withDirection(t) {
      return (this._direction = t), this;
    }
    _withDropContainer(t) {
      this._dropContainer = t;
    }
    getFreeDragPosition() {
      let t = this.isDragging()
        ? this._activeTransform
        : this._passiveTransform;
      return { x: t.x, y: t.y };
    }
    setFreeDragPosition(t) {
      return (
        (this._activeTransform = { x: 0, y: 0 }),
        (this._passiveTransform.x = t.x),
        (this._passiveTransform.y = t.y),
        this._dropContainer || this._applyRootElementTransform(t.x, t.y),
        this
      );
    }
    withPreviewContainer(t) {
      return (this._previewContainer = t), this;
    }
    _sortFromLastPointerPosition() {
      let t = this._lastKnownPointerPosition;
      t &&
        this._dropContainer &&
        this._updateActiveDropContainer(
          this._getConstrainedPointerPosition(t),
          t
        );
    }
    _removeListeners() {
      this._pointerMoveSubscription.unsubscribe(),
        this._pointerUpSubscription.unsubscribe(),
        this._scrollSubscription.unsubscribe(),
        this._cleanupShadowRootSelectStart?.(),
        (this._cleanupShadowRootSelectStart = void 0);
    }
    _destroyPreview() {
      this._preview?.destroy(), (this._preview = null);
    }
    _destroyPlaceholder() {
      this._anchor?.remove(),
        this._placeholder?.remove(),
        this._placeholderRef?.destroy(),
        (this._placeholder = this._anchor = this._placeholderRef = null);
    }
    _pointerDown = (t) => {
      if ((this.beforeStarted.next(), this._handles.length)) {
        let e = this._getTargetHandle(t);
        e &&
          !this._disabledHandles.has(e) &&
          !this.disabled &&
          this._initializeDragSequence(e, t);
      } else
        this.disabled || this._initializeDragSequence(this._rootElement, t);
    };
    _pointerMove = (t) => {
      let e = this._getPointerPositionOnPage(t);
      if (!this._hasStartedDragging()) {
        let r = Math.abs(e.x - this._pickupPositionOnPage.x),
          o = Math.abs(e.y - this._pickupPositionOnPage.y);
        if (r + o >= this._config.dragStartThreshold) {
          let a =
              Date.now() >= this._dragStartTime + this._getDragStartDelay(t),
            l = this._dropContainer;
          if (!a) {
            this._endDragSequence(t);
            return;
          }
          (!l || (!l.isDragging() && !l.isReceiving())) &&
            (t.cancelable && t.preventDefault(),
            this._hasStartedDragging.set(!0),
            this._ngZone.run(() => this._startDragSequence(t)));
        }
        return;
      }
      t.cancelable && t.preventDefault();
      let i = this._getConstrainedPointerPosition(e);
      if (
        ((this._hasMoved = !0),
        (this._lastKnownPointerPosition = e),
        this._updatePointerDirectionDelta(i),
        this._dropContainer)
      )
        this._updateActiveDropContainer(i, e);
      else {
        let r = this.constrainPosition
            ? this._initialDomRect
            : this._pickupPositionOnPage,
          o = this._activeTransform;
        (o.x = i.x - r.x + this._passiveTransform.x),
          (o.y = i.y - r.y + this._passiveTransform.y),
          this._applyRootElementTransform(o.x, o.y);
      }
      this._moveEvents.observers.length &&
        this._ngZone.run(() => {
          this._moveEvents.next({
            source: this,
            pointerPosition: i,
            event: t,
            distance: this._getDragDistance(i),
            delta: this._pointerDirectionDelta,
          });
        });
    };
    _pointerUp = (t) => {
      this._endDragSequence(t);
    };
    _endDragSequence(t) {
      if (
        this._dragDropRegistry.isDragging(this) &&
        (this._removeListeners(),
        this._dragDropRegistry.stopDragging(this),
        this._toggleNativeDragInteractions(),
        this._handles &&
          (this._rootElement.style.webkitTapHighlightColor =
            this._rootElementTapHighlight),
        !!this._hasStartedDragging())
      )
        if (
          (this.released.next({ source: this, event: t }), this._dropContainer)
        )
          this._dropContainer._stopScrolling(),
            this._animatePreviewToPlaceholder().then(() => {
              this._cleanupDragArtifacts(t),
                this._cleanupCachedDimensions(),
                this._dragDropRegistry.stopDragging(this);
            });
        else {
          this._passiveTransform.x = this._activeTransform.x;
          let e = this._getPointerPositionOnPage(t);
          (this._passiveTransform.y = this._activeTransform.y),
            this._ngZone.run(() => {
              this.ended.next({
                source: this,
                distance: this._getDragDistance(e),
                dropPoint: e,
                event: t,
              });
            }),
            this._cleanupCachedDimensions(),
            this._dragDropRegistry.stopDragging(this);
        }
    }
    _startDragSequence(t) {
      hl(t) && (this._lastTouchEventTime = Date.now()),
        this._toggleNativeDragInteractions();
      let e = this._getShadowRoot(),
        i = this._dropContainer;
      if (
        (e &&
          this._ngZone.runOutsideAngular(() => {
            this._cleanupShadowRootSelectStart = this._renderer.listen(
              e,
              "selectstart",
              i1,
              t1
            );
          }),
        i)
      ) {
        let r = this._rootElement,
          o = r.parentNode,
          s = (this._placeholder = this._createPlaceholderElement()),
          a = (this._marker = this._marker || this._document.createComment(""));
        o.insertBefore(a, r),
          (this._initialTransform = r.style.transform || ""),
          (this._preview = new s_(
            this._document,
            this._rootElement,
            this._direction,
            this._initialDomRect,
            this._previewTemplate || null,
            this.previewClass || null,
            this._pickupPositionOnPage,
            this._initialTransform,
            this._config.zIndex || 1e3,
            this._renderer
          )),
          this._preview.attach(this._getPreviewInsertionPoint(o, e)),
          hI(r, !1, yI),
          this._document.body.appendChild(o.replaceChild(s, r)),
          this.started.next({ source: this, event: t }),
          i.start(),
          (this._initialContainer = i),
          (this._initialIndex = i.getItemIndex(this));
      } else
        this.started.next({ source: this, event: t }),
          (this._initialContainer = this._initialIndex = void 0);
      this._parentPositions.cache(i ? i.getScrollableParents() : []);
    }
    _initializeDragSequence(t, e) {
      this._parentDragRef && e.stopPropagation();
      let i = this.isDragging(),
        r = hl(e),
        o = !r && e.button !== 0,
        s = this._rootElement,
        a = it(e),
        l =
          !r &&
          this._lastTouchEventTime &&
          this._lastTouchEventTime + n1 > Date.now(),
        c = r ? Ii(e) : Ci(e);
      if (
        (a && a.draggable && e.type === "mousedown" && e.preventDefault(),
        i || o || l || c)
      )
        return;
      if (this._handles.length) {
        let p = s.style;
        (this._rootElementTapHighlight = p.webkitTapHighlightColor || ""),
          (p.webkitTapHighlightColor = "transparent");
      }
      (this._hasMoved = !1),
        this._hasStartedDragging.set(this._hasMoved),
        this._removeListeners(),
        (this._initialDomRect = this._rootElement.getBoundingClientRect()),
        (this._pointerMoveSubscription =
          this._dragDropRegistry.pointerMove.subscribe(this._pointerMove)),
        (this._pointerUpSubscription =
          this._dragDropRegistry.pointerUp.subscribe(this._pointerUp)),
        (this._scrollSubscription = this._dragDropRegistry
          .scrolled(this._getShadowRoot())
          .subscribe((p) => this._updateOnScroll(p))),
        this._boundaryElement &&
          (this._boundaryRect = u_(this._boundaryElement));
      let d = this._previewTemplate;
      this._pickupPositionInElement =
        d && d.template && !d.matchSize
          ? { x: 0, y: 0 }
          : this._getPointerPositionInElement(this._initialDomRect, t, e);
      let u =
        (this._pickupPositionOnPage =
        this._lastKnownPointerPosition =
          this._getPointerPositionOnPage(e));
      (this._pointerDirectionDelta = { x: 0, y: 0 }),
        (this._pointerPositionAtLastDirectionChange = { x: u.x, y: u.y }),
        (this._dragStartTime = Date.now()),
        this._dragDropRegistry.startDragging(this, e);
    }
    _cleanupDragArtifacts(t) {
      hI(this._rootElement, !0, yI),
        this._marker.parentNode.replaceChild(this._rootElement, this._marker),
        this._destroyPreview(),
        this._destroyPlaceholder(),
        (this._initialDomRect =
          this._boundaryRect =
          this._previewRect =
          this._initialTransform =
            void 0),
        this._ngZone.run(() => {
          let e = this._dropContainer,
            i = e.getItemIndex(this),
            r = this._getPointerPositionOnPage(t),
            o = this._getDragDistance(r),
            s = e._isOverContainer(r.x, r.y);
          this.ended.next({
            source: this,
            distance: o,
            dropPoint: r,
            event: t,
          }),
            this.dropped.next({
              item: this,
              currentIndex: i,
              previousIndex: this._initialIndex,
              container: e,
              previousContainer: this._initialContainer,
              isPointerOverContainer: s,
              distance: o,
              dropPoint: r,
              event: t,
            }),
            e.drop(
              this,
              i,
              this._initialIndex,
              this._initialContainer,
              s,
              o,
              r,
              t
            ),
            (this._dropContainer = this._initialContainer);
        });
    }
    _updateActiveDropContainer({ x: t, y: e }, { x: i, y: r }) {
      let o = this._initialContainer._getSiblingContainerFromPosition(
        this,
        t,
        e
      );
      !o &&
        this._dropContainer !== this._initialContainer &&
        this._initialContainer._isOverContainer(t, e) &&
        (o = this._initialContainer),
        o &&
          o !== this._dropContainer &&
          this._ngZone.run(() => {
            let s = this._dropContainer.getItemIndex(this),
              a =
                this._dropContainer
                  .getItemAtIndex(s + 1)
                  ?.getVisibleElement() || null;
            this.exited.next({ item: this, container: this._dropContainer }),
              this._dropContainer.exit(this),
              this._conditionallyInsertAnchor(o, this._dropContainer, a),
              (this._dropContainer = o),
              this._dropContainer.enter(
                this,
                t,
                e,
                o === this._initialContainer && o.sortingDisabled
                  ? this._initialIndex
                  : void 0
              ),
              this.entered.next({
                item: this,
                container: o,
                currentIndex: o.getItemIndex(this),
              });
          }),
        this.isDragging() &&
          (this._dropContainer._startScrollingIfNecessary(i, r),
          this._dropContainer._sortItem(
            this,
            t,
            e,
            this._pointerDirectionDelta
          ),
          this.constrainPosition
            ? this._applyPreviewTransform(t, e)
            : this._applyPreviewTransform(
                t - this._pickupPositionInElement.x,
                e - this._pickupPositionInElement.y
              ));
    }
    _animatePreviewToPlaceholder() {
      if (!this._hasMoved) return Promise.resolve();
      let t = this._placeholder.getBoundingClientRect();
      this._preview.addClass("cdk-drag-animating"),
        this._applyPreviewTransform(t.left, t.top);
      let e = this._preview.getTransitionDuration();
      return e === 0
        ? Promise.resolve()
        : this._ngZone.runOutsideAngular(
            () =>
              new Promise((i) => {
                let r = (a) => {
                    (!a ||
                      (this._preview &&
                        it(a) === this._preview.element &&
                        a.propertyName === "transform")) &&
                      (s(), i(), clearTimeout(o));
                  },
                  o = setTimeout(r, e * 1.5),
                  s = this._preview.addEventListener("transitionend", r);
              })
          );
    }
    _createPlaceholderElement() {
      let t = this._placeholderTemplate,
        e = t ? t.template : null,
        i;
      return (
        e
          ? ((this._placeholderRef = t.viewContainer.createEmbeddedView(
              e,
              t.context
            )),
            this._placeholderRef.detectChanges(),
            (i = CI(this._placeholderRef, this._document)))
          : (i = r_(this._rootElement)),
        (i.style.pointerEvents = "none"),
        i.classList.add(_I),
        i
      );
    }
    _getPointerPositionInElement(t, e, i) {
      let r = e === this._rootElement ? null : e,
        o = r ? r.getBoundingClientRect() : t,
        s = hl(i) ? i.targetTouches[0] : i,
        a = this._getViewportScrollPosition(),
        l = s.pageX - o.left - a.left,
        c = s.pageY - o.top - a.top;
      return { x: o.left - t.left + l, y: o.top - t.top + c };
    }
    _getPointerPositionOnPage(t) {
      let e = this._getViewportScrollPosition(),
        i = hl(t)
          ? t.touches[0] || t.changedTouches[0] || { pageX: 0, pageY: 0 }
          : t,
        r = i.pageX - e.left,
        o = i.pageY - e.top;
      if (this._ownerSVGElement) {
        let s = this._ownerSVGElement.getScreenCTM();
        if (s) {
          let a = this._ownerSVGElement.createSVGPoint();
          return (a.x = r), (a.y = o), a.matrixTransform(s.inverse());
        }
      }
      return { x: r, y: o };
    }
    _getConstrainedPointerPosition(t) {
      let e = this._dropContainer ? this._dropContainer.lockAxis : null,
        { x: i, y: r } = this.constrainPosition
          ? this.constrainPosition(
              t,
              this,
              this._initialDomRect,
              this._pickupPositionInElement
            )
          : t;
      if (
        (this.lockAxis === "x" || e === "x"
          ? (r =
              this._pickupPositionOnPage.y -
              (this.constrainPosition ? this._pickupPositionInElement.y : 0))
          : (this.lockAxis === "y" || e === "y") &&
            (i =
              this._pickupPositionOnPage.x -
              (this.constrainPosition ? this._pickupPositionInElement.x : 0)),
        this._boundaryRect)
      ) {
        let { x: o, y: s } = this.constrainPosition
            ? { x: 0, y: 0 }
            : this._pickupPositionInElement,
          a = this._boundaryRect,
          { width: l, height: c } = this._getPreviewRect(),
          d = a.top + s,
          u = a.bottom - (c - s),
          p = a.left + o,
          h = a.right - (l - o);
        (i = bI(i, p, h)), (r = bI(r, d, u));
      }
      return { x: i, y: r };
    }
    _updatePointerDirectionDelta(t) {
      let { x: e, y: i } = t,
        r = this._pointerDirectionDelta,
        o = this._pointerPositionAtLastDirectionChange,
        s = Math.abs(e - o.x),
        a = Math.abs(i - o.y);
      return (
        s > this._config.pointerDirectionChangeThreshold &&
          ((r.x = e > o.x ? 1 : -1), (o.x = e)),
        a > this._config.pointerDirectionChangeThreshold &&
          ((r.y = i > o.y ? 1 : -1), (o.y = i)),
        r
      );
    }
    _toggleNativeDragInteractions() {
      if (!this._rootElement || !this._handles) return;
      let t = this._handles.length > 0 || !this.isDragging();
      t !== this._nativeInteractionsEnabled &&
        ((this._nativeInteractionsEnabled = t), gs(this._rootElement, t));
    }
    _removeRootElementListeners() {
      this._rootElementCleanups?.forEach((t) => t()),
        (this._rootElementCleanups = void 0);
    }
    _applyRootElementTransform(t, e) {
      let i = 1 / this.scale,
        r = gl(t * i, e * i),
        o = this._rootElement.style;
      this._initialTransform == null &&
        (this._initialTransform =
          o.transform && o.transform != "none" ? o.transform : ""),
        (o.transform = sf(r, this._initialTransform));
    }
    _applyPreviewTransform(t, e) {
      let i = this._previewTemplate?.template ? void 0 : this._initialTransform,
        r = gl(t, e);
      this._preview.setTransform(sf(r, i));
    }
    _getDragDistance(t) {
      let e = this._pickupPositionOnPage;
      return e ? { x: t.x - e.x, y: t.y - e.y } : { x: 0, y: 0 };
    }
    _cleanupCachedDimensions() {
      (this._boundaryRect = this._previewRect = void 0),
        this._parentPositions.clear();
    }
    _containInsideBoundaryOnResize() {
      let { x: t, y: e } = this._passiveTransform;
      if ((t === 0 && e === 0) || this.isDragging() || !this._boundaryElement)
        return;
      let i = this._rootElement.getBoundingClientRect(),
        r = this._boundaryElement.getBoundingClientRect();
      if (
        (r.width === 0 && r.height === 0) ||
        (i.width === 0 && i.height === 0)
      )
        return;
      let o = r.left - i.left,
        s = i.right - r.right,
        a = r.top - i.top,
        l = i.bottom - r.bottom;
      r.width > i.width ? (o > 0 && (t += o), s > 0 && (t -= s)) : (t = 0),
        r.height > i.height ? (a > 0 && (e += a), l > 0 && (e -= l)) : (e = 0),
        (t !== this._passiveTransform.x || e !== this._passiveTransform.y) &&
          this.setFreeDragPosition({ y: e, x: t });
    }
    _getDragStartDelay(t) {
      let e = this.dragStartDelay;
      return typeof e == "number" ? e : hl(t) ? e.touch : e ? e.mouse : 0;
    }
    _updateOnScroll(t) {
      let e = this._parentPositions.handleScroll(t);
      if (e) {
        let i = it(t);
        this._boundaryRect &&
          i !== this._boundaryElement &&
          i.contains(this._boundaryElement) &&
          ml(this._boundaryRect, e.top, e.left),
          (this._pickupPositionOnPage.x += e.left),
          (this._pickupPositionOnPage.y += e.top),
          this._dropContainer ||
            ((this._activeTransform.x -= e.left),
            (this._activeTransform.y -= e.top),
            this._applyRootElementTransform(
              this._activeTransform.x,
              this._activeTransform.y
            ));
      }
    }
    _getViewportScrollPosition() {
      return (
        this._parentPositions.positions.get(this._document)?.scrollPosition ||
        this._parentPositions.getViewportScrollPosition()
      );
    }
    _getShadowRoot() {
      return (
        this._cachedShadowRoot === void 0 &&
          (this._cachedShadowRoot = no(this._rootElement)),
        this._cachedShadowRoot
      );
    }
    _getPreviewInsertionPoint(t, e) {
      let i = this._previewContainer || "global";
      if (i === "parent") return t;
      if (i === "global") {
        let r = this._document;
        return (
          e ||
          r.fullscreenElement ||
          r.webkitFullscreenElement ||
          r.mozFullScreenElement ||
          r.msFullscreenElement ||
          r.body
        );
      }
      return Ve(i);
    }
    _getPreviewRect() {
      return (
        (!this._previewRect ||
          (!this._previewRect.width && !this._previewRect.height)) &&
          (this._previewRect = this._preview
            ? this._preview.getBoundingClientRect()
            : this._initialDomRect),
        this._previewRect
      );
    }
    _nativeDragStart = (t) => {
      if (this._handles.length) {
        let e = this._getTargetHandle(t);
        e &&
          !this._disabledHandles.has(e) &&
          !this.disabled &&
          t.preventDefault();
      } else this.disabled || t.preventDefault();
    };
    _getTargetHandle(t) {
      return this._handles.find(
        (e) => t.target && (t.target === e || e.contains(t.target))
      );
    }
    _conditionallyInsertAnchor(t, e, i) {
      if (t === this._initialContainer)
        this._anchor?.remove(), (this._anchor = null);
      else if (e === this._initialContainer && e.hasAnchor) {
        let r = (this._anchor ??= r_(this._placeholder));
        r.classList.remove(_I),
          r.classList.add("cdk-drag-anchor"),
          (r.style.transform = ""),
          i ? i.before(r) : Ve(e.element).appendChild(r);
      }
    }
  };
function bI(n, t, e) {
  return Math.max(t, Math.min(e, n));
}
function hl(n) {
  return n.type[0] === "t";
}
function i1(n) {
  n.preventDefault();
}
function lf(n, t, e) {
  let i = wI(t, n.length - 1),
    r = wI(e, n.length - 1);
  if (i === r) return;
  let o = n[i],
    s = r < i ? -1 : 1;
  for (let a = i; a !== r; a += s) n[a] = n[a + s];
  n[r] = o;
}
function wI(n, t) {
  return Math.max(0, Math.min(t, n));
}
var af = class {
    _dragDropRegistry;
    _element;
    _sortPredicate;
    _itemPositions = [];
    _activeDraggables;
    orientation = "vertical";
    direction;
    constructor(t) {
      this._dragDropRegistry = t;
    }
    _previousSwap = { drag: null, delta: 0, overlaps: !1 };
    start(t) {
      this.withItems(t);
    }
    sort(t, e, i, r) {
      let o = this._itemPositions,
        s = this._getItemIndexFromPointerPosition(t, e, i, r);
      if (s === -1 && o.length > 0) return null;
      let a = this.orientation === "horizontal",
        l = o.findIndex((w) => w.drag === t),
        c = o[s],
        d = o[l].clientRect,
        u = c.clientRect,
        p = l > s ? 1 : -1,
        h = this._getItemOffsetPx(d, u, p),
        m = this._getSiblingOffsetPx(l, o, p),
        g = o.slice();
      return (
        lf(o, l, s),
        o.forEach((w, S) => {
          if (g[S] === w) return;
          let ae = w.drag === t,
            he = ae ? h : m,
            be = ae ? t.getPlaceholderElement() : w.drag.getRootElement();
          w.offset += he;
          let Xn = Math.round(w.offset * (1 / w.drag.scale));
          a
            ? ((be.style.transform = sf(
                `translate3d(${Xn}px, 0, 0)`,
                w.initialTransform
              )),
              ml(w.clientRect, 0, he))
            : ((be.style.transform = sf(
                `translate3d(0, ${Xn}px, 0)`,
                w.initialTransform
              )),
              ml(w.clientRect, he, 0));
        }),
        (this._previousSwap.overlaps = o_(u, e, i)),
        (this._previousSwap.drag = c.drag),
        (this._previousSwap.delta = a ? r.x : r.y),
        { previousIndex: l, currentIndex: s }
      );
    }
    enter(t, e, i, r) {
      let o =
          r == null || r < 0
            ? this._getItemIndexFromPointerPosition(t, e, i)
            : r,
        s = this._activeDraggables,
        a = s.indexOf(t),
        l = t.getPlaceholderElement(),
        c = s[o];
      if (
        (c === t && (c = s[o + 1]),
        !c &&
          (o == null || o === -1 || o < s.length - 1) &&
          this._shouldEnterAsFirstChild(e, i) &&
          (c = s[0]),
        a > -1 && s.splice(a, 1),
        c && !this._dragDropRegistry.isDragging(c))
      ) {
        let d = c.getRootElement();
        d.parentElement.insertBefore(l, d), s.splice(o, 0, t);
      } else this._element.appendChild(l), s.push(t);
      (l.style.transform = ""), this._cacheItemPositions();
    }
    withItems(t) {
      (this._activeDraggables = t.slice()), this._cacheItemPositions();
    }
    withSortPredicate(t) {
      this._sortPredicate = t;
    }
    reset() {
      this._activeDraggables?.forEach((t) => {
        let e = t.getRootElement();
        if (e) {
          let i = this._itemPositions.find(
            (r) => r.drag === t
          )?.initialTransform;
          e.style.transform = i || "";
        }
      }),
        (this._itemPositions = []),
        (this._activeDraggables = []),
        (this._previousSwap.drag = null),
        (this._previousSwap.delta = 0),
        (this._previousSwap.overlaps = !1);
    }
    getActiveItemsSnapshot() {
      return this._activeDraggables;
    }
    getItemIndex(t) {
      return this._getVisualItemPositions().findIndex((e) => e.drag === t);
    }
    getItemAtIndex(t) {
      return this._getVisualItemPositions()[t]?.drag || null;
    }
    updateOnScroll(t, e) {
      this._itemPositions.forEach(({ clientRect: i }) => {
        ml(i, t, e);
      }),
        this._itemPositions.forEach(({ drag: i }) => {
          this._dragDropRegistry.isDragging(i) &&
            i._sortFromLastPointerPosition();
        });
    }
    withElementContainer(t) {
      this._element = t;
    }
    _cacheItemPositions() {
      let t = this.orientation === "horizontal";
      this._itemPositions = this._activeDraggables
        .map((e) => {
          let i = e.getVisibleElement();
          return {
            drag: e,
            offset: 0,
            initialTransform: i.style.transform || "",
            clientRect: u_(i),
          };
        })
        .sort((e, i) =>
          t
            ? e.clientRect.left - i.clientRect.left
            : e.clientRect.top - i.clientRect.top
        );
    }
    _getVisualItemPositions() {
      return this.orientation === "horizontal" && this.direction === "rtl"
        ? this._itemPositions.slice().reverse()
        : this._itemPositions;
    }
    _getItemOffsetPx(t, e, i) {
      let r = this.orientation === "horizontal",
        o = r ? e.left - t.left : e.top - t.top;
      return i === -1 && (o += r ? e.width - t.width : e.height - t.height), o;
    }
    _getSiblingOffsetPx(t, e, i) {
      let r = this.orientation === "horizontal",
        o = e[t].clientRect,
        s = e[t + i * -1],
        a = o[r ? "width" : "height"] * i;
      if (s) {
        let l = r ? "left" : "top",
          c = r ? "right" : "bottom";
        i === -1
          ? (a -= s.clientRect[l] - o[c])
          : (a += o[l] - s.clientRect[c]);
      }
      return a;
    }
    _shouldEnterAsFirstChild(t, e) {
      if (!this._activeDraggables.length) return !1;
      let i = this._itemPositions,
        r = this.orientation === "horizontal";
      if (i[0].drag !== this._activeDraggables[0]) {
        let s = i[i.length - 1].clientRect;
        return r ? t >= s.right : e >= s.bottom;
      } else {
        let s = i[0].clientRect;
        return r ? t <= s.left : e <= s.top;
      }
    }
    _getItemIndexFromPointerPosition(t, e, i, r) {
      let o = this.orientation === "horizontal",
        s = this._itemPositions.findIndex(({ drag: a, clientRect: l }) => {
          if (a === t) return !1;
          if (r) {
            let c = o ? r.x : r.y;
            if (
              a === this._previousSwap.drag &&
              this._previousSwap.overlaps &&
              c === this._previousSwap.delta
            )
              return !1;
          }
          return o
            ? e >= Math.floor(l.left) && e < Math.floor(l.right)
            : i >= Math.floor(l.top) && i < Math.floor(l.bottom);
        });
      return s === -1 || !this._sortPredicate(s, t) ? -1 : s;
    }
  },
  l_ = class {
    _document;
    _dragDropRegistry;
    _element;
    _sortPredicate;
    _rootNode;
    _activeItems;
    _previousSwap = { drag: null, deltaX: 0, deltaY: 0, overlaps: !1 };
    _relatedNodes = [];
    constructor(t, e) {
      (this._document = t), (this._dragDropRegistry = e);
    }
    start(t) {
      let e = this._element.childNodes;
      this._relatedNodes = [];
      for (let i = 0; i < e.length; i++) {
        let r = e[i];
        this._relatedNodes.push([r, r.nextSibling]);
      }
      this.withItems(t);
    }
    sort(t, e, i, r) {
      let o = this._getItemIndexFromPointerPosition(t, e, i),
        s = this._previousSwap;
      if (o === -1 || this._activeItems[o] === t) return null;
      let a = this._activeItems[o];
      if (s.drag === a && s.overlaps && s.deltaX === r.x && s.deltaY === r.y)
        return null;
      let l = this.getItemIndex(t),
        c = t.getPlaceholderElement(),
        d = a.getRootElement();
      o > l ? d.after(c) : d.before(c), lf(this._activeItems, l, o);
      let u = this._getRootNode().elementFromPoint(e, i);
      return (
        (s.deltaX = r.x),
        (s.deltaY = r.y),
        (s.drag = a),
        (s.overlaps = d === u || d.contains(u)),
        { previousIndex: l, currentIndex: o }
      );
    }
    enter(t, e, i, r) {
      let o =
        r == null || r < 0 ? this._getItemIndexFromPointerPosition(t, e, i) : r;
      o === -1 && (o = this._getClosestItemIndexToPointer(t, e, i));
      let s = this._activeItems[o],
        a = this._activeItems.indexOf(t);
      a > -1 && this._activeItems.splice(a, 1),
        s && !this._dragDropRegistry.isDragging(s)
          ? (this._activeItems.splice(o, 0, t),
            s.getRootElement().before(t.getPlaceholderElement()))
          : (this._activeItems.push(t),
            this._element.appendChild(t.getPlaceholderElement()));
    }
    withItems(t) {
      this._activeItems = t.slice();
    }
    withSortPredicate(t) {
      this._sortPredicate = t;
    }
    reset() {
      let t = this._element,
        e = this._previousSwap;
      for (let i = this._relatedNodes.length - 1; i > -1; i--) {
        let [r, o] = this._relatedNodes[i];
        r.parentNode === t &&
          r.nextSibling !== o &&
          (o === null
            ? t.appendChild(r)
            : o.parentNode === t && t.insertBefore(r, o));
      }
      (this._relatedNodes = []),
        (this._activeItems = []),
        (e.drag = null),
        (e.deltaX = e.deltaY = 0),
        (e.overlaps = !1);
    }
    getActiveItemsSnapshot() {
      return this._activeItems;
    }
    getItemIndex(t) {
      return this._activeItems.indexOf(t);
    }
    getItemAtIndex(t) {
      return this._activeItems[t] || null;
    }
    updateOnScroll() {
      this._activeItems.forEach((t) => {
        this._dragDropRegistry.isDragging(t) &&
          t._sortFromLastPointerPosition();
      });
    }
    withElementContainer(t) {
      t !== this._element && ((this._element = t), (this._rootNode = void 0));
    }
    _getItemIndexFromPointerPosition(t, e, i) {
      let r = this._getRootNode().elementFromPoint(
          Math.floor(e),
          Math.floor(i)
        ),
        o = r
          ? this._activeItems.findIndex((s) => {
              let a = s.getRootElement();
              return r === a || a.contains(r);
            })
          : -1;
      return o === -1 || !this._sortPredicate(o, t) ? -1 : o;
    }
    _getRootNode() {
      return (
        this._rootNode ||
          (this._rootNode = no(this._element) || this._document),
        this._rootNode
      );
    }
    _getClosestItemIndexToPointer(t, e, i) {
      if (this._activeItems.length === 0) return -1;
      if (this._activeItems.length === 1) return 0;
      let r = 1 / 0,
        o = -1;
      for (let s = 0; s < this._activeItems.length; s++) {
        let a = this._activeItems[s];
        if (a !== t) {
          let { x: l, y: c } = a.getRootElement().getBoundingClientRect(),
            d = Math.hypot(e - l, i - c);
          d < r && ((r = d), (o = s));
        }
      }
      return o;
    }
  },
  EI = 0.05,
  II = 0.05,
  fn = (function (n) {
    return (
      (n[(n.NONE = 0)] = "NONE"),
      (n[(n.UP = 1)] = "UP"),
      (n[(n.DOWN = 2)] = "DOWN"),
      n
    );
  })(fn || {}),
  At = (function (n) {
    return (
      (n[(n.NONE = 0)] = "NONE"),
      (n[(n.LEFT = 1)] = "LEFT"),
      (n[(n.RIGHT = 2)] = "RIGHT"),
      n
    );
  })(At || {}),
  c_ = class {
    _dragDropRegistry;
    _ngZone;
    _viewportRuler;
    element;
    disabled = !1;
    sortingDisabled = !1;
    lockAxis;
    autoScrollDisabled = !1;
    autoScrollStep = 2;
    hasAnchor = !1;
    enterPredicate = () => !0;
    sortPredicate = () => !0;
    beforeStarted = new E();
    entered = new E();
    exited = new E();
    dropped = new E();
    sorted = new E();
    receivingStarted = new E();
    receivingStopped = new E();
    data;
    _container;
    _isDragging = !1;
    _parentPositions;
    _sortStrategy;
    _domRect;
    _draggables = [];
    _siblings = [];
    _activeSiblings = new Set();
    _viewportScrollSubscription = W.EMPTY;
    _verticalScrollDirection = fn.NONE;
    _horizontalScrollDirection = At.NONE;
    _scrollNode;
    _stopScrollTimers = new E();
    _cachedShadowRoot = null;
    _document;
    _scrollableElements = [];
    _initialScrollSnap;
    _direction = "ltr";
    constructor(t, e, i, r, o) {
      (this._dragDropRegistry = e),
        (this._ngZone = r),
        (this._viewportRuler = o);
      let s = (this.element = Ve(t));
      (this._document = i),
        this.withOrientation("vertical").withElementContainer(s),
        e.registerDropContainer(this),
        (this._parentPositions = new of(i));
    }
    dispose() {
      this._stopScrolling(),
        this._stopScrollTimers.complete(),
        this._viewportScrollSubscription.unsubscribe(),
        this.beforeStarted.complete(),
        this.entered.complete(),
        this.exited.complete(),
        this.dropped.complete(),
        this.sorted.complete(),
        this.receivingStarted.complete(),
        this.receivingStopped.complete(),
        this._activeSiblings.clear(),
        (this._scrollNode = null),
        this._parentPositions.clear(),
        this._dragDropRegistry.removeDropContainer(this);
    }
    isDragging() {
      return this._isDragging;
    }
    start() {
      this._draggingStarted(), this._notifyReceivingSiblings();
    }
    enter(t, e, i, r) {
      this._draggingStarted(),
        r == null && this.sortingDisabled && (r = this._draggables.indexOf(t)),
        this._sortStrategy.enter(t, e, i, r),
        this._cacheParentPositions(),
        this._notifyReceivingSiblings(),
        this.entered.next({
          item: t,
          container: this,
          currentIndex: this.getItemIndex(t),
        });
    }
    exit(t) {
      this._reset(), this.exited.next({ item: t, container: this });
    }
    drop(t, e, i, r, o, s, a, l = {}) {
      this._reset(),
        this.dropped.next({
          item: t,
          currentIndex: e,
          previousIndex: i,
          container: this,
          previousContainer: r,
          isPointerOverContainer: o,
          distance: s,
          dropPoint: a,
          event: l,
        });
    }
    withItems(t) {
      let e = this._draggables;
      return (
        (this._draggables = t),
        t.forEach((i) => i._withDropContainer(this)),
        this.isDragging() &&
          (e.filter((r) => r.isDragging()).every((r) => t.indexOf(r) === -1)
            ? this._reset()
            : this._sortStrategy.withItems(this._draggables)),
        this
      );
    }
    withDirection(t) {
      return (
        (this._direction = t),
        this._sortStrategy instanceof af && (this._sortStrategy.direction = t),
        this
      );
    }
    connectedTo(t) {
      return (this._siblings = t.slice()), this;
    }
    withOrientation(t) {
      if (t === "mixed")
        this._sortStrategy = new l_(this._document, this._dragDropRegistry);
      else {
        let e = new af(this._dragDropRegistry);
        (e.direction = this._direction),
          (e.orientation = t),
          (this._sortStrategy = e);
      }
      return (
        this._sortStrategy.withElementContainer(this._container),
        this._sortStrategy.withSortPredicate((e, i) =>
          this.sortPredicate(e, i, this)
        ),
        this
      );
    }
    withScrollableParents(t) {
      let e = this._container;
      return (
        (this._scrollableElements =
          t.indexOf(e) === -1 ? [e, ...t] : t.slice()),
        this
      );
    }
    withElementContainer(t) {
      if (t === this._container) return this;
      let e = Ve(this.element),
        i = this._scrollableElements.indexOf(this._container),
        r = this._scrollableElements.indexOf(t);
      return (
        i > -1 && this._scrollableElements.splice(i, 1),
        r > -1 && this._scrollableElements.splice(r, 1),
        this._sortStrategy && this._sortStrategy.withElementContainer(t),
        (this._cachedShadowRoot = null),
        this._scrollableElements.unshift(t),
        (this._container = t),
        this
      );
    }
    getScrollableParents() {
      return this._scrollableElements;
    }
    getItemIndex(t) {
      return this._isDragging
        ? this._sortStrategy.getItemIndex(t)
        : this._draggables.indexOf(t);
    }
    getItemAtIndex(t) {
      return this._isDragging
        ? this._sortStrategy.getItemAtIndex(t)
        : this._draggables[t] || null;
    }
    isReceiving() {
      return this._activeSiblings.size > 0;
    }
    _sortItem(t, e, i, r) {
      if (
        this.sortingDisabled ||
        !this._domRect ||
        !fI(this._domRect, EI, e, i)
      )
        return;
      let o = this._sortStrategy.sort(t, e, i, r);
      o &&
        this.sorted.next({
          previousIndex: o.previousIndex,
          currentIndex: o.currentIndex,
          container: this,
          item: t,
        });
    }
    _startScrollingIfNecessary(t, e) {
      if (this.autoScrollDisabled) return;
      let i,
        r = fn.NONE,
        o = At.NONE;
      if (
        (this._parentPositions.positions.forEach((s, a) => {
          a === this._document ||
            !s.clientRect ||
            i ||
            (fI(s.clientRect, EI, t, e) &&
              (([r, o] = r1(a, s.clientRect, this._direction, t, e)),
              (r || o) && (i = a)));
        }),
        !r && !o)
      ) {
        let { width: s, height: a } = this._viewportRuler.getViewportSize(),
          l = { width: s, height: a, top: 0, right: s, bottom: a, left: 0 };
        (r = SI(l, e)), (o = xI(l, t)), (i = window);
      }
      i &&
        (r !== this._verticalScrollDirection ||
          o !== this._horizontalScrollDirection ||
          i !== this._scrollNode) &&
        ((this._verticalScrollDirection = r),
        (this._horizontalScrollDirection = o),
        (this._scrollNode = i),
        (r || o) && i
          ? this._ngZone.runOutsideAngular(this._startScrollInterval)
          : this._stopScrolling());
    }
    _stopScrolling() {
      this._stopScrollTimers.next();
    }
    _draggingStarted() {
      let t = this._container.style;
      this.beforeStarted.next(),
        (this._isDragging = !0),
        (this._initialScrollSnap =
          t.msScrollSnapType || t.scrollSnapType || ""),
        (t.scrollSnapType = t.msScrollSnapType = "none"),
        this._sortStrategy.start(this._draggables),
        this._cacheParentPositions(),
        this._viewportScrollSubscription.unsubscribe(),
        this._listenToScrollEvents();
    }
    _cacheParentPositions() {
      this._parentPositions.cache(this._scrollableElements),
        (this._domRect = this._parentPositions.positions.get(
          this._container
        ).clientRect);
    }
    _reset() {
      this._isDragging = !1;
      let t = this._container.style;
      (t.scrollSnapType = t.msScrollSnapType = this._initialScrollSnap),
        this._siblings.forEach((e) => e._stopReceiving(this)),
        this._sortStrategy.reset(),
        this._stopScrolling(),
        this._viewportScrollSubscription.unsubscribe(),
        this._parentPositions.clear();
    }
    _startScrollInterval = () => {
      this._stopScrolling(),
        Ch(0, nc)
          .pipe(Ie(this._stopScrollTimers))
          .subscribe(() => {
            let t = this._scrollNode,
              e = this.autoScrollStep;
            this._verticalScrollDirection === fn.UP
              ? t.scrollBy(0, -e)
              : this._verticalScrollDirection === fn.DOWN && t.scrollBy(0, e),
              this._horizontalScrollDirection === At.LEFT
                ? t.scrollBy(-e, 0)
                : this._horizontalScrollDirection === At.RIGHT &&
                  t.scrollBy(e, 0);
          });
    };
    _isOverContainer(t, e) {
      return this._domRect != null && o_(this._domRect, t, e);
    }
    _getSiblingContainerFromPosition(t, e, i) {
      return this._siblings.find((r) => r._canReceive(t, e, i));
    }
    _canReceive(t, e, i) {
      if (
        !this._domRect ||
        !o_(this._domRect, e, i) ||
        !this.enterPredicate(t, this)
      )
        return !1;
      let r = this._getShadowRoot().elementFromPoint(e, i);
      return r ? r === this._container || this._container.contains(r) : !1;
    }
    _startReceiving(t, e) {
      let i = this._activeSiblings;
      !i.has(t) &&
        e.every(
          (r) =>
            this.enterPredicate(r, this) || this._draggables.indexOf(r) > -1
        ) &&
        (i.add(t),
        this._cacheParentPositions(),
        this._listenToScrollEvents(),
        this.receivingStarted.next({ initiator: t, receiver: this, items: e }));
    }
    _stopReceiving(t) {
      this._activeSiblings.delete(t),
        this._viewportScrollSubscription.unsubscribe(),
        this.receivingStopped.next({ initiator: t, receiver: this });
    }
    _listenToScrollEvents() {
      this._viewportScrollSubscription = this._dragDropRegistry
        .scrolled(this._getShadowRoot())
        .subscribe((t) => {
          if (this.isDragging()) {
            let e = this._parentPositions.handleScroll(t);
            e && this._sortStrategy.updateOnScroll(e.top, e.left);
          } else this.isReceiving() && this._cacheParentPositions();
        });
    }
    _getShadowRoot() {
      if (!this._cachedShadowRoot) {
        let t = no(this._container);
        this._cachedShadowRoot = t || this._document;
      }
      return this._cachedShadowRoot;
    }
    _notifyReceivingSiblings() {
      let t = this._sortStrategy
        .getActiveItemsSnapshot()
        .filter((e) => e.isDragging());
      this._siblings.forEach((e) => e._startReceiving(this, t));
    }
  };
function SI(n, t) {
  let { top: e, bottom: i, height: r } = n,
    o = r * II;
  return t >= e - o && t <= e + o
    ? fn.UP
    : t >= i - o && t <= i + o
    ? fn.DOWN
    : fn.NONE;
}
function xI(n, t) {
  let { left: e, right: i, width: r } = n,
    o = r * II;
  return t >= e - o && t <= e + o
    ? At.LEFT
    : t >= i - o && t <= i + o
    ? At.RIGHT
    : At.NONE;
}
function r1(n, t, e, i, r) {
  let o = SI(t, r),
    s = xI(t, i),
    a = fn.NONE,
    l = At.NONE;
  if (o) {
    let c = n.scrollTop;
    o === fn.UP
      ? c > 0 && (a = fn.UP)
      : n.scrollHeight - c > n.clientHeight && (a = fn.DOWN);
  }
  if (s) {
    let c = n.scrollLeft;
    e === "rtl"
      ? s === At.RIGHT
        ? c < 0 && (l = At.RIGHT)
        : n.scrollWidth + c > n.clientWidth && (l = At.LEFT)
      : s === At.LEFT
      ? c > 0 && (l = At.LEFT)
      : n.scrollWidth - c > n.clientWidth && (l = At.RIGHT);
  }
  return [a, l];
}
var pl = { capture: !0 },
  i_ = { passive: !1, capture: !0 },
  o1 = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["ng-component"]],
        hostAttrs: ["cdk-drag-resets-container", ""],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `@layer cdk-resets{.cdk-drag-preview{background:none;border:none;padding:0;color:inherit;inset:auto}}.cdk-drag-placeholder *,.cdk-drag-preview *{pointer-events:none !important}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  h_ = (() => {
    class n {
      _ngZone = f(M);
      _document = f(O);
      _styleLoader = f(gt);
      _renderer = f(Se).createRenderer(null, null);
      _cleanupDocumentTouchmove;
      _scroll = new E();
      _dropInstances = new Set();
      _dragInstances = new Set();
      _activeDragInstances = Ne([]);
      _globalListeners;
      _draggingPredicate = (e) => e.isDragging();
      _domNodesToDirectives = null;
      pointerMove = new E();
      pointerUp = new E();
      constructor() {}
      registerDropContainer(e) {
        this._dropInstances.has(e) || this._dropInstances.add(e);
      }
      registerDragItem(e) {
        this._dragInstances.add(e),
          this._dragInstances.size === 1 &&
            this._ngZone.runOutsideAngular(() => {
              this._cleanupDocumentTouchmove?.(),
                (this._cleanupDocumentTouchmove = this._renderer.listen(
                  this._document,
                  "touchmove",
                  this._persistentTouchmoveListener,
                  i_
                ));
            });
      }
      removeDropContainer(e) {
        this._dropInstances.delete(e);
      }
      removeDragItem(e) {
        this._dragInstances.delete(e),
          this.stopDragging(e),
          this._dragInstances.size === 0 && this._cleanupDocumentTouchmove?.();
      }
      startDragging(e, i) {
        if (
          !(this._activeDragInstances().indexOf(e) > -1) &&
          (this._styleLoader.load(o1),
          this._activeDragInstances.update((r) => [...r, e]),
          this._activeDragInstances().length === 1)
        ) {
          let r = i.type.startsWith("touch"),
            o = (a) => this.pointerUp.next(a),
            s = [
              ["scroll", (a) => this._scroll.next(a), pl],
              ["selectstart", this._preventDefaultWhileDragging, i_],
            ];
          r
            ? s.push(["touchend", o, pl], ["touchcancel", o, pl])
            : s.push(["mouseup", o, pl]),
            r || s.push(["mousemove", (a) => this.pointerMove.next(a), i_]),
            this._ngZone.runOutsideAngular(() => {
              this._globalListeners = s.map(([a, l, c]) =>
                this._renderer.listen(this._document, a, l, c)
              );
            });
        }
      }
      stopDragging(e) {
        this._activeDragInstances.update((i) => {
          let r = i.indexOf(e);
          return r > -1 ? (i.splice(r, 1), [...i]) : i;
        }),
          this._activeDragInstances().length === 0 &&
            this._clearGlobalListeners();
      }
      isDragging(e) {
        return this._activeDragInstances().indexOf(e) > -1;
      }
      scrolled(e) {
        let i = [this._scroll];
        return (
          e &&
            e !== this._document &&
            i.push(
              new H((r) =>
                this._ngZone.runOutsideAngular(() => {
                  let o = this._renderer.listen(
                    e,
                    "scroll",
                    (s) => {
                      this._activeDragInstances().length && r.next(s);
                    },
                    pl
                  );
                  return () => {
                    o();
                  };
                })
              )
            ),
          kt(...i)
        );
      }
      registerDirectiveNode(e, i) {
        (this._domNodesToDirectives ??= new WeakMap()),
          this._domNodesToDirectives.set(e, i);
      }
      removeDirectiveNode(e) {
        this._domNodesToDirectives?.delete(e);
      }
      getDragDirectiveForNode(e) {
        return this._domNodesToDirectives?.get(e) || null;
      }
      ngOnDestroy() {
        this._dragInstances.forEach((e) => this.removeDragItem(e)),
          this._dropInstances.forEach((e) => this.removeDropContainer(e)),
          (this._domNodesToDirectives = null),
          this._clearGlobalListeners(),
          this.pointerMove.complete(),
          this.pointerUp.complete();
      }
      _preventDefaultWhileDragging = (e) => {
        this._activeDragInstances().length > 0 && e.preventDefault();
      };
      _persistentTouchmoveListener = (e) => {
        this._activeDragInstances().length > 0 &&
          (this._activeDragInstances().some(this._draggingPredicate) &&
            e.preventDefault(),
          this.pointerMove.next(e));
      };
      _clearGlobalListeners() {
        this._globalListeners?.forEach((e) => e()),
          (this._globalListeners = void 0);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  s1 = { dragStartThreshold: 5, pointerDirectionChangeThreshold: 5 },
  MI = (() => {
    class n {
      _document = f(O);
      _ngZone = f(M);
      _viewportRuler = f(ir);
      _dragDropRegistry = f(h_);
      _renderer = f(Se).createRenderer(null, null);
      constructor() {}
      createDrag(e, i = s1) {
        return new a_(
          e,
          i,
          this._document,
          this._ngZone,
          this._viewportRuler,
          this._dragDropRegistry,
          this._renderer
        );
      }
      createDropList(e) {
        return new c_(
          e,
          this._dragDropRegistry,
          this._document,
          this._ngZone,
          this._viewportRuler
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  d_ = new y("CDK_DRAG_PARENT");
var TI = new y("CdkDragHandle"),
  RI = (() => {
    class n {
      element = f(K);
      _parentDrag = f(d_, { optional: !0, skipSelf: !0 });
      _dragDropRegistry = f(h_);
      _stateChanges = new E();
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        (this._disabled = e), this._stateChanges.next(this);
      }
      _disabled = !1;
      constructor() {
        this._parentDrag?._addHandle(this);
      }
      ngAfterViewInit() {
        if (!this._parentDrag) {
          let e = this.element.nativeElement.parentElement;
          for (; e; ) {
            let i = this._dragDropRegistry.getDragDirectiveForNode(e);
            if (i) {
              (this._parentDrag = i), i._addHandle(this);
              break;
            }
            e = e.parentElement;
          }
        }
      }
      ngOnDestroy() {
        this._parentDrag?._removeHandle(this), this._stateChanges.complete();
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "cdkDragHandle", ""]],
        hostAttrs: [1, "cdk-drag-handle"],
        inputs: { disabled: [2, "cdkDragHandleDisabled", "disabled", se] },
        features: [ze([{ provide: TI, useExisting: n }])],
      });
    }
    return n;
  })(),
  AI = new y("CDK_DRAG_CONFIG"),
  NI = new y("CdkDropList"),
  OI = (() => {
    class n {
      element = f(K);
      dropContainer = f(NI, { optional: !0, skipSelf: !0 });
      _ngZone = f(M);
      _viewContainerRef = f(mt);
      _dir = f(un, { optional: !0 });
      _changeDetectorRef = f(lt);
      _selfHandle = f(TI, { optional: !0, self: !0 });
      _parentDrag = f(d_, { optional: !0, skipSelf: !0 });
      _dragDropRegistry = f(h_);
      _destroyed = new E();
      _handles = new je([]);
      _previewTemplate;
      _placeholderTemplate;
      _dragRef;
      data;
      lockAxis;
      rootElementSelector;
      boundaryElement;
      dragStartDelay;
      freeDragPosition;
      get disabled() {
        return (
          this._disabled ||
          !!(this.dropContainer && this.dropContainer.disabled)
        );
      }
      set disabled(e) {
        (this._disabled = e), (this._dragRef.disabled = this._disabled);
      }
      _disabled;
      constrainPosition;
      previewClass;
      previewContainer;
      scale = 1;
      started = new j();
      released = new j();
      ended = new j();
      entered = new j();
      exited = new j();
      dropped = new j();
      moved = new H((e) => {
        let i = this._dragRef.moved
          .pipe(
            R((r) => ({
              source: this,
              pointerPosition: r.pointerPosition,
              event: r.event,
              delta: r.delta,
              distance: r.distance,
            }))
          )
          .subscribe(e);
        return () => {
          i.unsubscribe();
        };
      });
      _injector = f(te);
      constructor() {
        let e = this.dropContainer,
          i = f(AI, { optional: !0 }),
          r = f(MI);
        (this._dragRef = r.createDrag(this.element, {
          dragStartThreshold:
            i && i.dragStartThreshold != null ? i.dragStartThreshold : 5,
          pointerDirectionChangeThreshold:
            i && i.pointerDirectionChangeThreshold != null
              ? i.pointerDirectionChangeThreshold
              : 5,
          zIndex: i?.zIndex,
        })),
          (this._dragRef.data = this),
          this._dragDropRegistry.registerDirectiveNode(
            this.element.nativeElement,
            this
          ),
          i && this._assignDefaults(i),
          e &&
            (this._dragRef._withDropContainer(e._dropListRef),
            e.addItem(this),
            e._dropListRef.beforeStarted
              .pipe(Ie(this._destroyed))
              .subscribe(() => {
                this._dragRef.scale = this.scale;
              })),
          this._syncInputs(this._dragRef),
          this._handleEvents(this._dragRef);
      }
      getPlaceholderElement() {
        return this._dragRef.getPlaceholderElement();
      }
      getRootElement() {
        return this._dragRef.getRootElement();
      }
      reset() {
        this._dragRef.reset();
      }
      resetToBoundary() {
        this._dragRef.resetToBoundary();
      }
      getFreeDragPosition() {
        return this._dragRef.getFreeDragPosition();
      }
      setFreeDragPosition(e) {
        this._dragRef.setFreeDragPosition(e);
      }
      ngAfterViewInit() {
        Kt(
          () => {
            this._updateRootElement(),
              this._setupHandlesListener(),
              (this._dragRef.scale = this.scale),
              this.freeDragPosition &&
                this._dragRef.setFreeDragPosition(this.freeDragPosition);
          },
          { injector: this._injector }
        );
      }
      ngOnChanges(e) {
        let i = e.rootElementSelector,
          r = e.freeDragPosition;
        i && !i.firstChange && this._updateRootElement(),
          (this._dragRef.scale = this.scale),
          r &&
            !r.firstChange &&
            this.freeDragPosition &&
            this._dragRef.setFreeDragPosition(this.freeDragPosition);
      }
      ngOnDestroy() {
        this.dropContainer && this.dropContainer.removeItem(this),
          this._dragDropRegistry.removeDirectiveNode(
            this.element.nativeElement
          ),
          this._ngZone.runOutsideAngular(() => {
            this._handles.complete(),
              this._destroyed.next(),
              this._destroyed.complete(),
              this._dragRef.dispose();
          });
      }
      _addHandle(e) {
        let i = this._handles.getValue();
        i.push(e), this._handles.next(i);
      }
      _removeHandle(e) {
        let i = this._handles.getValue(),
          r = i.indexOf(e);
        r > -1 && (i.splice(r, 1), this._handles.next(i));
      }
      _setPreviewTemplate(e) {
        this._previewTemplate = e;
      }
      _resetPreviewTemplate(e) {
        e === this._previewTemplate && (this._previewTemplate = null);
      }
      _setPlaceholderTemplate(e) {
        this._placeholderTemplate = e;
      }
      _resetPlaceholderTemplate(e) {
        e === this._placeholderTemplate && (this._placeholderTemplate = null);
      }
      _updateRootElement() {
        let e = this.element.nativeElement,
          i = e;
        this.rootElementSelector &&
          (i =
            e.closest !== void 0
              ? e.closest(this.rootElementSelector)
              : e.parentElement?.closest(this.rootElementSelector)),
          this._dragRef.withRootElement(i || e);
      }
      _getBoundaryElement() {
        let e = this.boundaryElement;
        return e
          ? typeof e == "string"
            ? this.element.nativeElement.closest(e)
            : Ve(e)
          : null;
      }
      _syncInputs(e) {
        e.beforeStarted.subscribe(() => {
          if (!e.isDragging()) {
            let i = this._dir,
              r = this.dragStartDelay,
              o = this._placeholderTemplate
                ? {
                    template: this._placeholderTemplate.templateRef,
                    context: this._placeholderTemplate.data,
                    viewContainer: this._viewContainerRef,
                  }
                : null,
              s = this._previewTemplate
                ? {
                    template: this._previewTemplate.templateRef,
                    context: this._previewTemplate.data,
                    matchSize: this._previewTemplate.matchSize,
                    viewContainer: this._viewContainerRef,
                  }
                : null;
            (e.disabled = this.disabled),
              (e.lockAxis = this.lockAxis),
              (e.scale = this.scale),
              (e.dragStartDelay = typeof r == "object" && r ? r : ps(r)),
              (e.constrainPosition = this.constrainPosition),
              (e.previewClass = this.previewClass),
              e
                .withBoundaryElement(this._getBoundaryElement())
                .withPlaceholderTemplate(o)
                .withPreviewTemplate(s)
                .withPreviewContainer(this.previewContainer || "global"),
              i && e.withDirection(i.value);
          }
        }),
          e.beforeStarted.pipe(dt(1)).subscribe(() => {
            if (this._parentDrag) {
              e.withParent(this._parentDrag._dragRef);
              return;
            }
            let i = this.element.nativeElement.parentElement;
            for (; i; ) {
              let r = this._dragDropRegistry.getDragDirectiveForNode(i);
              if (r) {
                e.withParent(r._dragRef);
                break;
              }
              i = i.parentElement;
            }
          });
      }
      _handleEvents(e) {
        e.started.subscribe((i) => {
          this.started.emit({ source: this, event: i.event }),
            this._changeDetectorRef.markForCheck();
        }),
          e.released.subscribe((i) => {
            this.released.emit({ source: this, event: i.event });
          }),
          e.ended.subscribe((i) => {
            this.ended.emit({
              source: this,
              distance: i.distance,
              dropPoint: i.dropPoint,
              event: i.event,
            }),
              this._changeDetectorRef.markForCheck();
          }),
          e.entered.subscribe((i) => {
            this.entered.emit({
              container: i.container.data,
              item: this,
              currentIndex: i.currentIndex,
            });
          }),
          e.exited.subscribe((i) => {
            this.exited.emit({ container: i.container.data, item: this });
          }),
          e.dropped.subscribe((i) => {
            this.dropped.emit({
              previousIndex: i.previousIndex,
              currentIndex: i.currentIndex,
              previousContainer: i.previousContainer.data,
              container: i.container.data,
              isPointerOverContainer: i.isPointerOverContainer,
              item: this,
              distance: i.distance,
              dropPoint: i.dropPoint,
              event: i.event,
            });
          });
      }
      _assignDefaults(e) {
        let {
          lockAxis: i,
          dragStartDelay: r,
          constrainPosition: o,
          previewClass: s,
          boundaryElement: a,
          draggingDisabled: l,
          rootElementSelector: c,
          previewContainer: d,
        } = e;
        (this.disabled = l ?? !1),
          (this.dragStartDelay = r || 0),
          i && (this.lockAxis = i),
          o && (this.constrainPosition = o),
          s && (this.previewClass = s),
          a && (this.boundaryElement = a),
          c && (this.rootElementSelector = c),
          d && (this.previewContainer = d);
      }
      _setupHandlesListener() {
        this._handles
          .pipe(
            we((e) => {
              let i = e.map((r) => r.element);
              this._selfHandle &&
                this.rootElementSelector &&
                i.push(this.element),
                this._dragRef.withHandles(i);
            }),
            Be((e) => kt(...e.map((i) => i._stateChanges.pipe(Xe(i))))),
            Ie(this._destroyed)
          )
          .subscribe((e) => {
            let i = this._dragRef,
              r = e.element.nativeElement;
            e.disabled ? i.disableHandle(r) : i.enableHandle(r);
          });
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "cdkDrag", ""]],
        hostAttrs: [1, "cdk-drag"],
        hostVars: 4,
        hostBindings: function (i, r) {
          i & 2 &&
            re("cdk-drag-disabled", r.disabled)(
              "cdk-drag-dragging",
              r._dragRef.isDragging()
            );
        },
        inputs: {
          data: [0, "cdkDragData", "data"],
          lockAxis: [0, "cdkDragLockAxis", "lockAxis"],
          rootElementSelector: [0, "cdkDragRootElement", "rootElementSelector"],
          boundaryElement: [0, "cdkDragBoundary", "boundaryElement"],
          dragStartDelay: [0, "cdkDragStartDelay", "dragStartDelay"],
          freeDragPosition: [0, "cdkDragFreeDragPosition", "freeDragPosition"],
          disabled: [2, "cdkDragDisabled", "disabled", se],
          constrainPosition: [
            0,
            "cdkDragConstrainPosition",
            "constrainPosition",
          ],
          previewClass: [0, "cdkDragPreviewClass", "previewClass"],
          previewContainer: [0, "cdkDragPreviewContainer", "previewContainer"],
          scale: [2, "cdkDragScale", "scale", Gr],
        },
        outputs: {
          started: "cdkDragStarted",
          released: "cdkDragReleased",
          ended: "cdkDragEnded",
          entered: "cdkDragEntered",
          exited: "cdkDragExited",
          dropped: "cdkDragDropped",
          moved: "cdkDragMoved",
        },
        exportAs: ["cdkDrag"],
        features: [ze([{ provide: d_, useExisting: n }]), wt],
      });
    }
    return n;
  })(),
  DI = new y("CdkDropListGroup");
var kI = (() => {
  class n {
    element = f(K);
    _changeDetectorRef = f(lt);
    _scrollDispatcher = f(ms);
    _dir = f(un, { optional: !0 });
    _group = f(DI, { optional: !0, skipSelf: !0 });
    _latestSortedRefs;
    _destroyed = new E();
    _scrollableParentsResolved;
    static _dropLists = [];
    _dropListRef;
    connectedTo = [];
    data;
    orientation;
    id = f($t).getId("cdk-drop-list-");
    lockAxis;
    get disabled() {
      return this._disabled || (!!this._group && this._group.disabled);
    }
    set disabled(e) {
      this._dropListRef.disabled = this._disabled = e;
    }
    _disabled;
    sortingDisabled;
    enterPredicate = () => !0;
    sortPredicate = () => !0;
    autoScrollDisabled;
    autoScrollStep;
    elementContainerSelector;
    hasAnchor;
    dropped = new j();
    entered = new j();
    exited = new j();
    sorted = new j();
    _unsortedItems = new Set();
    constructor() {
      let e = f(MI),
        i = f(AI, { optional: !0 });
      (this._dropListRef = e.createDropList(this.element)),
        (this._dropListRef.data = this),
        i && this._assignDefaults(i),
        (this._dropListRef.enterPredicate = (r, o) =>
          this.enterPredicate(r.data, o.data)),
        (this._dropListRef.sortPredicate = (r, o, s) =>
          this.sortPredicate(r, o.data, s.data)),
        this._setupInputSyncSubscription(this._dropListRef),
        this._handleEvents(this._dropListRef),
        n._dropLists.push(this),
        this._group && this._group._items.add(this);
    }
    addItem(e) {
      this._unsortedItems.add(e),
        this._dropListRef.isDragging() &&
          this._syncItemsWithRef(this.getSortedItems().map((i) => i._dragRef));
    }
    removeItem(e) {
      if ((this._unsortedItems.delete(e), this._latestSortedRefs)) {
        let i = this._latestSortedRefs.indexOf(e._dragRef);
        i > -1 &&
          (this._latestSortedRefs.splice(i, 1),
          this._syncItemsWithRef(this._latestSortedRefs));
      }
    }
    getSortedItems() {
      return Array.from(this._unsortedItems).sort((e, i) =>
        e._dragRef
          .getVisibleElement()
          .compareDocumentPosition(i._dragRef.getVisibleElement()) &
        Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1
      );
    }
    ngOnDestroy() {
      let e = n._dropLists.indexOf(this);
      e > -1 && n._dropLists.splice(e, 1),
        this._group && this._group._items.delete(this),
        (this._latestSortedRefs = void 0),
        this._unsortedItems.clear(),
        this._dropListRef.dispose(),
        this._destroyed.next(),
        this._destroyed.complete();
    }
    _setupInputSyncSubscription(e) {
      this._dir &&
        this._dir.change
          .pipe(Xe(this._dir.value), Ie(this._destroyed))
          .subscribe((i) => e.withDirection(i)),
        e.beforeStarted.subscribe(() => {
          let i = rr(this.connectedTo).map((r) => {
            if (typeof r == "string") {
              let o = n._dropLists.find((s) => s.id === r);
              return o;
            }
            return r;
          });
          if (
            (this._group &&
              this._group._items.forEach((r) => {
                i.indexOf(r) === -1 && i.push(r);
              }),
            !this._scrollableParentsResolved)
          ) {
            let r = this._scrollDispatcher
              .getAncestorScrollContainers(this.element)
              .map((o) => o.getElementRef().nativeElement);
            this._dropListRef.withScrollableParents(r),
              (this._scrollableParentsResolved = !0);
          }
          if (this.elementContainerSelector) {
            let r = this.element.nativeElement.querySelector(
              this.elementContainerSelector
            );
            e.withElementContainer(r);
          }
          (e.disabled = this.disabled),
            (e.lockAxis = this.lockAxis),
            (e.sortingDisabled = this.sortingDisabled),
            (e.autoScrollDisabled = this.autoScrollDisabled),
            (e.autoScrollStep = ps(this.autoScrollStep, 2)),
            (e.hasAnchor = this.hasAnchor),
            e
              .connectedTo(
                i.filter((r) => r && r !== this).map((r) => r._dropListRef)
              )
              .withOrientation(this.orientation);
        });
    }
    _handleEvents(e) {
      e.beforeStarted.subscribe(() => {
        this._syncItemsWithRef(this.getSortedItems().map((i) => i._dragRef)),
          this._changeDetectorRef.markForCheck();
      }),
        e.entered.subscribe((i) => {
          this.entered.emit({
            container: this,
            item: i.item.data,
            currentIndex: i.currentIndex,
          });
        }),
        e.exited.subscribe((i) => {
          this.exited.emit({ container: this, item: i.item.data }),
            this._changeDetectorRef.markForCheck();
        }),
        e.sorted.subscribe((i) => {
          this.sorted.emit({
            previousIndex: i.previousIndex,
            currentIndex: i.currentIndex,
            container: this,
            item: i.item.data,
          });
        }),
        e.dropped.subscribe((i) => {
          this.dropped.emit({
            previousIndex: i.previousIndex,
            currentIndex: i.currentIndex,
            previousContainer: i.previousContainer.data,
            container: i.container.data,
            item: i.item.data,
            isPointerOverContainer: i.isPointerOverContainer,
            distance: i.distance,
            dropPoint: i.dropPoint,
            event: i.event,
          }),
            this._changeDetectorRef.markForCheck();
        }),
        kt(e.receivingStarted, e.receivingStopped).subscribe(() =>
          this._changeDetectorRef.markForCheck()
        );
    }
    _assignDefaults(e) {
      let {
        lockAxis: i,
        draggingDisabled: r,
        sortingDisabled: o,
        listAutoScrollDisabled: s,
        listOrientation: a,
      } = e;
      (this.disabled = r ?? !1),
        (this.sortingDisabled = o ?? !1),
        (this.autoScrollDisabled = s ?? !1),
        (this.orientation = a || "vertical"),
        i && (this.lockAxis = i);
    }
    _syncItemsWithRef(e) {
      (this._latestSortedRefs = e), this._dropListRef.withItems(e);
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵdir = L({
      type: n,
      selectors: [["", "cdkDropList", ""], ["cdk-drop-list"]],
      hostAttrs: [1, "cdk-drop-list"],
      hostVars: 7,
      hostBindings: function (i, r) {
        i & 2 &&
          (De("id", r.id),
          re("cdk-drop-list-disabled", r.disabled)(
            "cdk-drop-list-dragging",
            r._dropListRef.isDragging()
          )("cdk-drop-list-receiving", r._dropListRef.isReceiving()));
      },
      inputs: {
        connectedTo: [0, "cdkDropListConnectedTo", "connectedTo"],
        data: [0, "cdkDropListData", "data"],
        orientation: [0, "cdkDropListOrientation", "orientation"],
        id: "id",
        lockAxis: [0, "cdkDropListLockAxis", "lockAxis"],
        disabled: [2, "cdkDropListDisabled", "disabled", se],
        sortingDisabled: [
          2,
          "cdkDropListSortingDisabled",
          "sortingDisabled",
          se,
        ],
        enterPredicate: [0, "cdkDropListEnterPredicate", "enterPredicate"],
        sortPredicate: [0, "cdkDropListSortPredicate", "sortPredicate"],
        autoScrollDisabled: [
          2,
          "cdkDropListAutoScrollDisabled",
          "autoScrollDisabled",
          se,
        ],
        autoScrollStep: [0, "cdkDropListAutoScrollStep", "autoScrollStep"],
        elementContainerSelector: [
          0,
          "cdkDropListElementContainer",
          "elementContainerSelector",
        ],
        hasAnchor: [2, "cdkDropListHasAnchor", "hasAnchor", se],
      },
      outputs: {
        dropped: "cdkDropListDropped",
        entered: "cdkDropListEntered",
        exited: "cdkDropListExited",
        sorted: "cdkDropListSorted",
      },
      exportAs: ["cdkDropList"],
      features: [
        ze([
          { provide: DI, useValue: void 0 },
          { provide: NI, useExisting: n },
        ]),
      ],
    });
  }
  return n;
})();
var vl;
function PI() {
  if (vl == null && typeof window < "u")
    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", { get: () => (vl = !0) })
      );
    } finally {
      vl = vl || !1;
    }
  return vl;
}
function vs(n) {
  return PI() ? n : !!n.capture;
}
var FI = new y("cdk-input-modality-detector-options"),
  LI = { ignoreKeys: [18, 17, 224, 91, 16] },
  VI = 650,
  p_ = { passive: !0, capture: !0 },
  jI = (() => {
    class n {
      _platform = f(xe);
      _listenerCleanups;
      modalityDetected;
      modalityChanged;
      get mostRecentModality() {
        return this._modality.value;
      }
      _mostRecentTarget = null;
      _modality = new je(null);
      _options;
      _lastTouchMs = 0;
      _onKeydown = (e) => {
        this._options?.ignoreKeys?.some((i) => i === e.keyCode) ||
          (this._modality.next("keyboard"), (this._mostRecentTarget = it(e)));
      };
      _onMousedown = (e) => {
        Date.now() - this._lastTouchMs < VI ||
          (this._modality.next(Ci(e) ? "keyboard" : "mouse"),
          (this._mostRecentTarget = it(e)));
      };
      _onTouchstart = (e) => {
        if (Ii(e)) {
          this._modality.next("keyboard");
          return;
        }
        (this._lastTouchMs = Date.now()),
          this._modality.next("touch"),
          (this._mostRecentTarget = it(e));
      };
      constructor() {
        let e = f(M),
          i = f(O),
          r = f(FI, { optional: !0 });
        if (
          ((this._options = _(_({}, LI), r)),
          (this.modalityDetected = this._modality.pipe(zs(1))),
          (this.modalityChanged = this.modalityDetected.pipe(Cc())),
          this._platform.isBrowser)
        ) {
          let o = f(Se).createRenderer(null, null);
          this._listenerCleanups = e.runOutsideAngular(() => [
            o.listen(i, "keydown", this._onKeydown, p_),
            o.listen(i, "mousedown", this._onMousedown, p_),
            o.listen(i, "touchstart", this._onTouchstart, p_),
          ]);
        }
      }
      ngOnDestroy() {
        this._modality.complete(), this._listenerCleanups?.forEach((e) => e());
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  _l = (function (n) {
    return (
      (n[(n.IMMEDIATE = 0)] = "IMMEDIATE"),
      (n[(n.EVENTUAL = 1)] = "EVENTUAL"),
      n
    );
  })(_l || {}),
  BI = new y("cdk-focus-monitor-default-options"),
  cf = vs({ passive: !0, capture: !0 }),
  or = (() => {
    class n {
      _ngZone = f(M);
      _platform = f(xe);
      _inputModalityDetector = f(jI);
      _origin = null;
      _lastFocusOrigin;
      _windowFocused = !1;
      _windowFocusTimeoutId;
      _originTimeoutId;
      _originFromTouchInteraction = !1;
      _elementInfo = new Map();
      _monitoredElementCount = 0;
      _rootNodeFocusListenerCount = new Map();
      _detectionMode;
      _windowFocusListener = () => {
        (this._windowFocused = !0),
          (this._windowFocusTimeoutId = setTimeout(
            () => (this._windowFocused = !1)
          ));
      };
      _document = f(O);
      _stopInputModalityDetector = new E();
      constructor() {
        let e = f(BI, { optional: !0 });
        this._detectionMode = e?.detectionMode || _l.IMMEDIATE;
      }
      _rootNodeFocusAndBlurListener = (e) => {
        let i = it(e);
        for (let r = i; r; r = r.parentElement)
          e.type === "focus" ? this._onFocus(e, r) : this._onBlur(e, r);
      };
      monitor(e, i = !1) {
        let r = Ve(e);
        if (!this._platform.isBrowser || r.nodeType !== 1) return I();
        let o = no(r) || this._document,
          s = this._elementInfo.get(r);
        if (s) return i && (s.checkChildren = !0), s.subject;
        let a = { checkChildren: i, subject: new E(), rootNode: o };
        return (
          this._elementInfo.set(r, a),
          this._registerGlobalListeners(a),
          a.subject
        );
      }
      stopMonitoring(e) {
        let i = Ve(e),
          r = this._elementInfo.get(i);
        r &&
          (r.subject.complete(),
          this._setClasses(i),
          this._elementInfo.delete(i),
          this._removeGlobalListeners(r));
      }
      focusVia(e, i, r) {
        let o = Ve(e),
          s = this._document.activeElement;
        o === s
          ? this._getClosestElementsInfo(o).forEach(([a, l]) =>
              this._originChanged(a, i, l)
            )
          : (this._setOrigin(i), typeof o.focus == "function" && o.focus(r));
      }
      ngOnDestroy() {
        this._elementInfo.forEach((e, i) => this.stopMonitoring(i));
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _getFocusOrigin(e) {
        return this._origin
          ? this._originFromTouchInteraction
            ? this._shouldBeAttributedToTouch(e)
              ? "touch"
              : "program"
            : this._origin
          : this._windowFocused && this._lastFocusOrigin
          ? this._lastFocusOrigin
          : e && this._isLastInteractionFromInputLabel(e)
          ? "mouse"
          : "program";
      }
      _shouldBeAttributedToTouch(e) {
        return (
          this._detectionMode === _l.EVENTUAL ||
          !!e?.contains(this._inputModalityDetector._mostRecentTarget)
        );
      }
      _setClasses(e, i) {
        e.classList.toggle("cdk-focused", !!i),
          e.classList.toggle("cdk-touch-focused", i === "touch"),
          e.classList.toggle("cdk-keyboard-focused", i === "keyboard"),
          e.classList.toggle("cdk-mouse-focused", i === "mouse"),
          e.classList.toggle("cdk-program-focused", i === "program");
      }
      _setOrigin(e, i = !1) {
        this._ngZone.runOutsideAngular(() => {
          if (
            ((this._origin = e),
            (this._originFromTouchInteraction = e === "touch" && i),
            this._detectionMode === _l.IMMEDIATE)
          ) {
            clearTimeout(this._originTimeoutId);
            let r = this._originFromTouchInteraction ? VI : 1;
            this._originTimeoutId = setTimeout(() => (this._origin = null), r);
          }
        });
      }
      _onFocus(e, i) {
        let r = this._elementInfo.get(i),
          o = it(e);
        !r ||
          (!r.checkChildren && i !== o) ||
          this._originChanged(i, this._getFocusOrigin(o), r);
      }
      _onBlur(e, i) {
        let r = this._elementInfo.get(i);
        !r ||
          (r.checkChildren &&
            e.relatedTarget instanceof Node &&
            i.contains(e.relatedTarget)) ||
          (this._setClasses(i), this._emitOrigin(r, null));
      }
      _emitOrigin(e, i) {
        e.subject.observers.length && this._ngZone.run(() => e.subject.next(i));
      }
      _registerGlobalListeners(e) {
        if (!this._platform.isBrowser) return;
        let i = e.rootNode,
          r = this._rootNodeFocusListenerCount.get(i) || 0;
        r ||
          this._ngZone.runOutsideAngular(() => {
            i.addEventListener("focus", this._rootNodeFocusAndBlurListener, cf),
              i.addEventListener(
                "blur",
                this._rootNodeFocusAndBlurListener,
                cf
              );
          }),
          this._rootNodeFocusListenerCount.set(i, r + 1),
          ++this._monitoredElementCount === 1 &&
            (this._ngZone.runOutsideAngular(() => {
              this._getWindow().addEventListener(
                "focus",
                this._windowFocusListener
              );
            }),
            this._inputModalityDetector.modalityDetected
              .pipe(Ie(this._stopInputModalityDetector))
              .subscribe((o) => {
                this._setOrigin(o, !0);
              }));
      }
      _removeGlobalListeners(e) {
        let i = e.rootNode;
        if (this._rootNodeFocusListenerCount.has(i)) {
          let r = this._rootNodeFocusListenerCount.get(i);
          r > 1
            ? this._rootNodeFocusListenerCount.set(i, r - 1)
            : (i.removeEventListener(
                "focus",
                this._rootNodeFocusAndBlurListener,
                cf
              ),
              i.removeEventListener(
                "blur",
                this._rootNodeFocusAndBlurListener,
                cf
              ),
              this._rootNodeFocusListenerCount.delete(i));
        }
        --this._monitoredElementCount ||
          (this._getWindow().removeEventListener(
            "focus",
            this._windowFocusListener
          ),
          this._stopInputModalityDetector.next(),
          clearTimeout(this._windowFocusTimeoutId),
          clearTimeout(this._originTimeoutId));
      }
      _originChanged(e, i, r) {
        this._setClasses(e, i),
          this._emitOrigin(r, i),
          (this._lastFocusOrigin = i);
      }
      _getClosestElementsInfo(e) {
        let i = [];
        return (
          this._elementInfo.forEach((r, o) => {
            (o === e || (r.checkChildren && o.contains(e))) && i.push([o, r]);
          }),
          i
        );
      }
      _isLastInteractionFromInputLabel(e) {
        let { _mostRecentTarget: i, mostRecentModality: r } =
          this._inputModalityDetector;
        if (
          r !== "mouse" ||
          !i ||
          i === e ||
          (e.nodeName !== "INPUT" && e.nodeName !== "TEXTAREA") ||
          e.disabled
        )
          return !1;
        let o = e.labels;
        if (o) {
          for (let s = 0; s < o.length; s++) if (o[s].contains(i)) return !0;
        }
        return !1;
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var HI = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵcmp = Z({
      type: n,
      selectors: [["ng-component"]],
      exportAs: ["cdkVisuallyHidden"],
      decls: 0,
      vars: 0,
      template: function (i, r) {},
      styles: [
        `.cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return n;
})();
var UI = new Set(),
  ro,
  df = (() => {
    class n {
      _platform = f(xe);
      _nonce = f(Wo, { optional: !0 });
      _matchMedia;
      constructor() {
        this._matchMedia =
          this._platform.isBrowser && window.matchMedia
            ? window.matchMedia.bind(window)
            : l1;
      }
      matchMedia(e) {
        return (
          (this._platform.WEBKIT || this._platform.BLINK) && a1(e, this._nonce),
          this._matchMedia(e)
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function a1(n, t) {
  if (!UI.has(n))
    try {
      ro ||
        ((ro = document.createElement("style")),
        t && ro.setAttribute("nonce", t),
        ro.setAttribute("type", "text/css"),
        document.head.appendChild(ro)),
        ro.sheet &&
          (ro.sheet.insertRule(`@media ${n} {body{ }}`, 0), UI.add(n));
    } catch (e) {
      console.error(e);
    }
}
function l1(n) {
  return {
    matches: n === "all" || n === "",
    media: n,
    addListener: () => {},
    removeListener: () => {},
  };
}
var m_ = (() => {
  class n {
    _mediaMatcher = f(df);
    _zone = f(M);
    _queries = new Map();
    _destroySubject = new E();
    constructor() {}
    ngOnDestroy() {
      this._destroySubject.next(), this._destroySubject.complete();
    }
    isMatched(e) {
      return zI(rr(e)).some((r) => this._registerQuery(r).mql.matches);
    }
    observe(e) {
      let r = zI(rr(e)).map((s) => this._registerQuery(s).observable),
        o = Io(r);
      return (
        (o = Ai(o.pipe(dt(1)), o.pipe(zs(1), Hs(0)))),
        o.pipe(
          R((s) => {
            let a = { matches: !1, breakpoints: {} };
            return (
              s.forEach(({ matches: l, query: c }) => {
                (a.matches = a.matches || l), (a.breakpoints[c] = l);
              }),
              a
            );
          })
        )
      );
    }
    _registerQuery(e) {
      if (this._queries.has(e)) return this._queries.get(e);
      let i = this._mediaMatcher.matchMedia(e),
        o = {
          observable: new H((s) => {
            let a = (l) => this._zone.run(() => s.next(l));
            return (
              i.addListener(a),
              () => {
                i.removeListener(a);
              }
            );
          }).pipe(
            Xe(i),
            R(({ matches: s }) => ({ query: e, matches: s })),
            Ie(this._destroySubject)
          ),
          mql: i,
        };
      return this._queries.set(e, o), o;
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
function zI(n) {
  return n
    .map((t) => t.split(","))
    .reduce((t, e) => t.concat(e))
    .map((t) => t.trim());
}
var c1 = (() => {
  class n {
    create(e) {
      return typeof MutationObserver > "u" ? null : new MutationObserver(e);
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var $I = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ providers: [c1] });
  }
  return n;
})();
var sr = (function (n) {
    return (
      (n[(n.NONE = 0)] = "NONE"),
      (n[(n.BLACK_ON_WHITE = 1)] = "BLACK_ON_WHITE"),
      (n[(n.WHITE_ON_BLACK = 2)] = "WHITE_ON_BLACK"),
      n
    );
  })(sr || {}),
  GI = "cdk-high-contrast-black-on-white",
  WI = "cdk-high-contrast-white-on-black",
  g_ = "cdk-high-contrast-active",
  v_ = (() => {
    class n {
      _platform = f(xe);
      _hasCheckedHighContrastMode;
      _document = f(O);
      _breakpointSubscription;
      constructor() {
        this._breakpointSubscription = f(m_)
          .observe("(forced-colors: active)")
          .subscribe(() => {
            this._hasCheckedHighContrastMode &&
              ((this._hasCheckedHighContrastMode = !1),
              this._applyBodyHighContrastModeCssClasses());
          });
      }
      getHighContrastMode() {
        if (!this._platform.isBrowser) return sr.NONE;
        let e = this._document.createElement("div");
        (e.style.backgroundColor = "rgb(1,2,3)"),
          (e.style.position = "absolute"),
          this._document.body.appendChild(e);
        let i = this._document.defaultView || window,
          r = i && i.getComputedStyle ? i.getComputedStyle(e) : null,
          o = ((r && r.backgroundColor) || "").replace(/ /g, "");
        switch ((e.remove(), o)) {
          case "rgb(0,0,0)":
          case "rgb(45,50,54)":
          case "rgb(32,32,32)":
            return sr.WHITE_ON_BLACK;
          case "rgb(255,255,255)":
          case "rgb(255,250,239)":
            return sr.BLACK_ON_WHITE;
        }
        return sr.NONE;
      }
      ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
      }
      _applyBodyHighContrastModeCssClasses() {
        if (
          !this._hasCheckedHighContrastMode &&
          this._platform.isBrowser &&
          this._document.body
        ) {
          let e = this._document.body.classList;
          e.remove(g_, GI, WI), (this._hasCheckedHighContrastMode = !0);
          let i = this.getHighContrastMode();
          i === sr.BLACK_ON_WHITE
            ? e.add(g_, GI)
            : i === sr.WHITE_ON_BLACK && e.add(g_, WI);
        }
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var d1 = 200,
  uf = class {
    _letterKeyStream = new E();
    _items = [];
    _selectedItemIndex = -1;
    _pressedLetters = [];
    _skipPredicateFn;
    _selectedItem = new E();
    selectedItem = this._selectedItem;
    constructor(t, e) {
      let i = typeof e?.debounceInterval == "number" ? e.debounceInterval : d1;
      e?.skipPredicate && (this._skipPredicateFn = e.skipPredicate),
        this.setItems(t),
        this._setupKeyHandler(i);
    }
    destroy() {
      (this._pressedLetters = []),
        this._letterKeyStream.complete(),
        this._selectedItem.complete();
    }
    setCurrentSelectedItemIndex(t) {
      this._selectedItemIndex = t;
    }
    setItems(t) {
      this._items = t;
    }
    handleKey(t) {
      let e = t.keyCode;
      t.key && t.key.length === 1
        ? this._letterKeyStream.next(t.key.toLocaleUpperCase())
        : ((e >= 65 && e <= 90) || (e >= 48 && e <= 57)) &&
          this._letterKeyStream.next(String.fromCharCode(e));
    }
    isTyping() {
      return this._pressedLetters.length > 0;
    }
    reset() {
      this._pressedLetters = [];
    }
    _setupKeyHandler(t) {
      this._letterKeyStream
        .pipe(
          we((e) => this._pressedLetters.push(e)),
          Hs(t),
          ve(() => this._pressedLetters.length > 0),
          R(() => this._pressedLetters.join("").toLocaleUpperCase())
        )
        .subscribe((e) => {
          for (let i = 1; i < this._items.length + 1; i++) {
            let r = (this._selectedItemIndex + i) % this._items.length,
              o = this._items[r];
            if (
              !this._skipPredicateFn?.(o) &&
              o.getLabel?.().toLocaleUpperCase().trim().indexOf(e) === 0
            ) {
              this._selectedItem.next(o);
              break;
            }
          }
          this._pressedLetters = [];
        });
    }
  };
function ff(n, ...t) {
  return t.length
    ? t.some((e) => n[e])
    : n.altKey || n.shiftKey || n.ctrlKey || n.metaKey;
}
var hf = class {
  _items;
  _activeItemIndex = Ne(-1);
  _activeItem = Ne(null);
  _wrap = !1;
  _typeaheadSubscription = W.EMPTY;
  _itemChangesSubscription;
  _vertical = !0;
  _horizontal;
  _allowedModifierKeys = [];
  _homeAndEnd = !1;
  _pageUpAndDown = { enabled: !1, delta: 10 };
  _effectRef;
  _typeahead;
  _skipPredicateFn = (t) => t.disabled;
  constructor(t, e) {
    (this._items = t),
      t instanceof En
        ? (this._itemChangesSubscription = t.changes.subscribe((i) =>
            this._itemsChanged(i.toArray())
          ))
        : zi(t) &&
          (this._effectRef = Ea(() => this._itemsChanged(t()), {
            injector: e,
          }));
  }
  tabOut = new E();
  change = new E();
  skipPredicate(t) {
    return (this._skipPredicateFn = t), this;
  }
  withWrap(t = !0) {
    return (this._wrap = t), this;
  }
  withVerticalOrientation(t = !0) {
    return (this._vertical = t), this;
  }
  withHorizontalOrientation(t) {
    return (this._horizontal = t), this;
  }
  withAllowedModifierKeys(t) {
    return (this._allowedModifierKeys = t), this;
  }
  withTypeAhead(t = 200) {
    this._typeaheadSubscription.unsubscribe();
    let e = this._getItemsArray();
    return (
      (this._typeahead = new uf(e, {
        debounceInterval: typeof t == "number" ? t : void 0,
        skipPredicate: (i) => this._skipPredicateFn(i),
      })),
      (this._typeaheadSubscription = this._typeahead.selectedItem.subscribe(
        (i) => {
          this.setActiveItem(i);
        }
      )),
      this
    );
  }
  cancelTypeahead() {
    return this._typeahead?.reset(), this;
  }
  withHomeAndEnd(t = !0) {
    return (this._homeAndEnd = t), this;
  }
  withPageUpDown(t = !0, e = 10) {
    return (this._pageUpAndDown = { enabled: t, delta: e }), this;
  }
  setActiveItem(t) {
    let e = this._activeItem();
    this.updateActiveItem(t),
      this._activeItem() !== e && this.change.next(this._activeItemIndex());
  }
  onKeydown(t) {
    let e = t.keyCode,
      r = ["altKey", "ctrlKey", "metaKey", "shiftKey"].every(
        (o) => !t[o] || this._allowedModifierKeys.indexOf(o) > -1
      );
    switch (e) {
      case 9:
        this.tabOut.next();
        return;
      case 40:
        if (this._vertical && r) {
          this.setNextItemActive();
          break;
        } else return;
      case 38:
        if (this._vertical && r) {
          this.setPreviousItemActive();
          break;
        } else return;
      case 39:
        if (this._horizontal && r) {
          this._horizontal === "rtl"
            ? this.setPreviousItemActive()
            : this.setNextItemActive();
          break;
        } else return;
      case 37:
        if (this._horizontal && r) {
          this._horizontal === "rtl"
            ? this.setNextItemActive()
            : this.setPreviousItemActive();
          break;
        } else return;
      case 36:
        if (this._homeAndEnd && r) {
          this.setFirstItemActive();
          break;
        } else return;
      case 35:
        if (this._homeAndEnd && r) {
          this.setLastItemActive();
          break;
        } else return;
      case 33:
        if (this._pageUpAndDown.enabled && r) {
          let o = this._activeItemIndex() - this._pageUpAndDown.delta;
          this._setActiveItemByIndex(o > 0 ? o : 0, 1);
          break;
        } else return;
      case 34:
        if (this._pageUpAndDown.enabled && r) {
          let o = this._activeItemIndex() + this._pageUpAndDown.delta,
            s = this._getItemsArray().length;
          this._setActiveItemByIndex(o < s ? o : s - 1, -1);
          break;
        } else return;
      default:
        (r || ff(t, "shiftKey")) && this._typeahead?.handleKey(t);
        return;
    }
    this._typeahead?.reset(), t.preventDefault();
  }
  get activeItemIndex() {
    return this._activeItemIndex();
  }
  get activeItem() {
    return this._activeItem();
  }
  isTyping() {
    return !!this._typeahead && this._typeahead.isTyping();
  }
  setFirstItemActive() {
    this._setActiveItemByIndex(0, 1);
  }
  setLastItemActive() {
    this._setActiveItemByIndex(this._getItemsArray().length - 1, -1);
  }
  setNextItemActive() {
    this._activeItemIndex() < 0
      ? this.setFirstItemActive()
      : this._setActiveItemByDelta(1);
  }
  setPreviousItemActive() {
    this._activeItemIndex() < 0 && this._wrap
      ? this.setLastItemActive()
      : this._setActiveItemByDelta(-1);
  }
  updateActiveItem(t) {
    let e = this._getItemsArray(),
      i = typeof t == "number" ? t : e.indexOf(t),
      r = e[i];
    this._activeItem.set(r ?? null),
      this._activeItemIndex.set(i),
      this._typeahead?.setCurrentSelectedItemIndex(i);
  }
  destroy() {
    this._typeaheadSubscription.unsubscribe(),
      this._itemChangesSubscription?.unsubscribe(),
      this._effectRef?.destroy(),
      this._typeahead?.destroy(),
      this.tabOut.complete(),
      this.change.complete();
  }
  _setActiveItemByDelta(t) {
    this._wrap ? this._setActiveInWrapMode(t) : this._setActiveInDefaultMode(t);
  }
  _setActiveInWrapMode(t) {
    let e = this._getItemsArray();
    for (let i = 1; i <= e.length; i++) {
      let r = (this._activeItemIndex() + t * i + e.length) % e.length,
        o = e[r];
      if (!this._skipPredicateFn(o)) {
        this.setActiveItem(r);
        return;
      }
    }
  }
  _setActiveInDefaultMode(t) {
    this._setActiveItemByIndex(this._activeItemIndex() + t, t);
  }
  _setActiveItemByIndex(t, e) {
    let i = this._getItemsArray();
    if (i[t]) {
      for (; this._skipPredicateFn(i[t]); ) if (((t += e), !i[t])) return;
      this.setActiveItem(t);
    }
  }
  _getItemsArray() {
    return zi(this._items)
      ? this._items()
      : this._items instanceof En
      ? this._items.toArray()
      : this._items;
  }
  _itemsChanged(t) {
    this._typeahead?.setItems(t);
    let e = this._activeItem();
    if (e) {
      let i = t.indexOf(e);
      i > -1 &&
        i !== this._activeItemIndex() &&
        (this._activeItemIndex.set(i),
        this._typeahead?.setCurrentSelectedItemIndex(i));
    }
  }
};
var oo = class extends hf {
  _origin = "program";
  setFocusOrigin(t) {
    return (this._origin = t), this;
  }
  setActiveItem(t) {
    super.setActiveItem(t),
      this.activeItem && this.activeItem.focus(this._origin);
  }
};
var ke = (() => {
  class n {
    constructor() {
      f(v_)._applyBodyHighContrastModeCssClasses();
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [nr, nr] });
  }
  return n;
})();
var u1 = ["*"];
var f1 = [
    [
      ["", "mat-card-avatar", ""],
      ["", "matCardAvatar", ""],
    ],
    [
      ["mat-card-title"],
      ["mat-card-subtitle"],
      ["", "mat-card-title", ""],
      ["", "mat-card-subtitle", ""],
      ["", "matCardTitle", ""],
      ["", "matCardSubtitle", ""],
    ],
    "*",
  ],
  h1 = [
    "[mat-card-avatar], [matCardAvatar]",
    `mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,
    "*",
  ],
  p1 = new y("MAT_CARD_CONFIG"),
  _s = (() => {
    class n {
      appearance;
      constructor() {
        let e = f(p1, { optional: !0 });
        this.appearance = e?.appearance || "raised";
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["mat-card"]],
        hostAttrs: [1, "mat-mdc-card", "mdc-card"],
        hostVars: 8,
        hostBindings: function (i, r) {
          i & 2 &&
            re("mat-mdc-card-outlined", r.appearance === "outlined")(
              "mdc-card--outlined",
              r.appearance === "outlined"
            )("mat-mdc-card-filled", r.appearance === "filled")(
              "mdc-card--filled",
              r.appearance === "filled"
            );
        },
        inputs: { appearance: "appearance" },
        exportAs: ["matCard"],
        ngContentSelectors: u1,
        decls: 1,
        vars: 0,
        template: function (i, r) {
          i & 1 && (qe(), oe(0));
        },
        styles: [
          `.mat-mdc-card{display:flex;flex-direction:column;box-sizing:border-box;position:relative;border-style:solid;border-width:0;background-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-elevated-container-elevation, var(--mat-sys-level1))}.mat-mdc-card::after{position:absolute;top:0;left:0;width:100%;height:100%;border:solid 1px rgba(0,0,0,0);content:"";display:block;pointer-events:none;box-sizing:border-box;border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium))}.mat-mdc-card-outlined{background-color:var(--mat-card-outlined-container-color, var(--mat-sys-surface));border-radius:var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));border-width:var(--mat-card-outlined-outline-width, 1px);border-color:var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));box-shadow:var(--mat-card-outlined-container-elevation, var(--mat-sys-level0))}.mat-mdc-card-outlined::after{border:none}.mat-mdc-card-filled{background-color:var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));border-radius:var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-filled-container-elevation, var(--mat-sys-level0))}.mdc-card__media{position:relative;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-size:cover}.mdc-card__media::before{display:block;content:""}.mdc-card__media:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__media:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mat-mdc-card-actions{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;min-height:52px;padding:8px}.mat-mdc-card-title{font-family:var(--mat-card-title-text-font, var(--mat-sys-title-large-font));line-height:var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));font-size:var(--mat-card-title-text-size, var(--mat-sys-title-large-size));letter-spacing:var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));font-weight:var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight))}.mat-mdc-card-subtitle{color:var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));font-family:var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));line-height:var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));font-size:var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));letter-spacing:var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));font-weight:var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight))}.mat-mdc-card-title,.mat-mdc-card-subtitle{display:block;margin:0}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle{padding:16px 16px 0}.mat-mdc-card-header{display:flex;padding:16px 16px 0}.mat-mdc-card-content{display:block;padding:0 16px}.mat-mdc-card-content:first-child{padding-top:16px}.mat-mdc-card-content:last-child{padding-bottom:16px}.mat-mdc-card-title-group{display:flex;justify-content:space-between;width:100%}.mat-mdc-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;margin-bottom:16px;object-fit:cover}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title{line-height:normal}.mat-mdc-card-sm-image{width:80px;height:80px}.mat-mdc-card-md-image{width:112px;height:112px}.mat-mdc-card-lg-image{width:152px;height:152px}.mat-mdc-card-xl-image{width:240px;height:240px}.mat-mdc-card-subtitle~.mat-mdc-card-title,.mat-mdc-card-title~.mat-mdc-card-subtitle,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-title-group .mat-mdc-card-title,.mat-mdc-card-title-group .mat-mdc-card-subtitle{padding-top:0}.mat-mdc-card-content>:last-child:not(.mat-mdc-card-footer){margin-bottom:0}.mat-mdc-card-actions-align-end{justify-content:flex-end}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  ys = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["mat-card-title"],
          ["", "mat-card-title", ""],
          ["", "matCardTitle", ""],
        ],
        hostAttrs: [1, "mat-mdc-card-title"],
      });
    }
    return n;
  })();
var bs = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["mat-card-content"]],
        hostAttrs: [1, "mat-mdc-card-content"],
      });
    }
    return n;
  })(),
  pf = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["mat-card-subtitle"],
          ["", "mat-card-subtitle", ""],
          ["", "matCardSubtitle", ""],
        ],
        hostAttrs: [1, "mat-mdc-card-subtitle"],
      });
    }
    return n;
  })(),
  KI = (() => {
    class n {
      align = "start";
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["mat-card-actions"]],
        hostAttrs: [1, "mat-mdc-card-actions", "mdc-card__actions"],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && re("mat-mdc-card-actions-align-end", r.align === "end");
        },
        inputs: { align: "align" },
        exportAs: ["matCardActions"],
      });
    }
    return n;
  })(),
  ws = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["mat-card-header"]],
        hostAttrs: [1, "mat-mdc-card-header"],
        ngContentSelectors: h1,
        decls: 4,
        vars: 0,
        consts: [[1, "mat-mdc-card-header-text"]],
        template: function (i, r) {
          i & 1 && (qe(f1), oe(0), Tt(1, "div", 0), oe(2, 1), Bt(), oe(3, 2));
        },
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })();
var ar = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [ke, ke] });
  }
  return n;
})();
var mf;
function m1() {
  if (mf === void 0 && ((mf = null), typeof window < "u")) {
    let n = window;
    n.trustedTypes !== void 0 &&
      (mf = n.trustedTypes.createPolicy("angular#components", {
        createHTML: (t) => t,
      }));
  }
  return mf;
}
function yl(n) {
  return m1()?.createHTML(n) || n;
}
function ZI(n) {
  return Error(`Unable to find icon with the name "${n}"`);
}
function g1() {
  return Error(
    "Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers."
  );
}
function QI(n) {
  return Error(
    `The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${n}".`
  );
}
function XI(n) {
  return Error(
    `The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${n}".`
  );
}
var Si = class {
    url;
    svgText;
    options;
    svgElement;
    constructor(t, e, i) {
      (this.url = t), (this.svgText = e), (this.options = i);
    }
  },
  eS = (() => {
    class n {
      _httpClient;
      _sanitizer;
      _errorHandler;
      _document;
      _svgIconConfigs = new Map();
      _iconSetConfigs = new Map();
      _cachedIconsByUrl = new Map();
      _inProgressUrlFetches = new Map();
      _fontCssClassesByAlias = new Map();
      _resolvers = [];
      _defaultFontSetClass = ["material-icons", "mat-ligature-font"];
      constructor(e, i, r, o) {
        (this._httpClient = e),
          (this._sanitizer = i),
          (this._errorHandler = o),
          (this._document = r);
      }
      addSvgIcon(e, i, r) {
        return this.addSvgIconInNamespace("", e, i, r);
      }
      addSvgIconLiteral(e, i, r) {
        return this.addSvgIconLiteralInNamespace("", e, i, r);
      }
      addSvgIconInNamespace(e, i, r, o) {
        return this._addSvgIconConfig(e, i, new Si(r, null, o));
      }
      addSvgIconResolver(e) {
        return this._resolvers.push(e), this;
      }
      addSvgIconLiteralInNamespace(e, i, r, o) {
        let s = this._sanitizer.sanitize(Mt.HTML, r);
        if (!s) throw XI(r);
        let a = yl(s);
        return this._addSvgIconConfig(e, i, new Si("", a, o));
      }
      addSvgIconSet(e, i) {
        return this.addSvgIconSetInNamespace("", e, i);
      }
      addSvgIconSetLiteral(e, i) {
        return this.addSvgIconSetLiteralInNamespace("", e, i);
      }
      addSvgIconSetInNamespace(e, i, r) {
        return this._addSvgIconSetConfig(e, new Si(i, null, r));
      }
      addSvgIconSetLiteralInNamespace(e, i, r) {
        let o = this._sanitizer.sanitize(Mt.HTML, i);
        if (!o) throw XI(i);
        let s = yl(o);
        return this._addSvgIconSetConfig(e, new Si("", s, r));
      }
      registerFontClassAlias(e, i = e) {
        return this._fontCssClassesByAlias.set(e, i), this;
      }
      classNameForFontAlias(e) {
        return this._fontCssClassesByAlias.get(e) || e;
      }
      setDefaultFontSetClass(...e) {
        return (this._defaultFontSetClass = e), this;
      }
      getDefaultFontSetClass() {
        return this._defaultFontSetClass;
      }
      getSvgIconFromUrl(e) {
        let i = this._sanitizer.sanitize(Mt.RESOURCE_URL, e);
        if (!i) throw QI(e);
        let r = this._cachedIconsByUrl.get(i);
        return r
          ? I(gf(r))
          : this._loadSvgIconFromConfig(new Si(e, null)).pipe(
              we((o) => this._cachedIconsByUrl.set(i, o)),
              R((o) => gf(o))
            );
      }
      getNamedSvgIcon(e, i = "") {
        let r = JI(i, e),
          o = this._svgIconConfigs.get(r);
        if (o) return this._getSvgFromConfig(o);
        if (((o = this._getIconConfigFromResolvers(i, e)), o))
          return this._svgIconConfigs.set(r, o), this._getSvgFromConfig(o);
        let s = this._iconSetConfigs.get(i);
        return s ? this._getSvgFromIconSetConfigs(e, s) : Ri(ZI(r));
      }
      ngOnDestroy() {
        (this._resolvers = []),
          this._svgIconConfigs.clear(),
          this._iconSetConfigs.clear(),
          this._cachedIconsByUrl.clear();
      }
      _getSvgFromConfig(e) {
        return e.svgText
          ? I(gf(this._svgElementFromConfig(e)))
          : this._loadSvgIconFromConfig(e).pipe(R((i) => gf(i)));
      }
      _getSvgFromIconSetConfigs(e, i) {
        let r = this._extractIconWithNameFromAnySet(e, i);
        if (r) return I(r);
        let o = i
          .filter((s) => !s.svgText)
          .map((s) =>
            this._loadSvgIconSetFromConfig(s).pipe(
              Fn((a) => {
                let c = `Loading icon set URL: ${this._sanitizer.sanitize(
                  Mt.RESOURCE_URL,
                  s.url
                )} failed: ${a.message}`;
                return this._errorHandler.handleError(new Error(c)), I(null);
              })
            )
          );
        return Er(o).pipe(
          R(() => {
            let s = this._extractIconWithNameFromAnySet(e, i);
            if (!s) throw ZI(e);
            return s;
          })
        );
      }
      _extractIconWithNameFromAnySet(e, i) {
        for (let r = i.length - 1; r >= 0; r--) {
          let o = i[r];
          if (o.svgText && o.svgText.toString().indexOf(e) > -1) {
            let s = this._svgElementFromConfig(o),
              a = this._extractSvgIconFromSet(s, e, o.options);
            if (a) return a;
          }
        }
        return null;
      }
      _loadSvgIconFromConfig(e) {
        return this._fetchIcon(e).pipe(
          we((i) => (e.svgText = i)),
          R(() => this._svgElementFromConfig(e))
        );
      }
      _loadSvgIconSetFromConfig(e) {
        return e.svgText
          ? I(null)
          : this._fetchIcon(e).pipe(we((i) => (e.svgText = i)));
      }
      _extractSvgIconFromSet(e, i, r) {
        let o = e.querySelector(`[id="${i}"]`);
        if (!o) return null;
        let s = o.cloneNode(!0);
        if ((s.removeAttribute("id"), s.nodeName.toLowerCase() === "svg"))
          return this._setSvgAttributes(s, r);
        if (s.nodeName.toLowerCase() === "symbol")
          return this._setSvgAttributes(this._toSvgElement(s), r);
        let a = this._svgElementFromString(yl("<svg></svg>"));
        return a.appendChild(s), this._setSvgAttributes(a, r);
      }
      _svgElementFromString(e) {
        let i = this._document.createElement("DIV");
        i.innerHTML = e;
        let r = i.querySelector("svg");
        if (!r) throw Error("<svg> tag not found");
        return r;
      }
      _toSvgElement(e) {
        let i = this._svgElementFromString(yl("<svg></svg>")),
          r = e.attributes;
        for (let o = 0; o < r.length; o++) {
          let { name: s, value: a } = r[o];
          s !== "id" && i.setAttribute(s, a);
        }
        for (let o = 0; o < e.childNodes.length; o++)
          e.childNodes[o].nodeType === this._document.ELEMENT_NODE &&
            i.appendChild(e.childNodes[o].cloneNode(!0));
        return i;
      }
      _setSvgAttributes(e, i) {
        return (
          e.setAttribute("fit", ""),
          e.setAttribute("height", "100%"),
          e.setAttribute("width", "100%"),
          e.setAttribute("preserveAspectRatio", "xMidYMid meet"),
          e.setAttribute("focusable", "false"),
          i && i.viewBox && e.setAttribute("viewBox", i.viewBox),
          e
        );
      }
      _fetchIcon(e) {
        let { url: i, options: r } = e,
          o = r?.withCredentials ?? !1;
        if (!this._httpClient) throw g1();
        if (i == null) throw Error(`Cannot fetch icon from URL "${i}".`);
        let s = this._sanitizer.sanitize(Mt.RESOURCE_URL, i);
        if (!s) throw QI(i);
        let a = this._inProgressUrlFetches.get(s);
        if (a) return a;
        let l = this._httpClient
          .get(s, { responseType: "text", withCredentials: o })
          .pipe(
            R((c) => yl(c)),
            ki(() => this._inProgressUrlFetches.delete(s)),
            Us()
          );
        return this._inProgressUrlFetches.set(s, l), l;
      }
      _addSvgIconConfig(e, i, r) {
        return this._svgIconConfigs.set(JI(e, i), r), this;
      }
      _addSvgIconSetConfig(e, i) {
        let r = this._iconSetConfigs.get(e);
        return r ? r.push(i) : this._iconSetConfigs.set(e, [i]), this;
      }
      _svgElementFromConfig(e) {
        if (!e.svgElement) {
          let i = this._svgElementFromString(e.svgText);
          this._setSvgAttributes(i, e.options), (e.svgElement = i);
        }
        return e.svgElement;
      }
      _getIconConfigFromResolvers(e, i) {
        for (let r = 0; r < this._resolvers.length; r++) {
          let o = this._resolvers[r](i, e);
          if (o)
            return v1(o) ? new Si(o.url, null, o.options) : new Si(o, null);
        }
      }
      static ɵfac = function (i) {
        return new (i || n)(A(Zg, 8), A(Qg), A(O, 8), A(ft));
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function gf(n) {
  return n.cloneNode(!0);
}
function JI(n, t) {
  return n + ":" + t;
}
function v1(n) {
  return !!(n.url && n.options);
}
var _1 = ["*"],
  y1 = new y("MAT_ICON_DEFAULT_OPTIONS"),
  b1 = new y("mat-icon-location", { providedIn: "root", factory: w1 });
function w1() {
  let n = f(O),
    t = n ? n.location : null;
  return { getPathname: () => (t ? t.pathname + t.search : "") };
}
var tS = [
    "clip-path",
    "color-profile",
    "src",
    "cursor",
    "fill",
    "filter",
    "marker",
    "marker-start",
    "marker-mid",
    "marker-end",
    "mask",
    "stroke",
  ],
  E1 = tS.map((n) => `[${n}]`).join(", "),
  D1 = /^url\(['"]?#(.*?)['"]?\)$/,
  lr = (() => {
    class n {
      _elementRef = f(K);
      _iconRegistry = f(eS);
      _location = f(b1);
      _errorHandler = f(ft);
      _defaultColor;
      get color() {
        return this._color || this._defaultColor;
      }
      set color(e) {
        this._color = e;
      }
      _color;
      inline = !1;
      get svgIcon() {
        return this._svgIcon;
      }
      set svgIcon(e) {
        e !== this._svgIcon &&
          (e
            ? this._updateSvgIcon(e)
            : this._svgIcon && this._clearSvgElement(),
          (this._svgIcon = e));
      }
      _svgIcon;
      get fontSet() {
        return this._fontSet;
      }
      set fontSet(e) {
        let i = this._cleanupFontValue(e);
        i !== this._fontSet &&
          ((this._fontSet = i), this._updateFontIconClasses());
      }
      _fontSet;
      get fontIcon() {
        return this._fontIcon;
      }
      set fontIcon(e) {
        let i = this._cleanupFontValue(e);
        i !== this._fontIcon &&
          ((this._fontIcon = i), this._updateFontIconClasses());
      }
      _fontIcon;
      _previousFontSetClass = [];
      _previousFontIconClass;
      _svgName;
      _svgNamespace;
      _previousPath;
      _elementsWithExternalReferences;
      _currentIconFetch = W.EMPTY;
      constructor() {
        let e = f(new Ca("aria-hidden"), { optional: !0 }),
          i = f(y1, { optional: !0 });
        i &&
          (i.color && (this.color = this._defaultColor = i.color),
          i.fontSet && (this.fontSet = i.fontSet)),
          e ||
            this._elementRef.nativeElement.setAttribute("aria-hidden", "true");
      }
      _splitIconName(e) {
        if (!e) return ["", ""];
        let i = e.split(":");
        switch (i.length) {
          case 1:
            return ["", i[0]];
          case 2:
            return i;
          default:
            throw Error(`Invalid icon name: "${e}"`);
        }
      }
      ngOnInit() {
        this._updateFontIconClasses();
      }
      ngAfterViewChecked() {
        let e = this._elementsWithExternalReferences;
        if (e && e.size) {
          let i = this._location.getPathname();
          i !== this._previousPath &&
            ((this._previousPath = i), this._prependPathToReferences(i));
        }
      }
      ngOnDestroy() {
        this._currentIconFetch.unsubscribe(),
          this._elementsWithExternalReferences &&
            this._elementsWithExternalReferences.clear();
      }
      _usingFontIcon() {
        return !this.svgIcon;
      }
      _setSvgElement(e) {
        this._clearSvgElement();
        let i = this._location.getPathname();
        (this._previousPath = i),
          this._cacheChildrenWithExternalReferences(e),
          this._prependPathToReferences(i),
          this._elementRef.nativeElement.appendChild(e);
      }
      _clearSvgElement() {
        let e = this._elementRef.nativeElement,
          i = e.childNodes.length;
        for (
          this._elementsWithExternalReferences &&
          this._elementsWithExternalReferences.clear();
          i--;

        ) {
          let r = e.childNodes[i];
          (r.nodeType !== 1 || r.nodeName.toLowerCase() === "svg") &&
            r.remove();
        }
      }
      _updateFontIconClasses() {
        if (!this._usingFontIcon()) return;
        let e = this._elementRef.nativeElement,
          i = (
            this.fontSet
              ? this._iconRegistry
                  .classNameForFontAlias(this.fontSet)
                  .split(/ +/)
              : this._iconRegistry.getDefaultFontSetClass()
          ).filter((r) => r.length > 0);
        this._previousFontSetClass.forEach((r) => e.classList.remove(r)),
          i.forEach((r) => e.classList.add(r)),
          (this._previousFontSetClass = i),
          this.fontIcon !== this._previousFontIconClass &&
            !i.includes("mat-ligature-font") &&
            (this._previousFontIconClass &&
              e.classList.remove(this._previousFontIconClass),
            this.fontIcon && e.classList.add(this.fontIcon),
            (this._previousFontIconClass = this.fontIcon));
      }
      _cleanupFontValue(e) {
        return typeof e == "string" ? e.trim().split(" ")[0] : e;
      }
      _prependPathToReferences(e) {
        let i = this._elementsWithExternalReferences;
        i &&
          i.forEach((r, o) => {
            r.forEach((s) => {
              o.setAttribute(s.name, `url('${e}#${s.value}')`);
            });
          });
      }
      _cacheChildrenWithExternalReferences(e) {
        let i = e.querySelectorAll(E1),
          r = (this._elementsWithExternalReferences =
            this._elementsWithExternalReferences || new Map());
        for (let o = 0; o < i.length; o++)
          tS.forEach((s) => {
            let a = i[o],
              l = a.getAttribute(s),
              c = l ? l.match(D1) : null;
            if (c) {
              let d = r.get(a);
              d || ((d = []), r.set(a, d)), d.push({ name: s, value: c[1] });
            }
          });
      }
      _updateSvgIcon(e) {
        if (
          ((this._svgNamespace = null),
          (this._svgName = null),
          this._currentIconFetch.unsubscribe(),
          e)
        ) {
          let [i, r] = this._splitIconName(e);
          i && (this._svgNamespace = i),
            r && (this._svgName = r),
            (this._currentIconFetch = this._iconRegistry
              .getNamedSvgIcon(r, i)
              .pipe(dt(1))
              .subscribe(
                (o) => this._setSvgElement(o),
                (o) => {
                  let s = `Error retrieving icon ${i}:${r}! ${o.message}`;
                  this._errorHandler.handleError(new Error(s));
                }
              ));
        }
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["mat-icon"]],
        hostAttrs: ["role", "img", 1, "mat-icon", "notranslate"],
        hostVars: 10,
        hostBindings: function (i, r) {
          i & 2 &&
            (De("data-mat-icon-type", r._usingFontIcon() ? "font" : "svg")(
              "data-mat-icon-name",
              r._svgName || r.fontIcon
            )("data-mat-icon-namespace", r._svgNamespace || r.fontSet)(
              "fontIcon",
              r._usingFontIcon() ? r.fontIcon : null
            ),
            In(r.color ? "mat-" + r.color : ""),
            re("mat-icon-inline", r.inline)(
              "mat-icon-no-color",
              r.color !== "primary" &&
                r.color !== "accent" &&
                r.color !== "warn"
            ));
        },
        inputs: {
          color: "color",
          inline: [2, "inline", "inline", se],
          svgIcon: "svgIcon",
          fontSet: "fontSet",
          fontIcon: "fontIcon",
        },
        exportAs: ["matIcon"],
        ngContentSelectors: _1,
        decls: 1,
        vars: 0,
        template: function (i, r) {
          i & 1 && (qe(), oe(0));
        },
        styles: [
          `mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color, inherit)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  cr = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({ imports: [ke, ke] });
    }
    return n;
  })();
function w_() {
  return (
    (typeof __karma__ < "u" && !!__karma__) ||
    (typeof jasmine < "u" && !!jasmine) ||
    (typeof jest < "u" && !!jest) ||
    (typeof Mocha < "u" && !!Mocha)
  );
}
var Es,
  nS = [
    "color",
    "button",
    "checkbox",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ];
function E_() {
  if (Es) return Es;
  if (typeof document != "object" || !document) return (Es = new Set(nS)), Es;
  let n = document.createElement("input");
  return (
    (Es = new Set(nS.filter((t) => (n.setAttribute("type", t), n.type === t)))),
    Es
  );
}
var C1 = new y("MATERIAL_ANIMATIONS");
function Jt() {
  return f(C1, { optional: !0 })?.animationsDisabled ||
    f(qi, { optional: !0 }) === "NoopAnimations"
    ? !0
    : f(df).matchMedia("(prefers-reduced-motion)").matches;
}
function $e(n) {
  return n == null ? "" : typeof n == "string" ? n : `${n}px`;
}
function Ds(n) {
  return n != null && `${n}` != "false";
}
var hn = (function (n) {
    return (
      (n[(n.FADING_IN = 0)] = "FADING_IN"),
      (n[(n.VISIBLE = 1)] = "VISIBLE"),
      (n[(n.FADING_OUT = 2)] = "FADING_OUT"),
      (n[(n.HIDDEN = 3)] = "HIDDEN"),
      n
    );
  })(hn || {}),
  D_ = class {
    _renderer;
    element;
    config;
    _animationForciblyDisabledThroughCss;
    state = hn.HIDDEN;
    constructor(t, e, i, r = !1) {
      (this._renderer = t),
        (this.element = e),
        (this.config = i),
        (this._animationForciblyDisabledThroughCss = r);
    }
    fadeOut() {
      this._renderer.fadeOutRipple(this);
    }
  },
  iS = vs({ passive: !0, capture: !0 }),
  C_ = class {
    _events = new Map();
    addHandler(t, e, i, r) {
      let o = this._events.get(e);
      if (o) {
        let s = o.get(i);
        s ? s.add(r) : o.set(i, new Set([r]));
      } else
        this._events.set(e, new Map([[i, new Set([r])]])),
          t.runOutsideAngular(() => {
            document.addEventListener(e, this._delegateEventHandler, iS);
          });
    }
    removeHandler(t, e, i) {
      let r = this._events.get(t);
      if (!r) return;
      let o = r.get(e);
      o &&
        (o.delete(i),
        o.size === 0 && r.delete(e),
        r.size === 0 &&
          (this._events.delete(t),
          document.removeEventListener(t, this._delegateEventHandler, iS)));
    }
    _delegateEventHandler = (t) => {
      let e = it(t);
      e &&
        this._events.get(t.type)?.forEach((i, r) => {
          (r === e || r.contains(e)) && i.forEach((o) => o.handleEvent(t));
        });
    };
  },
  bl = { enterDuration: 225, exitDuration: 150 },
  I1 = 800,
  rS = vs({ passive: !0, capture: !0 }),
  oS = ["mousedown", "touchstart"],
  sS = ["mouseup", "mouseleave", "touchend", "touchcancel"],
  S1 = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["ng-component"]],
        hostAttrs: ["mat-ripple-style-loader", ""],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `.mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  wl = class n {
    _target;
    _ngZone;
    _platform;
    _containerElement;
    _triggerElement;
    _isPointerDown = !1;
    _activeRipples = new Map();
    _mostRecentTransientRipple;
    _lastTouchStartEvent;
    _pointerUpEventsRegistered = !1;
    _containerRect;
    static _eventManager = new C_();
    constructor(t, e, i, r, o) {
      (this._target = t),
        (this._ngZone = e),
        (this._platform = r),
        r.isBrowser && (this._containerElement = Ve(i)),
        o && o.get(gt).load(S1);
    }
    fadeInRipple(t, e, i = {}) {
      let r = (this._containerRect =
          this._containerRect ||
          this._containerElement.getBoundingClientRect()),
        o = _(_({}, bl), i.animation);
      i.centered && ((t = r.left + r.width / 2), (e = r.top + r.height / 2));
      let s = i.radius || x1(t, e, r),
        a = t - r.left,
        l = e - r.top,
        c = o.enterDuration,
        d = document.createElement("div");
      d.classList.add("mat-ripple-element"),
        (d.style.left = `${a - s}px`),
        (d.style.top = `${l - s}px`),
        (d.style.height = `${s * 2}px`),
        (d.style.width = `${s * 2}px`),
        i.color != null && (d.style.backgroundColor = i.color),
        (d.style.transitionDuration = `${c}ms`),
        this._containerElement.appendChild(d);
      let u = window.getComputedStyle(d),
        p = u.transitionProperty,
        h = u.transitionDuration,
        m =
          p === "none" ||
          h === "0s" ||
          h === "0s, 0s" ||
          (r.width === 0 && r.height === 0),
        g = new D_(this, d, i, m);
      (d.style.transform = "scale3d(1, 1, 1)"),
        (g.state = hn.FADING_IN),
        i.persistent || (this._mostRecentTransientRipple = g);
      let w = null;
      return (
        !m &&
          (c || o.exitDuration) &&
          this._ngZone.runOutsideAngular(() => {
            let S = () => {
                w && (w.fallbackTimer = null),
                  clearTimeout(he),
                  this._finishRippleTransition(g);
              },
              ae = () => this._destroyRipple(g),
              he = setTimeout(ae, c + 100);
            d.addEventListener("transitionend", S),
              d.addEventListener("transitioncancel", ae),
              (w = {
                onTransitionEnd: S,
                onTransitionCancel: ae,
                fallbackTimer: he,
              });
          }),
        this._activeRipples.set(g, w),
        (m || !c) && this._finishRippleTransition(g),
        g
      );
    }
    fadeOutRipple(t) {
      if (t.state === hn.FADING_OUT || t.state === hn.HIDDEN) return;
      let e = t.element,
        i = _(_({}, bl), t.config.animation);
      (e.style.transitionDuration = `${i.exitDuration}ms`),
        (e.style.opacity = "0"),
        (t.state = hn.FADING_OUT),
        (t._animationForciblyDisabledThroughCss || !i.exitDuration) &&
          this._finishRippleTransition(t);
    }
    fadeOutAll() {
      this._getActiveRipples().forEach((t) => t.fadeOut());
    }
    fadeOutAllNonPersistent() {
      this._getActiveRipples().forEach((t) => {
        t.config.persistent || t.fadeOut();
      });
    }
    setupTriggerEvents(t) {
      let e = Ve(t);
      !this._platform.isBrowser ||
        !e ||
        e === this._triggerElement ||
        (this._removeTriggerEvents(),
        (this._triggerElement = e),
        oS.forEach((i) => {
          n._eventManager.addHandler(this._ngZone, i, e, this);
        }));
    }
    handleEvent(t) {
      t.type === "mousedown"
        ? this._onMousedown(t)
        : t.type === "touchstart"
        ? this._onTouchStart(t)
        : this._onPointerUp(),
        this._pointerUpEventsRegistered ||
          (this._ngZone.runOutsideAngular(() => {
            sS.forEach((e) => {
              this._triggerElement.addEventListener(e, this, rS);
            });
          }),
          (this._pointerUpEventsRegistered = !0));
    }
    _finishRippleTransition(t) {
      t.state === hn.FADING_IN
        ? this._startFadeOutTransition(t)
        : t.state === hn.FADING_OUT && this._destroyRipple(t);
    }
    _startFadeOutTransition(t) {
      let e = t === this._mostRecentTransientRipple,
        { persistent: i } = t.config;
      (t.state = hn.VISIBLE), !i && (!e || !this._isPointerDown) && t.fadeOut();
    }
    _destroyRipple(t) {
      let e = this._activeRipples.get(t) ?? null;
      this._activeRipples.delete(t),
        this._activeRipples.size || (this._containerRect = null),
        t === this._mostRecentTransientRipple &&
          (this._mostRecentTransientRipple = null),
        (t.state = hn.HIDDEN),
        e !== null &&
          (t.element.removeEventListener("transitionend", e.onTransitionEnd),
          t.element.removeEventListener(
            "transitioncancel",
            e.onTransitionCancel
          ),
          e.fallbackTimer !== null && clearTimeout(e.fallbackTimer)),
        t.element.remove();
    }
    _onMousedown(t) {
      let e = Ci(t),
        i =
          this._lastTouchStartEvent &&
          Date.now() < this._lastTouchStartEvent + I1;
      !this._target.rippleDisabled &&
        !e &&
        !i &&
        ((this._isPointerDown = !0),
        this.fadeInRipple(t.clientX, t.clientY, this._target.rippleConfig));
    }
    _onTouchStart(t) {
      if (!this._target.rippleDisabled && !Ii(t)) {
        (this._lastTouchStartEvent = Date.now()), (this._isPointerDown = !0);
        let e = t.changedTouches;
        if (e)
          for (let i = 0; i < e.length; i++)
            this.fadeInRipple(
              e[i].clientX,
              e[i].clientY,
              this._target.rippleConfig
            );
      }
    }
    _onPointerUp() {
      this._isPointerDown &&
        ((this._isPointerDown = !1),
        this._getActiveRipples().forEach((t) => {
          let e =
            t.state === hn.VISIBLE ||
            (t.config.terminateOnPointerUp && t.state === hn.FADING_IN);
          !t.config.persistent && e && t.fadeOut();
        }));
    }
    _getActiveRipples() {
      return Array.from(this._activeRipples.keys());
    }
    _removeTriggerEvents() {
      let t = this._triggerElement;
      t &&
        (oS.forEach((e) => n._eventManager.removeHandler(e, t, this)),
        this._pointerUpEventsRegistered &&
          (sS.forEach((e) => t.removeEventListener(e, this, rS)),
          (this._pointerUpEventsRegistered = !1)));
    }
  };
function x1(n, t, e) {
  let i = Math.max(Math.abs(n - e.left), Math.abs(n - e.right)),
    r = Math.max(Math.abs(t - e.top), Math.abs(t - e.bottom));
  return Math.sqrt(i * i + r * r);
}
var El = new y("mat-ripple-global-options"),
  aS = (() => {
    class n {
      _elementRef = f(K);
      _animationsDisabled = Jt();
      color;
      unbounded;
      centered;
      radius = 0;
      animation;
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        e && this.fadeOutAllNonPersistent(),
          (this._disabled = e),
          this._setupTriggerEventsIfEnabled();
      }
      _disabled = !1;
      get trigger() {
        return this._trigger || this._elementRef.nativeElement;
      }
      set trigger(e) {
        (this._trigger = e), this._setupTriggerEventsIfEnabled();
      }
      _trigger;
      _rippleRenderer;
      _globalOptions;
      _isInitialized = !1;
      constructor() {
        let e = f(M),
          i = f(xe),
          r = f(El, { optional: !0 }),
          o = f(te);
        (this._globalOptions = r || {}),
          (this._rippleRenderer = new wl(this, e, this._elementRef, i, o));
      }
      ngOnInit() {
        (this._isInitialized = !0), this._setupTriggerEventsIfEnabled();
      }
      ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
      }
      fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
      }
      fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
      }
      get rippleConfig() {
        return {
          centered: this.centered,
          radius: this.radius,
          color: this.color,
          animation: _(
            _(
              _({}, this._globalOptions.animation),
              this._animationsDisabled
                ? { enterDuration: 0, exitDuration: 0 }
                : {}
            ),
            this.animation
          ),
          terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
      }
      get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
      }
      _setupTriggerEventsIfEnabled() {
        !this.disabled &&
          this._isInitialized &&
          this._rippleRenderer.setupTriggerEvents(this.trigger);
      }
      launch(e, i = 0, r) {
        return typeof e == "number"
          ? this._rippleRenderer.fadeInRipple(
              e,
              i,
              _(_({}, this.rippleConfig), r)
            )
          : this._rippleRenderer.fadeInRipple(
              0,
              0,
              _(_({}, this.rippleConfig), e)
            );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["", "mat-ripple", ""],
          ["", "matRipple", ""],
        ],
        hostAttrs: [1, "mat-ripple"],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && re("mat-ripple-unbounded", r.unbounded);
        },
        inputs: {
          color: [0, "matRippleColor", "color"],
          unbounded: [0, "matRippleUnbounded", "unbounded"],
          centered: [0, "matRippleCentered", "centered"],
          radius: [0, "matRippleRadius", "radius"],
          animation: [0, "matRippleAnimation", "animation"],
          disabled: [0, "matRippleDisabled", "disabled"],
          trigger: [0, "matRippleTrigger", "trigger"],
        },
        exportAs: ["matRipple"],
      });
    }
    return n;
  })();
var M1 = { capture: !0 },
  T1 = ["focus", "mousedown", "mouseenter", "touchstart"],
  I_ = "mat-ripple-loader-uninitialized",
  S_ = "mat-ripple-loader-class-name",
  lS = "mat-ripple-loader-centered",
  _f = "mat-ripple-loader-disabled",
  yf = (() => {
    class n {
      _document = f(O);
      _animationsDisabled = Jt();
      _globalRippleOptions = f(El, { optional: !0 });
      _platform = f(xe);
      _ngZone = f(M);
      _injector = f(te);
      _eventCleanups;
      _hosts = new Map();
      constructor() {
        let e = f(Se).createRenderer(null, null);
        this._eventCleanups = this._ngZone.runOutsideAngular(() =>
          T1.map((i) => e.listen(this._document, i, this._onInteraction, M1))
        );
      }
      ngOnDestroy() {
        let e = this._hosts.keys();
        for (let i of e) this.destroyRipple(i);
        this._eventCleanups.forEach((i) => i());
      }
      configureRipple(e, i) {
        e.setAttribute(I_, this._globalRippleOptions?.namespace ?? ""),
          (i.className || !e.hasAttribute(S_)) &&
            e.setAttribute(S_, i.className || ""),
          i.centered && e.setAttribute(lS, ""),
          i.disabled && e.setAttribute(_f, "");
      }
      setDisabled(e, i) {
        let r = this._hosts.get(e);
        r
          ? ((r.target.rippleDisabled = i),
            !i &&
              !r.hasSetUpEvents &&
              ((r.hasSetUpEvents = !0), r.renderer.setupTriggerEvents(e)))
          : i
          ? e.setAttribute(_f, "")
          : e.removeAttribute(_f);
      }
      _onInteraction = (e) => {
        let i = it(e);
        if (i instanceof HTMLElement) {
          let r = i.closest(
            `[${I_}="${this._globalRippleOptions?.namespace ?? ""}"]`
          );
          r && this._createRipple(r);
        }
      };
      _createRipple(e) {
        if (!this._document || this._hosts.has(e)) return;
        e.querySelector(".mat-ripple")?.remove();
        let i = this._document.createElement("span");
        i.classList.add("mat-ripple", e.getAttribute(S_)), e.append(i);
        let r = this._globalRippleOptions,
          o = this._animationsDisabled
            ? 0
            : r?.animation?.enterDuration ?? bl.enterDuration,
          s = this._animationsDisabled
            ? 0
            : r?.animation?.exitDuration ?? bl.exitDuration,
          a = {
            rippleDisabled:
              this._animationsDisabled || r?.disabled || e.hasAttribute(_f),
            rippleConfig: {
              centered: e.hasAttribute(lS),
              terminateOnPointerUp: r?.terminateOnPointerUp,
              animation: { enterDuration: o, exitDuration: s },
            },
          },
          l = new wl(a, this._ngZone, i, this._platform, this._injector),
          c = !a.rippleDisabled;
        c && l.setupTriggerEvents(e),
          this._hosts.set(e, { target: a, renderer: l, hasSetUpEvents: c }),
          e.removeAttribute(I_);
      }
      destroyRipple(e) {
        let i = this._hosts.get(e);
        i && (i.renderer._removeTriggerEvents(), this._hosts.delete(e));
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var so = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵcmp = Z({
      type: n,
      selectors: [["structural-styles"]],
      decls: 0,
      vars: 0,
      template: function (i, r) {},
      styles: [
        `.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return n;
})();
var R1 = ["mat-icon-button", ""],
  A1 = ["*"],
  N1 = new y("MAT_BUTTON_CONFIG");
function cS(n) {
  return n == null ? void 0 : Gr(n);
}
var x_ = (() => {
    class n {
      _elementRef = f(K);
      _ngZone = f(M);
      _animationsDisabled = Jt();
      _config = f(N1, { optional: !0 });
      _focusMonitor = f(or);
      _cleanupClick;
      _renderer = f(pt);
      _rippleLoader = f(yf);
      _isAnchor;
      _isFab = !1;
      color;
      get disableRipple() {
        return this._disableRipple;
      }
      set disableRipple(e) {
        (this._disableRipple = e), this._updateRippleDisabled();
      }
      _disableRipple = !1;
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        (this._disabled = e), this._updateRippleDisabled();
      }
      _disabled = !1;
      ariaDisabled;
      disabledInteractive;
      tabIndex;
      set _tabindex(e) {
        this.tabIndex = e;
      }
      constructor() {
        f(gt).load(so);
        let e = this._elementRef.nativeElement;
        (this._isAnchor = e.tagName === "A"),
          (this.disabledInteractive = this._config?.disabledInteractive ?? !1),
          (this.color = this._config?.color ?? null),
          this._rippleLoader?.configureRipple(e, {
            className: "mat-mdc-button-ripple",
          });
      }
      ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, !0),
          this._isAnchor && this._setupAsAnchor();
      }
      ngOnDestroy() {
        this._cleanupClick?.(),
          this._focusMonitor.stopMonitoring(this._elementRef),
          this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
      }
      focus(e = "program", i) {
        e
          ? this._focusMonitor.focusVia(this._elementRef.nativeElement, e, i)
          : this._elementRef.nativeElement.focus(i);
      }
      _getAriaDisabled() {
        return this.ariaDisabled != null
          ? this.ariaDisabled
          : this._isAnchor
          ? this.disabled || null
          : this.disabled && this.disabledInteractive
          ? !0
          : null;
      }
      _getDisabledAttribute() {
        return this.disabledInteractive || !this.disabled ? null : !0;
      }
      _updateRippleDisabled() {
        this._rippleLoader?.setDisabled(
          this._elementRef.nativeElement,
          this.disableRipple || this.disabled
        );
      }
      _getTabIndex() {
        return this._isAnchor
          ? this.disabled && !this.disabledInteractive
            ? -1
            : this.tabIndex
          : this.tabIndex;
      }
      _setupAsAnchor() {
        this._cleanupClick = this._ngZone.runOutsideAngular(() =>
          this._renderer.listen(
            this._elementRef.nativeElement,
            "click",
            (e) => {
              this.disabled &&
                (e.preventDefault(), e.stopImmediatePropagation());
            }
          )
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        hostAttrs: [1, "mat-mdc-button-base"],
        hostVars: 13,
        hostBindings: function (i, r) {
          i & 2 &&
            (De("disabled", r._getDisabledAttribute())(
              "aria-disabled",
              r._getAriaDisabled()
            )("tabindex", r._getTabIndex()),
            In(r.color ? "mat-" + r.color : ""),
            re("mat-mdc-button-disabled", r.disabled)(
              "mat-mdc-button-disabled-interactive",
              r.disabledInteractive
            )("mat-unthemed", !r.color)(
              "_mat-animation-noopable",
              r._animationsDisabled
            ));
        },
        inputs: {
          color: "color",
          disableRipple: [2, "disableRipple", "disableRipple", se],
          disabled: [2, "disabled", "disabled", se],
          ariaDisabled: [2, "aria-disabled", "ariaDisabled", se],
          disabledInteractive: [
            2,
            "disabledInteractive",
            "disabledInteractive",
            se,
          ],
          tabIndex: [2, "tabIndex", "tabIndex", cS],
          _tabindex: [2, "tabindex", "_tabindex", cS],
        },
      });
    }
    return n;
  })(),
  M_ = (() => {
    class n extends x_ {
      constructor() {
        super(),
          this._rippleLoader.configureRipple(this._elementRef.nativeElement, {
            centered: !0,
          });
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [
          ["button", "mat-icon-button", ""],
          ["a", "mat-icon-button", ""],
          ["button", "matIconButton", ""],
          ["a", "matIconButton", ""],
        ],
        hostAttrs: [1, "mdc-icon-button", "mat-mdc-icon-button"],
        exportAs: ["matButton", "matAnchor"],
        features: [at],
        attrs: R1,
        ngContentSelectors: A1,
        decls: 4,
        vars: 0,
        consts: [
          [1, "mat-mdc-button-persistent-ripple", "mdc-icon-button__ripple"],
          [1, "mat-focus-indicator"],
          [1, "mat-mdc-button-touch-target"],
        ],
        template: function (i, r) {
          i & 1 &&
            (qe(), sn(0, "span", 0), oe(1), sn(2, "span", 1)(3, "span", 2));
        },
        styles: [
          `.mat-mdc-icon-button{-webkit-user-select:none;user-select:none;display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;text-decoration:none;cursor:pointer;z-index:0;overflow:visible;border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));flex-shrink:0;text-align:center;width:var(--mat-icon-button-state-layer-size, 40px);height:var(--mat-icon-button-state-layer-size, 40px);padding:calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);font-size:var(--mat-icon-button-icon-size, 24px);color:var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-icon-button .mdc-button__label,.mat-mdc-icon-button .mat-icon{z-index:1;position:relative}.mat-mdc-icon-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-icon-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-icon-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-icon-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-icon-button-touch-target-display, block);left:50%;width:48px;transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button[disabled],.mat-mdc-icon-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-icon-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-icon-button img,.mat-mdc-icon-button svg{width:var(--mat-icon-button-icon-size, 24px);height:var(--mat-icon-button-icon-size, 24px);vertical-align:baseline}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%))}.mat-mdc-icon-button[hidden]{display:none}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}
`,
          `@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })();
var Cs = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [ke, ke] });
  }
  return n;
})();
var O1 = ["matButton", ""],
  k1 = [
    [
      ["", 8, "material-icons", 3, "iconPositionEnd", ""],
      ["mat-icon", 3, "iconPositionEnd", ""],
      ["", "matButtonIcon", "", 3, "iconPositionEnd", ""],
    ],
    "*",
    [
      ["", "iconPositionEnd", "", 8, "material-icons"],
      ["mat-icon", "iconPositionEnd", ""],
      ["", "matButtonIcon", "", "iconPositionEnd", ""],
    ],
  ],
  P1 = [
    ".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])",
    "*",
    ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]",
  ];
var dS = new Map([
    ["text", ["mat-mdc-button"]],
    ["filled", ["mdc-button--unelevated", "mat-mdc-unelevated-button"]],
    ["elevated", ["mdc-button--raised", "mat-mdc-raised-button"]],
    ["outlined", ["mdc-button--outlined", "mat-mdc-outlined-button"]],
    ["tonal", ["mat-tonal-button"]],
  ]),
  bf = (() => {
    class n extends x_ {
      get appearance() {
        return this._appearance;
      }
      set appearance(e) {
        this.setAppearance(e || this._config?.defaultAppearance || "text");
      }
      _appearance = null;
      constructor() {
        super();
        let e = F1(this._elementRef.nativeElement);
        e && this.setAppearance(e);
      }
      setAppearance(e) {
        if (e === this._appearance) return;
        let i = this._elementRef.nativeElement.classList,
          r = this._appearance ? dS.get(this._appearance) : null,
          o = dS.get(e);
        r && i.remove(...r), i.add(...o), (this._appearance = e);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [
          ["button", "matButton", ""],
          ["a", "matButton", ""],
          ["button", "mat-button", ""],
          ["button", "mat-raised-button", ""],
          ["button", "mat-flat-button", ""],
          ["button", "mat-stroked-button", ""],
          ["a", "mat-button", ""],
          ["a", "mat-raised-button", ""],
          ["a", "mat-flat-button", ""],
          ["a", "mat-stroked-button", ""],
        ],
        hostAttrs: [1, "mdc-button"],
        inputs: { appearance: [0, "matButton", "appearance"] },
        exportAs: ["matButton", "matAnchor"],
        features: [at],
        attrs: O1,
        ngContentSelectors: P1,
        decls: 7,
        vars: 4,
        consts: [
          [1, "mat-mdc-button-persistent-ripple"],
          [1, "mdc-button__label"],
          [1, "mat-focus-indicator"],
          [1, "mat-mdc-button-touch-target"],
        ],
        template: function (i, r) {
          i & 1 &&
            (qe(k1),
            sn(0, "span", 0),
            oe(1),
            Tt(2, "span", 1),
            oe(3, 1),
            Bt(),
            oe(4, 2),
            sn(5, "span", 2)(6, "span", 3)),
            i & 2 &&
              re("mdc-button__ripple", !r._isFab)("mdc-fab__ripple", r._isFab);
        },
        styles: [
          `.mat-mdc-button-base{text-decoration:none}.mat-mdc-button-base .mat-icon{min-height:fit-content;flex-shrink:0}.mdc-button{-webkit-user-select:none;user-select:none;position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:none;line-height:inherit;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:rgba(0,0,0,0);padding:0 8px}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:none}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button[hidden]{display:none}.mdc-button .mdc-button__label{position:relative}.mat-mdc-button{padding:0 var(--mat-button-text-horizontal-padding, 12px);height:var(--mat-button-text-container-height, 40px);font-family:var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-text-label-text-transform);font-weight:var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight))}.mat-mdc-button,.mat-mdc-button .mdc-button__ripple{border-radius:var(--mat-button-text-container-shape, var(--mat-sys-corner-full))}.mat-mdc-button:not(:disabled){color:var(--mat-button-text-label-text-color, var(--mat-sys-primary))}.mat-mdc-button[disabled],.mat-mdc-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-button:has(.material-icons,mat-icon,[matButtonIcon]){padding:0 var(--mat-button-text-with-icon-horizontal-padding, 16px)}.mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}[dir=rtl] .mat-mdc-button>.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}.mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-offset, -4px);margin-left:var(--mat-button-text-icon-spacing, 8px)}[dir=rtl] .mat-mdc-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-text-icon-spacing, 8px);margin-left:var(--mat-button-text-icon-offset, -4px)}.mat-mdc-button .mat-ripple-element{background-color:var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-state-layer-color, var(--mat-sys-primary))}.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-button-text-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-filled-container-height, 40px);font-family:var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-filled-label-text-transform);font-weight:var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-filled-horizontal-padding, 24px)}.mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}[dir=rtl] .mat-mdc-unelevated-button>.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}.mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-offset, -8px);margin-left:var(--mat-button-filled-icon-spacing, 8px)}[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-filled-icon-spacing, 8px);margin-left:var(--mat-button-filled-icon-offset, -8px)}.mat-mdc-unelevated-button .mat-ripple-element{background-color:var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary))}.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-unelevated-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-unelevated-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-unelevated-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-unelevated-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-button-filled-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-unelevated-button:not(:disabled){color:var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));background-color:var(--mat-button-filled-container-color, var(--mat-sys-primary))}.mat-mdc-unelevated-button,.mat-mdc-unelevated-button .mdc-button__ripple{border-radius:var(--mat-button-filled-container-shape, var(--mat-sys-corner-full))}.mat-mdc-unelevated-button[disabled],.mat-mdc-unelevated-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-raised-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);box-shadow:var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));height:var(--mat-button-protected-container-height, 40px);font-family:var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-protected-label-text-transform);font-weight:var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-protected-horizontal-padding, 24px)}.mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}[dir=rtl] .mat-mdc-raised-button>.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}.mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-offset, -8px);margin-left:var(--mat-button-protected-icon-spacing, 8px)}[dir=rtl] .mat-mdc-raised-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-protected-icon-spacing, 8px);margin-left:var(--mat-button-protected-icon-offset, -8px)}.mat-mdc-raised-button .mat-ripple-element{background-color:var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-state-layer-color, var(--mat-sys-primary))}.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-raised-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-raised-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-raised-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-raised-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-button-protected-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-raised-button:not(:disabled){color:var(--mat-button-protected-label-text-color, var(--mat-sys-primary));background-color:var(--mat-button-protected-container-color, var(--mat-sys-surface))}.mat-mdc-raised-button,.mat-mdc-raised-button .mdc-button__ripple{border-radius:var(--mat-button-protected-container-shape, var(--mat-sys-corner-full))}.mat-mdc-raised-button:hover{box-shadow:var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2))}.mat-mdc-raised-button:focus{box-shadow:var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button:active,.mat-mdc-raised-button:focus:active{box-shadow:var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1))}.mat-mdc-raised-button[disabled],.mat-mdc-raised-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-raised-button[disabled].mat-mdc-button-disabled,.mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled{box-shadow:var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0))}.mat-mdc-raised-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-mdc-outlined-button{border-style:solid;transition:border 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-outlined-container-height, 40px);font-family:var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-outlined-label-text-transform);font-weight:var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));border-radius:var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));border-width:var(--mat-button-outlined-outline-width, 1px);padding:0 var(--mat-button-outlined-horizontal-padding, 24px)}.mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}[dir=rtl] .mat-mdc-outlined-button>.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}.mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-offset, -8px);margin-left:var(--mat-button-outlined-icon-spacing, 8px)}[dir=rtl] .mat-mdc-outlined-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-outlined-icon-spacing, 8px);margin-left:var(--mat-button-outlined-icon-offset, -8px)}.mat-mdc-outlined-button .mat-ripple-element{background-color:var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary))}.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-outlined-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-outlined-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-outlined-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-mdc-outlined-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-button-outlined-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-outlined-button:not(:disabled){color:var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));border-color:var(--mat-button-outlined-outline-color, var(--mat-sys-outline))}.mat-mdc-outlined-button[disabled],.mat-mdc-outlined-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));border-color:var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-button-tonal-container-height, 40px);font-family:var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));font-size:var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));text-transform:var(--mat-button-tonal-label-text-transform);font-weight:var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));padding:0 var(--mat-button-tonal-horizontal-padding, 24px)}.mat-tonal-button:not(:disabled){color:var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));background-color:var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container))}.mat-tonal-button,.mat-tonal-button .mdc-button__ripple{border-radius:var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full))}.mat-tonal-button[disabled],.mat-tonal-button.mat-mdc-button-disabled{cursor:default;pointer-events:none;color:var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));background-color:var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-tonal-button.mat-mdc-button-disabled-interactive{pointer-events:auto}.mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}[dir=rtl] .mat-tonal-button>.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}.mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-offset, -8px);margin-left:var(--mat-button-tonal-icon-spacing, 8px)}[dir=rtl] .mat-tonal-button .mdc-button__label+.mat-icon{margin-right:var(--mat-button-tonal-icon-spacing, 8px);margin-left:var(--mat-button-tonal-icon-offset, -8px)}.mat-tonal-button .mat-ripple-element{background-color:var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent))}.mat-tonal-button .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before{background-color:var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-tonal-button:hover>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-tonal-button.cdk-program-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.cdk-keyboard-focused>.mat-mdc-button-persistent-ripple::before,.mat-tonal-button.mat-mdc-button-disabled-interactive:focus>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-tonal-button:active>.mat-mdc-button-persistent-ripple::before{opacity:var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity))}.mat-tonal-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;display:var(--mat-button-tonal-touch-target-display, block);left:0;right:0;transform:translateY(-50%)}.mat-mdc-button,.mat-mdc-unelevated-button,.mat-mdc-raised-button,.mat-mdc-outlined-button,.mat-tonal-button{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple,.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-button .mat-mdc-button-ripple,.mat-mdc-unelevated-button .mat-mdc-button-ripple,.mat-mdc-raised-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-tonal-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,.mat-tonal-button .mat-mdc-button-persistent-ripple::before{content:"";opacity:0}.mat-mdc-button .mdc-button__label,.mat-mdc-button .mat-icon,.mat-mdc-unelevated-button .mdc-button__label,.mat-mdc-unelevated-button .mat-icon,.mat-mdc-raised-button .mdc-button__label,.mat-mdc-raised-button .mat-icon,.mat-mdc-outlined-button .mdc-button__label,.mat-mdc-outlined-button .mat-icon,.mat-tonal-button .mdc-button__label,.mat-tonal-button .mat-icon{z-index:1;position:relative}.mat-mdc-button .mat-focus-indicator,.mat-mdc-unelevated-button .mat-focus-indicator,.mat-mdc-raised-button .mat-focus-indicator,.mat-mdc-outlined-button .mat-focus-indicator,.mat-tonal-button .mat-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:inherit}.mat-mdc-button:focus>.mat-focus-indicator::before,.mat-mdc-unelevated-button:focus>.mat-focus-indicator::before,.mat-mdc-raised-button:focus>.mat-focus-indicator::before,.mat-mdc-outlined-button:focus>.mat-focus-indicator::before,.mat-tonal-button:focus>.mat-focus-indicator::before{content:"";border-radius:inherit}.mat-mdc-button._mat-animation-noopable,.mat-mdc-unelevated-button._mat-animation-noopable,.mat-mdc-raised-button._mat-animation-noopable,.mat-mdc-outlined-button._mat-animation-noopable,.mat-tonal-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-button>.mat-icon,.mat-mdc-unelevated-button>.mat-icon,.mat-mdc-raised-button>.mat-icon,.mat-mdc-outlined-button>.mat-icon,.mat-tonal-button>.mat-icon{display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}.mat-mdc-outlined-button .mat-mdc-button-ripple,.mat-mdc-outlined-button .mdc-button__ripple{top:-1px;left:-1px;bottom:-1px;right:-1px}.mat-mdc-unelevated-button .mat-focus-indicator::before,.mat-tonal-button .mat-focus-indicator::before,.mat-mdc-raised-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-outlined-button .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px)*-1)}
`,
          `@media(forced-colors: active){.mat-mdc-button:not(.mdc-button--outlined),.mat-mdc-unelevated-button:not(.mdc-button--outlined),.mat-mdc-raised-button:not(.mdc-button--outlined),.mat-mdc-outlined-button:not(.mdc-button--outlined),.mat-mdc-button-base.mat-tonal-button,.mat-mdc-icon-button.mat-mdc-icon-button,.mat-mdc-outlined-button .mdc-button__ripple{outline:solid 1px}}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })();
function F1(n) {
  return n.hasAttribute("mat-raised-button")
    ? "elevated"
    : n.hasAttribute("mat-stroked-button")
    ? "outlined"
    : n.hasAttribute("mat-flat-button")
    ? "filled"
    : n.hasAttribute("mat-button")
    ? "text"
    : null;
}
var Is = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [ke, Cs, ke] });
  }
  return n;
})();
var Dl = class {
    _attachedHost;
    attach(t) {
      return (this._attachedHost = t), t.attach(this);
    }
    detach() {
      let t = this._attachedHost;
      t != null && ((this._attachedHost = null), t.detach());
    }
    get isAttached() {
      return this._attachedHost != null;
    }
    setAttachedHost(t) {
      this._attachedHost = t;
    }
  },
  R_ = class extends Dl {
    component;
    viewContainerRef;
    injector;
    projectableNodes;
    constructor(t, e, i, r) {
      super(),
        (this.component = t),
        (this.viewContainerRef = e),
        (this.injector = i),
        (this.projectableNodes = r);
    }
  },
  Ss = class extends Dl {
    templateRef;
    viewContainerRef;
    context;
    injector;
    constructor(t, e, i, r) {
      super(),
        (this.templateRef = t),
        (this.viewContainerRef = e),
        (this.context = i),
        (this.injector = r);
    }
    get origin() {
      return this.templateRef.elementRef;
    }
    attach(t, e = this.context) {
      return (this.context = e), super.attach(t);
    }
    detach() {
      return (this.context = void 0), super.detach();
    }
  },
  A_ = class extends Dl {
    element;
    constructor(t) {
      super(), (this.element = t instanceof K ? t.nativeElement : t);
    }
  },
  N_ = class {
    _attachedPortal;
    _disposeFn;
    _isDisposed = !1;
    hasAttached() {
      return !!this._attachedPortal;
    }
    attach(t) {
      if (t instanceof R_)
        return (this._attachedPortal = t), this.attachComponentPortal(t);
      if (t instanceof Ss)
        return (this._attachedPortal = t), this.attachTemplatePortal(t);
      if (this.attachDomPortal && t instanceof A_)
        return (this._attachedPortal = t), this.attachDomPortal(t);
    }
    attachDomPortal = null;
    detach() {
      this._attachedPortal &&
        (this._attachedPortal.setAttachedHost(null),
        (this._attachedPortal = null)),
        this._invokeDisposeFn();
    }
    dispose() {
      this.hasAttached() && this.detach(),
        this._invokeDisposeFn(),
        (this._isDisposed = !0);
    }
    setDisposeFn(t) {
      this._disposeFn = t;
    }
    _invokeDisposeFn() {
      this._disposeFn && (this._disposeFn(), (this._disposeFn = null));
    }
  },
  Cl = class extends N_ {
    outletElement;
    _appRef;
    _defaultInjector;
    constructor(t, e, i) {
      super(),
        (this.outletElement = t),
        (this._appRef = e),
        (this._defaultInjector = i);
    }
    attachComponentPortal(t) {
      let e;
      if (t.viewContainerRef) {
        let i = t.injector || t.viewContainerRef.injector,
          r = i.get(ui, null, { optional: !0 }) || void 0;
        (e = t.viewContainerRef.createComponent(t.component, {
          index: t.viewContainerRef.length,
          injector: i,
          ngModuleRef: r,
          projectableNodes: t.projectableNodes || void 0,
        })),
          this.setDisposeFn(() => e.destroy());
      } else {
        let i = this._appRef,
          r = t.injector || this._defaultInjector || te.NULL,
          o = r.get(Re, i.injector);
        (e = Yd(t.component, {
          elementInjector: r,
          environmentInjector: o,
          projectableNodes: t.projectableNodes || void 0,
        })),
          i.attachView(e.hostView),
          this.setDisposeFn(() => {
            i.viewCount > 0 && i.detachView(e.hostView), e.destroy();
          });
      }
      return (
        this.outletElement.appendChild(this._getComponentRootNode(e)),
        (this._attachedPortal = t),
        e
      );
    }
    attachTemplatePortal(t) {
      let e = t.viewContainerRef,
        i = e.createEmbeddedView(t.templateRef, t.context, {
          injector: t.injector,
        });
      return (
        i.rootNodes.forEach((r) => this.outletElement.appendChild(r)),
        i.detectChanges(),
        this.setDisposeFn(() => {
          let r = e.indexOf(i);
          r !== -1 && e.remove(r);
        }),
        (this._attachedPortal = t),
        i
      );
    }
    attachDomPortal = (t) => {
      let e = t.element;
      e.parentNode;
      let i = this.outletElement.ownerDocument.createComment("dom-portal");
      e.parentNode.insertBefore(i, e),
        this.outletElement.appendChild(e),
        (this._attachedPortal = t),
        super.setDisposeFn(() => {
          i.parentNode && i.parentNode.replaceChild(e, i);
        });
    };
    dispose() {
      super.dispose(), this.outletElement.remove();
    }
    _getComponentRootNode(t) {
      return t.hostView.rootNodes[0];
    }
  };
var uS = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({});
  }
  return n;
})();
var fS = lI();
function yS(n) {
  return new wf(n.get(ir), n.get(O));
}
var wf = class {
  _viewportRuler;
  _previousHTMLStyles = { top: "", left: "" };
  _previousScrollPosition;
  _isEnabled = !1;
  _document;
  constructor(t, e) {
    (this._viewportRuler = t), (this._document = e);
  }
  attach() {}
  enable() {
    if (this._canBeEnabled()) {
      let t = this._document.documentElement;
      (this._previousScrollPosition =
        this._viewportRuler.getViewportScrollPosition()),
        (this._previousHTMLStyles.left = t.style.left || ""),
        (this._previousHTMLStyles.top = t.style.top || ""),
        (t.style.left = $e(-this._previousScrollPosition.left)),
        (t.style.top = $e(-this._previousScrollPosition.top)),
        t.classList.add("cdk-global-scrollblock"),
        (this._isEnabled = !0);
    }
  }
  disable() {
    if (this._isEnabled) {
      let t = this._document.documentElement,
        e = this._document.body,
        i = t.style,
        r = e.style,
        o = i.scrollBehavior || "",
        s = r.scrollBehavior || "";
      (this._isEnabled = !1),
        (i.left = this._previousHTMLStyles.left),
        (i.top = this._previousHTMLStyles.top),
        t.classList.remove("cdk-global-scrollblock"),
        fS && (i.scrollBehavior = r.scrollBehavior = "auto"),
        window.scroll(
          this._previousScrollPosition.left,
          this._previousScrollPosition.top
        ),
        fS && ((i.scrollBehavior = o), (r.scrollBehavior = s));
    }
  }
  _canBeEnabled() {
    if (
      this._document.documentElement.classList.contains(
        "cdk-global-scrollblock"
      ) ||
      this._isEnabled
    )
      return !1;
    let e = this._document.documentElement,
      i = this._viewportRuler.getViewportSize();
    return e.scrollHeight > i.height || e.scrollWidth > i.width;
  }
};
function bS(n, t) {
  return new Ef(n.get(ms), n.get(M), n.get(ir), t);
}
var Ef = class {
  _scrollDispatcher;
  _ngZone;
  _viewportRuler;
  _config;
  _scrollSubscription = null;
  _overlayRef;
  _initialScrollPosition;
  constructor(t, e, i, r) {
    (this._scrollDispatcher = t),
      (this._ngZone = e),
      (this._viewportRuler = i),
      (this._config = r);
  }
  attach(t) {
    this._overlayRef, (this._overlayRef = t);
  }
  enable() {
    if (this._scrollSubscription) return;
    let t = this._scrollDispatcher
      .scrolled(0)
      .pipe(
        ve(
          (e) =>
            !e ||
            !this._overlayRef.overlayElement.contains(
              e.getElementRef().nativeElement
            )
        )
      );
    this._config && this._config.threshold && this._config.threshold > 1
      ? ((this._initialScrollPosition =
          this._viewportRuler.getViewportScrollPosition().top),
        (this._scrollSubscription = t.subscribe(() => {
          let e = this._viewportRuler.getViewportScrollPosition().top;
          Math.abs(e - this._initialScrollPosition) > this._config.threshold
            ? this._detach()
            : this._overlayRef.updatePosition();
        })))
      : (this._scrollSubscription = t.subscribe(this._detach));
  }
  disable() {
    this._scrollSubscription &&
      (this._scrollSubscription.unsubscribe(),
      (this._scrollSubscription = null));
  }
  detach() {
    this.disable(), (this._overlayRef = null);
  }
  _detach = () => {
    this.disable(),
      this._overlayRef.hasAttached() &&
        this._ngZone.run(() => this._overlayRef.detach());
  };
};
var Il = class {
  enable() {}
  disable() {}
  attach() {}
};
function O_(n, t) {
  return t.some((e) => {
    let i = n.bottom < e.top,
      r = n.top > e.bottom,
      o = n.right < e.left,
      s = n.left > e.right;
    return i || r || o || s;
  });
}
function hS(n, t) {
  return t.some((e) => {
    let i = n.top < e.top,
      r = n.bottom > e.bottom,
      o = n.left < e.left,
      s = n.right > e.right;
    return i || r || o || s;
  });
}
function lo(n, t) {
  return new Df(n.get(ms), n.get(ir), n.get(M), t);
}
var Df = class {
    _scrollDispatcher;
    _viewportRuler;
    _ngZone;
    _config;
    _scrollSubscription = null;
    _overlayRef;
    constructor(t, e, i, r) {
      (this._scrollDispatcher = t),
        (this._viewportRuler = e),
        (this._ngZone = i),
        (this._config = r);
    }
    attach(t) {
      this._overlayRef, (this._overlayRef = t);
    }
    enable() {
      if (!this._scrollSubscription) {
        let t = this._config ? this._config.scrollThrottle : 0;
        this._scrollSubscription = this._scrollDispatcher
          .scrolled(t)
          .subscribe(() => {
            if (
              (this._overlayRef.updatePosition(),
              this._config && this._config.autoClose)
            ) {
              let e = this._overlayRef.overlayElement.getBoundingClientRect(),
                { width: i, height: r } = this._viewportRuler.getViewportSize();
              O_(e, [
                { width: i, height: r, bottom: r, right: i, top: 0, left: 0 },
              ]) &&
                (this.disable(),
                this._ngZone.run(() => this._overlayRef.detach()));
            }
          });
      }
    }
    disable() {
      this._scrollSubscription &&
        (this._scrollSubscription.unsubscribe(),
        (this._scrollSubscription = null));
    }
    detach() {
      this.disable(), (this._overlayRef = null);
    }
  },
  wS = (() => {
    class n {
      _injector = f(te);
      constructor() {}
      noop = () => new Il();
      close = (e) => bS(this._injector, e);
      block = () => yS(this._injector);
      reposition = (e) => lo(this._injector, e);
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  xs = class {
    positionStrategy;
    scrollStrategy = new Il();
    panelClass = "";
    hasBackdrop = !1;
    backdropClass = "cdk-overlay-dark-backdrop";
    disableAnimations;
    width;
    height;
    minWidth;
    minHeight;
    maxWidth;
    maxHeight;
    direction;
    disposeOnNavigation = !1;
    constructor(t) {
      if (t) {
        let e = Object.keys(t);
        for (let i of e) t[i] !== void 0 && (this[i] = t[i]);
      }
    }
  };
var Cf = class {
  connectionPair;
  scrollableViewProperties;
  constructor(t, e) {
    (this.connectionPair = t), (this.scrollableViewProperties = e);
  }
};
var ES = (() => {
    class n {
      _attachedOverlays = [];
      _document = f(O);
      _isAttached;
      constructor() {}
      ngOnDestroy() {
        this.detach();
      }
      add(e) {
        this.remove(e), this._attachedOverlays.push(e);
      }
      remove(e) {
        let i = this._attachedOverlays.indexOf(e);
        i > -1 && this._attachedOverlays.splice(i, 1),
          this._attachedOverlays.length === 0 && this.detach();
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  DS = (() => {
    class n extends ES {
      _ngZone = f(M);
      _renderer = f(Se).createRenderer(null, null);
      _cleanupKeydown;
      add(e) {
        super.add(e),
          this._isAttached ||
            (this._ngZone.runOutsideAngular(() => {
              this._cleanupKeydown = this._renderer.listen(
                "body",
                "keydown",
                this._keydownListener
              );
            }),
            (this._isAttached = !0));
      }
      detach() {
        this._isAttached && (this._cleanupKeydown?.(), (this._isAttached = !1));
      }
      _keydownListener = (e) => {
        let i = this._attachedOverlays;
        for (let r = i.length - 1; r > -1; r--)
          if (i[r]._keydownEvents.observers.length > 0) {
            this._ngZone.run(() => i[r]._keydownEvents.next(e));
            break;
          }
      };
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Cn(n)))(r || n);
        };
      })();
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  CS = (() => {
    class n extends ES {
      _platform = f(xe);
      _ngZone = f(M);
      _renderer = f(Se).createRenderer(null, null);
      _cursorOriginalValue;
      _cursorStyleIsSet = !1;
      _pointerDownEventTarget;
      _cleanups;
      add(e) {
        if ((super.add(e), !this._isAttached)) {
          let i = this._document.body,
            r = { capture: !0 },
            o = this._renderer;
          (this._cleanups = this._ngZone.runOutsideAngular(() => [
            o.listen(i, "pointerdown", this._pointerDownListener, r),
            o.listen(i, "click", this._clickListener, r),
            o.listen(i, "auxclick", this._clickListener, r),
            o.listen(i, "contextmenu", this._clickListener, r),
          ])),
            this._platform.IOS &&
              !this._cursorStyleIsSet &&
              ((this._cursorOriginalValue = i.style.cursor),
              (i.style.cursor = "pointer"),
              (this._cursorStyleIsSet = !0)),
            (this._isAttached = !0);
        }
      }
      detach() {
        this._isAttached &&
          (this._cleanups?.forEach((e) => e()),
          (this._cleanups = void 0),
          this._platform.IOS &&
            this._cursorStyleIsSet &&
            ((this._document.body.style.cursor = this._cursorOriginalValue),
            (this._cursorStyleIsSet = !1)),
          (this._isAttached = !1));
      }
      _pointerDownListener = (e) => {
        this._pointerDownEventTarget = it(e);
      };
      _clickListener = (e) => {
        let i = it(e),
          r =
            e.type === "click" && this._pointerDownEventTarget
              ? this._pointerDownEventTarget
              : i;
        this._pointerDownEventTarget = null;
        let o = this._attachedOverlays.slice();
        for (let s = o.length - 1; s > -1; s--) {
          let a = o[s];
          if (a._outsidePointerEvents.observers.length < 1 || !a.hasAttached())
            continue;
          if (pS(a.overlayElement, i) || pS(a.overlayElement, r)) break;
          let l = a._outsidePointerEvents;
          this._ngZone ? this._ngZone.run(() => l.next(e)) : l.next(e);
        }
      };
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Cn(n)))(r || n);
        };
      })();
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function pS(n, t) {
  let e = typeof ShadowRoot < "u" && ShadowRoot,
    i = t;
  for (; i; ) {
    if (i === n) return !0;
    i = e && i instanceof ShadowRoot ? i.host : i.parentNode;
  }
  return !1;
}
var IS = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["ng-component"]],
        hostAttrs: ["cdk-overlay-style-loader", ""],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed}@layer cdk-overlay{.cdk-overlay-container{z-index:1000}}.cdk-overlay-container:empty{display:none}.cdk-global-overlay-wrapper{display:flex;position:absolute}@layer cdk-overlay{.cdk-global-overlay-wrapper{z-index:1000}}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;display:flex;max-width:100%;max-height:100%}@layer cdk-overlay{.cdk-overlay-pane{z-index:1000}}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);opacity:0;touch-action:manipulation}@layer cdk-overlay{.cdk-overlay-backdrop{z-index:1000;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}}@media(prefers-reduced-motion){.cdk-overlay-backdrop{transition-duration:1ms}}.cdk-overlay-backdrop-showing{opacity:1}@media(forced-colors: active){.cdk-overlay-backdrop-showing{opacity:.6}}@layer cdk-overlay{.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.32)}}.cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing,.cdk-high-contrast-active .cdk-overlay-transparent-backdrop{opacity:0;visibility:visible}.cdk-overlay-backdrop-noop-animation{transition:none}.cdk-overlay-connected-position-bounding-box{position:absolute;display:flex;flex-direction:column;min-width:1px;min-height:1px}@layer cdk-overlay{.cdk-overlay-connected-position-bounding-box{z-index:1000}}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  SS = (() => {
    class n {
      _platform = f(xe);
      _containerElement;
      _document = f(O);
      _styleLoader = f(gt);
      constructor() {}
      ngOnDestroy() {
        this._containerElement?.remove();
      }
      getContainerElement() {
        return (
          this._loadStyles(),
          this._containerElement || this._createContainer(),
          this._containerElement
        );
      }
      _createContainer() {
        let e = "cdk-overlay-container";
        if (this._platform.isBrowser || w_()) {
          let r = this._document.querySelectorAll(
            `.${e}[platform="server"], .${e}[platform="test"]`
          );
          for (let o = 0; o < r.length; o++) r[o].remove();
        }
        let i = this._document.createElement("div");
        i.classList.add(e),
          w_()
            ? i.setAttribute("platform", "test")
            : this._platform.isBrowser || i.setAttribute("platform", "server"),
          this._document.body.appendChild(i),
          (this._containerElement = i);
      }
      _loadStyles() {
        this._styleLoader.load(IS);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })(),
  k_ = class {
    _renderer;
    _ngZone;
    element;
    _cleanupClick;
    _cleanupTransitionEnd;
    _fallbackTimeout;
    constructor(t, e, i, r) {
      (this._renderer = e),
        (this._ngZone = i),
        (this.element = t.createElement("div")),
        this.element.classList.add("cdk-overlay-backdrop"),
        (this._cleanupClick = e.listen(this.element, "click", r));
    }
    detach() {
      this._ngZone.runOutsideAngular(() => {
        let t = this.element;
        clearTimeout(this._fallbackTimeout),
          this._cleanupTransitionEnd?.(),
          (this._cleanupTransitionEnd = this._renderer.listen(
            t,
            "transitionend",
            this.dispose
          )),
          (this._fallbackTimeout = setTimeout(this.dispose, 500)),
          (t.style.pointerEvents = "none"),
          t.classList.remove("cdk-overlay-backdrop-showing");
      });
    }
    dispose = () => {
      clearTimeout(this._fallbackTimeout),
        this._cleanupClick?.(),
        this._cleanupTransitionEnd?.(),
        (this._cleanupClick =
          this._cleanupTransitionEnd =
          this._fallbackTimeout =
            void 0),
        this.element.remove();
    };
  },
  If = class {
    _portalOutlet;
    _host;
    _pane;
    _config;
    _ngZone;
    _keyboardDispatcher;
    _document;
    _location;
    _outsideClickDispatcher;
    _animationsDisabled;
    _injector;
    _renderer;
    _backdropClick = new E();
    _attachments = new E();
    _detachments = new E();
    _positionStrategy;
    _scrollStrategy;
    _locationChanges = W.EMPTY;
    _backdropRef = null;
    _detachContentMutationObserver;
    _detachContentAfterRenderRef;
    _previousHostParent;
    _keydownEvents = new E();
    _outsidePointerEvents = new E();
    _afterNextRenderRef;
    constructor(t, e, i, r, o, s, a, l, c, d = !1, u, p) {
      (this._portalOutlet = t),
        (this._host = e),
        (this._pane = i),
        (this._config = r),
        (this._ngZone = o),
        (this._keyboardDispatcher = s),
        (this._document = a),
        (this._location = l),
        (this._outsideClickDispatcher = c),
        (this._animationsDisabled = d),
        (this._injector = u),
        (this._renderer = p),
        r.scrollStrategy &&
          ((this._scrollStrategy = r.scrollStrategy),
          this._scrollStrategy.attach(this)),
        (this._positionStrategy = r.positionStrategy);
    }
    get overlayElement() {
      return this._pane;
    }
    get backdropElement() {
      return this._backdropRef?.element || null;
    }
    get hostElement() {
      return this._host;
    }
    attach(t) {
      !this._host.parentElement &&
        this._previousHostParent &&
        this._previousHostParent.appendChild(this._host);
      let e = this._portalOutlet.attach(t);
      return (
        this._positionStrategy && this._positionStrategy.attach(this),
        this._updateStackingOrder(),
        this._updateElementSize(),
        this._updateElementDirection(),
        this._scrollStrategy && this._scrollStrategy.enable(),
        this._afterNextRenderRef?.destroy(),
        (this._afterNextRenderRef = Kt(
          () => {
            this.hasAttached() && this.updatePosition();
          },
          { injector: this._injector }
        )),
        this._togglePointerEvents(!0),
        this._config.hasBackdrop && this._attachBackdrop(),
        this._config.panelClass &&
          this._toggleClasses(this._pane, this._config.panelClass, !0),
        this._attachments.next(),
        this._completeDetachContent(),
        this._keyboardDispatcher.add(this),
        this._config.disposeOnNavigation &&
          (this._locationChanges = this._location.subscribe(() =>
            this.dispose()
          )),
        this._outsideClickDispatcher.add(this),
        typeof e?.onDestroy == "function" &&
          e.onDestroy(() => {
            this.hasAttached() &&
              this._ngZone.runOutsideAngular(() =>
                Promise.resolve().then(() => this.detach())
              );
          }),
        e
      );
    }
    detach() {
      if (!this.hasAttached()) return;
      this.detachBackdrop(),
        this._togglePointerEvents(!1),
        this._positionStrategy &&
          this._positionStrategy.detach &&
          this._positionStrategy.detach(),
        this._scrollStrategy && this._scrollStrategy.disable();
      let t = this._portalOutlet.detach();
      return (
        this._detachments.next(),
        this._completeDetachContent(),
        this._keyboardDispatcher.remove(this),
        this._detachContentWhenEmpty(),
        this._locationChanges.unsubscribe(),
        this._outsideClickDispatcher.remove(this),
        t
      );
    }
    dispose() {
      let t = this.hasAttached();
      this._positionStrategy && this._positionStrategy.dispose(),
        this._disposeScrollStrategy(),
        this._backdropRef?.dispose(),
        this._locationChanges.unsubscribe(),
        this._keyboardDispatcher.remove(this),
        this._portalOutlet.dispose(),
        this._attachments.complete(),
        this._backdropClick.complete(),
        this._keydownEvents.complete(),
        this._outsidePointerEvents.complete(),
        this._outsideClickDispatcher.remove(this),
        this._host?.remove(),
        this._afterNextRenderRef?.destroy(),
        (this._previousHostParent =
          this._pane =
          this._host =
          this._backdropRef =
            null),
        t && this._detachments.next(),
        this._detachments.complete(),
        this._completeDetachContent();
    }
    hasAttached() {
      return this._portalOutlet.hasAttached();
    }
    backdropClick() {
      return this._backdropClick;
    }
    attachments() {
      return this._attachments;
    }
    detachments() {
      return this._detachments;
    }
    keydownEvents() {
      return this._keydownEvents;
    }
    outsidePointerEvents() {
      return this._outsidePointerEvents;
    }
    getConfig() {
      return this._config;
    }
    updatePosition() {
      this._positionStrategy && this._positionStrategy.apply();
    }
    updatePositionStrategy(t) {
      t !== this._positionStrategy &&
        (this._positionStrategy && this._positionStrategy.dispose(),
        (this._positionStrategy = t),
        this.hasAttached() && (t.attach(this), this.updatePosition()));
    }
    updateSize(t) {
      (this._config = _(_({}, this._config), t)), this._updateElementSize();
    }
    setDirection(t) {
      (this._config = B(_({}, this._config), { direction: t })),
        this._updateElementDirection();
    }
    addPanelClass(t) {
      this._pane && this._toggleClasses(this._pane, t, !0);
    }
    removePanelClass(t) {
      this._pane && this._toggleClasses(this._pane, t, !1);
    }
    getDirection() {
      let t = this._config.direction;
      return t ? (typeof t == "string" ? t : t.value) : "ltr";
    }
    updateScrollStrategy(t) {
      t !== this._scrollStrategy &&
        (this._disposeScrollStrategy(),
        (this._scrollStrategy = t),
        this.hasAttached() && (t.attach(this), t.enable()));
    }
    _updateElementDirection() {
      this._host.setAttribute("dir", this.getDirection());
    }
    _updateElementSize() {
      if (!this._pane) return;
      let t = this._pane.style;
      (t.width = $e(this._config.width)),
        (t.height = $e(this._config.height)),
        (t.minWidth = $e(this._config.minWidth)),
        (t.minHeight = $e(this._config.minHeight)),
        (t.maxWidth = $e(this._config.maxWidth)),
        (t.maxHeight = $e(this._config.maxHeight));
    }
    _togglePointerEvents(t) {
      this._pane.style.pointerEvents = t ? "" : "none";
    }
    _attachBackdrop() {
      let t = "cdk-overlay-backdrop-showing";
      this._backdropRef?.dispose(),
        (this._backdropRef = new k_(
          this._document,
          this._renderer,
          this._ngZone,
          (e) => {
            this._backdropClick.next(e);
          }
        )),
        this._animationsDisabled &&
          this._backdropRef.element.classList.add(
            "cdk-overlay-backdrop-noop-animation"
          ),
        this._config.backdropClass &&
          this._toggleClasses(
            this._backdropRef.element,
            this._config.backdropClass,
            !0
          ),
        this._host.parentElement.insertBefore(
          this._backdropRef.element,
          this._host
        ),
        !this._animationsDisabled && typeof requestAnimationFrame < "u"
          ? this._ngZone.runOutsideAngular(() => {
              requestAnimationFrame(() =>
                this._backdropRef?.element.classList.add(t)
              );
            })
          : this._backdropRef.element.classList.add(t);
    }
    _updateStackingOrder() {
      this._host.nextSibling && this._host.parentNode.appendChild(this._host);
    }
    detachBackdrop() {
      this._animationsDisabled
        ? (this._backdropRef?.dispose(), (this._backdropRef = null))
        : this._backdropRef?.detach();
    }
    _toggleClasses(t, e, i) {
      let r = rr(e || []).filter((o) => !!o);
      r.length && (i ? t.classList.add(...r) : t.classList.remove(...r));
    }
    _detachContentWhenEmpty() {
      let t = !1;
      try {
        this._detachContentAfterRenderRef = Kt(
          () => {
            (t = !0), this._detachContent();
          },
          { injector: this._injector }
        );
      } catch (e) {
        if (t) throw e;
        this._detachContent();
      }
      globalThis.MutationObserver &&
        this._pane &&
        ((this._detachContentMutationObserver ||=
          new globalThis.MutationObserver(() => {
            this._detachContent();
          })),
        this._detachContentMutationObserver.observe(this._pane, {
          childList: !0,
        }));
    }
    _detachContent() {
      (!this._pane || !this._host || this._pane.children.length === 0) &&
        (this._pane &&
          this._config.panelClass &&
          this._toggleClasses(this._pane, this._config.panelClass, !1),
        this._host &&
          this._host.parentElement &&
          ((this._previousHostParent = this._host.parentElement),
          this._host.remove()),
        this._completeDetachContent());
    }
    _completeDetachContent() {
      this._detachContentAfterRenderRef?.destroy(),
        (this._detachContentAfterRenderRef = void 0),
        this._detachContentMutationObserver?.disconnect();
    }
    _disposeScrollStrategy() {
      let t = this._scrollStrategy;
      t?.disable(), t?.detach?.();
    }
  },
  mS = "cdk-overlay-connected-position-bounding-box",
  L1 = /([A-Za-z%]+)$/;
function Mf(n, t) {
  return new Sf(t, n.get(ir), n.get(O), n.get(xe), n.get(SS));
}
var Sf = class {
  _viewportRuler;
  _document;
  _platform;
  _overlayContainer;
  _overlayRef;
  _isInitialRender;
  _lastBoundingBoxSize = { width: 0, height: 0 };
  _isPushed = !1;
  _canPush = !0;
  _growAfterOpen = !1;
  _hasFlexibleDimensions = !0;
  _positionLocked = !1;
  _originRect;
  _overlayRect;
  _viewportRect;
  _containerRect;
  _viewportMargin = 0;
  _scrollables = [];
  _preferredPositions = [];
  _origin;
  _pane;
  _isDisposed;
  _boundingBox;
  _lastPosition;
  _lastScrollVisibility;
  _positionChanges = new E();
  _resizeSubscription = W.EMPTY;
  _offsetX = 0;
  _offsetY = 0;
  _transformOriginSelector;
  _appliedPanelClasses = [];
  _previousPushAmount;
  positionChanges = this._positionChanges;
  get positions() {
    return this._preferredPositions;
  }
  constructor(t, e, i, r, o) {
    (this._viewportRuler = e),
      (this._document = i),
      (this._platform = r),
      (this._overlayContainer = o),
      this.setOrigin(t);
  }
  attach(t) {
    this._overlayRef && this._overlayRef,
      this._validatePositions(),
      t.hostElement.classList.add(mS),
      (this._overlayRef = t),
      (this._boundingBox = t.hostElement),
      (this._pane = t.overlayElement),
      (this._isDisposed = !1),
      (this._isInitialRender = !0),
      (this._lastPosition = null),
      this._resizeSubscription.unsubscribe(),
      (this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
        (this._isInitialRender = !0), this.apply();
      }));
  }
  apply() {
    if (this._isDisposed || !this._platform.isBrowser) return;
    if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
      this.reapplyLastPosition();
      return;
    }
    this._clearPanelClasses(),
      this._resetOverlayElementStyles(),
      this._resetBoundingBoxStyles(),
      (this._viewportRect = this._getNarrowedViewportRect()),
      (this._originRect = this._getOriginRect()),
      (this._overlayRect = this._pane.getBoundingClientRect()),
      (this._containerRect = this._overlayContainer
        .getContainerElement()
        .getBoundingClientRect());
    let t = this._originRect,
      e = this._overlayRect,
      i = this._viewportRect,
      r = this._containerRect,
      o = [],
      s;
    for (let a of this._preferredPositions) {
      let l = this._getOriginPoint(t, r, a),
        c = this._getOverlayPoint(l, e, a),
        d = this._getOverlayFit(c, e, i, a);
      if (d.isCompletelyWithinViewport) {
        (this._isPushed = !1), this._applyPosition(a, l);
        return;
      }
      if (this._canFitWithFlexibleDimensions(d, c, i)) {
        o.push({
          position: a,
          origin: l,
          overlayRect: e,
          boundingBoxRect: this._calculateBoundingBoxRect(l, a),
        });
        continue;
      }
      (!s || s.overlayFit.visibleArea < d.visibleArea) &&
        (s = {
          overlayFit: d,
          overlayPoint: c,
          originPoint: l,
          position: a,
          overlayRect: e,
        });
    }
    if (o.length) {
      let a = null,
        l = -1;
      for (let c of o) {
        let d =
          c.boundingBoxRect.width *
          c.boundingBoxRect.height *
          (c.position.weight || 1);
        d > l && ((l = d), (a = c));
      }
      (this._isPushed = !1), this._applyPosition(a.position, a.origin);
      return;
    }
    if (this._canPush) {
      (this._isPushed = !0), this._applyPosition(s.position, s.originPoint);
      return;
    }
    this._applyPosition(s.position, s.originPoint);
  }
  detach() {
    this._clearPanelClasses(),
      (this._lastPosition = null),
      (this._previousPushAmount = null),
      this._resizeSubscription.unsubscribe();
  }
  dispose() {
    this._isDisposed ||
      (this._boundingBox &&
        ao(this._boundingBox.style, {
          top: "",
          left: "",
          right: "",
          bottom: "",
          height: "",
          width: "",
          alignItems: "",
          justifyContent: "",
        }),
      this._pane && this._resetOverlayElementStyles(),
      this._overlayRef && this._overlayRef.hostElement.classList.remove(mS),
      this.detach(),
      this._positionChanges.complete(),
      (this._overlayRef = this._boundingBox = null),
      (this._isDisposed = !0));
  }
  reapplyLastPosition() {
    if (this._isDisposed || !this._platform.isBrowser) return;
    let t = this._lastPosition;
    if (t) {
      (this._originRect = this._getOriginRect()),
        (this._overlayRect = this._pane.getBoundingClientRect()),
        (this._viewportRect = this._getNarrowedViewportRect()),
        (this._containerRect = this._overlayContainer
          .getContainerElement()
          .getBoundingClientRect());
      let e = this._getOriginPoint(this._originRect, this._containerRect, t);
      this._applyPosition(t, e);
    } else this.apply();
  }
  withScrollableContainers(t) {
    return (this._scrollables = t), this;
  }
  withPositions(t) {
    return (
      (this._preferredPositions = t),
      t.indexOf(this._lastPosition) === -1 && (this._lastPosition = null),
      this._validatePositions(),
      this
    );
  }
  withViewportMargin(t) {
    return (this._viewportMargin = t), this;
  }
  withFlexibleDimensions(t = !0) {
    return (this._hasFlexibleDimensions = t), this;
  }
  withGrowAfterOpen(t = !0) {
    return (this._growAfterOpen = t), this;
  }
  withPush(t = !0) {
    return (this._canPush = t), this;
  }
  withLockedPosition(t = !0) {
    return (this._positionLocked = t), this;
  }
  setOrigin(t) {
    return (this._origin = t), this;
  }
  withDefaultOffsetX(t) {
    return (this._offsetX = t), this;
  }
  withDefaultOffsetY(t) {
    return (this._offsetY = t), this;
  }
  withTransformOriginOn(t) {
    return (this._transformOriginSelector = t), this;
  }
  _getOriginPoint(t, e, i) {
    let r;
    if (i.originX == "center") r = t.left + t.width / 2;
    else {
      let s = this._isRtl() ? t.right : t.left,
        a = this._isRtl() ? t.left : t.right;
      r = i.originX == "start" ? s : a;
    }
    e.left < 0 && (r -= e.left);
    let o;
    return (
      i.originY == "center"
        ? (o = t.top + t.height / 2)
        : (o = i.originY == "top" ? t.top : t.bottom),
      e.top < 0 && (o -= e.top),
      { x: r, y: o }
    );
  }
  _getOverlayPoint(t, e, i) {
    let r;
    i.overlayX == "center"
      ? (r = -e.width / 2)
      : i.overlayX === "start"
      ? (r = this._isRtl() ? -e.width : 0)
      : (r = this._isRtl() ? 0 : -e.width);
    let o;
    return (
      i.overlayY == "center"
        ? (o = -e.height / 2)
        : (o = i.overlayY == "top" ? 0 : -e.height),
      { x: t.x + r, y: t.y + o }
    );
  }
  _getOverlayFit(t, e, i, r) {
    let o = vS(e),
      { x: s, y: a } = t,
      l = this._getOffset(r, "x"),
      c = this._getOffset(r, "y");
    l && (s += l), c && (a += c);
    let d = 0 - s,
      u = s + o.width - i.width,
      p = 0 - a,
      h = a + o.height - i.height,
      m = this._subtractOverflows(o.width, d, u),
      g = this._subtractOverflows(o.height, p, h),
      w = m * g;
    return {
      visibleArea: w,
      isCompletelyWithinViewport: o.width * o.height === w,
      fitsInViewportVertically: g === o.height,
      fitsInViewportHorizontally: m == o.width,
    };
  }
  _canFitWithFlexibleDimensions(t, e, i) {
    if (this._hasFlexibleDimensions) {
      let r = i.bottom - e.y,
        o = i.right - e.x,
        s = gS(this._overlayRef.getConfig().minHeight),
        a = gS(this._overlayRef.getConfig().minWidth),
        l = t.fitsInViewportVertically || (s != null && s <= r),
        c = t.fitsInViewportHorizontally || (a != null && a <= o);
      return l && c;
    }
    return !1;
  }
  _pushOverlayOnScreen(t, e, i) {
    if (this._previousPushAmount && this._positionLocked)
      return {
        x: t.x + this._previousPushAmount.x,
        y: t.y + this._previousPushAmount.y,
      };
    let r = vS(e),
      o = this._viewportRect,
      s = Math.max(t.x + r.width - o.width, 0),
      a = Math.max(t.y + r.height - o.height, 0),
      l = Math.max(o.top - i.top - t.y, 0),
      c = Math.max(o.left - i.left - t.x, 0),
      d = 0,
      u = 0;
    return (
      r.width <= o.width
        ? (d = c || -s)
        : (d = t.x < this._viewportMargin ? o.left - i.left - t.x : 0),
      r.height <= o.height
        ? (u = l || -a)
        : (u = t.y < this._viewportMargin ? o.top - i.top - t.y : 0),
      (this._previousPushAmount = { x: d, y: u }),
      { x: t.x + d, y: t.y + u }
    );
  }
  _applyPosition(t, e) {
    if (
      (this._setTransformOrigin(t),
      this._setOverlayElementStyles(e, t),
      this._setBoundingBoxStyles(e, t),
      t.panelClass && this._addPanelClasses(t.panelClass),
      this._positionChanges.observers.length)
    ) {
      let i = this._getScrollVisibility();
      if (
        t !== this._lastPosition ||
        !this._lastScrollVisibility ||
        !V1(this._lastScrollVisibility, i)
      ) {
        let r = new Cf(t, i);
        this._positionChanges.next(r);
      }
      this._lastScrollVisibility = i;
    }
    (this._lastPosition = t), (this._isInitialRender = !1);
  }
  _setTransformOrigin(t) {
    if (!this._transformOriginSelector) return;
    let e = this._boundingBox.querySelectorAll(this._transformOriginSelector),
      i,
      r = t.overlayY;
    t.overlayX === "center"
      ? (i = "center")
      : this._isRtl()
      ? (i = t.overlayX === "start" ? "right" : "left")
      : (i = t.overlayX === "start" ? "left" : "right");
    for (let o = 0; o < e.length; o++) e[o].style.transformOrigin = `${i} ${r}`;
  }
  _calculateBoundingBoxRect(t, e) {
    let i = this._viewportRect,
      r = this._isRtl(),
      o,
      s,
      a;
    if (e.overlayY === "top")
      (s = t.y), (o = i.height - s + this._viewportMargin);
    else if (e.overlayY === "bottom")
      (a = i.height - t.y + this._viewportMargin * 2),
        (o = i.height - a + this._viewportMargin);
    else {
      let h = Math.min(i.bottom - t.y + i.top, t.y),
        m = this._lastBoundingBoxSize.height;
      (o = h * 2),
        (s = t.y - h),
        o > m &&
          !this._isInitialRender &&
          !this._growAfterOpen &&
          (s = t.y - m / 2);
    }
    let l = (e.overlayX === "start" && !r) || (e.overlayX === "end" && r),
      c = (e.overlayX === "end" && !r) || (e.overlayX === "start" && r),
      d,
      u,
      p;
    if (c)
      (p = i.width - t.x + this._viewportMargin * 2),
        (d = t.x - this._viewportMargin);
    else if (l) (u = t.x), (d = i.right - t.x);
    else {
      let h = Math.min(i.right - t.x + i.left, t.x),
        m = this._lastBoundingBoxSize.width;
      (d = h * 2),
        (u = t.x - h),
        d > m &&
          !this._isInitialRender &&
          !this._growAfterOpen &&
          (u = t.x - m / 2);
    }
    return { top: s, left: u, bottom: a, right: p, width: d, height: o };
  }
  _setBoundingBoxStyles(t, e) {
    let i = this._calculateBoundingBoxRect(t, e);
    !this._isInitialRender &&
      !this._growAfterOpen &&
      ((i.height = Math.min(i.height, this._lastBoundingBoxSize.height)),
      (i.width = Math.min(i.width, this._lastBoundingBoxSize.width)));
    let r = {};
    if (this._hasExactPosition())
      (r.top = r.left = "0"),
        (r.bottom = r.right = r.maxHeight = r.maxWidth = ""),
        (r.width = r.height = "100%");
    else {
      let o = this._overlayRef.getConfig().maxHeight,
        s = this._overlayRef.getConfig().maxWidth;
      (r.height = $e(i.height)),
        (r.top = $e(i.top)),
        (r.bottom = $e(i.bottom)),
        (r.width = $e(i.width)),
        (r.left = $e(i.left)),
        (r.right = $e(i.right)),
        e.overlayX === "center"
          ? (r.alignItems = "center")
          : (r.alignItems = e.overlayX === "end" ? "flex-end" : "flex-start"),
        e.overlayY === "center"
          ? (r.justifyContent = "center")
          : (r.justifyContent =
              e.overlayY === "bottom" ? "flex-end" : "flex-start"),
        o && (r.maxHeight = $e(o)),
        s && (r.maxWidth = $e(s));
    }
    (this._lastBoundingBoxSize = i), ao(this._boundingBox.style, r);
  }
  _resetBoundingBoxStyles() {
    ao(this._boundingBox.style, {
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      height: "",
      width: "",
      alignItems: "",
      justifyContent: "",
    });
  }
  _resetOverlayElementStyles() {
    ao(this._pane.style, {
      top: "",
      left: "",
      bottom: "",
      right: "",
      position: "",
      transform: "",
    });
  }
  _setOverlayElementStyles(t, e) {
    let i = {},
      r = this._hasExactPosition(),
      o = this._hasFlexibleDimensions,
      s = this._overlayRef.getConfig();
    if (r) {
      let d = this._viewportRuler.getViewportScrollPosition();
      ao(i, this._getExactOverlayY(e, t, d)),
        ao(i, this._getExactOverlayX(e, t, d));
    } else i.position = "static";
    let a = "",
      l = this._getOffset(e, "x"),
      c = this._getOffset(e, "y");
    l && (a += `translateX(${l}px) `),
      c && (a += `translateY(${c}px)`),
      (i.transform = a.trim()),
      s.maxHeight &&
        (r ? (i.maxHeight = $e(s.maxHeight)) : o && (i.maxHeight = "")),
      s.maxWidth &&
        (r ? (i.maxWidth = $e(s.maxWidth)) : o && (i.maxWidth = "")),
      ao(this._pane.style, i);
  }
  _getExactOverlayY(t, e, i) {
    let r = { top: "", bottom: "" },
      o = this._getOverlayPoint(e, this._overlayRect, t);
    if (
      (this._isPushed &&
        (o = this._pushOverlayOnScreen(o, this._overlayRect, i)),
      t.overlayY === "bottom")
    ) {
      let s = this._document.documentElement.clientHeight;
      r.bottom = `${s - (o.y + this._overlayRect.height)}px`;
    } else r.top = $e(o.y);
    return r;
  }
  _getExactOverlayX(t, e, i) {
    let r = { left: "", right: "" },
      o = this._getOverlayPoint(e, this._overlayRect, t);
    this._isPushed && (o = this._pushOverlayOnScreen(o, this._overlayRect, i));
    let s;
    if (
      (this._isRtl()
        ? (s = t.overlayX === "end" ? "left" : "right")
        : (s = t.overlayX === "end" ? "right" : "left"),
      s === "right")
    ) {
      let a = this._document.documentElement.clientWidth;
      r.right = `${a - (o.x + this._overlayRect.width)}px`;
    } else r.left = $e(o.x);
    return r;
  }
  _getScrollVisibility() {
    let t = this._getOriginRect(),
      e = this._pane.getBoundingClientRect(),
      i = this._scrollables.map((r) =>
        r.getElementRef().nativeElement.getBoundingClientRect()
      );
    return {
      isOriginClipped: hS(t, i),
      isOriginOutsideView: O_(t, i),
      isOverlayClipped: hS(e, i),
      isOverlayOutsideView: O_(e, i),
    };
  }
  _subtractOverflows(t, ...e) {
    return e.reduce((i, r) => i - Math.max(r, 0), t);
  }
  _getNarrowedViewportRect() {
    let t = this._document.documentElement.clientWidth,
      e = this._document.documentElement.clientHeight,
      i = this._viewportRuler.getViewportScrollPosition();
    return {
      top: i.top + this._viewportMargin,
      left: i.left + this._viewportMargin,
      right: i.left + t - this._viewportMargin,
      bottom: i.top + e - this._viewportMargin,
      width: t - 2 * this._viewportMargin,
      height: e - 2 * this._viewportMargin,
    };
  }
  _isRtl() {
    return this._overlayRef.getDirection() === "rtl";
  }
  _hasExactPosition() {
    return !this._hasFlexibleDimensions || this._isPushed;
  }
  _getOffset(t, e) {
    return e === "x"
      ? t.offsetX == null
        ? this._offsetX
        : t.offsetX
      : t.offsetY == null
      ? this._offsetY
      : t.offsetY;
  }
  _validatePositions() {}
  _addPanelClasses(t) {
    this._pane &&
      rr(t).forEach((e) => {
        e !== "" &&
          this._appliedPanelClasses.indexOf(e) === -1 &&
          (this._appliedPanelClasses.push(e), this._pane.classList.add(e));
      });
  }
  _clearPanelClasses() {
    this._pane &&
      (this._appliedPanelClasses.forEach((t) => {
        this._pane.classList.remove(t);
      }),
      (this._appliedPanelClasses = []));
  }
  _getOriginRect() {
    let t = this._origin;
    if (t instanceof K) return t.nativeElement.getBoundingClientRect();
    if (t instanceof Element) return t.getBoundingClientRect();
    let e = t.width || 0,
      i = t.height || 0;
    return {
      top: t.y,
      bottom: t.y + i,
      left: t.x,
      right: t.x + e,
      height: i,
      width: e,
    };
  }
};
function ao(n, t) {
  for (let e in t) t.hasOwnProperty(e) && (n[e] = t[e]);
  return n;
}
function gS(n) {
  if (typeof n != "number" && n != null) {
    let [t, e] = n.split(L1);
    return !e || e === "px" ? parseFloat(t) : null;
  }
  return n || null;
}
function vS(n) {
  return {
    top: Math.floor(n.top),
    right: Math.floor(n.right),
    bottom: Math.floor(n.bottom),
    left: Math.floor(n.left),
    width: Math.floor(n.width),
    height: Math.floor(n.height),
  };
}
function V1(n, t) {
  return n === t
    ? !0
    : n.isOriginClipped === t.isOriginClipped &&
        n.isOriginOutsideView === t.isOriginOutsideView &&
        n.isOverlayClipped === t.isOverlayClipped &&
        n.isOverlayOutsideView === t.isOverlayOutsideView;
}
var _S = "cdk-global-overlay-wrapper";
function xS(n) {
  return new xf();
}
var xf = class {
    _overlayRef;
    _cssPosition = "static";
    _topOffset = "";
    _bottomOffset = "";
    _alignItems = "";
    _xPosition = "";
    _xOffset = "";
    _width = "";
    _height = "";
    _isDisposed = !1;
    attach(t) {
      let e = t.getConfig();
      (this._overlayRef = t),
        this._width && !e.width && t.updateSize({ width: this._width }),
        this._height && !e.height && t.updateSize({ height: this._height }),
        t.hostElement.classList.add(_S),
        (this._isDisposed = !1);
    }
    top(t = "") {
      return (
        (this._bottomOffset = ""),
        (this._topOffset = t),
        (this._alignItems = "flex-start"),
        this
      );
    }
    left(t = "") {
      return (this._xOffset = t), (this._xPosition = "left"), this;
    }
    bottom(t = "") {
      return (
        (this._topOffset = ""),
        (this._bottomOffset = t),
        (this._alignItems = "flex-end"),
        this
      );
    }
    right(t = "") {
      return (this._xOffset = t), (this._xPosition = "right"), this;
    }
    start(t = "") {
      return (this._xOffset = t), (this._xPosition = "start"), this;
    }
    end(t = "") {
      return (this._xOffset = t), (this._xPosition = "end"), this;
    }
    width(t = "") {
      return (
        this._overlayRef
          ? this._overlayRef.updateSize({ width: t })
          : (this._width = t),
        this
      );
    }
    height(t = "") {
      return (
        this._overlayRef
          ? this._overlayRef.updateSize({ height: t })
          : (this._height = t),
        this
      );
    }
    centerHorizontally(t = "") {
      return this.left(t), (this._xPosition = "center"), this;
    }
    centerVertically(t = "") {
      return this.top(t), (this._alignItems = "center"), this;
    }
    apply() {
      if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
      let t = this._overlayRef.overlayElement.style,
        e = this._overlayRef.hostElement.style,
        i = this._overlayRef.getConfig(),
        { width: r, height: o, maxWidth: s, maxHeight: a } = i,
        l =
          (r === "100%" || r === "100vw") &&
          (!s || s === "100%" || s === "100vw"),
        c =
          (o === "100%" || o === "100vh") &&
          (!a || a === "100%" || a === "100vh"),
        d = this._xPosition,
        u = this._xOffset,
        p = this._overlayRef.getConfig().direction === "rtl",
        h = "",
        m = "",
        g = "";
      l
        ? (g = "flex-start")
        : d === "center"
        ? ((g = "center"), p ? (m = u) : (h = u))
        : p
        ? d === "left" || d === "end"
          ? ((g = "flex-end"), (h = u))
          : (d === "right" || d === "start") && ((g = "flex-start"), (m = u))
        : d === "left" || d === "start"
        ? ((g = "flex-start"), (h = u))
        : (d === "right" || d === "end") && ((g = "flex-end"), (m = u)),
        (t.position = this._cssPosition),
        (t.marginLeft = l ? "0" : h),
        (t.marginTop = c ? "0" : this._topOffset),
        (t.marginBottom = this._bottomOffset),
        (t.marginRight = l ? "0" : m),
        (e.justifyContent = g),
        (e.alignItems = c ? "flex-start" : this._alignItems);
    }
    dispose() {
      if (this._isDisposed || !this._overlayRef) return;
      let t = this._overlayRef.overlayElement.style,
        e = this._overlayRef.hostElement,
        i = e.style;
      e.classList.remove(_S),
        (i.justifyContent =
          i.alignItems =
          t.marginTop =
          t.marginBottom =
          t.marginLeft =
          t.marginRight =
          t.position =
            ""),
        (this._overlayRef = null),
        (this._isDisposed = !0);
    }
  },
  MS = (() => {
    class n {
      _injector = f(te);
      constructor() {}
      global() {
        return xS();
      }
      flexibleConnectedTo(e) {
        return Mf(this._injector, e);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
function Tf(n, t) {
  n.get(gt).load(IS);
  let e = n.get(SS),
    i = n.get(O),
    r = n.get($t),
    o = n.get(jt),
    s = n.get(un),
    a = i.createElement("div"),
    l = i.createElement("div");
  (l.id = r.getId("cdk-overlay-")),
    l.classList.add("cdk-overlay-pane"),
    a.appendChild(l),
    e.getContainerElement().appendChild(a);
  let c = new Cl(l, o, n),
    d = new xs(t),
    u =
      n.get(pt, null, { optional: !0 }) || n.get(Se).createRenderer(null, null);
  return (
    (d.direction = d.direction || s.value),
    new If(
      c,
      a,
      l,
      d,
      n.get(M),
      n.get(DS),
      i,
      n.get(Qi),
      n.get(CS),
      t?.disableAnimations ??
        n.get(qi, null, { optional: !0 }) === "NoopAnimations",
      n.get(Re),
      u
    )
  );
}
var TS = (() => {
  class n {
    scrollStrategies = f(wS);
    _positionBuilder = f(MS);
    _injector = f(te);
    constructor() {}
    create(e) {
      return Tf(this._injector, e);
    }
    position() {
      return this._positionBuilder;
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var j1 = new y("cdk-connected-overlay-scroll-strategy", {
  providedIn: "root",
  factory: () => {
    let n = f(te);
    return () => lo(n);
  },
});
function B1(n) {
  let t = f(te);
  return () => lo(t);
}
var H1 = { provide: j1, useFactory: B1 },
  P_ = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({ providers: [TS, H1], imports: [nr, uS, e_, e_] });
    }
    return n;
  })();
var z1 = ["mat-menu-item", ""],
  $1 = [[["mat-icon"], ["", "matMenuItemIcon", ""]], "*"],
  G1 = ["mat-icon, [matMenuItemIcon]", "*"];
function W1(n, t) {
  n & 1 && (oa(), D(0, "svg", 2), Le(1, "polygon", 3), C());
}
var q1 = ["*"];
function Y1(n, t) {
  if (n & 1) {
    let e = Gn();
    Tt(0, "div", 0),
      Bd("click", function () {
        Je(e);
        let r = de();
        return et(r.closed.emit("click"));
      })("animationstart", function (r) {
        Je(e);
        let o = de();
        return et(o._onAnimationStart(r.animationName));
      })("animationend", function (r) {
        Je(e);
        let o = de();
        return et(o._onAnimationDone(r.animationName));
      })("animationcancel", function (r) {
        Je(e);
        let o = de();
        return et(o._onAnimationDone(r.animationName));
      }),
      Tt(1, "div", 1),
      oe(2),
      Bt()();
  }
  if (n & 2) {
    let e = de();
    In(e._classList),
      re("mat-menu-panel-animations-disabled", e._animationsDisabled)(
        "mat-menu-panel-exit-animation",
        e._panelAnimationState === "void"
      )("mat-menu-panel-animating", e._isAnimating),
      Wn("id", e.panelId),
      De("aria-label", e.ariaLabel || null)(
        "aria-labelledby",
        e.ariaLabelledby || null
      )("aria-describedby", e.ariaDescribedby || null);
  }
}
var L_ = new y("MAT_MENU_PANEL"),
  xl = (() => {
    class n {
      _elementRef = f(K);
      _document = f(O);
      _focusMonitor = f(or);
      _parentMenu = f(L_, { optional: !0 });
      _changeDetectorRef = f(lt);
      role = "menuitem";
      disabled = !1;
      disableRipple = !1;
      _hovered = new E();
      _focused = new E();
      _highlighted = !1;
      _triggersSubmenu = !1;
      constructor() {
        f(gt).load(so), this._parentMenu?.addItem?.(this);
      }
      focus(e, i) {
        this._focusMonitor && e
          ? this._focusMonitor.focusVia(this._getHostElement(), e, i)
          : this._getHostElement().focus(i),
          this._focused.next(this);
      }
      ngAfterViewInit() {
        this._focusMonitor && this._focusMonitor.monitor(this._elementRef, !1);
      }
      ngOnDestroy() {
        this._focusMonitor &&
          this._focusMonitor.stopMonitoring(this._elementRef),
          this._parentMenu &&
            this._parentMenu.removeItem &&
            this._parentMenu.removeItem(this),
          this._hovered.complete(),
          this._focused.complete();
      }
      _getTabIndex() {
        return this.disabled ? "-1" : "0";
      }
      _getHostElement() {
        return this._elementRef.nativeElement;
      }
      _checkDisabled(e) {
        this.disabled && (e.preventDefault(), e.stopPropagation());
      }
      _handleMouseEnter() {
        this._hovered.next(this);
      }
      getLabel() {
        let e = this._elementRef.nativeElement.cloneNode(!0),
          i = e.querySelectorAll("mat-icon, .material-icons");
        for (let r = 0; r < i.length; r++) i[r].remove();
        return e.textContent?.trim() || "";
      }
      _setHighlighted(e) {
        (this._highlighted = e), this._changeDetectorRef.markForCheck();
      }
      _setTriggersSubmenu(e) {
        (this._triggersSubmenu = e), this._changeDetectorRef.markForCheck();
      }
      _hasFocus() {
        return (
          this._document &&
          this._document.activeElement === this._getHostElement()
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["", "mat-menu-item", ""]],
        hostAttrs: [1, "mat-mdc-menu-item", "mat-focus-indicator"],
        hostVars: 8,
        hostBindings: function (i, r) {
          i & 1 &&
            me("click", function (s) {
              return r._checkDisabled(s);
            })("mouseenter", function () {
              return r._handleMouseEnter();
            }),
            i & 2 &&
              (De("role", r.role)("tabindex", r._getTabIndex())(
                "aria-disabled",
                r.disabled
              )("disabled", r.disabled || null),
              re("mat-mdc-menu-item-highlighted", r._highlighted)(
                "mat-mdc-menu-item-submenu-trigger",
                r._triggersSubmenu
              ));
        },
        inputs: {
          role: "role",
          disabled: [2, "disabled", "disabled", se],
          disableRipple: [2, "disableRipple", "disableRipple", se],
        },
        exportAs: ["matMenuItem"],
        attrs: z1,
        ngContentSelectors: G1,
        decls: 5,
        vars: 3,
        consts: [
          [1, "mat-mdc-menu-item-text"],
          [
            "matRipple",
            "",
            1,
            "mat-mdc-menu-ripple",
            3,
            "matRippleDisabled",
            "matRippleTrigger",
          ],
          [
            "viewBox",
            "0 0 5 10",
            "focusable",
            "false",
            "aria-hidden",
            "true",
            1,
            "mat-mdc-menu-submenu-icon",
          ],
          ["points", "0,0 5,5 0,10"],
        ],
        template: function (i, r) {
          i & 1 &&
            (qe($1),
            oe(0),
            D(1, "span", 0),
            oe(2, 1),
            C(),
            Le(3, "div", 1),
            Ge(4, W1, 2, 0, ":svg:svg", 2)),
            i & 2 &&
              (x(3),
              le("matRippleDisabled", r.disableRipple || r.disabled)(
                "matRippleTrigger",
                r._getHostElement()
              ),
              x(),
              We(r._triggersSubmenu ? 4 : -1));
        },
        dependencies: [aS],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })();
var K1 = new y("MatMenuContent");
var Z1 = new y("mat-menu-default-options", { providedIn: "root", factory: Q1 });
function Q1() {
  return {
    overlapTrigger: !1,
    xPosition: "after",
    yPosition: "below",
    backdropClass: "cdk-overlay-transparent-backdrop",
  };
}
var F_ = "_mat-menu-enter",
  Rf = "_mat-menu-exit",
  Ms = (() => {
    class n {
      _elementRef = f(K);
      _changeDetectorRef = f(lt);
      _injector = f(te);
      _keyManager;
      _xPosition;
      _yPosition;
      _firstItemFocusRef;
      _exitFallbackTimeout;
      _animationsDisabled = Jt();
      _allItems;
      _directDescendantItems = new En();
      _classList = {};
      _panelAnimationState = "void";
      _animationDone = new E();
      _isAnimating = !1;
      parentMenu;
      direction;
      overlayPanelClass;
      backdropClass;
      ariaLabel;
      ariaLabelledby;
      ariaDescribedby;
      get xPosition() {
        return this._xPosition;
      }
      set xPosition(e) {
        (this._xPosition = e), this.setPositionClasses();
      }
      get yPosition() {
        return this._yPosition;
      }
      set yPosition(e) {
        (this._yPosition = e), this.setPositionClasses();
      }
      templateRef;
      items;
      lazyContent;
      overlapTrigger;
      hasBackdrop;
      set panelClass(e) {
        let i = this._previousPanelClass,
          r = _({}, this._classList);
        i &&
          i.length &&
          i.split(" ").forEach((o) => {
            r[o] = !1;
          }),
          (this._previousPanelClass = e),
          e &&
            e.length &&
            (e.split(" ").forEach((o) => {
              r[o] = !0;
            }),
            (this._elementRef.nativeElement.className = "")),
          (this._classList = r);
      }
      _previousPanelClass;
      get classList() {
        return this.panelClass;
      }
      set classList(e) {
        this.panelClass = e;
      }
      closed = new j();
      close = this.closed;
      panelId = f($t).getId("mat-menu-panel-");
      constructor() {
        let e = f(Z1);
        (this.overlayPanelClass = e.overlayPanelClass || ""),
          (this._xPosition = e.xPosition),
          (this._yPosition = e.yPosition),
          (this.backdropClass = e.backdropClass),
          (this.overlapTrigger = e.overlapTrigger),
          (this.hasBackdrop = e.hasBackdrop);
      }
      ngOnInit() {
        this.setPositionClasses();
      }
      ngAfterContentInit() {
        this._updateDirectDescendants(),
          (this._keyManager = new oo(this._directDescendantItems)
            .withWrap()
            .withTypeAhead()
            .withHomeAndEnd()),
          this._keyManager.tabOut.subscribe(() => this.closed.emit("tab")),
          this._directDescendantItems.changes
            .pipe(
              Xe(this._directDescendantItems),
              Be((e) => kt(...e.map((i) => i._focused)))
            )
            .subscribe((e) => this._keyManager.updateActiveItem(e)),
          this._directDescendantItems.changes.subscribe((e) => {
            let i = this._keyManager;
            if (
              this._panelAnimationState === "enter" &&
              i.activeItem?._hasFocus()
            ) {
              let r = e.toArray(),
                o = Math.max(0, Math.min(r.length - 1, i.activeItemIndex || 0));
              r[o] && !r[o].disabled
                ? i.setActiveItem(o)
                : i.setNextItemActive();
            }
          });
      }
      ngOnDestroy() {
        this._keyManager?.destroy(),
          this._directDescendantItems.destroy(),
          this.closed.complete(),
          this._firstItemFocusRef?.destroy(),
          clearTimeout(this._exitFallbackTimeout);
      }
      _hovered() {
        return this._directDescendantItems.changes.pipe(
          Xe(this._directDescendantItems),
          Be((i) => kt(...i.map((r) => r._hovered)))
        );
      }
      addItem(e) {}
      removeItem(e) {}
      _handleKeydown(e) {
        let i = e.keyCode,
          r = this._keyManager;
        switch (i) {
          case 27:
            ff(e) || (e.preventDefault(), this.closed.emit("keydown"));
            break;
          case 37:
            this.parentMenu &&
              this.direction === "ltr" &&
              this.closed.emit("keydown");
            break;
          case 39:
            this.parentMenu &&
              this.direction === "rtl" &&
              this.closed.emit("keydown");
            break;
          default:
            (i === 38 || i === 40) && r.setFocusOrigin("keyboard"),
              r.onKeydown(e);
            return;
        }
      }
      focusFirstItem(e = "program") {
        this._firstItemFocusRef?.destroy(),
          (this._firstItemFocusRef = Kt(
            () => {
              let i = this._resolvePanel();
              if (!i || !i.contains(document.activeElement)) {
                let r = this._keyManager;
                r.setFocusOrigin(e).setFirstItemActive(),
                  !r.activeItem && i && i.focus();
              }
            },
            { injector: this._injector }
          ));
      }
      resetActiveItem() {
        this._keyManager.setActiveItem(-1);
      }
      setElevation(e) {}
      setPositionClasses(e = this.xPosition, i = this.yPosition) {
        (this._classList = B(_({}, this._classList), {
          "mat-menu-before": e === "before",
          "mat-menu-after": e === "after",
          "mat-menu-above": i === "above",
          "mat-menu-below": i === "below",
        })),
          this._changeDetectorRef.markForCheck();
      }
      _onAnimationDone(e) {
        let i = e === Rf;
        (i || e === F_) &&
          (i &&
            (clearTimeout(this._exitFallbackTimeout),
            (this._exitFallbackTimeout = void 0)),
          this._animationDone.next(i ? "void" : "enter"),
          (this._isAnimating = !1));
      }
      _onAnimationStart(e) {
        (e === F_ || e === Rf) && (this._isAnimating = !0);
      }
      _setIsOpen(e) {
        if (((this._panelAnimationState = e ? "enter" : "void"), e)) {
          if (this._keyManager.activeItemIndex === 0) {
            let i = this._resolvePanel();
            i && (i.scrollTop = 0);
          }
        } else
          this._animationsDisabled ||
            (this._exitFallbackTimeout = setTimeout(
              () => this._onAnimationDone(Rf),
              200
            ));
        this._animationsDisabled &&
          setTimeout(() => {
            this._onAnimationDone(e ? F_ : Rf);
          }),
          this._changeDetectorRef.markForCheck();
      }
      _updateDirectDescendants() {
        this._allItems.changes.pipe(Xe(this._allItems)).subscribe((e) => {
          this._directDescendantItems.reset(
            e.filter((i) => i._parentMenu === this)
          ),
            this._directDescendantItems.notifyOnChanges();
        });
      }
      _resolvePanel() {
        let e = null;
        return (
          this._directDescendantItems.length &&
            (e = this._directDescendantItems.first
              ._getHostElement()
              .closest('[role="menu"]')),
          e
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["mat-menu"]],
        contentQueries: function (i, r, o) {
          if ((i & 1 && (Ue(o, K1, 5), Ue(o, xl, 5), Ue(o, xl, 4)), i & 2)) {
            let s;
            ue((s = fe())) && (r.lazyContent = s.first),
              ue((s = fe())) && (r._allItems = s),
              ue((s = fe())) && (r.items = s);
          }
        },
        viewQuery: function (i, r) {
          if ((i & 1 && Et(Lt, 5), i & 2)) {
            let o;
            ue((o = fe())) && (r.templateRef = o.first);
          }
        },
        hostVars: 3,
        hostBindings: function (i, r) {
          i & 2 &&
            De("aria-label", null)("aria-labelledby", null)(
              "aria-describedby",
              null
            );
        },
        inputs: {
          backdropClass: "backdropClass",
          ariaLabel: [0, "aria-label", "ariaLabel"],
          ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
          ariaDescribedby: [0, "aria-describedby", "ariaDescribedby"],
          xPosition: "xPosition",
          yPosition: "yPosition",
          overlapTrigger: [2, "overlapTrigger", "overlapTrigger", se],
          hasBackdrop: [
            2,
            "hasBackdrop",
            "hasBackdrop",
            (e) => (e == null ? null : se(e)),
          ],
          panelClass: [0, "class", "panelClass"],
          classList: "classList",
        },
        outputs: { closed: "closed", close: "close" },
        exportAs: ["matMenu"],
        features: [ze([{ provide: L_, useExisting: n }])],
        ngContentSelectors: q1,
        decls: 1,
        vars: 0,
        consts: [
          [
            "tabindex",
            "-1",
            "role",
            "menu",
            1,
            "mat-mdc-menu-panel",
            3,
            "click",
            "animationstart",
            "animationend",
            "animationcancel",
            "id",
          ],
          [1, "mat-mdc-menu-content"],
        ],
        template: function (i, r) {
          i & 1 && (qe(), Pd(0, Y1, 3, 12, "ng-template"));
        },
        styles: [
          `mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;outline:0}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-menu-item-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-menu-item-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-menu-item-label-text-tracking, var(--mat-sys-label-large-tracking));font-weight:var(--mat-menu-item-label-text-weight, var(--mat-sys-label-large-weight))}@keyframes _mat-menu-enter{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:none}}@keyframes _mat-menu-exit{from{opacity:1}to{opacity:0}}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;box-sizing:border-box;outline:0;animation:_mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);border-radius:var(--mat-menu-container-shape, var(--mat-sys-corner-extra-small));background-color:var(--mat-menu-container-color, var(--mat-sys-surface-container));box-shadow:var(--mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));will-change:transform,opacity}.mat-mdc-menu-panel.mat-menu-panel-exit-animation{animation:_mat-menu-exit 100ms 25ms linear forwards}.mat-mdc-menu-panel.mat-menu-panel-animations-disabled{animation:none}.mat-mdc-menu-panel.mat-menu-panel-animating{pointer-events:none}.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty){display:none}@media(forced-colors: active){.mat-mdc-menu-panel{outline:solid 1px}}.mat-mdc-menu-panel .mat-divider{color:var(--mat-menu-divider-color, var(--mat-sys-surface-variant));margin-bottom:var(--mat-menu-divider-bottom-spacing, 8px);margin-top:var(--mat-menu-divider-top-spacing, 8px)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;min-height:48px;padding-left:var(--mat-menu-item-leading-spacing, 12px);padding-right:var(--mat-menu-item-trailing-spacing, 12px);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-menu-item::-moz-focus-inner{border:0}[dir=rtl] .mat-mdc-menu-item{padding-left:var(--mat-menu-item-trailing-spacing, 12px);padding-right:var(--mat-menu-item-leading-spacing, 12px)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-trailing-spacing, 12px)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-trailing-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-leading-spacing, 12px)}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color, var(--mat-sys-on-surface))}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:"";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item:focus{outline:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing, 12px);height:var(--mat-menu-item-icon-size, 24px);width:var(--mat-menu-item-icon-size, 24px)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing, 12px)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent))}@media(forced-colors: active){.mat-mdc-menu-item{margin-top:1px}}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size, 24px);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing, 12px)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing, 12px);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1);transform-origin:center}@media(forced-colors: active){.mat-mdc-menu-submenu-icon{fill:CanvasText}}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  AS = new y("mat-menu-scroll-strategy", {
    providedIn: "root",
    factory: () => {
      let n = f(te);
      return () => lo(n);
    },
  });
function X1(n) {
  let t = f(te);
  return () => lo(t);
}
var J1 = { provide: AS, deps: [], useFactory: X1 };
var Sl = new WeakMap(),
  eL = (() => {
    class n {
      _canHaveBackdrop;
      _element = f(K);
      _viewContainerRef = f(mt);
      _menuItemInstance = f(xl, { optional: !0, self: !0 });
      _dir = f(un, { optional: !0 });
      _focusMonitor = f(or);
      _ngZone = f(M);
      _injector = f(te);
      _scrollStrategy = f(AS);
      _changeDetectorRef = f(lt);
      _animationsDisabled = Jt();
      _portal;
      _overlayRef = null;
      _menuOpen = !1;
      _closingActionsSubscription = W.EMPTY;
      _menuCloseSubscription = W.EMPTY;
      _pendingRemoval;
      _parentMaterialMenu;
      _parentInnerPadding;
      _openedBy = void 0;
      get _menu() {
        return this._menuInternal;
      }
      set _menu(e) {
        e !== this._menuInternal &&
          ((this._menuInternal = e),
          this._menuCloseSubscription.unsubscribe(),
          e &&
            (this._parentMaterialMenu,
            (this._menuCloseSubscription = e.close.subscribe((i) => {
              this._destroyMenu(i),
                (i === "click" || i === "tab") &&
                  this._parentMaterialMenu &&
                  this._parentMaterialMenu.closed.emit(i);
            }))),
          this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()));
      }
      _menuInternal;
      constructor(e) {
        this._canHaveBackdrop = e;
        let i = f(L_, { optional: !0 });
        this._parentMaterialMenu = i instanceof Ms ? i : void 0;
      }
      ngOnDestroy() {
        this._menu && this._ownsMenu(this._menu) && Sl.delete(this._menu),
          this._pendingRemoval?.unsubscribe(),
          this._menuCloseSubscription.unsubscribe(),
          this._closingActionsSubscription.unsubscribe(),
          this._overlayRef &&
            (this._overlayRef.dispose(), (this._overlayRef = null));
      }
      get menuOpen() {
        return this._menuOpen;
      }
      get dir() {
        return this._dir && this._dir.value === "rtl" ? "rtl" : "ltr";
      }
      _triggersSubmenu() {
        return !!(
          this._menuItemInstance &&
          this._parentMaterialMenu &&
          this._menu
        );
      }
      _closeMenu() {
        this._menu?.close.emit();
      }
      _openMenu(e) {
        let i = this._menu;
        if (this._menuOpen || !i) return;
        this._pendingRemoval?.unsubscribe();
        let r = Sl.get(i);
        Sl.set(i, this), r && r !== this && r._closeMenu();
        let o = this._createOverlay(i),
          s = o.getConfig(),
          a = s.positionStrategy;
        this._setPosition(i, a),
          this._canHaveBackdrop
            ? (s.hasBackdrop =
                i.hasBackdrop == null
                  ? !this._triggersSubmenu()
                  : i.hasBackdrop)
            : (s.hasBackdrop = !1),
          o.hasAttached() ||
            (o.attach(this._getPortal(i)),
            i.lazyContent?.attach(this.menuData)),
          (this._closingActionsSubscription =
            this._menuClosingActions().subscribe(() => this._closeMenu())),
          (i.parentMenu = this._triggersSubmenu()
            ? this._parentMaterialMenu
            : void 0),
          (i.direction = this.dir),
          e && i.focusFirstItem(this._openedBy || "program"),
          this._setIsMenuOpen(!0),
          i instanceof Ms &&
            (i._setIsOpen(!0),
            i._directDescendantItems.changes.pipe(Ie(i.close)).subscribe(() => {
              a.withLockedPosition(!1).reapplyLastPosition(),
                a.withLockedPosition(!0);
            }));
      }
      focus(e, i) {
        this._focusMonitor && e
          ? this._focusMonitor.focusVia(this._element, e, i)
          : this._element.nativeElement.focus(i);
      }
      _destroyMenu(e) {
        let i = this._overlayRef,
          r = this._menu;
        !i ||
          !this.menuOpen ||
          (this._closingActionsSubscription.unsubscribe(),
          this._pendingRemoval?.unsubscribe(),
          r instanceof Ms && this._ownsMenu(r)
            ? ((this._pendingRemoval = r._animationDone
                .pipe(dt(1))
                .subscribe(() => {
                  i.detach(), r.lazyContent?.detach();
                })),
              r._setIsOpen(!1))
            : (i.detach(), r?.lazyContent?.detach()),
          r && this._ownsMenu(r) && Sl.delete(r),
          this.restoreFocus &&
            (e === "keydown" || !this._openedBy || !this._triggersSubmenu()) &&
            this.focus(this._openedBy),
          (this._openedBy = void 0),
          this._setIsMenuOpen(!1));
      }
      _setIsMenuOpen(e) {
        e !== this._menuOpen &&
          ((this._menuOpen = e),
          this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit(),
          this._triggersSubmenu() && this._menuItemInstance._setHighlighted(e),
          this._changeDetectorRef.markForCheck());
      }
      _createOverlay(e) {
        if (!this._overlayRef) {
          let i = this._getOverlayConfig(e);
          this._subscribeToPositions(e, i.positionStrategy),
            (this._overlayRef = Tf(this._injector, i)),
            this._overlayRef.keydownEvents().subscribe((r) => {
              this._menu instanceof Ms && this._menu._handleKeydown(r);
            });
        }
        return this._overlayRef;
      }
      _getOverlayConfig(e) {
        return new xs({
          positionStrategy: Mf(this._injector, this._getOverlayOrigin())
            .withLockedPosition()
            .withGrowAfterOpen()
            .withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),
          backdropClass: e.backdropClass || "cdk-overlay-transparent-backdrop",
          panelClass: e.overlayPanelClass,
          scrollStrategy: this._scrollStrategy(),
          direction: this._dir || "ltr",
          disableAnimations: this._animationsDisabled,
        });
      }
      _subscribeToPositions(e, i) {
        e.setPositionClasses &&
          i.positionChanges.subscribe((r) => {
            this._ngZone.run(() => {
              let o =
                  r.connectionPair.overlayX === "start" ? "after" : "before",
                s = r.connectionPair.overlayY === "top" ? "below" : "above";
              e.setPositionClasses(o, s);
            });
          });
      }
      _setPosition(e, i) {
        let [r, o] =
            e.xPosition === "before" ? ["end", "start"] : ["start", "end"],
          [s, a] =
            e.yPosition === "above" ? ["bottom", "top"] : ["top", "bottom"],
          [l, c] = [s, a],
          [d, u] = [r, o],
          p = 0;
        if (this._triggersSubmenu()) {
          if (
            ((u = r = e.xPosition === "before" ? "start" : "end"),
            (o = d = r === "end" ? "start" : "end"),
            this._parentMaterialMenu)
          ) {
            if (this._parentInnerPadding == null) {
              let h = this._parentMaterialMenu.items.first;
              this._parentInnerPadding = h ? h._getHostElement().offsetTop : 0;
            }
            p =
              s === "bottom"
                ? this._parentInnerPadding
                : -this._parentInnerPadding;
          }
        } else
          e.overlapTrigger ||
            ((l = s === "top" ? "bottom" : "top"),
            (c = a === "top" ? "bottom" : "top"));
        i.withPositions([
          { originX: r, originY: l, overlayX: d, overlayY: s, offsetY: p },
          { originX: o, originY: l, overlayX: u, overlayY: s, offsetY: p },
          { originX: r, originY: c, overlayX: d, overlayY: a, offsetY: -p },
          { originX: o, originY: c, overlayX: u, overlayY: a, offsetY: -p },
        ]);
      }
      _menuClosingActions() {
        let e = this._getOutsideClickStream(this._overlayRef),
          i = this._overlayRef.detachments(),
          r = this._parentMaterialMenu ? this._parentMaterialMenu.closed : I(),
          o = this._parentMaterialMenu
            ? this._parentMaterialMenu
                ._hovered()
                .pipe(ve((s) => this._menuOpen && s !== this._menuItemInstance))
            : I();
        return kt(e, r, o, i);
      }
      _getPortal(e) {
        return (
          (!this._portal || this._portal.templateRef !== e.templateRef) &&
            (this._portal = new Ss(e.templateRef, this._viewContainerRef)),
          this._portal
        );
      }
      _ownsMenu(e) {
        return Sl.get(e) === this;
      }
      static ɵfac = function (i) {
        Km();
      };
      static ɵdir = L({ type: n });
    }
    return n;
  })(),
  NS = (() => {
    class n extends eL {
      _cleanupTouchstart;
      _hoverSubscription = W.EMPTY;
      get _deprecatedMatMenuTriggerFor() {
        return this.menu;
      }
      set _deprecatedMatMenuTriggerFor(e) {
        this.menu = e;
      }
      get menu() {
        return this._menu;
      }
      set menu(e) {
        this._menu = e;
      }
      menuData;
      restoreFocus = !0;
      menuOpened = new j();
      onMenuOpen = this.menuOpened;
      menuClosed = new j();
      onMenuClose = this.menuClosed;
      constructor() {
        super(!0);
        let e = f(pt);
        this._cleanupTouchstart = e.listen(
          this._element.nativeElement,
          "touchstart",
          (i) => {
            Ii(i) || (this._openedBy = "touch");
          },
          { passive: !0 }
        );
      }
      triggersSubmenu() {
        return super._triggersSubmenu();
      }
      toggleMenu() {
        return this.menuOpen ? this.closeMenu() : this.openMenu();
      }
      openMenu() {
        this._openMenu(!0);
      }
      closeMenu() {
        this._closeMenu();
      }
      updatePosition() {
        this._overlayRef?.updatePosition();
      }
      ngAfterContentInit() {
        this._handleHover();
      }
      ngOnDestroy() {
        super.ngOnDestroy(),
          this._cleanupTouchstart(),
          this._hoverSubscription.unsubscribe();
      }
      _getOverlayOrigin() {
        return this._element;
      }
      _getOutsideClickStream(e) {
        return e.backdropClick();
      }
      _handleMousedown(e) {
        Ci(e) ||
          ((this._openedBy = e.button === 0 ? "mouse" : void 0),
          this.triggersSubmenu() && e.preventDefault());
      }
      _handleKeydown(e) {
        let i = e.keyCode;
        (i === 13 || i === 32) && (this._openedBy = "keyboard"),
          this.triggersSubmenu() &&
            ((i === 39 && this.dir === "ltr") ||
              (i === 37 && this.dir === "rtl")) &&
            ((this._openedBy = "keyboard"), this.openMenu());
      }
      _handleClick(e) {
        this.triggersSubmenu()
          ? (e.stopPropagation(), this.openMenu())
          : this.toggleMenu();
      }
      _handleHover() {
        this.triggersSubmenu() &&
          this._parentMaterialMenu &&
          (this._hoverSubscription = this._parentMaterialMenu
            ._hovered()
            .subscribe((e) => {
              e === this._menuItemInstance &&
                !e.disabled &&
                ((this._openedBy = "mouse"), this._openMenu(!1));
            }));
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["", "mat-menu-trigger-for", ""],
          ["", "matMenuTriggerFor", ""],
        ],
        hostAttrs: [1, "mat-mdc-menu-trigger"],
        hostVars: 3,
        hostBindings: function (i, r) {
          i & 1 &&
            me("click", function (s) {
              return r._handleClick(s);
            })("mousedown", function (s) {
              return r._handleMousedown(s);
            })("keydown", function (s) {
              return r._handleKeydown(s);
            }),
            i & 2 &&
              De("aria-haspopup", r.menu ? "menu" : null)(
                "aria-expanded",
                r.menuOpen
              )(
                "aria-controls",
                r.menuOpen ? (r.menu == null ? null : r.menu.panelId) : null
              );
        },
        inputs: {
          _deprecatedMatMenuTriggerFor: [
            0,
            "mat-menu-trigger-for",
            "_deprecatedMatMenuTriggerFor",
          ],
          menu: [0, "matMenuTriggerFor", "menu"],
          menuData: [0, "matMenuTriggerData", "menuData"],
          restoreFocus: [0, "matMenuTriggerRestoreFocus", "restoreFocus"],
        },
        outputs: {
          menuOpened: "menuOpened",
          onMenuOpen: "onMenuOpen",
          menuClosed: "menuClosed",
          onMenuClose: "onMenuClose",
        },
        exportAs: ["matMenuTrigger"],
        features: [at],
      });
    }
    return n;
  })();
var OS = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({ providers: [J1], imports: [Cs, ke, P_, fl, ke] });
    }
    return n;
  })(),
  kS = {
    transformMenu: {
      type: 7,
      name: "transformMenu",
      definitions: [
        {
          type: 0,
          name: "void",
          styles: {
            type: 6,
            styles: { opacity: 0, transform: "scale(0.8)" },
            offset: null,
          },
        },
        {
          type: 1,
          expr: "void => enter",
          animation: {
            type: 4,
            styles: {
              type: 6,
              styles: { opacity: 1, transform: "scale(1)" },
              offset: null,
            },
            timings: "120ms cubic-bezier(0, 0, 0.2, 1)",
          },
          options: null,
        },
        {
          type: 1,
          expr: "* => void",
          animation: {
            type: 4,
            styles: { type: 6, styles: { opacity: 0 }, offset: null },
            timings: "100ms 25ms linear",
          },
          options: null,
        },
      ],
      options: {},
    },
    fadeInItems: {
      type: 7,
      name: "fadeInItems",
      definitions: [
        {
          type: 0,
          name: "showing",
          styles: { type: 6, styles: { opacity: 1 }, offset: null },
        },
        {
          type: 1,
          expr: "void => *",
          animation: [
            { type: 6, styles: { opacity: 0 }, offset: null },
            {
              type: 4,
              styles: null,
              timings: "400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)",
            },
          ],
          options: null,
        },
      ],
      options: {},
    },
  },
  yee = kS.fadeInItems,
  bee = kS.transformMenu;
function nL(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 9)(1, "div", 10), U(2), C(), D(3, "div", 11), U(4), C()()),
    n & 2)
  ) {
    let e = t.$implicit;
    x(2), Oe(e.day), x(2), Ud("", e.high, "\xB0/", e.low, "\xB0");
  }
}
function iL(n, t) {
  if ((n & 1 && (D(0, "div", 7), nt(1, nL, 5, 3, "div", 8), C()), n & 2)) {
    let e = de();
    x(), le("ngForOf", e.card.weatherData.forecast);
  }
}
var Nf = class n {
  card;
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = Z({
    type: n,
    selectors: [["app-weather-card"]],
    inputs: { card: "card" },
    decls: 24,
    vars: 9,
    consts: [
      [1, "weather-card"],
      [1, "weather-main"],
      [1, "temperature"],
      [1, "condition"],
      [1, "weather-details"],
      [1, "detail"],
      ["class", "forecast", 4, "ngIf"],
      [1, "forecast"],
      ["class", "forecast-item", 4, "ngFor", "ngForOf"],
      [1, "forecast-item"],
      [1, "day"],
      [1, "temps"],
    ],
    template: function (e, i) {
      e & 1 &&
        (D(0, "mat-card", 0)(1, "mat-card-header")(2, "mat-card-title"),
        U(3),
        C(),
        D(4, "mat-card-subtitle"),
        U(5),
        C()(),
        D(6, "mat-card-content")(7, "div", 1)(8, "div", 2),
        U(9),
        C(),
        D(10, "div", 3),
        U(11),
        C()(),
        D(12, "div", 4)(13, "div", 5)(14, "mat-icon"),
        U(15, "water_drop"),
        C(),
        D(16, "span"),
        U(17),
        C()(),
        D(18, "div", 5)(19, "mat-icon"),
        U(20, "air"),
        C(),
        D(21, "span"),
        U(22),
        C()()(),
        nt(23, iL, 2, 1, "div", 6),
        C()()),
        e & 2 &&
          (pi("background-color", i.card.color),
          x(3),
          Oe(i.card.title),
          x(2),
          Oe(i.card.weatherData.location),
          x(4),
          $r("", i.card.weatherData.temperature, "\xB0C"),
          x(2),
          Oe(i.card.weatherData.condition),
          x(6),
          $r("", i.card.weatherData.humidity, "%"),
          x(5),
          $r("", i.card.weatherData.windSpeed, " km/h"),
          x(),
          le("ngIf", i.card.weatherData.forecast));
    },
    dependencies: [qn, Xi, vi, ar, _s, bs, ws, pf, ys, cr, lr],
    styles: [
      ".weather-card[_ngcontent-%COMP%]{width:250px;height:300px;margin:8px;cursor:move}.weather-main[_ngcontent-%COMP%]{text-align:center;margin-bottom:16px}.temperature[_ngcontent-%COMP%]{font-size:2.5em;font-weight:700;color:#fff}.condition[_ngcontent-%COMP%]{font-size:1.1em;color:#fff;opacity:.9}.weather-details[_ngcontent-%COMP%]{display:flex;justify-content:space-around;margin-bottom:16px}.detail[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;color:#fff}.detail[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px}.forecast[_ngcontent-%COMP%]{display:flex;gap:8px;overflow-x:auto}.forecast-item[_ngcontent-%COMP%]{min-width:60px;text-align:center;color:#fff;opacity:.9}.day[_ngcontent-%COMP%]{font-size:.8em;margin-bottom:4px}.temps[_ngcontent-%COMP%]{font-size:.9em;font-weight:700}",
    ],
    changeDetection: 0,
  });
};
var US = (() => {
    class n {
      _renderer;
      _elementRef;
      onChange = (e) => {};
      onTouched = () => {};
      constructor(e, i) {
        (this._renderer = e), (this._elementRef = i);
      }
      setProperty(e, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, e, i);
      }
      registerOnTouched(e) {
        this.onTouched = e;
      }
      registerOnChange(e) {
        this.onChange = e;
      }
      setDisabledState(e) {
        this.setProperty("disabled", e);
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(pt), ie(K));
      };
      static ɵdir = L({ type: n });
    }
    return n;
  })(),
  rL = (() => {
    class n extends US {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Cn(n)))(r || n);
        };
      })();
      static ɵdir = L({ type: n, features: [at] });
    }
    return n;
  })(),
  zS = new y("");
var oL = { provide: zS, useExisting: mn(() => Gf), multi: !0 };
function sL() {
  let n = ln() ? ln().getUserAgent() : "";
  return /android (\d+)/.test(n.toLowerCase());
}
var aL = new y(""),
  Gf = (() => {
    class n extends US {
      _compositionMode;
      _composing = !1;
      constructor(e, i, r) {
        super(e, i),
          (this._compositionMode = r),
          this._compositionMode == null && (this._compositionMode = !sL());
      }
      writeValue(e) {
        let i = e ?? "";
        this.setProperty("value", i);
      }
      _handleInput(e) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(e);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(e) {
        (this._composing = !1), this._compositionMode && this.onChange(e);
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(pt), ie(K), ie(aL, 8));
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, r) {
          i & 1 &&
            me("input", function (s) {
              return r._handleInput(s.target.value);
            })("blur", function () {
              return r.onTouched();
            })("compositionstart", function () {
              return r._compositionStart();
            })("compositionend", function (s) {
              return r._compositionEnd(s.target.value);
            });
        },
        standalone: !1,
        features: [ze([oL]), at],
      });
    }
    return n;
  })();
function B_(n) {
  return n == null || H_(n) === 0;
}
function H_(n) {
  return n == null
    ? null
    : Array.isArray(n) || typeof n == "string"
    ? n.length
    : n instanceof Set
    ? n.size
    : null;
}
var U_ = new y(""),
  z_ = new y(""),
  lL =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  kf = class {
    static min(t) {
      return cL(t);
    }
    static max(t) {
      return dL(t);
    }
    static required(t) {
      return uL(t);
    }
    static requiredTrue(t) {
      return fL(t);
    }
    static email(t) {
      return hL(t);
    }
    static minLength(t) {
      return pL(t);
    }
    static maxLength(t) {
      return mL(t);
    }
    static pattern(t) {
      return gL(t);
    }
    static nullValidator(t) {
      return $S();
    }
    static compose(t) {
      return ZS(t);
    }
    static composeAsync(t) {
      return QS(t);
    }
  };
function cL(n) {
  return (t) => {
    if (t.value == null || n == null) return null;
    let e = parseFloat(t.value);
    return !isNaN(e) && e < n ? { min: { min: n, actual: t.value } } : null;
  };
}
function dL(n) {
  return (t) => {
    if (t.value == null || n == null) return null;
    let e = parseFloat(t.value);
    return !isNaN(e) && e > n ? { max: { max: n, actual: t.value } } : null;
  };
}
function uL(n) {
  return B_(n.value) ? { required: !0 } : null;
}
function fL(n) {
  return n.value === !0 ? null : { required: !0 };
}
function hL(n) {
  return B_(n.value) || lL.test(n.value) ? null : { email: !0 };
}
function pL(n) {
  return (t) => {
    let e = t.value?.length ?? H_(t.value);
    return e === null || e === 0
      ? null
      : e < n
      ? { minlength: { requiredLength: n, actualLength: e } }
      : null;
  };
}
function mL(n) {
  return (t) => {
    let e = t.value?.length ?? H_(t.value);
    return e !== null && e > n
      ? { maxlength: { requiredLength: n, actualLength: e } }
      : null;
  };
}
function gL(n) {
  if (!n) return $S;
  let t, e;
  return (
    typeof n == "string"
      ? ((e = ""),
        n.charAt(0) !== "^" && (e += "^"),
        (e += n),
        n.charAt(n.length - 1) !== "$" && (e += "$"),
        (t = new RegExp(e)))
      : ((e = n.toString()), (t = n)),
    (i) => {
      if (B_(i.value)) return null;
      let r = i.value;
      return t.test(r)
        ? null
        : { pattern: { requiredPattern: e, actualValue: r } };
    }
  );
}
function $S(n) {
  return null;
}
function GS(n) {
  return n != null;
}
function WS(n) {
  return Ki(n) ? Me(n) : n;
}
function qS(n) {
  let t = {};
  return (
    n.forEach((e) => {
      t = e != null ? _(_({}, t), e) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function YS(n, t) {
  return t.map((e) => e(n));
}
function vL(n) {
  return !n.validate;
}
function KS(n) {
  return n.map((t) => (vL(t) ? t : (e) => t.validate(e)));
}
function ZS(n) {
  if (!n) return null;
  let t = n.filter(GS);
  return t.length == 0
    ? null
    : function (e) {
        return qS(YS(e, t));
      };
}
function $_(n) {
  return n != null ? ZS(KS(n)) : null;
}
function QS(n) {
  if (!n) return null;
  let t = n.filter(GS);
  return t.length == 0
    ? null
    : function (e) {
        let i = YS(e, t).map(WS);
        return Er(i).pipe(R(qS));
      };
}
function G_(n) {
  return n != null ? QS(KS(n)) : null;
}
function PS(n, t) {
  return n === null ? [t] : Array.isArray(n) ? [...n, t] : [n, t];
}
function XS(n) {
  return n._rawValidators;
}
function JS(n) {
  return n._rawAsyncValidators;
}
function V_(n) {
  return n ? (Array.isArray(n) ? n : [n]) : [];
}
function Pf(n, t) {
  return Array.isArray(n) ? n.includes(t) : n === t;
}
function FS(n, t) {
  let e = V_(t);
  return (
    V_(n).forEach((r) => {
      Pf(e, r) || e.push(r);
    }),
    e
  );
}
function LS(n, t) {
  return V_(t).filter((e) => !Pf(n, e));
}
var Ff = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = $_(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = G_(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, e) {
      return this.control ? this.control.hasError(t, e) : !1;
    }
    getError(t, e) {
      return this.control ? this.control.getError(t, e) : null;
    }
  },
  co = class extends Ff {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  uo = class extends Ff {
    _parent = null;
    name = null;
    valueAccessor = null;
  },
  j_ = class {
    _cd;
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  _L = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  Hee = B(_({}, _L), { "[class.ng-submitted]": "isSubmitted" }),
  ex = (() => {
    class n extends j_ {
      constructor(e) {
        super(e);
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(uo, 2));
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, r) {
          i & 2 &&
            re("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
              "ng-pristine",
              r.isPristine
            )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
              "ng-invalid",
              r.isInvalid
            )("ng-pending", r.isPending);
        },
        standalone: !1,
        features: [at],
      });
    }
    return n;
  })();
var Ml = "VALID",
  Of = "INVALID",
  Ts = "PENDING",
  Tl = "DISABLED",
  dr = class {},
  Lf = class extends dr {
    value;
    source;
    constructor(t, e) {
      super(), (this.value = t), (this.source = e);
    }
  },
  Al = class extends dr {
    pristine;
    source;
    constructor(t, e) {
      super(), (this.pristine = t), (this.source = e);
    }
  },
  Nl = class extends dr {
    touched;
    source;
    constructor(t, e) {
      super(), (this.touched = t), (this.source = e);
    }
  },
  Rs = class extends dr {
    status;
    source;
    constructor(t, e) {
      super(), (this.status = t), (this.source = e);
    }
  },
  Vf = class extends dr {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  },
  jf = class extends dr {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  };
function tx(n) {
  return (Wf(n) ? n.validators : n) || null;
}
function yL(n) {
  return Array.isArray(n) ? $_(n) : n || null;
}
function nx(n, t) {
  return (Wf(t) ? t.asyncValidators : n) || null;
}
function bL(n) {
  return Array.isArray(n) ? G_(n) : n || null;
}
function Wf(n) {
  return n != null && !Array.isArray(n) && typeof n == "object";
}
function wL(n, t, e) {
  let i = n.controls;
  if (!(t ? Object.keys(i) : i).length) throw new v(1e3, "");
  if (!i[e]) throw new v(1001, "");
}
function EL(n, t, e) {
  n._forEachChild((i, r) => {
    if (e[r] === void 0) throw new v(1002, "");
  });
}
var Bf = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, e) {
      this._assignValidators(t), this._assignAsyncValidators(e);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return an(this.statusReactive);
    }
    set status(t) {
      an(() => this.statusReactive.set(t));
    }
    _status = Sn(() => this.statusReactive());
    statusReactive = Ne(void 0);
    get valid() {
      return this.status === Ml;
    }
    get invalid() {
      return this.status === Of;
    }
    get pending() {
      return this.status == Ts;
    }
    get disabled() {
      return this.status === Tl;
    }
    get enabled() {
      return this.status !== Tl;
    }
    errors;
    get pristine() {
      return an(this.pristineReactive);
    }
    set pristine(t) {
      an(() => this.pristineReactive.set(t));
    }
    _pristine = Sn(() => this.pristineReactive());
    pristineReactive = Ne(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return an(this.touchedReactive);
    }
    set touched(t) {
      an(() => this.touchedReactive.set(t));
    }
    _touched = Sn(() => this.touchedReactive());
    touchedReactive = Ne(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new E();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(FS(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(FS(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(LS(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(LS(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return Pf(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return Pf(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let e = this.touched === !1;
      this.touched = !0;
      let i = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsTouched(B(_({}, t), { sourceControl: i })),
        e && t.emitEvent !== !1 && this._events.next(new Nl(!0, i));
    }
    markAllAsDirty(t = {}) {
      this.markAsDirty({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((e) => e.markAllAsDirty(t));
    }
    markAllAsTouched(t = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((e) => e.markAllAsTouched(t));
    }
    markAsUntouched(t = {}) {
      let e = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let i = t.sourceControl ?? this;
      this._forEachChild((r) => {
        r.markAsUntouched({
          onlySelf: !0,
          emitEvent: t.emitEvent,
          sourceControl: i,
        });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, i),
        e && t.emitEvent !== !1 && this._events.next(new Nl(!1, i));
    }
    markAsDirty(t = {}) {
      let e = this.pristine === !0;
      this.pristine = !1;
      let i = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsDirty(B(_({}, t), { sourceControl: i })),
        e && t.emitEvent !== !1 && this._events.next(new Al(!1, i));
    }
    markAsPristine(t = {}) {
      let e = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let i = t.sourceControl ?? this;
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, i),
        e && t.emitEvent !== !1 && this._events.next(new Al(!0, i));
    }
    markAsPending(t = {}) {
      this.status = Ts;
      let e = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Rs(this.status, e)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(B(_({}, t), { sourceControl: e }));
    }
    disable(t = {}) {
      let e = this._parentMarkedDirty(t.onlySelf);
      (this.status = Tl),
        (this.errors = null),
        this._forEachChild((r) => {
          r.disable(B(_({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let i = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Lf(this.value, i)),
        this._events.next(new Rs(this.status, i)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(B(_({}, t), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((r) => r(!0));
    }
    enable(t = {}) {
      let e = this._parentMarkedDirty(t.onlySelf);
      (this.status = Ml),
        this._forEachChild((i) => {
          i.enable(B(_({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(B(_({}, t), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((i) => i(!1));
    }
    _updateAncestors(t, e) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, e),
        this._parent._updateTouched({}, e));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let i = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Ml || this.status === Ts) &&
            this._runAsyncValidator(i, t.emitEvent);
      }
      let e = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Lf(this.value, e)),
        this._events.next(new Rs(this.status, e)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            B(_({}, t), { sourceControl: e })
          );
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((e) => e._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Tl : Ml;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, e) {
      if (this.asyncValidator) {
        (this.status = Ts),
          (this._hasOwnPendingAsyncValidator = {
            emitEvent: e !== !1,
            shouldHaveEmitted: t !== !1,
          });
        let i = WS(this.asyncValidator(this));
        this._asyncValidationSubscription = i.subscribe((r) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(r, { emitEvent: e, shouldHaveEmitted: t });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t =
          (this._hasOwnPendingAsyncValidator?.emitEvent ||
            this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ??
          !1;
        return (this._hasOwnPendingAsyncValidator = null), t;
      }
      return !1;
    }
    setErrors(t, e = {}) {
      (this.errors = t),
        this._updateControlsErrors(
          e.emitEvent !== !1,
          this,
          e.shouldHaveEmitted
        );
    }
    get(t) {
      let e = t;
      return e == null ||
        (Array.isArray(e) || (e = e.split(".")), e.length === 0)
        ? null
        : e.reduce((i, r) => i && i._find(r), this);
    }
    getError(t, e) {
      let i = e ? this.get(e) : this;
      return i && i.errors ? i.errors[t] : null;
    }
    hasError(t, e) {
      return !!this.getError(t, e);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, e, i) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || i) && this._events.next(new Rs(this.status, e)),
        this._parent && this._parent._updateControlsErrors(t, e, i);
    }
    _initObservables() {
      (this.valueChanges = new j()), (this.statusChanges = new j());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Tl
        : this.errors
        ? Of
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Ts)
        ? Ts
        : this._anyControlsHaveStatus(Of)
        ? Of
        : Ml;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((e) => e.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, e) {
      let i = !this._anyControlsDirty(),
        r = this.pristine !== i;
      (this.pristine = i),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, e),
        r && this._events.next(new Al(this.pristine, e));
    }
    _updateTouched(t = {}, e) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Nl(this.touched, e)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, e);
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      Wf(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let e = this._parent && this._parent.dirty;
      return !t && !!e && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = yL(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = bL(this._rawAsyncValidators));
    }
  },
  Hf = class extends Bf {
    constructor(t, e, i) {
      super(tx(e), nx(i, e)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(e),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    registerControl(t, e) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = e),
          e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange),
          e);
    }
    addControl(t, e, i = {}) {
      this.registerControl(t, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, e = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: e.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, e, i = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        e && this.registerControl(t, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, e = {}) {
      EL(this, !0, t),
        Object.keys(t).forEach((i) => {
          wL(this, !0, i),
            this.controls[i].setValue(t[i], {
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }),
        this.updateValueAndValidity(e);
    }
    patchValue(t, e = {}) {
      t != null &&
        (Object.keys(t).forEach((i) => {
          let r = this.controls[i];
          r && r.patchValue(t[i], { onlySelf: !0, emitEvent: e.emitEvent });
        }),
        this.updateValueAndValidity(e));
    }
    reset(t = {}, e = {}) {
      this._forEachChild((i, r) => {
        i.reset(t ? t[r] : null, { onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._updatePristine(e, this),
        this._updateTouched(e, this),
        this.updateValueAndValidity(e);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, e, i) => ((t[i] = e.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (e, i) =>
        i._syncPendingControls() ? !0 : e
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((e) => {
        let i = this.controls[e];
        i && t(i, e);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [e, i] of Object.entries(this.controls))
        if (this.contains(e) && t(i)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (e, i, r) => ((i.enabled || this.disabled) && (e[r] = i.value), e)
      );
    }
    _reduceChildren(t, e) {
      let i = t;
      return (
        this._forEachChild((r, o) => {
          i = e(i, r, o);
        }),
        i
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var qf = new y("", { providedIn: "root", factory: () => W_ }),
  W_ = "always";
function DL(n, t) {
  return [...t.path, n];
}
function Uf(n, t, e = W_) {
  q_(n, t),
    t.valueAccessor.writeValue(n.value),
    (n.disabled || e === "always") &&
      t.valueAccessor.setDisabledState?.(n.disabled),
    IL(n, t),
    xL(n, t),
    SL(n, t),
    CL(n, t);
}
function VS(n, t, e = !0) {
  let i = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(i), t.valueAccessor.registerOnTouched(i)),
    $f(n, t),
    n &&
      (t._invokeOnDestroyCallbacks(), n._registerOnCollectionChange(() => {}));
}
function zf(n, t) {
  n.forEach((e) => {
    e.registerOnValidatorChange && e.registerOnValidatorChange(t);
  });
}
function CL(n, t) {
  if (t.valueAccessor.setDisabledState) {
    let e = (i) => {
      t.valueAccessor.setDisabledState(i);
    };
    n.registerOnDisabledChange(e),
      t._registerOnDestroy(() => {
        n._unregisterOnDisabledChange(e);
      });
  }
}
function q_(n, t) {
  let e = XS(n);
  t.validator !== null
    ? n.setValidators(PS(e, t.validator))
    : typeof e == "function" && n.setValidators([e]);
  let i = JS(n);
  t.asyncValidator !== null
    ? n.setAsyncValidators(PS(i, t.asyncValidator))
    : typeof i == "function" && n.setAsyncValidators([i]);
  let r = () => n.updateValueAndValidity();
  zf(t._rawValidators, r), zf(t._rawAsyncValidators, r);
}
function $f(n, t) {
  let e = !1;
  if (n !== null) {
    if (t.validator !== null) {
      let r = XS(n);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== t.validator);
        o.length !== r.length && ((e = !0), n.setValidators(o));
      }
    }
    if (t.asyncValidator !== null) {
      let r = JS(n);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== t.asyncValidator);
        o.length !== r.length && ((e = !0), n.setAsyncValidators(o));
      }
    }
  }
  let i = () => {};
  return zf(t._rawValidators, i), zf(t._rawAsyncValidators, i), e;
}
function IL(n, t) {
  t.valueAccessor.registerOnChange((e) => {
    (n._pendingValue = e),
      (n._pendingChange = !0),
      (n._pendingDirty = !0),
      n.updateOn === "change" && ix(n, t);
  });
}
function SL(n, t) {
  t.valueAccessor.registerOnTouched(() => {
    (n._pendingTouched = !0),
      n.updateOn === "blur" && n._pendingChange && ix(n, t),
      n.updateOn !== "submit" && n.markAsTouched();
  });
}
function ix(n, t) {
  n._pendingDirty && n.markAsDirty(),
    n.setValue(n._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(n._pendingValue),
    (n._pendingChange = !1);
}
function xL(n, t) {
  let e = (i, r) => {
    t.valueAccessor.writeValue(i), r && t.viewToModelUpdate(i);
  };
  n.registerOnChange(e),
    t._registerOnDestroy(() => {
      n._unregisterOnChange(e);
    });
}
function rx(n, t) {
  n == null, q_(n, t);
}
function ML(n, t) {
  return $f(n, t);
}
function TL(n, t) {
  if (!n.hasOwnProperty("model")) return !1;
  let e = n.model;
  return e.isFirstChange() ? !0 : !Object.is(t, e.currentValue);
}
function RL(n) {
  return Object.getPrototypeOf(n.constructor) === rL;
}
function ox(n, t) {
  n._syncPendingControls(),
    t.forEach((e) => {
      let i = e.control;
      i.updateOn === "submit" &&
        i._pendingChange &&
        (e.viewToModelUpdate(i._pendingValue), (i._pendingChange = !1));
    });
}
function AL(n, t) {
  if (!t) return null;
  Array.isArray(t);
  let e, i, r;
  return (
    t.forEach((o) => {
      o.constructor === Gf ? (e = o) : RL(o) ? (i = o) : (r = o);
    }),
    r || i || e || null
  );
}
function NL(n, t) {
  let e = n.indexOf(t);
  e > -1 && n.splice(e, 1);
}
var OL = { provide: co, useExisting: mn(() => Y_) },
  Rl = Promise.resolve(),
  Y_ = (() => {
    class n extends co {
      callSetDisabledState;
      get submitted() {
        return an(this.submittedReactive);
      }
      _submitted = Sn(() => this.submittedReactive());
      submittedReactive = Ne(!1);
      _directives = new Set();
      form;
      ngSubmit = new j();
      options;
      constructor(e, i, r) {
        super(),
          (this.callSetDisabledState = r),
          (this.form = new Hf({}, $_(e), G_(i)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(e) {
        Rl.then(() => {
          let i = this._findContainer(e.path);
          (e.control = i.registerControl(e.name, e.control)),
            Uf(e.control, e, this.callSetDisabledState),
            e.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(e);
        });
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        Rl.then(() => {
          let i = this._findContainer(e.path);
          i && i.removeControl(e.name), this._directives.delete(e);
        });
      }
      addFormGroup(e) {
        Rl.then(() => {
          let i = this._findContainer(e.path),
            r = new Hf({});
          rx(r, e),
            i.registerControl(e.name, r),
            r.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(e) {
        Rl.then(() => {
          let i = this._findContainer(e.path);
          i && i.removeControl(e.name);
        });
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        Rl.then(() => {
          this.form.get(e.path).setValue(i);
        });
      }
      setValue(e) {
        this.control.setValue(e);
      }
      onSubmit(e) {
        return (
          this.submittedReactive.set(!0),
          ox(this.form, this._directives),
          this.ngSubmit.emit(e),
          this.form._events.next(new Vf(this.control)),
          e?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0) {
        this.form.reset(e),
          this.submittedReactive.set(!1),
          this.form._events.next(new jf(this.form));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(e) {
        return e.pop(), e.length ? this.form.get(e) : this.form;
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(U_, 10), ie(z_, 10), ie(qf, 8));
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
          ["ng-form"],
          ["", "ngForm", ""],
        ],
        hostBindings: function (i, r) {
          i & 1 &&
            me("submit", function (s) {
              return r.onSubmit(s);
            })("reset", function () {
              return r.onReset();
            });
        },
        inputs: { options: [0, "ngFormOptions", "options"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [ze([OL]), at],
      });
    }
    return n;
  })();
function jS(n, t) {
  let e = n.indexOf(t);
  e > -1 && n.splice(e, 1);
}
function BS(n) {
  return (
    typeof n == "object" &&
    n !== null &&
    Object.keys(n).length === 2 &&
    "value" in n &&
    "disabled" in n
  );
}
var sx = class extends Bf {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, e, i) {
    super(tx(e), nx(i, e)),
      this._applyFormState(t),
      this._setUpdateStrategy(e),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Wf(e) &&
        (e.nonNullable || e.initialValueIsDefault) &&
        (BS(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, e = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        e.emitModelToViewChange !== !1 &&
        this._onChange.forEach((i) =>
          i(this.value, e.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(e);
  }
  patchValue(t, e = {}) {
    this.setValue(t, e);
  }
  reset(t = this.defaultValue, e = {}) {
    this._applyFormState(t),
      this.markAsPristine(e),
      this.markAsUntouched(e),
      this.setValue(this.value, e),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    jS(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    jS(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    BS(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var kL = (n) => n instanceof sx;
var PL = { provide: uo, useExisting: mn(() => K_) },
  HS = Promise.resolve(),
  K_ = (() => {
    class n extends uo {
      _changeDetectorRef;
      callSetDisabledState;
      control = new sx();
      static ngAcceptInputType_isDisabled;
      _registered = !1;
      viewModel;
      name = "";
      isDisabled;
      model;
      options;
      update = new j();
      constructor(e, i, r, o, s, a) {
        super(),
          (this._changeDetectorRef = s),
          (this.callSetDisabledState = a),
          (this._parent = e),
          this._setValidators(i),
          this._setAsyncValidators(r),
          (this.valueAccessor = AL(this, o));
      }
      ngOnChanges(e) {
        if ((this._checkForErrors(), !this._registered || "name" in e)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = e.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in e && this._updateDisabled(e),
          TL(e, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(e) {
        (this.viewModel = e), this.update.emit(e);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        Uf(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._checkName();
      }
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(e) {
        HS.then(() => {
          this.control.setValue(e, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(e) {
        let i = e.isDisabled.currentValue,
          r = i !== 0 && se(i);
        HS.then(() => {
          r && !this.control.disabled
            ? this.control.disable()
            : !r && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(e) {
        return this._parent ? DL(e, this._parent) : [e];
      }
      static ɵfac = function (i) {
        return new (i || n)(
          ie(co, 9),
          ie(U_, 10),
          ie(z_, 10),
          ie(zS, 10),
          ie(lt, 8),
          ie(qf, 8)
        );
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
          options: [0, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        standalone: !1,
        features: [ze([PL]), at, wt],
      });
    }
    return n;
  })();
var FL = { provide: co, useExisting: mn(() => Z_) },
  Z_ = (() => {
    class n extends co {
      callSetDisabledState;
      get submitted() {
        return an(this._submittedReactive);
      }
      set submitted(e) {
        this._submittedReactive.set(e);
      }
      _submitted = Sn(() => this._submittedReactive());
      _submittedReactive = Ne(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new j();
      constructor(e, i, r) {
        super(),
          (this.callSetDisabledState = r),
          this._setValidators(e),
          this._setAsyncValidators(i);
      }
      ngOnChanges(e) {
        e.hasOwnProperty("form") &&
          (this._updateValidators(),
          this._updateDomValue(),
          this._updateRegistrations(),
          (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          ($f(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(e) {
        let i = this.form.get(e.path);
        return (
          Uf(i, e, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(e),
          i
        );
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        VS(e.control || null, e, !1), NL(this.directives, e);
      }
      addFormGroup(e) {
        this._setUpFormContainer(e);
      }
      removeFormGroup(e) {
        this._cleanUpFormContainer(e);
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      addFormArray(e) {
        this._setUpFormContainer(e);
      }
      removeFormArray(e) {
        this._cleanUpFormContainer(e);
      }
      getFormArray(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        this.form.get(e.path).setValue(i);
      }
      onSubmit(e) {
        return (
          this._submittedReactive.set(!0),
          ox(this.form, this.directives),
          this.ngSubmit.emit(e),
          this.form._events.next(new Vf(this.control)),
          e?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0, i = {}) {
        this.form.reset(e, i),
          this._submittedReactive.set(!1),
          i?.emitEvent !== !1 && this.form._events.next(new jf(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((e) => {
          let i = e.control,
            r = this.form.get(e.path);
          i !== r &&
            (VS(i || null, e),
            kL(r) && (Uf(r, e, this.callSetDisabledState), (e.control = r)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(e) {
        let i = this.form.get(e.path);
        rx(i, e), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(e) {
        if (this.form) {
          let i = this.form.get(e.path);
          i && ML(i, e) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        q_(this.form, this), this._oldForm && $f(this._oldForm, this);
      }
      static ɵfac = function (i) {
        return new (i || n)(ie(U_, 10), ie(z_, 10), ie(qf, 8));
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (i, r) {
          i & 1 &&
            me("submit", function (s) {
              return r.onSubmit(s);
            })("reset", function () {
              return r.onReset();
            });
        },
        inputs: { form: [0, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [ze([FL]), at, wt],
      });
    }
    return n;
  })();
var LL = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({});
  }
  return n;
})();
var ax = (() => {
  class n {
    static withConfig(e) {
      return {
        ngModule: n,
        providers: [{ provide: qf, useValue: e.callSetDisabledState ?? W_ }],
      };
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [LL] });
  }
  return n;
})();
var jL = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["ng-component"]],
        hostAttrs: ["cdk-text-field-style-loader", ""],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `textarea.cdk-textarea-autosize{resize:none}textarea.cdk-textarea-autosize-measuring{padding:2px 0 !important;box-sizing:content-box !important;height:auto !important;overflow:hidden !important}textarea.cdk-textarea-autosize-measuring-firefox{padding:2px 0 !important;box-sizing:content-box !important;height:0 !important}@keyframes cdk-text-field-autofill-start{/*!*/}@keyframes cdk-text-field-autofill-end{/*!*/}.cdk-text-field-autofill-monitored:-webkit-autofill{animation:cdk-text-field-autofill-start 0s 1ms}.cdk-text-field-autofill-monitored:not(:-webkit-autofill){animation:cdk-text-field-autofill-end 0s 1ms}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  BL = { passive: !0 },
  lx = (() => {
    class n {
      _platform = f(xe);
      _ngZone = f(M);
      _renderer = f(Se).createRenderer(null, null);
      _styleLoader = f(gt);
      _monitoredElements = new Map();
      constructor() {}
      monitor(e) {
        if (!this._platform.isBrowser) return ot;
        this._styleLoader.load(jL);
        let i = Ve(e),
          r = this._monitoredElements.get(i);
        if (r) return r.subject;
        let o = new E(),
          s = "cdk-text-field-autofilled",
          a = (c) => {
            c.animationName === "cdk-text-field-autofill-start" &&
            !i.classList.contains(s)
              ? (i.classList.add(s),
                this._ngZone.run(() =>
                  o.next({ target: c.target, isAutofilled: !0 })
                ))
              : c.animationName === "cdk-text-field-autofill-end" &&
                i.classList.contains(s) &&
                (i.classList.remove(s),
                this._ngZone.run(() =>
                  o.next({ target: c.target, isAutofilled: !1 })
                ));
          },
          l = this._ngZone.runOutsideAngular(
            () => (
              i.classList.add("cdk-text-field-autofill-monitored"),
              this._renderer.listen(i, "animationstart", a, BL)
            )
          );
        return this._monitoredElements.set(i, { subject: o, unlisten: l }), o;
      }
      stopMonitoring(e) {
        let i = Ve(e),
          r = this._monitoredElements.get(i);
        r &&
          (r.unlisten(),
          r.subject.complete(),
          i.classList.remove("cdk-text-field-autofill-monitored"),
          i.classList.remove("cdk-text-field-autofilled"),
          this._monitoredElements.delete(i));
      }
      ngOnDestroy() {
        this._monitoredElements.forEach((e, i) => this.stopMonitoring(i));
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var cx = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({});
  }
  return n;
})();
var dx = new y("MAT_INPUT_VALUE_ACCESSOR");
var Q_ = class {
    _box;
    _destroyed = new E();
    _resizeSubject = new E();
    _resizeObserver;
    _elementObservables = new Map();
    constructor(t) {
      (this._box = t),
        typeof ResizeObserver < "u" &&
          (this._resizeObserver = new ResizeObserver((e) =>
            this._resizeSubject.next(e)
          ));
    }
    observe(t) {
      return (
        this._elementObservables.has(t) ||
          this._elementObservables.set(
            t,
            new H((e) => {
              let i = this._resizeSubject.subscribe(e);
              return (
                this._resizeObserver?.observe(t, { box: this._box }),
                () => {
                  this._resizeObserver?.unobserve(t),
                    i.unsubscribe(),
                    this._elementObservables.delete(t);
                }
              );
            }).pipe(
              ve((e) => e.some((i) => i.target === t)),
              xc({ bufferSize: 1, refCount: !0 }),
              Ie(this._destroyed)
            )
          ),
        this._elementObservables.get(t)
      );
    }
    destroy() {
      this._destroyed.next(),
        this._destroyed.complete(),
        this._resizeSubject.complete(),
        this._elementObservables.clear();
    }
  },
  ux = (() => {
    class n {
      _cleanupErrorListener;
      _observers = new Map();
      _ngZone = f(M);
      constructor() {
        typeof ResizeObserver < "u";
      }
      ngOnDestroy() {
        for (let [, e] of this._observers) e.destroy();
        this._observers.clear(), this._cleanupErrorListener?.();
      }
      observe(e, i) {
        let r = i?.box || "content-box";
        return (
          this._observers.has(r) || this._observers.set(r, new Q_(r)),
          this._observers.get(r).observe(e)
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
    }
    return n;
  })();
var HL = ["notch"],
  UL = ["matFormFieldNotchedOutline", ""],
  zL = ["*"],
  fx = ["iconPrefixContainer"],
  hx = ["textPrefixContainer"],
  px = ["iconSuffixContainer"],
  mx = ["textSuffixContainer"],
  $L = ["textField"],
  GL = [
    "*",
    [["mat-label"]],
    [
      ["", "matPrefix", ""],
      ["", "matIconPrefix", ""],
    ],
    [["", "matTextPrefix", ""]],
    [["", "matTextSuffix", ""]],
    [
      ["", "matSuffix", ""],
      ["", "matIconSuffix", ""],
    ],
    [["mat-error"], ["", "matError", ""]],
    [["mat-hint", 3, "align", "end"]],
    [["mat-hint", "align", "end"]],
  ],
  WL = [
    "*",
    "mat-label",
    "[matPrefix], [matIconPrefix]",
    "[matTextPrefix]",
    "[matTextSuffix]",
    "[matSuffix], [matIconSuffix]",
    "mat-error, [matError]",
    "mat-hint:not([align='end'])",
    "mat-hint[align='end']",
  ];
function qL(n, t) {
  n & 1 && Le(0, "span", 20);
}
function YL(n, t) {
  if (
    (n & 1 && (D(0, "label", 19), oe(1, 1), Ge(2, qL, 1, 0, "span", 20), C()),
    n & 2)
  ) {
    let e = de(2);
    le("floating", e._shouldLabelFloat())("monitorResize", e._hasOutline())(
      "id",
      e._labelId
    ),
      De("for", e._control.disableAutomaticLabeling ? null : e._control.id),
      x(2),
      We(!e.hideRequiredMarker && e._control.required ? 2 : -1);
  }
}
function KL(n, t) {
  if ((n & 1 && Ge(0, YL, 3, 5, "label", 19), n & 2)) {
    let e = de();
    We(e._hasFloatingLabel() ? 0 : -1);
  }
}
function ZL(n, t) {
  n & 1 && Le(0, "div", 7);
}
function QL(n, t) {}
function XL(n, t) {
  if ((n & 1 && nt(0, QL, 0, 0, "ng-template", 13), n & 2)) {
    de(2);
    let e = Ko(1);
    le("ngTemplateOutlet", e);
  }
}
function JL(n, t) {
  if ((n & 1 && (D(0, "div", 9), Ge(1, XL, 1, 1, null, 13), C()), n & 2)) {
    let e = de();
    le("matFormFieldNotchedOutlineOpen", e._shouldLabelFloat()),
      x(),
      We(e._forceDisplayInfixLabel() ? -1 : 1);
  }
}
function eV(n, t) {
  n & 1 && (D(0, "div", 10, 2), oe(2, 2), C());
}
function tV(n, t) {
  n & 1 && (D(0, "div", 11, 3), oe(2, 3), C());
}
function nV(n, t) {}
function iV(n, t) {
  if ((n & 1 && nt(0, nV, 0, 0, "ng-template", 13), n & 2)) {
    de();
    let e = Ko(1);
    le("ngTemplateOutlet", e);
  }
}
function rV(n, t) {
  n & 1 && (D(0, "div", 14, 4), oe(2, 4), C());
}
function oV(n, t) {
  n & 1 && (D(0, "div", 15, 5), oe(2, 5), C());
}
function sV(n, t) {
  n & 1 && Le(0, "div", 16);
}
function aV(n, t) {
  n & 1 && oe(0, 6);
}
function lV(n, t) {
  if ((n & 1 && (D(0, "mat-hint", 21), U(1), C()), n & 2)) {
    let e = de(2);
    le("id", e._hintLabelId), x(), Oe(e.hintLabel);
  }
}
function cV(n, t) {
  if (
    (n & 1 &&
      (Ge(0, lV, 2, 2, "mat-hint", 21), oe(1, 7), Le(2, "div", 22), oe(3, 8)),
    n & 2)
  ) {
    let e = de();
    We(e.hintLabel ? 0 : -1);
  }
}
var X_ = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({ type: n, selectors: [["mat-label"]] });
    }
    return n;
  })(),
  dV = new y("MatError");
var J_ = (() => {
    class n {
      align = "start";
      id = f($t).getId("mat-mdc-hint-");
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["mat-hint"]],
        hostAttrs: [
          1,
          "mat-mdc-form-field-hint",
          "mat-mdc-form-field-bottom-align",
        ],
        hostVars: 4,
        hostBindings: function (i, r) {
          i & 2 &&
            (Wn("id", r.id),
            De("align", null),
            re("mat-mdc-form-field-hint-end", r.align === "end"));
        },
        inputs: { align: "align", id: "id" },
      });
    }
    return n;
  })(),
  uV = new y("MatPrefix");
var fV = new y("MatSuffix");
var Ex = new y("FloatingLabelParent"),
  gx = (() => {
    class n {
      _elementRef = f(K);
      get floating() {
        return this._floating;
      }
      set floating(e) {
        (this._floating = e), this.monitorResize && this._handleResize();
      }
      _floating = !1;
      get monitorResize() {
        return this._monitorResize;
      }
      set monitorResize(e) {
        (this._monitorResize = e),
          this._monitorResize
            ? this._subscribeToResize()
            : this._resizeSubscription.unsubscribe();
      }
      _monitorResize = !1;
      _resizeObserver = f(ux);
      _ngZone = f(M);
      _parent = f(Ex);
      _resizeSubscription = new W();
      constructor() {}
      ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
      }
      getWidth() {
        return hV(this._elementRef.nativeElement);
      }
      get element() {
        return this._elementRef.nativeElement;
      }
      _handleResize() {
        setTimeout(() => this._parent._handleLabelResized());
      }
      _subscribeToResize() {
        this._resizeSubscription.unsubscribe(),
          this._ngZone.runOutsideAngular(() => {
            this._resizeSubscription = this._resizeObserver
              .observe(this._elementRef.nativeElement, { box: "border-box" })
              .subscribe(() => this._handleResize());
          });
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["label", "matFormFieldFloatingLabel", ""]],
        hostAttrs: [1, "mdc-floating-label", "mat-mdc-floating-label"],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && re("mdc-floating-label--float-above", r.floating);
        },
        inputs: { floating: "floating", monitorResize: "monitorResize" },
      });
    }
    return n;
  })();
function hV(n) {
  let t = n;
  if (t.offsetParent !== null) return t.scrollWidth;
  let e = t.cloneNode(!0);
  e.style.setProperty("position", "absolute"),
    e.style.setProperty("transform", "translate(-9999px, -9999px)"),
    document.documentElement.appendChild(e);
  let i = e.scrollWidth;
  return e.remove(), i;
}
var vx = "mdc-line-ripple--active",
  Yf = "mdc-line-ripple--deactivating",
  _x = (() => {
    class n {
      _elementRef = f(K);
      _cleanupTransitionEnd;
      constructor() {
        let e = f(M),
          i = f(pt);
        e.runOutsideAngular(() => {
          this._cleanupTransitionEnd = i.listen(
            this._elementRef.nativeElement,
            "transitionend",
            this._handleTransitionEnd
          );
        });
      }
      activate() {
        let e = this._elementRef.nativeElement.classList;
        e.remove(Yf), e.add(vx);
      }
      deactivate() {
        this._elementRef.nativeElement.classList.add(Yf);
      }
      _handleTransitionEnd = (e) => {
        let i = this._elementRef.nativeElement.classList,
          r = i.contains(Yf);
        e.propertyName === "opacity" && r && i.remove(vx, Yf);
      };
      ngOnDestroy() {
        this._cleanupTransitionEnd();
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["div", "matFormFieldLineRipple", ""]],
        hostAttrs: [1, "mdc-line-ripple"],
      });
    }
    return n;
  })(),
  yx = (() => {
    class n {
      _elementRef = f(K);
      _ngZone = f(M);
      open = !1;
      _notch;
      ngAfterViewInit() {
        let e = this._elementRef.nativeElement,
          i = e.querySelector(".mdc-floating-label");
        i
          ? (e.classList.add("mdc-notched-outline--upgraded"),
            typeof requestAnimationFrame == "function" &&
              ((i.style.transitionDuration = "0s"),
              this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => (i.style.transitionDuration = ""));
              })))
          : e.classList.add("mdc-notched-outline--no-label");
      }
      _setNotchWidth(e) {
        let i = this._notch.nativeElement;
        !this.open || !e
          ? (i.style.width = "")
          : (i.style.width = `calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`);
      }
      _setMaxWidth(e) {
        this._notch.nativeElement.style.setProperty(
          "--mat-form-field-notch-max-width",
          `calc(100% - ${e}px)`
        );
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["div", "matFormFieldNotchedOutline", ""]],
        viewQuery: function (i, r) {
          if ((i & 1 && Et(HL, 5), i & 2)) {
            let o;
            ue((o = fe())) && (r._notch = o.first);
          }
        },
        hostAttrs: [1, "mdc-notched-outline"],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && re("mdc-notched-outline--notched", r.open);
        },
        inputs: { open: [0, "matFormFieldNotchedOutlineOpen", "open"] },
        attrs: UL,
        ngContentSelectors: zL,
        decls: 5,
        vars: 0,
        consts: [
          ["notch", ""],
          [1, "mat-mdc-notch-piece", "mdc-notched-outline__leading"],
          [1, "mat-mdc-notch-piece", "mdc-notched-outline__notch"],
          [1, "mat-mdc-notch-piece", "mdc-notched-outline__trailing"],
        ],
        template: function (i, r) {
          i & 1 &&
            (qe(),
            sn(0, "div", 1),
            Tt(1, "div", 2, 0),
            oe(3),
            Bt(),
            sn(4, "div", 3));
        },
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })(),
  ey = (() => {
    class n {
      value;
      stateChanges;
      id;
      placeholder;
      ngControl;
      focused;
      empty;
      shouldLabelFloat;
      required;
      disabled;
      errorState;
      controlType;
      autofilled;
      userAriaDescribedBy;
      disableAutomaticLabeling;
      describedByIds;
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({ type: n });
    }
    return n;
  })();
var ty = new y("MatFormField"),
  pV = new y("MAT_FORM_FIELD_DEFAULT_OPTIONS"),
  bx = "fill",
  mV = "auto",
  wx = "fixed",
  gV = "translateY(-50%)",
  Ol = (() => {
    class n {
      _elementRef = f(K);
      _changeDetectorRef = f(lt);
      _dir = f(un);
      _platform = f(xe);
      _idGenerator = f($t);
      _ngZone = f(M);
      _defaults = f(pV, { optional: !0 });
      _textField;
      _iconPrefixContainer;
      _textPrefixContainer;
      _iconSuffixContainer;
      _textSuffixContainer;
      _floatingLabel;
      _notchedOutline;
      _lineRipple;
      _iconPrefixContainerSignal = Sa("iconPrefixContainer");
      _textPrefixContainerSignal = Sa("textPrefixContainer");
      _iconSuffixContainerSignal = Sa("iconSuffixContainer");
      _textSuffixContainerSignal = Sa("textSuffixContainer");
      _prefixSuffixContainers = Sn(() =>
        [
          this._iconPrefixContainerSignal(),
          this._textPrefixContainerSignal(),
          this._iconSuffixContainerSignal(),
          this._textSuffixContainerSignal(),
        ]
          .map((e) => e?.nativeElement)
          .filter((e) => e !== void 0)
      );
      _formFieldControl;
      _prefixChildren;
      _suffixChildren;
      _errorChildren;
      _hintChildren;
      _labelChild = CD(X_);
      get hideRequiredMarker() {
        return this._hideRequiredMarker;
      }
      set hideRequiredMarker(e) {
        this._hideRequiredMarker = Ds(e);
      }
      _hideRequiredMarker = !1;
      color = "primary";
      get floatLabel() {
        return this._floatLabel || this._defaults?.floatLabel || mV;
      }
      set floatLabel(e) {
        e !== this._floatLabel &&
          ((this._floatLabel = e), this._changeDetectorRef.markForCheck());
      }
      _floatLabel;
      get appearance() {
        return this._appearanceSignal();
      }
      set appearance(e) {
        let i = e || this._defaults?.appearance || bx;
        this._appearanceSignal.set(i);
      }
      _appearanceSignal = Ne(bx);
      get subscriptSizing() {
        return this._subscriptSizing || this._defaults?.subscriptSizing || wx;
      }
      set subscriptSizing(e) {
        this._subscriptSizing = e || this._defaults?.subscriptSizing || wx;
      }
      _subscriptSizing = null;
      get hintLabel() {
        return this._hintLabel;
      }
      set hintLabel(e) {
        (this._hintLabel = e), this._processHints();
      }
      _hintLabel = "";
      _hasIconPrefix = !1;
      _hasTextPrefix = !1;
      _hasIconSuffix = !1;
      _hasTextSuffix = !1;
      _labelId = this._idGenerator.getId("mat-mdc-form-field-label-");
      _hintLabelId = this._idGenerator.getId("mat-mdc-hint-");
      _describedByIds;
      get _control() {
        return this._explicitFormFieldControl || this._formFieldControl;
      }
      set _control(e) {
        this._explicitFormFieldControl = e;
      }
      _destroyed = new E();
      _isFocused = null;
      _explicitFormFieldControl;
      _previousControl = null;
      _previousControlValidatorFn = null;
      _stateChanges;
      _valueChanges;
      _describedByChanges;
      _animationsDisabled = Jt();
      constructor() {
        let e = this._defaults;
        e &&
          (e.appearance && (this.appearance = e.appearance),
          (this._hideRequiredMarker = !!e?.hideRequiredMarker),
          e.color && (this.color = e.color)),
          this._syncOutlineLabelOffset();
      }
      ngAfterViewInit() {
        this._updateFocusState(),
          this._animationsDisabled ||
            this._ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this._elementRef.nativeElement.classList.add(
                  "mat-form-field-animations-enabled"
                );
              }, 300);
            }),
          this._changeDetectorRef.detectChanges();
      }
      ngAfterContentInit() {
        this._assertFormFieldControl(),
          this._initializeSubscript(),
          this._initializePrefixAndSuffix();
      }
      ngAfterContentChecked() {
        this._assertFormFieldControl(),
          this._control !== this._previousControl &&
            (this._initializeControl(this._previousControl),
            this._control.ngControl &&
              this._control.ngControl.control &&
              (this._previousControlValidatorFn =
                this._control.ngControl.control.validator),
            (this._previousControl = this._control)),
          this._control.ngControl &&
            this._control.ngControl.control &&
            this._control.ngControl.control.validator !==
              this._previousControlValidatorFn &&
            this._changeDetectorRef.markForCheck();
      }
      ngOnDestroy() {
        this._outlineLabelOffsetResizeObserver?.disconnect(),
          this._stateChanges?.unsubscribe(),
          this._valueChanges?.unsubscribe(),
          this._describedByChanges?.unsubscribe(),
          this._destroyed.next(),
          this._destroyed.complete();
      }
      getLabelId = Sn(() => (this._hasFloatingLabel() ? this._labelId : null));
      getConnectedOverlayOrigin() {
        return this._textField || this._elementRef;
      }
      _animateAndLockLabel() {
        this._hasFloatingLabel() && (this.floatLabel = "always");
      }
      _initializeControl(e) {
        let i = this._control,
          r = "mat-mdc-form-field-type-";
        e && this._elementRef.nativeElement.classList.remove(r + e.controlType),
          i.controlType &&
            this._elementRef.nativeElement.classList.add(r + i.controlType),
          this._stateChanges?.unsubscribe(),
          (this._stateChanges = i.stateChanges.subscribe(() => {
            this._updateFocusState(), this._changeDetectorRef.markForCheck();
          })),
          this._describedByChanges?.unsubscribe(),
          (this._describedByChanges = i.stateChanges
            .pipe(
              Xe([void 0, void 0]),
              R(() => [i.errorState, i.userAriaDescribedBy]),
              Sc(),
              ve(([[o, s], [a, l]]) => o !== a || s !== l)
            )
            .subscribe(() => this._syncDescribedByIds())),
          this._valueChanges?.unsubscribe(),
          i.ngControl &&
            i.ngControl.valueChanges &&
            (this._valueChanges = i.ngControl.valueChanges
              .pipe(Ie(this._destroyed))
              .subscribe(() => this._changeDetectorRef.markForCheck()));
      }
      _checkPrefixAndSuffixTypes() {
        (this._hasIconPrefix = !!this._prefixChildren.find((e) => !e._isText)),
          (this._hasTextPrefix = !!this._prefixChildren.find((e) => e._isText)),
          (this._hasIconSuffix = !!this._suffixChildren.find(
            (e) => !e._isText
          )),
          (this._hasTextSuffix = !!this._suffixChildren.find((e) => e._isText));
      }
      _initializePrefixAndSuffix() {
        this._checkPrefixAndSuffixTypes(),
          kt(
            this._prefixChildren.changes,
            this._suffixChildren.changes
          ).subscribe(() => {
            this._checkPrefixAndSuffixTypes(),
              this._changeDetectorRef.markForCheck();
          });
      }
      _initializeSubscript() {
        this._hintChildren.changes.subscribe(() => {
          this._processHints(), this._changeDetectorRef.markForCheck();
        }),
          this._errorChildren.changes.subscribe(() => {
            this._syncDescribedByIds(), this._changeDetectorRef.markForCheck();
          }),
          this._validateHints(),
          this._syncDescribedByIds();
      }
      _assertFormFieldControl() {
        this._control;
      }
      _updateFocusState() {
        this._control.focused && !this._isFocused
          ? ((this._isFocused = !0), this._lineRipple?.activate())
          : !this._control.focused &&
            (this._isFocused || this._isFocused === null) &&
            ((this._isFocused = !1), this._lineRipple?.deactivate()),
          this._textField?.nativeElement.classList.toggle(
            "mdc-text-field--focused",
            this._control.focused
          );
      }
      _outlineLabelOffsetResizeObserver = null;
      _syncOutlineLabelOffset() {
        xD({
          earlyRead: () => {
            if (this._appearanceSignal() !== "outline")
              return this._outlineLabelOffsetResizeObserver?.disconnect(), null;
            if (globalThis.ResizeObserver) {
              this._outlineLabelOffsetResizeObserver ||=
                new globalThis.ResizeObserver(() => {
                  this._writeOutlinedLabelStyles(
                    this._getOutlinedLabelOffset()
                  );
                });
              for (let e of this._prefixSuffixContainers())
                this._outlineLabelOffsetResizeObserver.observe(e, {
                  box: "border-box",
                });
            }
            return this._getOutlinedLabelOffset();
          },
          write: (e) => this._writeOutlinedLabelStyles(e()),
        });
      }
      _shouldAlwaysFloat() {
        return this.floatLabel === "always";
      }
      _hasOutline() {
        return this.appearance === "outline";
      }
      _forceDisplayInfixLabel() {
        return (
          !this._platform.isBrowser &&
          this._prefixChildren.length &&
          !this._shouldLabelFloat()
        );
      }
      _hasFloatingLabel = Sn(() => !!this._labelChild());
      _shouldLabelFloat() {
        return this._hasFloatingLabel()
          ? this._control.shouldLabelFloat || this._shouldAlwaysFloat()
          : !1;
      }
      _shouldForward(e) {
        let i = this._control ? this._control.ngControl : null;
        return i && i[e];
      }
      _getSubscriptMessageType() {
        return this._errorChildren &&
          this._errorChildren.length > 0 &&
          this._control.errorState
          ? "error"
          : "hint";
      }
      _handleLabelResized() {
        this._refreshOutlineNotchWidth();
      }
      _refreshOutlineNotchWidth() {
        !this._hasOutline() || !this._floatingLabel || !this._shouldLabelFloat()
          ? this._notchedOutline?._setNotchWidth(0)
          : this._notchedOutline?._setNotchWidth(
              this._floatingLabel.getWidth()
            );
      }
      _processHints() {
        this._validateHints(), this._syncDescribedByIds();
      }
      _validateHints() {
        this._hintChildren;
      }
      _syncDescribedByIds() {
        if (this._control) {
          let e = [];
          if (
            (this._control.userAriaDescribedBy &&
              typeof this._control.userAriaDescribedBy == "string" &&
              e.push(...this._control.userAriaDescribedBy.split(" ")),
            this._getSubscriptMessageType() === "hint")
          ) {
            let o = this._hintChildren
                ? this._hintChildren.find((a) => a.align === "start")
                : null,
              s = this._hintChildren
                ? this._hintChildren.find((a) => a.align === "end")
                : null;
            o ? e.push(o.id) : this._hintLabel && e.push(this._hintLabelId),
              s && e.push(s.id);
          } else
            this._errorChildren &&
              e.push(...this._errorChildren.map((o) => o.id));
          let i = this._control.describedByIds,
            r;
          if (i) {
            let o = this._describedByIds || e;
            r = e.concat(i.filter((s) => s && !o.includes(s)));
          } else r = e;
          this._control.setDescribedByIds(r), (this._describedByIds = e);
        }
      }
      _getOutlinedLabelOffset() {
        let e = this._dir.valueSignal();
        if (!this._hasOutline() || !this._floatingLabel) return null;
        if (!this._iconPrefixContainer && !this._textPrefixContainer)
          return ["", null];
        if (!this._isAttachedToDom()) return null;
        let i = this._iconPrefixContainer?.nativeElement,
          r = this._textPrefixContainer?.nativeElement,
          o = this._iconSuffixContainer?.nativeElement,
          s = this._textSuffixContainer?.nativeElement,
          a = i?.getBoundingClientRect().width ?? 0,
          l = r?.getBoundingClientRect().width ?? 0,
          c = o?.getBoundingClientRect().width ?? 0,
          d = s?.getBoundingClientRect().width ?? 0,
          u = e === "rtl" ? "-1" : "1",
          p = `${a + l}px`,
          m = `calc(${u} * (${p} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,
          g = `var(--mat-mdc-form-field-label-transform, ${gV} translateX(${m}))`,
          w = a + l + c + d;
        return [g, w];
      }
      _writeOutlinedLabelStyles(e) {
        if (e !== null) {
          let [i, r] = e;
          this._floatingLabel &&
            (this._floatingLabel.element.style.transform = i),
            r !== null && this._notchedOutline?._setMaxWidth(r);
        }
      }
      _isAttachedToDom() {
        let e = this._elementRef.nativeElement;
        if (e.getRootNode) {
          let i = e.getRootNode();
          return i && i !== e;
        }
        return document.documentElement.contains(e);
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵcmp = Z({
        type: n,
        selectors: [["mat-form-field"]],
        contentQueries: function (i, r, o) {
          if (
            (i & 1 &&
              (cg(o, r._labelChild, X_, 5),
              Ue(o, ey, 5),
              Ue(o, uV, 5),
              Ue(o, fV, 5),
              Ue(o, dV, 5),
              Ue(o, J_, 5)),
            i & 2)
          ) {
            Hd();
            let s;
            ue((s = fe())) && (r._formFieldControl = s.first),
              ue((s = fe())) && (r._prefixChildren = s),
              ue((s = fe())) && (r._suffixChildren = s),
              ue((s = fe())) && (r._errorChildren = s),
              ue((s = fe())) && (r._hintChildren = s);
          }
        },
        viewQuery: function (i, r) {
          if (
            (i & 1 &&
              (Yo(r._iconPrefixContainerSignal, fx, 5),
              Yo(r._textPrefixContainerSignal, hx, 5),
              Yo(r._iconSuffixContainerSignal, px, 5),
              Yo(r._textSuffixContainerSignal, mx, 5),
              Et($L, 5),
              Et(fx, 5),
              Et(hx, 5),
              Et(px, 5),
              Et(mx, 5),
              Et(gx, 5),
              Et(yx, 5),
              Et(_x, 5)),
            i & 2)
          ) {
            Hd(4);
            let o;
            ue((o = fe())) && (r._textField = o.first),
              ue((o = fe())) && (r._iconPrefixContainer = o.first),
              ue((o = fe())) && (r._textPrefixContainer = o.first),
              ue((o = fe())) && (r._iconSuffixContainer = o.first),
              ue((o = fe())) && (r._textSuffixContainer = o.first),
              ue((o = fe())) && (r._floatingLabel = o.first),
              ue((o = fe())) && (r._notchedOutline = o.first),
              ue((o = fe())) && (r._lineRipple = o.first);
          }
        },
        hostAttrs: [1, "mat-mdc-form-field"],
        hostVars: 40,
        hostBindings: function (i, r) {
          i & 2 &&
            re("mat-mdc-form-field-label-always-float", r._shouldAlwaysFloat())(
              "mat-mdc-form-field-has-icon-prefix",
              r._hasIconPrefix
            )("mat-mdc-form-field-has-icon-suffix", r._hasIconSuffix)(
              "mat-form-field-invalid",
              r._control.errorState
            )("mat-form-field-disabled", r._control.disabled)(
              "mat-form-field-autofilled",
              r._control.autofilled
            )("mat-form-field-appearance-fill", r.appearance == "fill")(
              "mat-form-field-appearance-outline",
              r.appearance == "outline"
            )(
              "mat-form-field-hide-placeholder",
              r._hasFloatingLabel() && !r._shouldLabelFloat()
            )("mat-focused", r._control.focused)(
              "mat-primary",
              r.color !== "accent" && r.color !== "warn"
            )("mat-accent", r.color === "accent")(
              "mat-warn",
              r.color === "warn"
            )("ng-untouched", r._shouldForward("untouched"))(
              "ng-touched",
              r._shouldForward("touched")
            )("ng-pristine", r._shouldForward("pristine"))(
              "ng-dirty",
              r._shouldForward("dirty")
            )("ng-valid", r._shouldForward("valid"))(
              "ng-invalid",
              r._shouldForward("invalid")
            )("ng-pending", r._shouldForward("pending"));
        },
        inputs: {
          hideRequiredMarker: "hideRequiredMarker",
          color: "color",
          floatLabel: "floatLabel",
          appearance: "appearance",
          subscriptSizing: "subscriptSizing",
          hintLabel: "hintLabel",
        },
        exportAs: ["matFormField"],
        features: [
          ze([
            { provide: ty, useExisting: n },
            { provide: Ex, useExisting: n },
          ]),
        ],
        ngContentSelectors: WL,
        decls: 19,
        vars: 25,
        consts: [
          ["labelTemplate", ""],
          ["textField", ""],
          ["iconPrefixContainer", ""],
          ["textPrefixContainer", ""],
          ["textSuffixContainer", ""],
          ["iconSuffixContainer", ""],
          [1, "mat-mdc-text-field-wrapper", "mdc-text-field", 3, "click"],
          [1, "mat-mdc-form-field-focus-overlay"],
          [1, "mat-mdc-form-field-flex"],
          [
            "matFormFieldNotchedOutline",
            "",
            3,
            "matFormFieldNotchedOutlineOpen",
          ],
          [1, "mat-mdc-form-field-icon-prefix"],
          [1, "mat-mdc-form-field-text-prefix"],
          [1, "mat-mdc-form-field-infix"],
          [3, "ngTemplateOutlet"],
          [1, "mat-mdc-form-field-text-suffix"],
          [1, "mat-mdc-form-field-icon-suffix"],
          ["matFormFieldLineRipple", ""],
          [
            1,
            "mat-mdc-form-field-subscript-wrapper",
            "mat-mdc-form-field-bottom-align",
          ],
          ["aria-atomic", "true", "aria-live", "polite"],
          [
            "matFormFieldFloatingLabel",
            "",
            3,
            "floating",
            "monitorResize",
            "id",
          ],
          [
            "aria-hidden",
            "true",
            1,
            "mat-mdc-form-field-required-marker",
            "mdc-floating-label--required",
          ],
          [3, "id"],
          [1, "mat-mdc-form-field-hint-spacer"],
        ],
        template: function (i, r) {
          if (i & 1) {
            let o = Gn();
            qe(GL),
              nt(0, KL, 1, 1, "ng-template", null, 0, hg),
              D(2, "div", 6, 1),
              me("click", function (a) {
                return Je(o), et(r._control.onContainerClick(a));
              }),
              Ge(4, ZL, 1, 0, "div", 7),
              D(5, "div", 8),
              Ge(6, JL, 2, 2, "div", 9),
              Ge(7, eV, 3, 0, "div", 10),
              Ge(8, tV, 3, 0, "div", 11),
              D(9, "div", 12),
              Ge(10, iV, 1, 1, null, 13),
              oe(11),
              C(),
              Ge(12, rV, 3, 0, "div", 14),
              Ge(13, oV, 3, 0, "div", 15),
              C(),
              Ge(14, sV, 1, 0, "div", 16),
              C(),
              D(15, "div", 17)(16, "div", 18),
              Ge(17, aV, 1, 0)(18, cV, 4, 1),
              C()();
          }
          if (i & 2) {
            let o;
            x(2),
              re("mdc-text-field--filled", !r._hasOutline())(
                "mdc-text-field--outlined",
                r._hasOutline()
              )("mdc-text-field--no-label", !r._hasFloatingLabel())(
                "mdc-text-field--disabled",
                r._control.disabled
              )("mdc-text-field--invalid", r._control.errorState),
              x(2),
              We(!r._hasOutline() && !r._control.disabled ? 4 : -1),
              x(2),
              We(r._hasOutline() ? 6 : -1),
              x(),
              We(r._hasIconPrefix ? 7 : -1),
              x(),
              We(r._hasTextPrefix ? 8 : -1),
              x(2),
              We(!r._hasOutline() || r._forceDisplayInfixLabel() ? 10 : -1),
              x(2),
              We(r._hasTextSuffix ? 12 : -1),
              x(),
              We(r._hasIconSuffix ? 13 : -1),
              x(),
              We(r._hasOutline() ? -1 : 14),
              x(),
              re(
                "mat-mdc-form-field-subscript-dynamic-size",
                r.subscriptSizing === "dynamic"
              );
            let s = r._getSubscriptMessageType();
            x(),
              re("mat-mdc-form-field-error-wrapper", s === "error")(
                "mat-mdc-form-field-hint-wrapper",
                s === "hint"
              ),
              x(),
              We((o = s) === "error" ? 17 : o === "hint" ? 18 : -1);
          }
        },
        dependencies: [gx, yx, Ag, _x, J_],
        styles: [
          `.mdc-text-field{display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-text-field__input{width:100%;min-width:0;border:none;border-radius:0;background:none;padding:0;-moz-appearance:none;-webkit-appearance:none;height:28px}.mdc-text-field__input::-webkit-calendar-picker-indicator,.mdc-text-field__input::-webkit-search-cancel-button{display:none}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}.mdc-text-field__input::placeholder{opacity:0}.mdc-text-field__input::-moz-placeholder{opacity:0}.mdc-text-field__input::-webkit-input-placeholder{opacity:0}.mdc-text-field__input:-ms-input-placeholder{opacity:0}.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{opacity:1}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder{opacity:0}.mdc-text-field--outlined .mdc-text-field__input,.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:rgba(0,0,0,0)}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-filled-caret-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error))}.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--filled{height:56px;border-bottom-right-radius:0;border-bottom-left-radius:0;border-top-left-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled{background-color:var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent))}.mdc-text-field--outlined{height:56px;overflow:visible;padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px)}[dir=rtl] .mdc-text-field--outlined{padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}.mdc-floating-label{position:absolute;left:0;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}[dir=rtl] .mdc-floating-label{right:0;left:auto;transform-origin:right top;text-align:right}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:auto}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:auto;right:4px}.mdc-text-field--filled .mdc-floating-label{left:16px;right:auto}[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:auto;right:16px}.mdc-text-field--disabled .mdc-floating-label{cursor:default}@media(forced-colors: active){.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--filled .mdc-floating-label{font-family:var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined .mdc-floating-label{font-family:var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-floating-label--float-above{cursor:auto;transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1);font-size:.75rem}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.3333333333%}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:1px;margin-right:0;content:"*"}[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:0;margin-right:1px}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mat-mdc-notch-piece{box-sizing:border-box;height:100%;pointer-events:none;border-top:1px solid;border-bottom:1px solid}.mdc-text-field--focused .mat-mdc-notch-piece{border-width:2px}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));border-width:var(--mat-form-field-outlined-outline-width, 1px)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary))}.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece{border-width:var(--mat-form-field-outlined-focus-outline-width, 2px)}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid;border-bottom-left-radius:0;border-top-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__trailing{flex-grow:1;border-left:none;border-right:1px solid;border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__notch{flex:0 0 auto;width:auto}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:min(var(--mat-form-field-notch-max-width, 100%),calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{max-width:min(100%,calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{z-index:1;border-bottom-width:var(--mat-form-field-filled-active-indicator-height, 1px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container))}.mdc-line-ripple::after{transform:scaleX(0);opacity:0;z-index:2}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-width:var(--mat-form-field-filled-focus-active-indicator-height, 2px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error))}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-text-field--disabled{pointer-events:none}.mat-mdc-form-field-textarea-control{vertical-align:middle;resize:vertical;box-sizing:border-box;height:auto;margin:0;padding:0;border:none;overflow:auto}.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font:inherit;letter-spacing:inherit;text-decoration:inherit;text-transform:inherit;border:none}.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;line-height:normal;pointer-events:all;will-change:auto}.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label{cursor:inherit}.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control{height:auto}.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color]{height:23px}.mat-mdc-text-field-wrapper{height:auto;flex:auto;will-change:auto}.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-left:0;--mat-mdc-form-field-label-offset-x: -16px}.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-right:0}[dir=rtl] .mat-mdc-text-field-wrapper{padding-left:16px;padding-right:16px}[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-left:0}[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-right:0}.mat-form-field-disabled .mdc-text-field__input::placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label{left:auto;right:auto}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input{display:inline-block}.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch{padding-top:0}.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:1px solid rgba(0,0,0,0)}[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:none;border-right:1px solid rgba(0,0,0,0)}.mat-mdc-form-field-infix{min-height:var(--mat-form-field-container-height, 56px);padding-top:var(--mat-form-field-filled-with-label-container-padding-top, 24px);padding-bottom:var(--mat-form-field-filled-with-label-container-padding-bottom, 8px)}.mdc-text-field--outlined .mat-mdc-form-field-infix,.mdc-text-field--no-label .mat-mdc-form-field-infix{padding-top:var(--mat-form-field-container-vertical-padding, 16px);padding-bottom:var(--mat-form-field-container-vertical-padding, 16px)}.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label{top:calc(var(--mat-form-field-container-height, 56px)/2)}.mdc-text-field--filled .mat-mdc-floating-label{display:var(--mat-form-field-filled-label-display, block)}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{--mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1)) scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));transform:var(--mat-mdc-form-field-label-transform)}@keyframes _mat-form-field-subscript-animation{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.mat-mdc-form-field-subscript-wrapper{box-sizing:border-box;width:100%;position:relative}.mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-error-wrapper{position:absolute;top:0;left:0;right:0;padding:0 16px;opacity:1;transform:translateY(0);animation:_mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper{position:static}.mat-mdc-form-field-bottom-align::before{content:"";display:inline-block;height:16px}.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before{content:unset}.mat-mdc-form-field-hint-end{order:1}.mat-mdc-form-field-hint-wrapper{display:flex}.mat-mdc-form-field-hint-spacer{flex:1 0 1em}.mat-mdc-form-field-error{display:block;color:var(--mat-form-field-error-text-color, var(--mat-sys-error))}.mat-mdc-form-field-subscript-wrapper,.mat-mdc-form-field-bottom-align::before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));letter-spacing:var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));font-weight:var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight))}.mat-mdc-form-field-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;opacity:0;pointer-events:none;background-color:var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface))}.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-focus-state-layer-opacity, 0)}select.mat-mdc-form-field-input-control{-moz-appearance:none;-webkit-appearance:none;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box}select.mat-mdc-form-field-input-control:not(:disabled){cursor:pointer}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option{color:var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10))}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled{color:var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;right:0;top:50%;margin-top:-2.5px;pointer-events:none;color:var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{right:auto;left:0}.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after{color:var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after{color:var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:15px}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:0;padding-left:15px}@media(forced-colors: active){.mat-form-field-appearance-fill .mat-mdc-text-field-wrapper{outline:solid 1px}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper{outline-color:GrayText}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper{outline:dashed 3px}}@media(forced-colors: active){.mat-mdc-form-field.mat-focused .mdc-notched-outline{border:dashed 3px}}.mat-mdc-form-field-input-control[type=date],.mat-mdc-form-field-input-control[type=datetime],.mat-mdc-form-field-input-control[type=datetime-local],.mat-mdc-form-field-input-control[type=month],.mat-mdc-form-field-input-control[type=week],.mat-mdc-form-field-input-control[type=time]{line-height:1}.mat-mdc-form-field-input-control::-webkit-datetime-edit{line-height:1;padding:0;margin-bottom:-2px}.mat-mdc-form-field{--mat-mdc-form-field-floating-label-scale: 0.75;display:inline-flex;flex-direction:column;min-width:0;text-align:left;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));font-weight:var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above{font-size:calc(var(--mat-form-field-outlined-label-text-populated-size)*var(--mat-mdc-form-field-floating-label-scale))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:var(--mat-form-field-outlined-label-text-populated-size)}[dir=rtl] .mat-mdc-form-field{text-align:right}.mat-mdc-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-mdc-text-field-wrapper{width:100%;z-index:0}.mat-mdc-form-field-icon-prefix,.mat-mdc-form-field-icon-suffix{align-self:center;line-height:0;pointer-events:auto;position:relative;z-index:1}.mat-mdc-form-field-icon-prefix>.mat-icon,.mat-mdc-form-field-icon-suffix>.mat-icon{padding:0 12px;box-sizing:content-box}.mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-invalid .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error))}.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container))}.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error))}.mat-mdc-form-field-icon-prefix,[dir=rtl] .mat-mdc-form-field-icon-suffix{padding:0 4px 0 0}.mat-mdc-form-field-icon-suffix,[dir=rtl] .mat-mdc-form-field-icon-prefix{padding:0 0 0 4px}.mat-mdc-form-field-subscript-wrapper .mat-icon,.mat-mdc-form-field label .mat-icon{width:1em;height:1em;font-size:inherit}.mat-mdc-form-field-infix{flex:auto;min-width:0;width:180px;position:relative;box-sizing:border-box}.mat-mdc-form-field-infix:has(textarea[cols]){width:auto}.mat-mdc-form-field .mdc-notched-outline__notch{margin-left:-1px;-webkit-clip-path:inset(-9em -999em -9em 1px);clip-path:inset(-9em -999em -9em 1px)}[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch{margin-left:0;margin-right:-1px;-webkit-clip-path:inset(-9em 1px -9em -999em);clip-path:inset(-9em 1px -9em -999em)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label{transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input{transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper{animation-duration:300ms}.mdc-notched-outline .mdc-floating-label{max-width:calc(100% + 1px)}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(133.3333333333% + 1px)}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return n;
  })();
var Kf = (() => {
  class n {
    isErrorState(e, i) {
      return !!(e && e.invalid && (e.touched || (i && i.submitted)));
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
  }
  return n;
})();
var Zf = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = !1;
  matcher;
  constructor(t, e, i, r, o) {
    (this._defaultMatcher = t),
      (this.ngControl = e),
      (this._parentFormGroup = i),
      (this._parentForm = r),
      (this._stateChanges = o);
  }
  updateErrorState() {
    let t = this.errorState,
      e = this._parentFormGroup || this._parentForm,
      i = this.matcher || this._defaultMatcher,
      r = this.ngControl ? this.ngControl.control : null,
      o = i?.isErrorState(r, e) ?? !1;
    o !== t && ((this.errorState = o), this._stateChanges.next());
  }
};
var As = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({ imports: [ke, $I, Ol, ke] });
  }
  return n;
})();
var vV = [
    "button",
    "checkbox",
    "file",
    "hidden",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
  ],
  _V = new y("MAT_INPUT_CONFIG"),
  Dx = (() => {
    class n {
      _elementRef = f(K);
      _platform = f(xe);
      ngControl = f(uo, { optional: !0, self: !0 });
      _autofillMonitor = f(lx);
      _ngZone = f(M);
      _formField = f(ty, { optional: !0 });
      _renderer = f(pt);
      _uid = f($t).getId("mat-input-");
      _previousNativeValue;
      _inputValueAccessor;
      _signalBasedValueAccessor;
      _previousPlaceholder;
      _errorStateTracker;
      _config = f(_V, { optional: !0 });
      _cleanupIosKeyup;
      _cleanupWebkitWheel;
      _isServer;
      _isNativeSelect;
      _isTextarea;
      _isInFormField;
      focused = !1;
      stateChanges = new E();
      controlType = "mat-input";
      autofilled = !1;
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        (this._disabled = Ds(e)),
          this.focused && ((this.focused = !1), this.stateChanges.next());
      }
      _disabled = !1;
      get id() {
        return this._id;
      }
      set id(e) {
        this._id = e || this._uid;
      }
      _id;
      placeholder;
      name;
      get required() {
        return (
          this._required ??
          this.ngControl?.control?.hasValidator(kf.required) ??
          !1
        );
      }
      set required(e) {
        this._required = Ds(e);
      }
      _required;
      get type() {
        return this._type;
      }
      set type(e) {
        (this._type = e || "text"),
          this._validateType(),
          !this._isTextarea &&
            E_().has(this._type) &&
            (this._elementRef.nativeElement.type = this._type);
      }
      _type = "text";
      get errorStateMatcher() {
        return this._errorStateTracker.matcher;
      }
      set errorStateMatcher(e) {
        this._errorStateTracker.matcher = e;
      }
      userAriaDescribedBy;
      get value() {
        return this._signalBasedValueAccessor
          ? this._signalBasedValueAccessor.value()
          : this._inputValueAccessor.value;
      }
      set value(e) {
        e !== this.value &&
          (this._signalBasedValueAccessor
            ? this._signalBasedValueAccessor.value.set(e)
            : (this._inputValueAccessor.value = e),
          this.stateChanges.next());
      }
      get readonly() {
        return this._readonly;
      }
      set readonly(e) {
        this._readonly = Ds(e);
      }
      _readonly = !1;
      disabledInteractive;
      get errorState() {
        return this._errorStateTracker.errorState;
      }
      set errorState(e) {
        this._errorStateTracker.errorState = e;
      }
      _neverEmptyInputTypes = [
        "date",
        "datetime",
        "datetime-local",
        "month",
        "time",
        "week",
      ].filter((e) => E_().has(e));
      constructor() {
        let e = f(Y_, { optional: !0 }),
          i = f(Z_, { optional: !0 }),
          r = f(Kf),
          o = f(dx, { optional: !0, self: !0 }),
          s = this._elementRef.nativeElement,
          a = s.nodeName.toLowerCase();
        o
          ? zi(o.value)
            ? (this._signalBasedValueAccessor = o)
            : (this._inputValueAccessor = o)
          : (this._inputValueAccessor = s),
          (this._previousNativeValue = this.value),
          (this.id = this.id),
          this._platform.IOS &&
            this._ngZone.runOutsideAngular(() => {
              this._cleanupIosKeyup = this._renderer.listen(
                s,
                "keyup",
                this._iOSKeyupListener
              );
            }),
          (this._errorStateTracker = new Zf(
            r,
            this.ngControl,
            i,
            e,
            this.stateChanges
          )),
          (this._isServer = !this._platform.isBrowser),
          (this._isNativeSelect = a === "select"),
          (this._isTextarea = a === "textarea"),
          (this._isInFormField = !!this._formField),
          (this.disabledInteractive = this._config?.disabledInteractive || !1),
          this._isNativeSelect &&
            (this.controlType = s.multiple
              ? "mat-native-select-multiple"
              : "mat-native-select"),
          this._signalBasedValueAccessor &&
            Ea(() => {
              this._signalBasedValueAccessor.value(), this.stateChanges.next();
            });
      }
      ngAfterViewInit() {
        this._platform.isBrowser &&
          this._autofillMonitor
            .monitor(this._elementRef.nativeElement)
            .subscribe((e) => {
              (this.autofilled = e.isAutofilled), this.stateChanges.next();
            });
      }
      ngOnChanges() {
        this.stateChanges.next();
      }
      ngOnDestroy() {
        this.stateChanges.complete(),
          this._platform.isBrowser &&
            this._autofillMonitor.stopMonitoring(
              this._elementRef.nativeElement
            ),
          this._cleanupIosKeyup?.(),
          this._cleanupWebkitWheel?.();
      }
      ngDoCheck() {
        this.ngControl &&
          (this.updateErrorState(),
          this.ngControl.disabled !== null &&
            this.ngControl.disabled !== this.disabled &&
            ((this.disabled = this.ngControl.disabled),
            this.stateChanges.next())),
          this._dirtyCheckNativeValue(),
          this._dirtyCheckPlaceholder();
      }
      focus(e) {
        this._elementRef.nativeElement.focus(e);
      }
      updateErrorState() {
        this._errorStateTracker.updateErrorState();
      }
      _focusChanged(e) {
        if (e !== this.focused) {
          if (
            !this._isNativeSelect &&
            e &&
            this.disabled &&
            this.disabledInteractive
          ) {
            let i = this._elementRef.nativeElement;
            i.type === "number"
              ? ((i.type = "text"),
                i.setSelectionRange(0, 0),
                (i.type = "number"))
              : i.setSelectionRange(0, 0);
          }
          (this.focused = e), this.stateChanges.next();
        }
      }
      _onInput() {}
      _dirtyCheckNativeValue() {
        let e = this._elementRef.nativeElement.value;
        this._previousNativeValue !== e &&
          ((this._previousNativeValue = e), this.stateChanges.next());
      }
      _dirtyCheckPlaceholder() {
        let e = this._getPlaceholder();
        if (e !== this._previousPlaceholder) {
          let i = this._elementRef.nativeElement;
          (this._previousPlaceholder = e),
            e
              ? i.setAttribute("placeholder", e)
              : i.removeAttribute("placeholder");
        }
      }
      _getPlaceholder() {
        return this.placeholder || null;
      }
      _validateType() {
        vV.indexOf(this._type) > -1;
      }
      _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
      }
      _isBadInput() {
        let e = this._elementRef.nativeElement.validity;
        return e && e.badInput;
      }
      get empty() {
        return (
          !this._isNeverEmpty() &&
          !this._elementRef.nativeElement.value &&
          !this._isBadInput() &&
          !this.autofilled
        );
      }
      get shouldLabelFloat() {
        if (this._isNativeSelect) {
          let e = this._elementRef.nativeElement,
            i = e.options[0];
          return (
            this.focused ||
            e.multiple ||
            !this.empty ||
            !!(e.selectedIndex > -1 && i && i.label)
          );
        } else return (this.focused && !this.disabled) || !this.empty;
      }
      get describedByIds() {
        return (
          this._elementRef.nativeElement
            .getAttribute("aria-describedby")
            ?.split(" ") || []
        );
      }
      setDescribedByIds(e) {
        let i = this._elementRef.nativeElement;
        e.length
          ? i.setAttribute("aria-describedby", e.join(" "))
          : i.removeAttribute("aria-describedby");
      }
      onContainerClick() {
        this.focused || this.focus();
      }
      _isInlineSelect() {
        let e = this._elementRef.nativeElement;
        return this._isNativeSelect && (e.multiple || e.size > 1);
      }
      _iOSKeyupListener = (e) => {
        let i = e.target;
        !i.value &&
          i.selectionStart === 0 &&
          i.selectionEnd === 0 &&
          (i.setSelectionRange(1, 1), i.setSelectionRange(0, 0));
      };
      _getReadonlyAttribute() {
        return this._isNativeSelect
          ? null
          : this.readonly || (this.disabled && this.disabledInteractive)
          ? "true"
          : null;
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [
          ["input", "matInput", ""],
          ["textarea", "matInput", ""],
          ["select", "matNativeControl", ""],
          ["input", "matNativeControl", ""],
          ["textarea", "matNativeControl", ""],
        ],
        hostAttrs: [1, "mat-mdc-input-element"],
        hostVars: 21,
        hostBindings: function (i, r) {
          i & 1 &&
            me("focus", function () {
              return r._focusChanged(!0);
            })("blur", function () {
              return r._focusChanged(!1);
            })("input", function () {
              return r._onInput();
            }),
            i & 2 &&
              (Wn("id", r.id)("disabled", r.disabled && !r.disabledInteractive)(
                "required",
                r.required
              ),
              De("name", r.name || null)("readonly", r._getReadonlyAttribute())(
                "aria-disabled",
                r.disabled && r.disabledInteractive ? "true" : null
              )("aria-invalid", r.empty && r.required ? null : r.errorState)(
                "aria-required",
                r.required
              )("id", r.id),
              re("mat-input-server", r._isServer)(
                "mat-mdc-form-field-textarea-control",
                r._isInFormField && r._isTextarea
              )("mat-mdc-form-field-input-control", r._isInFormField)(
                "mat-mdc-input-disabled-interactive",
                r.disabledInteractive
              )("mdc-text-field__input", r._isInFormField)(
                "mat-mdc-native-select-inline",
                r._isInlineSelect()
              ));
        },
        inputs: {
          disabled: "disabled",
          id: "id",
          placeholder: "placeholder",
          name: "name",
          required: "required",
          type: "type",
          errorStateMatcher: "errorStateMatcher",
          userAriaDescribedBy: [0, "aria-describedby", "userAriaDescribedBy"],
          value: "value",
          readonly: "readonly",
          disabledInteractive: [
            2,
            "disabledInteractive",
            "disabledInteractive",
            se,
          ],
        },
        exportAs: ["matInput"],
        features: [ze([{ provide: ey, useExisting: n }]), wt],
      });
    }
    return n;
  })(),
  Cx = (() => {
    class n {
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵmod = X({ type: n });
      static ɵinj = Y({ imports: [ke, As, As, cx, ke] });
    }
    return n;
  })();
var bV = [
    "*",
    [["mat-chip-avatar"], ["", "matChipAvatar", ""]],
    [
      ["mat-chip-trailing-icon"],
      ["", "matChipRemove", ""],
      ["", "matChipTrailingIcon", ""],
    ],
  ],
  wV = [
    "*",
    "mat-chip-avatar, [matChipAvatar]",
    "mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]",
  ];
function EV(n, t) {
  n & 1 && (D(0, "span", 3), oe(1, 1), C());
}
function DV(n, t) {
  n & 1 && (D(0, "span", 6), oe(1, 2), C());
}
var CV = ["*"];
var IV = new y("mat-chips-default-options", {
    providedIn: "root",
    factory: () => ({ separatorKeyCodes: [13] }),
  }),
  Ix = new y("MatChipAvatar"),
  Sx = new y("MatChipTrailingIcon"),
  xx = new y("MatChipEdit"),
  Mx = new y("MatChipRemove"),
  Rx = new y("MatChip"),
  Tx = (() => {
    class n {
      _elementRef = f(K);
      _parentChip = f(Rx);
      isInteractive = !0;
      _isPrimary = !0;
      _isLeading = !1;
      get disabled() {
        return this._disabled || this._parentChip?.disabled || !1;
      }
      set disabled(e) {
        this._disabled = e;
      }
      _disabled = !1;
      tabIndex = -1;
      _allowFocusWhenDisabled = !1;
      _getDisabledAttribute() {
        return this.disabled && !this._allowFocusWhenDisabled ? "" : null;
      }
      _getTabindex() {
        return (this.disabled && !this._allowFocusWhenDisabled) ||
          !this.isInteractive
          ? null
          : this.tabIndex.toString();
      }
      constructor() {
        f(gt).load(so),
          this._elementRef.nativeElement.nodeName === "BUTTON" &&
            this._elementRef.nativeElement.setAttribute("type", "button");
      }
      focus() {
        this._elementRef.nativeElement.focus();
      }
      _handleClick(e) {
        !this.disabled &&
          this.isInteractive &&
          this._isPrimary &&
          (e.preventDefault(),
          this._parentChip._handlePrimaryActionInteraction());
      }
      _handleKeydown(e) {
        (e.keyCode === 13 || e.keyCode === 32) &&
          !this.disabled &&
          this.isInteractive &&
          this._isPrimary &&
          !this._parentChip._isEditing &&
          (e.preventDefault(),
          this._parentChip._handlePrimaryActionInteraction());
      }
      static ɵfac = function (i) {
        return new (i || n)();
      };
      static ɵdir = L({
        type: n,
        selectors: [["", "matChipAction", ""]],
        hostAttrs: [1, "mdc-evolution-chip__action", "mat-mdc-chip-action"],
        hostVars: 11,
        hostBindings: function (i, r) {
          i & 1 &&
            me("click", function (s) {
              return r._handleClick(s);
            })("keydown", function (s) {
              return r._handleKeydown(s);
            }),
            i & 2 &&
              (De("tabindex", r._getTabindex())(
                "disabled",
                r._getDisabledAttribute()
              )("aria-disabled", r.disabled),
              re("mdc-evolution-chip__action--primary", r._isPrimary)(
                "mdc-evolution-chip__action--presentational",
                !r.isInteractive
              )("mdc-evolution-chip__action--secondary", !r._isPrimary)(
                "mdc-evolution-chip__action--trailing",
                !r._isPrimary && !r._isLeading
              ));
        },
        inputs: {
          isInteractive: "isInteractive",
          disabled: [2, "disabled", "disabled", se],
          tabIndex: [
            2,
            "tabIndex",
            "tabIndex",
            (e) => (e == null ? -1 : Gr(e)),
          ],
          _allowFocusWhenDisabled: "_allowFocusWhenDisabled",
        },
      });
    }
    return n;
  })();
var ny = (() => {
  class n {
    _changeDetectorRef = f(lt);
    _elementRef = f(K);
    _tagName = f(Ig);
    _ngZone = f(M);
    _focusMonitor = f(or);
    _globalRippleOptions = f(El, { optional: !0 });
    _document = f(O);
    _onFocus = new E();
    _onBlur = new E();
    _isBasicChip;
    role = null;
    _hasFocusInternal = !1;
    _pendingFocus;
    _actionChanges;
    _animationsDisabled = Jt();
    _allLeadingIcons;
    _allTrailingIcons;
    _allEditIcons;
    _allRemoveIcons;
    _hasFocus() {
      return this._hasFocusInternal;
    }
    id = f($t).getId("mat-mdc-chip-");
    ariaLabel = null;
    ariaDescription = null;
    _ariaDescriptionId = `${this.id}-aria-description`;
    _chipListDisabled = !1;
    _textElement;
    get value() {
      return this._value !== void 0
        ? this._value
        : this._textElement.textContent.trim();
    }
    set value(e) {
      this._value = e;
    }
    _value;
    color;
    removable = !0;
    highlighted = !1;
    disableRipple = !1;
    get disabled() {
      return this._disabled || this._chipListDisabled;
    }
    set disabled(e) {
      this._disabled = e;
    }
    _disabled = !1;
    removed = new j();
    destroyed = new j();
    basicChipAttrName = "mat-basic-chip";
    leadingIcon;
    editIcon;
    trailingIcon;
    removeIcon;
    primaryAction;
    _rippleLoader = f(yf);
    _injector = f(te);
    constructor() {
      let e = f(gt);
      e.load(so),
        e.load(HI),
        this._monitorFocus(),
        this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
          className: "mat-mdc-chip-ripple",
          disabled: this._isRippleDisabled(),
        });
    }
    ngOnInit() {
      this._isBasicChip =
        this._elementRef.nativeElement.hasAttribute(this.basicChipAttrName) ||
        this._tagName.toLowerCase() === this.basicChipAttrName;
    }
    ngAfterViewInit() {
      (this._textElement = this._elementRef.nativeElement.querySelector(
        ".mat-mdc-chip-action-label"
      )),
        this._pendingFocus && ((this._pendingFocus = !1), this.focus());
    }
    ngAfterContentInit() {
      this._actionChanges = kt(
        this._allLeadingIcons.changes,
        this._allTrailingIcons.changes,
        this._allEditIcons.changes,
        this._allRemoveIcons.changes
      ).subscribe(() => this._changeDetectorRef.markForCheck());
    }
    ngDoCheck() {
      this._rippleLoader.setDisabled(
        this._elementRef.nativeElement,
        this._isRippleDisabled()
      );
    }
    ngOnDestroy() {
      this._focusMonitor.stopMonitoring(this._elementRef),
        this._rippleLoader?.destroyRipple(this._elementRef.nativeElement),
        this._actionChanges?.unsubscribe(),
        this.destroyed.emit({ chip: this }),
        this.destroyed.complete();
    }
    remove() {
      this.removable && this.removed.emit({ chip: this });
    }
    _isRippleDisabled() {
      return (
        this.disabled ||
        this.disableRipple ||
        this._animationsDisabled ||
        this._isBasicChip ||
        !!this._globalRippleOptions?.disabled
      );
    }
    _hasTrailingIcon() {
      return !!(this.trailingIcon || this.removeIcon);
    }
    _handleKeydown(e) {
      ((e.keyCode === 8 && !e.repeat) || e.keyCode === 46) &&
        (e.preventDefault(), this.remove());
    }
    focus() {
      this.disabled ||
        (this.primaryAction
          ? this.primaryAction.focus()
          : (this._pendingFocus = !0));
    }
    _getSourceAction(e) {
      return this._getActions().find((i) => {
        let r = i._elementRef.nativeElement;
        return r === e || r.contains(e);
      });
    }
    _getActions() {
      let e = [];
      return (
        this.editIcon && e.push(this.editIcon),
        this.primaryAction && e.push(this.primaryAction),
        this.removeIcon && e.push(this.removeIcon),
        this.trailingIcon && e.push(this.trailingIcon),
        e
      );
    }
    _handlePrimaryActionInteraction() {}
    _edit(e) {}
    _monitorFocus() {
      this._focusMonitor.monitor(this._elementRef, !0).subscribe((e) => {
        let i = e !== null;
        i !== this._hasFocusInternal &&
          ((this._hasFocusInternal = i),
          i
            ? this._onFocus.next({ chip: this })
            : (this._changeDetectorRef.markForCheck(),
              setTimeout(() =>
                this._ngZone.run(() => this._onBlur.next({ chip: this }))
              )));
      });
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵcmp = Z({
      type: n,
      selectors: [
        ["mat-basic-chip"],
        ["", "mat-basic-chip", ""],
        ["mat-chip"],
        ["", "mat-chip", ""],
      ],
      contentQueries: function (i, r, o) {
        if (
          (i & 1 &&
            (Ue(o, Ix, 5),
            Ue(o, xx, 5),
            Ue(o, Sx, 5),
            Ue(o, Mx, 5),
            Ue(o, Ix, 5),
            Ue(o, Sx, 5),
            Ue(o, xx, 5),
            Ue(o, Mx, 5)),
          i & 2)
        ) {
          let s;
          ue((s = fe())) && (r.leadingIcon = s.first),
            ue((s = fe())) && (r.editIcon = s.first),
            ue((s = fe())) && (r.trailingIcon = s.first),
            ue((s = fe())) && (r.removeIcon = s.first),
            ue((s = fe())) && (r._allLeadingIcons = s),
            ue((s = fe())) && (r._allTrailingIcons = s),
            ue((s = fe())) && (r._allEditIcons = s),
            ue((s = fe())) && (r._allRemoveIcons = s);
        }
      },
      viewQuery: function (i, r) {
        if ((i & 1 && Et(Tx, 5), i & 2)) {
          let o;
          ue((o = fe())) && (r.primaryAction = o.first);
        }
      },
      hostAttrs: [1, "mat-mdc-chip"],
      hostVars: 31,
      hostBindings: function (i, r) {
        i & 1 &&
          me("keydown", function (s) {
            return r._handleKeydown(s);
          }),
          i & 2 &&
            (Wn("id", r.id),
            De("role", r.role)("aria-label", r.ariaLabel),
            In("mat-" + (r.color || "primary")),
            re("mdc-evolution-chip", !r._isBasicChip)(
              "mdc-evolution-chip--disabled",
              r.disabled
            )("mdc-evolution-chip--with-trailing-action", r._hasTrailingIcon())(
              "mdc-evolution-chip--with-primary-graphic",
              r.leadingIcon
            )("mdc-evolution-chip--with-primary-icon", r.leadingIcon)(
              "mdc-evolution-chip--with-avatar",
              r.leadingIcon
            )("mat-mdc-chip-with-avatar", r.leadingIcon)(
              "mat-mdc-chip-highlighted",
              r.highlighted
            )("mat-mdc-chip-disabled", r.disabled)(
              "mat-mdc-basic-chip",
              r._isBasicChip
            )("mat-mdc-standard-chip", !r._isBasicChip)(
              "mat-mdc-chip-with-trailing-icon",
              r._hasTrailingIcon()
            )("_mat-animation-noopable", r._animationsDisabled));
      },
      inputs: {
        role: "role",
        id: "id",
        ariaLabel: [0, "aria-label", "ariaLabel"],
        ariaDescription: [0, "aria-description", "ariaDescription"],
        value: "value",
        color: "color",
        removable: [2, "removable", "removable", se],
        highlighted: [2, "highlighted", "highlighted", se],
        disableRipple: [2, "disableRipple", "disableRipple", se],
        disabled: [2, "disabled", "disabled", se],
      },
      outputs: { removed: "removed", destroyed: "destroyed" },
      exportAs: ["matChip"],
      features: [ze([{ provide: Rx, useExisting: n }])],
      ngContentSelectors: wV,
      decls: 8,
      vars: 3,
      consts: [
        [1, "mat-mdc-chip-focus-overlay"],
        [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary"],
        ["matChipAction", "", 3, "isInteractive"],
        [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"],
        [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"],
        [1, "mat-mdc-chip-primary-focus-indicator", "mat-focus-indicator"],
        [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"],
      ],
      template: function (i, r) {
        i & 1 &&
          (qe(bV),
          Le(0, "span", 0),
          D(1, "span", 1)(2, "span", 2),
          Ge(3, EV, 2, 0, "span", 3),
          D(4, "span", 4),
          oe(5),
          Le(6, "span", 5),
          C()()(),
          Ge(7, DV, 2, 0, "span", 6)),
          i & 2 &&
            (x(2),
            le("isInteractive", !1),
            x(),
            We(r.leadingIcon ? 3 : -1),
            x(4),
            We(r._hasTrailingIcon() ? 7 : -1));
      },
      dependencies: [Tx],
      styles: [
        `.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return n;
})();
var Ax = (() => {
  class n {
    _elementRef = f(K);
    _changeDetectorRef = f(lt);
    _dir = f(un, { optional: !0 });
    _lastDestroyedFocusedChipIndex = null;
    _keyManager;
    _destroyed = new E();
    _defaultRole = "presentation";
    get chipFocusChanges() {
      return this._getChipStream((e) => e._onFocus);
    }
    get chipDestroyedChanges() {
      return this._getChipStream((e) => e.destroyed);
    }
    get chipRemovedChanges() {
      return this._getChipStream((e) => e.removed);
    }
    get disabled() {
      return this._disabled;
    }
    set disabled(e) {
      (this._disabled = e), this._syncChipsState();
    }
    _disabled = !1;
    get empty() {
      return !this._chips || this._chips.length === 0;
    }
    get role() {
      return this._explicitRole
        ? this._explicitRole
        : this.empty
        ? null
        : this._defaultRole;
    }
    tabIndex = 0;
    set role(e) {
      this._explicitRole = e;
    }
    _explicitRole = null;
    get focused() {
      return this._hasFocusedChip();
    }
    _chips;
    _chipActions = new En();
    constructor() {}
    ngAfterViewInit() {
      this._setUpFocusManagement(),
        this._trackChipSetChanges(),
        this._trackDestroyedFocusedChip();
    }
    ngOnDestroy() {
      this._keyManager?.destroy(),
        this._chipActions.destroy(),
        this._destroyed.next(),
        this._destroyed.complete();
    }
    _hasFocusedChip() {
      return this._chips && this._chips.some((e) => e._hasFocus());
    }
    _syncChipsState() {
      this._chips?.forEach((e) => {
        (e._chipListDisabled = this._disabled),
          e._changeDetectorRef.markForCheck();
      });
    }
    focus() {}
    _handleKeydown(e) {
      this._originatesFromChip(e) && this._keyManager.onKeydown(e);
    }
    _isValidIndex(e) {
      return e >= 0 && e < this._chips.length;
    }
    _allowFocusEscape() {
      let e = this._elementRef.nativeElement.tabIndex;
      e !== -1 &&
        ((this._elementRef.nativeElement.tabIndex = -1),
        setTimeout(() => (this._elementRef.nativeElement.tabIndex = e)));
    }
    _getChipStream(e) {
      return this._chips.changes.pipe(
        Xe(null),
        Be(() => kt(...this._chips.map(e)))
      );
    }
    _originatesFromChip(e) {
      let i = e.target;
      for (; i && i !== this._elementRef.nativeElement; ) {
        if (i.classList.contains("mat-mdc-chip")) return !0;
        i = i.parentElement;
      }
      return !1;
    }
    _setUpFocusManagement() {
      this._chips.changes.pipe(Xe(this._chips)).subscribe((e) => {
        let i = [];
        e.forEach((r) => r._getActions().forEach((o) => i.push(o))),
          this._chipActions.reset(i),
          this._chipActions.notifyOnChanges();
      }),
        (this._keyManager = new oo(this._chipActions)
          .withVerticalOrientation()
          .withHorizontalOrientation(this._dir ? this._dir.value : "ltr")
          .withHomeAndEnd()
          .skipPredicate((e) => this._skipPredicate(e))),
        this.chipFocusChanges
          .pipe(Ie(this._destroyed))
          .subscribe(({ chip: e }) => {
            let i = e._getSourceAction(document.activeElement);
            i && this._keyManager.updateActiveItem(i);
          }),
        this._dir?.change
          .pipe(Ie(this._destroyed))
          .subscribe((e) => this._keyManager.withHorizontalOrientation(e));
    }
    _skipPredicate(e) {
      return !e.isInteractive || e.disabled;
    }
    _trackChipSetChanges() {
      this._chips.changes.pipe(Xe(null), Ie(this._destroyed)).subscribe(() => {
        this.disabled && Promise.resolve().then(() => this._syncChipsState()),
          this._redirectDestroyedChipFocus();
      });
    }
    _trackDestroyedFocusedChip() {
      this.chipDestroyedChanges.pipe(Ie(this._destroyed)).subscribe((e) => {
        let r = this._chips.toArray().indexOf(e.chip);
        this._isValidIndex(r) &&
          e.chip._hasFocus() &&
          (this._lastDestroyedFocusedChipIndex = r);
      });
    }
    _redirectDestroyedChipFocus() {
      if (this._lastDestroyedFocusedChipIndex != null) {
        if (this._chips.length) {
          let e = Math.min(
              this._lastDestroyedFocusedChipIndex,
              this._chips.length - 1
            ),
            i = this._chips.toArray()[e];
          i.disabled
            ? this._chips.length === 1
              ? this.focus()
              : this._keyManager.setPreviousItemActive()
            : i.focus();
        } else this.focus();
        this._lastDestroyedFocusedChipIndex = null;
      }
    }
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵcmp = Z({
      type: n,
      selectors: [["mat-chip-set"]],
      contentQueries: function (i, r, o) {
        if ((i & 1 && Ue(o, ny, 5), i & 2)) {
          let s;
          ue((s = fe())) && (r._chips = s);
        }
      },
      hostAttrs: [1, "mat-mdc-chip-set", "mdc-evolution-chip-set"],
      hostVars: 1,
      hostBindings: function (i, r) {
        i & 1 &&
          me("keydown", function (s) {
            return r._handleKeydown(s);
          }),
          i & 2 && De("role", r.role);
      },
      inputs: {
        disabled: [2, "disabled", "disabled", se],
        role: "role",
        tabIndex: [2, "tabIndex", "tabIndex", (e) => (e == null ? 0 : Gr(e))],
      },
      ngContentSelectors: CV,
      decls: 2,
      vars: 0,
      consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
      template: function (i, r) {
        i & 1 && (qe(), Tt(0, "div", 0), oe(1), Bt());
      },
      styles: [
        `.mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return n;
})();
var Nx = (() => {
  class n {
    static ɵfac = function (i) {
      return new (i || n)();
    };
    static ɵmod = X({ type: n });
    static ɵinj = Y({
      providers: [Kf, { provide: IV, useValue: { separatorKeyCodes: [13] } }],
      imports: [ke, Cs, ke],
    });
  }
  return n;
})();
function xV(n, t) {
  if ((n & 1 && (D(0, "div", 8)(1, "p"), U(2), C()()), n & 2)) {
    let e = de();
    x(2), Oe(e.card.content);
  }
}
function MV(n, t) {
  if (n & 1) {
    let e = Gn();
    D(0, "div", 9)(1, "mat-form-field", 10)(2, "textarea", 11),
      $d("ngModelChange", function (r) {
        Je(e);
        let o = de();
        return dg(o.card.content, r) || (o.card.content = r), et(r);
      }),
      me("keydown.enter", function (r) {
        return Je(e), et(r.stopPropagation());
      }),
      C()()();
  }
  if (n & 2) {
    let e = de();
    x(2), zd("ngModel", e.card.content);
  }
}
function TV(n, t) {
  if ((n & 1 && (D(0, "mat-chip"), U(1), C()), n & 2)) {
    let e = t.$implicit;
    x(), Oe(e);
  }
}
function RV(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 12)(1, "mat-chip-set"),
      nt(2, TV, 2, 1, "mat-chip", 13),
      C()()),
    n & 2)
  ) {
    let e = de();
    x(2), le("ngForOf", e.card.tags);
  }
}
function AV(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 14)(1, "mat-icon"),
      U(2, "flag"),
      C(),
      D(3, "span"),
      U(4),
      ba(5, "titlecase"),
      C()()),
    n & 2)
  ) {
    let e = de();
    x(), In("priority-" + e.card.priority), x(3), Oe(ug(5, 3, e.card.priority));
  }
}
var Qf = class n {
  card;
  updateCard = new j();
  deleteCard = new j();
  toggleEdit() {
    (this.card.isEditing = !this.card.isEditing),
      this.card.isEditing ||
        ((this.card.updatedAt = new Date()), this.updateCard.emit(this.card));
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = Z({
    type: n,
    selectors: [["app-notes-card"]],
    inputs: { card: "card" },
    outputs: { updateCard: "updateCard", deleteCard: "deleteCard" },
    decls: 16,
    vars: 9,
    consts: [
      [1, "notes-card"],
      [1, "actions"],
      ["mat-icon-button", "", 3, "click"],
      ["mat-icon-button", "", "aria-label", "Delete", 3, "click"],
      ["class", "content", 4, "ngIf"],
      ["class", "edit-content", 4, "ngIf"],
      ["class", "tags", 4, "ngIf"],
      ["class", "priority", 4, "ngIf"],
      [1, "content"],
      [1, "edit-content"],
      ["appearance", "outline", 1, "full-width"],
      [
        "matInput",
        "",
        "placeholder",
        "Write your notes here...",
        "rows",
        "4",
        3,
        "ngModelChange",
        "keydown.enter",
        "ngModel",
      ],
      [1, "tags"],
      [4, "ngFor", "ngForOf"],
      [1, "priority"],
    ],
    template: function (e, i) {
      e & 1 &&
        (D(0, "mat-card", 0)(1, "mat-card-header")(2, "mat-card-title"),
        U(3),
        C(),
        D(4, "div", 1)(5, "button", 2),
        me("click", function () {
          return i.toggleEdit();
        }),
        D(6, "mat-icon"),
        U(7),
        C()(),
        D(8, "button", 3),
        me("click", function () {
          return i.deleteCard.emit(i.card.id);
        }),
        D(9, "mat-icon"),
        U(10, "delete"),
        C()()()(),
        D(11, "mat-card-content"),
        nt(12, xV, 3, 1, "div", 4)(13, MV, 3, 1, "div", 5)(
          14,
          RV,
          3,
          1,
          "div",
          6
        )(15, AV, 6, 5, "div", 7),
        C()()),
        e & 2 &&
          (pi("background-color", i.card.color),
          x(3),
          Oe(i.card.title),
          x(2),
          De("aria-label", i.card.isEditing ? "Save" : "Edit"),
          x(2),
          Oe(i.card.isEditing ? "save" : "edit"),
          x(5),
          le("ngIf", !i.card.isEditing),
          x(),
          le("ngIf", i.card.isEditing),
          x(),
          le("ngIf", i.card.tags && i.card.tags.length > 0),
          x(),
          le("ngIf", i.card.priority));
    },
    dependencies: [
      qn,
      Xi,
      vi,
      ax,
      Gf,
      ex,
      K_,
      ar,
      _s,
      bs,
      ws,
      ys,
      cr,
      lr,
      Is,
      M_,
      Cx,
      Dx,
      Ol,
      As,
      Nx,
      ny,
      Ax,
      Ng,
    ],
    styles: [
      ".notes-card[_ngcontent-%COMP%]{width:250px;min-height:200px;margin:8px;cursor:move}mat-card-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.actions[_ngcontent-%COMP%]{display:flex;gap:4px}.content[_ngcontent-%COMP%]{margin-bottom:16px;min-height:80px;white-space:pre-wrap}.edit-content[_ngcontent-%COMP%]{margin-bottom:16px}.full-width[_ngcontent-%COMP%]{width:100%}.tags[_ngcontent-%COMP%]{margin-bottom:8px}.priority[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;font-size:.9em}.priority-low[_ngcontent-%COMP%]{color:#4caf50}.priority-medium[_ngcontent-%COMP%]{color:#ff9800}.priority-high[_ngcontent-%COMP%]{color:#f44336}",
    ],
    changeDetection: 0,
  });
};
function NV(n, t) {
  n & 1 && (D(0, "div", 9)(1, "mat-icon"), U(2, "rss_feed"), C()());
}
function OV(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 10)(1, "mat-icon"),
      U(2, "person"),
      C(),
      D(3, "span"),
      U(4),
      C()()),
    n & 2)
  ) {
    let e = de();
    x(4), Oe(e.card.newsData.author);
  }
}
function kV(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 11)(1, "mat-icon"),
      U(2, "category"),
      C(),
      D(3, "span"),
      U(4),
      C()()),
    n & 2)
  ) {
    let e = de();
    x(4), Oe(e.card.newsData.category);
  }
}
var Xf = class n {
  card;
  openArticle(t) {
    window.open(t, "_blank");
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = Z({
    type: n,
    selectors: [["app-news-card"]],
    inputs: { card: "card" },
    decls: 26,
    vars: 13,
    consts: [
      [1, "news-card"],
      ["class", "news-image", 4, "ngIf"],
      [1, "headline"],
      [1, "summary"],
      [1, "meta"],
      ["class", "author", 4, "ngIf"],
      [1, "published"],
      ["class", "category", 4, "ngIf"],
      ["mat-button", "", 3, "click"],
      [1, "news-image"],
      [1, "author"],
      [1, "category"],
    ],
    template: function (e, i) {
      e & 1 &&
        (D(0, "mat-card", 0)(1, "mat-card-header")(2, "mat-card-title"),
        U(3),
        C(),
        D(4, "mat-card-subtitle"),
        U(5),
        C()(),
        D(6, "mat-card-content"),
        nt(7, NV, 3, 0, "div", 1),
        D(8, "div", 2),
        U(9),
        C(),
        D(10, "div", 3),
        U(11),
        C(),
        D(12, "div", 4),
        nt(13, OV, 5, 1, "div", 5),
        D(14, "div", 6)(15, "mat-icon"),
        U(16, "schedule"),
        C(),
        D(17, "span"),
        U(18),
        ba(19, "date"),
        C()(),
        nt(20, kV, 5, 1, "div", 7),
        C()(),
        D(21, "mat-card-actions")(22, "button", 8),
        me("click", function () {
          return i.openArticle(i.card.newsData.url);
        }),
        D(23, "mat-icon"),
        U(24, "open_in_new"),
        C(),
        U(25, " Read More "),
        C()()()),
        e & 2 &&
          (pi("background-color", i.card.color),
          x(3),
          Oe(i.card.title),
          x(2),
          Oe(i.card.newsData.source),
          x(2),
          le("ngIf", i.card.newsData.imageUrl),
          x(2),
          Oe(i.card.newsData.headline),
          x(2),
          Oe(i.card.newsData.summary),
          x(2),
          le("ngIf", i.card.newsData.author),
          x(5),
          Oe(fg(19, 10, i.card.newsData.publishedAt, "short")),
          x(2),
          le("ngIf", i.card.newsData.category));
    },
    dependencies: [qn, vi, ar, _s, KI, bs, ws, pf, ys, cr, lr, Is, bf, Og],
    styles: [
      ".news-card[_ngcontent-%COMP%]{width:280px;min-height:300px;margin:8px;cursor:move}.news-image[_ngcontent-%COMP%]{margin-bottom:12px}.news-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:120px;object-fit:cover;border-radius:4px}.headline[_ngcontent-%COMP%]{font-size:1.1em;font-weight:700;margin-bottom:8px;line-height:1.3;color:#333}.summary[_ngcontent-%COMP%]{font-size:.9em;color:#666;margin-bottom:12px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.meta[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;font-size:.8em;color:#888}.meta[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px}.meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:16px;width:16px;height:16px}mat-card-actions[_ngcontent-%COMP%]{padding:8px 16px}mat-card-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px}",
    ],
    changeDetection: 0,
  });
};
var Jf = class n {
  getWeatherData() {
    return I([
      {
        id: 1001,
        title: "Current Weather",
        color: "#2196f3",
        type: "weather",
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        weatherData: {
          temperature: 22,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
          location: "New York, NY",
          icon: "partly_cloudy_day",
          forecast: [
            { day: "Today", high: 25, low: 18, condition: "Sunny" },
            { day: "Tomorrow", high: 23, low: 16, condition: "Cloudy" },
            { day: "Friday", high: 20, low: 14, condition: "Rainy" },
          ],
        },
      },
      {
        id: 1002,
        title: "London Weather",
        color: "#607d8b",
        type: "weather",
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        weatherData: {
          temperature: 15,
          condition: "Rainy",
          humidity: 85,
          windSpeed: 18,
          location: "London, UK",
          icon: "rainy",
          forecast: [
            { day: "Today", high: 17, low: 12, condition: "Rainy" },
            { day: "Tomorrow", high: 19, low: 14, condition: "Cloudy" },
            { day: "Friday", high: 21, low: 16, condition: "Sunny" },
          ],
        },
      },
    ]);
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
};
var eh = class n {
  getNewsData() {
    let t = [
      {
        id: 2001,
        title: "No News Service Detected",
        color: "#ff9800",
        type: "news",
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        newsData: {
          headline: "No News service Detected",
          summary: "No News service Detected",
          author: "REOJ",
          publishedAt: new Date(Date.now() - 72e5),
          source: "Github",
          url: "https://github.com/reoj/",
        },
      },
    ];
    return I(t);
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
};
var th = class n {
  notesStorage = [
    {
      id: 3001,
      title: "Daily Tasks",
      color: "#ffeb3b",
      type: "notes",
      position: { x: 0, y: 0 },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1e3),
      updatedAt: new Date(),
      content: `Review project documentation
Prepare for team meeting
Update task status`,
      tags: ["work", "tasks"],
      priority: "high",
    },
    {
      id: 3002,
      title: "Ideas",
      color: "#e1bee7",
      type: "notes",
      position: { x: 0, y: 0 },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
      updatedAt: new Date(),
      content: `Mobile app concept: Location-based reminders
Integrate with calendar
Add voice notes feature`,
      tags: ["ideas", "mobile"],
      priority: "medium",
    },
    {
      id: 3003,
      title: "Shopping List",
      color: "#c8e6c9",
      type: "notes",
      position: { x: 0, y: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      content: `Milk
Bread
Eggs
Apples
Chicken breast`,
      tags: ["shopping", "grocery"],
      priority: "low",
    },
  ];
  getNotesData() {
    return I([...this.notesStorage]);
  }
  createNote(t) {
    let e = {
      id: Date.now(),
      title: t.title || "New Note",
      color: t.color || "#ffeb3b",
      type: "notes",
      position: t.position || { x: 0, y: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      content: t.content || "",
      tags: t.tags || [],
      priority: t.priority || "medium",
    };
    return this.notesStorage.push(e), I(e);
  }
  updateNote(t) {
    let e = this.notesStorage.findIndex((i) => i.id === t.id);
    return e !== -1
      ? ((this.notesStorage[e] = B(_({}, t), { updatedAt: new Date() })),
        I(this.notesStorage[e]))
      : I(t);
  }
  deleteNote(t) {
    let e = this.notesStorage.findIndex((i) => i.id === t);
    return e !== -1 ? (this.notesStorage.splice(e, 1), I(!0)) : I(!1);
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵprov = b({ token: n, factory: n.ɵfac, providedIn: "root" });
};
function VV(n, t) {
  if ((n & 1 && Le(0, "app-weather-card", 13), n & 2)) {
    let e = de().$implicit;
    le("card", e);
  }
}
function jV(n, t) {
  if (n & 1) {
    let e = Gn();
    D(0, "app-notes-card", 14),
      me("updateCard", function (r) {
        Je(e);
        let o = de(2);
        return et(o.updateNotesCard(r));
      })("deleteCard", function (r) {
        Je(e);
        let o = de(2);
        return et(o.removeCard(r));
      }),
      C();
  }
  if (n & 2) {
    let e = de().$implicit;
    le("card", e);
  }
}
function BV(n, t) {
  if ((n & 1 && Le(0, "app-news-card", 13), n & 2)) {
    let e = de().$implicit;
    le("card", e);
  }
}
function HV(n, t) {
  if (
    (n & 1 &&
      (D(0, "div", 8)(1, "div", 9),
      Le(2, "mat-icon", 10),
      C(),
      nt(3, VV, 1, 1, "app-weather-card", 11)(
        4,
        jV,
        1,
        1,
        "app-notes-card",
        12
      )(5, BV, 1, 1, "app-news-card", 11),
      C()),
    n & 2)
  ) {
    let e = t.$implicit;
    re("cdk-drag-animating", !0),
      x(3),
      le("ngIf", e.type === "weather"),
      x(),
      le("ngIf", e.type === "notes"),
      x(),
      le("ngIf", e.type === "news");
  }
}
var nh = class n {
  constructor(t, e, i) {
    this.weatherService = t;
    this.newsService = e;
    this.notesService = i;
  }
  cards = Ne([]);
  ngOnInit() {
    this.loadCards();
  }
  loadCards() {
    Er({
      weather: this.weatherService.getWeatherData(),
      news: this.newsService.getNewsData(),
      notes: this.notesService.getNotesData(),
    }).subscribe(({ weather: t, news: e, notes: i }) => {
      let r = [...t, ...e, ...i];
      this.cards.set(r);
    });
  }
  drop(t) {
    let e = this.cards();
    lf(e, t.previousIndex, t.currentIndex), this.cards.set([...e]);
  }
  addWeatherCard() {
    console.log("Add weather card functionality");
  }
  addNewsCard() {
    console.log("Add news card functionality");
  }
  addNotesCard() {
    this.notesService
      .createNote({
        title: `Note ${
          this.cards().filter((t) => t.type === "notes").length + 1
        }`,
        content: "New note content...",
        color: this.getRandomColor(),
        tags: [],
        priority: "medium",
      })
      .subscribe((t) => {
        this.cards.update((e) => [...e, t]);
      });
  }
  updateNotesCard(t) {
    this.notesService.updateNote(t).subscribe((e) => {
      this.cards.update((i) => i.map((r) => (r.id === e.id ? e : r)));
    });
  }
  removeCard(t) {
    this.cards().find((i) => i.id === t)?.type === "notes"
      ? this.notesService.deleteNote(t).subscribe(() => {
          this.cards.update((i) => i.filter((r) => r.id !== t));
        })
      : this.cards.update((i) => i.filter((r) => r.id !== t));
  }
  trackByCardId(t, e) {
    return e.id;
  }
  getRandomColor() {
    let t = [
      "#ffeb3b",
      "#4caf50",
      "#2196f3",
      "#ff9800",
      "#9c27b0",
      "#f44336",
      "#00bcd4",
      "#ff5722",
    ];
    return t[Math.floor(Math.random() * t.length)];
  }
  static ɵfac = function (e) {
    return new (e || n)(ie(Jf), ie(eh), ie(th));
  };
  static ɵcmp = Z({
    type: n,
    selectors: [["app-sticky-cards"]],
    decls: 23,
    vars: 3,
    consts: [
      ["addMenu", "matMenu"],
      [1, "sticky-cards-container"],
      [1, "header"],
      [
        "mat-raised-button",
        "",
        "color",
        "primary",
        1,
        "add-button",
        3,
        "matMenuTriggerFor",
      ],
      ["aria-hidden", "false", "aria-label", "Add icon", "fontIcon", "add"],
      ["mat-menu-item", "", 3, "click"],
      ["cdkDropList", "", 1, "cards-grid", 3, "cdkDropListDropped"],
      [
        "cdkDrag",
        "",
        "class",
        "card-wrapper",
        3,
        "cdk-drag-animating",
        4,
        "ngFor",
        "ngForOf",
        "ngForTrackBy",
      ],
      ["cdkDrag", "", 1, "card-wrapper"],
      ["cdkDragHandle", "", 1, "drag-handle"],
      [
        "fontIcon",
        "drag_indicator",
        "aria-hidden",
        "false",
        "aria-label",
        "Drag handle",
      ],
      [3, "card", 4, "ngIf"],
      [3, "card", "updateCard", "deleteCard", 4, "ngIf"],
      [3, "card"],
      [3, "updateCard", "deleteCard", "card"],
    ],
    template: function (e, i) {
      if (e & 1) {
        let r = Gn();
        D(0, "div", 1)(1, "div", 2)(2, "h1"),
          U(3, "Make IT a great day!"),
          C(),
          D(4, "button", 3),
          Le(5, "mat-icon", 4),
          U(6, " Add Card "),
          C(),
          D(7, "mat-menu", null, 0)(9, "button", 5),
          me("click", function () {
            return Je(r), et(i.addWeatherCard());
          }),
          D(10, "mat-icon"),
          U(11, "wb_sunny"),
          C(),
          U(12, " Weather Card "),
          C(),
          D(13, "button", 5),
          me("click", function () {
            return Je(r), et(i.addNotesCard());
          }),
          D(14, "mat-icon"),
          U(15, "note"),
          C(),
          U(16, " Notes Card "),
          C(),
          D(17, "button", 5),
          me("click", function () {
            return Je(r), et(i.addNewsCard());
          }),
          D(18, "mat-icon"),
          U(19, "article"),
          C(),
          U(20, " News Card "),
          C()()(),
          D(21, "div", 6),
          me("cdkDropListDropped", function (s) {
            return Je(r), et(i.drop(s));
          }),
          nt(22, HV, 6, 5, "div", 7),
          C()();
      }
      if (e & 2) {
        let r = Ko(8);
        x(4),
          le("matMenuTriggerFor", r),
          x(18),
          le("ngForOf", i.cards())("ngForTrackBy", i.trackByCardId);
      }
    },
    dependencies: [
      qn,
      Xi,
      vi,
      ar,
      cr,
      lr,
      Is,
      bf,
      OS,
      Ms,
      xl,
      NS,
      kI,
      OI,
      RI,
      Nf,
      Qf,
      Xf,
    ],
    styles: [
      ".sticky-cards-container[_ngcontent-%COMP%]{padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding:20px;background:#ffffff1a;border-radius:12px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#fff;margin:0;font-size:2.5rem;font-weight:300}.add-button[_ngcontent-%COMP%]{background:#fff3;color:#fff;border:2px solid rgba(255,255,255,.3);transition:all .3s ease}.add-button[_ngcontent-%COMP%]:hover{background:#ffffff4d;transform:translateY(-2px)}.cards-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;padding:20px}.card-wrapper[_ngcontent-%COMP%]{position:relative;transition:transform .3s ease,box-shadow .3s ease}.card-wrapper[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 10px 30px #0000004d}.drag-handle[_ngcontent-%COMP%]{position:absolute;top:8px;right:8px;z-index:10;background:#0000001a;border-radius:50%;padding:4px;cursor:grab;transition:background .3s ease}.drag-handle[_ngcontent-%COMP%]:hover{background:#0003}.drag-handle[_ngcontent-%COMP%]:active{cursor:grabbing}.cdk-drag-preview[_ngcontent-%COMP%]{box-sizing:border-box;border-radius:12px;box-shadow:0 15px 35px #0006;transform:rotate(5deg);transition:transform .3s ease}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:.3;transform:scale(.95)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .card-wrapper[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cards-grid.cdk-drop-list-receiving[_ngcontent-%COMP%]{background:#ffffff1a;border-radius:12px}@media (max-width: 768px){.header[_ngcontent-%COMP%]{flex-direction:column;gap:16px;text-align:center}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2rem}.cards-grid[_ngcontent-%COMP%]{grid-template-columns:1fr;gap:16px;padding:16px}}app-weather-card[_ngcontent-%COMP%], app-notes-card[_ngcontent-%COMP%], app-news-card[_ngcontent-%COMP%]{display:block;width:100%}@keyframes _ngcontent-%COMP%_cardSlideIn{0%{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}.card-wrapper[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_cardSlideIn .4s ease-out}",
    ],
    changeDetection: 0,
  });
};
var ih = class n {
  title = "stickyCards";
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = Z({
    type: n,
    selectors: [["app-root"]],
    decls: 2,
    vars: 0,
    template: function (e, i) {
      e & 1 && Le(0, "app-sticky-cards")(1, "router-outlet");
    },
    dependencies: [el, nh],
    encapsulation: 2,
  });
};
zg(ih, rI).catch((n) => console.error(n));
