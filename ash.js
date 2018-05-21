// Cole's ash.js
// ash is because the ash character is ae and this is avian-extend

const A = v => new Proxy(v, A._getHandler(A.type(v)));
A._arity = (n, fn, displayName, name, binding = null) => {
  const newFn = function (...a) { return fn.apply(binding, a); };
  Object.defineProperty(newFn, 'length', { value: n, writable: false });
  A._setFnName(newFn, name || fn.name);
  newFn.displayName = displayName || name || fn.name;
  return newFn;
};
A._curryN = (n, fn, name = fn ? fn.name : '', types = [], binding = null) => {
  if (n === 0) {
    return A._arity(0, fn, name, name, binding);
  }
  if (!Number.isInteger(n) || !(Math.sign(n) + 1)) {
    throw new Error(`${name}: The first argument to _curryN must be a non-negative integer!`);
  } else if (n > 30) {
    throw new Error(`${n} is a pretty big number. Are you sure you wanted to do that?`);
  }
  if (A.type(fn) !== 'function') {
    throw new Error('The second argument to _curryN must be a function!');
  }
  function prepare(previousArguments = Array(n).fill(A.__)) {
    const p = previousArguments.map((v, i) => {
      const ptype = types[i];
      let type = A._isPlaceholder(v) ? ptype ? `__:${ptype}` : 'A.__' : A.type(v);
      if (v === A.$) {
        type = '';
      } else if (type === 'number') {
        type = v;
      } else if (type === 'string') {
        type = `'${v.replace(/'/g, "\\'")}'`;
      }
      return type;
    }).join(', ');
    const len = previousArguments.slice(0, n).filter(v => v !== A.__).length;
    const tlen = previousArguments.filter(v => v !== A.__).length;
    // number of arguments recieved for non-optional argument values
    const displayName = `${name}(${p} : ${tlen} / ${n})`;
    const afn = A._arity(n - len, (...newArguments) => {
      let c = 0;
      // a counter variable
      const args = previousArguments.map(v => v === A.__ && c < newArguments.length ? newArguments[c++] : v).concat(newArguments.slice(c));
      // the old and new combined
      return prepare(args);
    }, displayName, name);
    afn.previousArguments = previousArguments;
    afn._isCurried = true;
    if (len === n) {
      previousArguments.forEach((v, i) => v === A.$ && delete previousArguments[i]);
      return fn.apply(binding, previousArguments);
    }
    return afn;
  }
  return prepare();
};
A._invokerN = (n, str, obj, types) => A._curryN(n, obj[str], str, types, obj);
A._isPlaceholder = v => v === A.__;
A._propsy = v => new Proxy(v, {
  get: (f, key) => {
    const argsGetter = (...kargs) => {
      const objReceiver = (obj) => {
        let nobj;
        if (f.flag) {
          nobj = f(f.flag, obj);
        } else {
          nobj = f(obj);
        }
        const value = nobj[key];
        if (typeof value === 'function') {
          return nobj[key](...kargs);
        }
        return value;
      };
      if (kargs[0] === argsGetter.flag) {
        const obj = kargs[1];
        return objReceiver(obj);
      }
      return A._propsy(objReceiver);
    };
    argsGetter.flag = [];
    return A._propsy(argsGetter);
  },
});
A._setFnName = (fn, name) => Object.defineProperty(fn, 'name', { value: name });
A.$ = ['Blank'];
A.__ = ['Placeholder'];
A.type = (v) => {
  const t = typeof v;
  switch (t) {
    case 'number': return Number.isNaN(v) ? 'NaN' : t;
    case 'object': return Array.isArray(v) ? 'array' : v ? 'object' : 'null';
    default: return t;
  }
};
A._ = A._propsy(v => v);
A.curryN = A._curryN(2, A._curryN, 'curryN', ['int', 'fn']);
A.curry = A._curryN(1, (...a) => A._curryN(a[0].length, ...a), 'curry', ['fn']);
// The name is optional so no need to curry
A.uncurryN = A._curryN(2, (n, fn, name = fn.name) => A._arity(n, (...args) => {
  let argpos = 0;
  let fnp = fn;
  while (argpos !== n) {
    const len = fnp.length + argpos;
    fnp = fnp(...args.slice(argpos, len));
    argpos = len;
  }
  return fnp;
}, name), 'uncurryN', ['int', 'fn']);
A.kariN = A._curryN(2, (...a) => A.curry(A.uncurryN(...a)), 'kariN', ['int', 'fn']);
A.arity = A._curryN(2, A._arity, 'arity', ['int', 'fn']);
A.nAry = A._curryN(2, (n, fn, name) => (...b) => A.arity(n, fn, name)(...b.slice(0, n)), 'nAry', ['int', 'fn']);
A.pipe = (...fns) => v => fns.reduce((a, fn) => fn(v), v);
// Helper functions
A.add = A.curry((a, b) => a + b, 'add', ['int', 'int']);
A.subtract = A.curry((a, b) => a - b, 'subtract', ['int', 'int']);
A.multiply = A.curry((a, b) => a * b, 'multiply', ['int', 'int']);
A.divide = A.curry((a, b) => a / b, 'divide', ['int', 'int']);

// Extend
// Look, verbs are hard. Come up with your own.
/*
A._addProtoFn = (fn, types) => {
  fn.displayName =
};
*/
A._addProtoFn = (fn, obj, types = [], name = fn.name) => {
  A._setFnName(fn, name);
  fn.displayName = name + (types.length ? `(${types.map(v => `__:${v}`)})` : '');
  Object.defineProperty(fn, 'length', { value: types.length });
  obj[name] = fn;
};
A._String = {
  mince() {
    return this.split``;
  },
  reverse() {
    return this.mince().reverse().join``;
  },
}
A._addProtoFn(function diceNoRemainder(n) {
  return this.match(new RegExp(`[\\s\\S]{${n}}`, 'g'));
}, A._String, ['int']);
A._addProtoFn(function dice(n) {
  let d = this.diceNoRemainder(n);
  const xs = -this.length % n;
  if (xs) {
    d = d.shove(this.slice(xs));
  }
  return d;
}, A._String, ['int']);
A._addProtoFn(function prefix(v, l) {
  const count = l - this.length;
  return `${v}`.repeat(count > 0 && count).concat(this);
}, A._String, ['str', 'int']);
A._addProtoFn(Array.prototype.every, A._String, ['fn']);
A._addProtoFn(Array.prototype.filter, A._String, ['fn']);
A._addProtoFn(Array.prototype.find, A._String, ['fn']);
A._addProtoFn(Array.prototype.forEach, A._String, ['fn']);
A._addProtoFn(Array.prototype.includes, A._String, ['fn']);
A._addProtoFn(Array.prototype.map, A._String, ['fn']);
A._addProtoFn(Array.prototype.reduce, A._String, ['fn', 'acc']);
A._Array = {
  // Pure
  copy() {
    return this.slice();
  },
  shove(...args) {
    const ary = this.copy().push(...args);
    return ary;
  },
  removeIndex(i) {
    return this.copy().mRemoveIndex(i);
  },
  snap(n) {
    return this.copy().pop(n);
  },
  pureReverse() {
    return this.copy().reverse();
  },
  pureSplice(...args) {
    return this.copy().splice(...args);
  },
};
A._Object = {
  copy() {
    return Object.assign({}, this);
  },
  keysArray() {
    return Object.keys(this);
  },
  identity() {
    return this;
  },
};
A._addProtoFn(function forEachKeys(fn) {
  this.keysArray().forEach(fn);
  return this;
}, A._Object, ['fn']);
A._addProtoFn(function mapKeys(fn) {
  return this.keysArray().map(fn);
}, A._Object, ['fn']);
A._addProtoFn(function map(fn) {
  const temp = {};
  this.forEach((v, k) => temp[k] = fn(v, k, this));
  return temp;
}, A._Object, ['fn']);
A._addProtoFn(function forEach(fn) {
  this.keysArray().forEach((k, i) => fn(this[k], k, this));
}, A._Object, ['fn']);
A._addProtoFn(function count(fn) {
  return this.filter(fn).length;
}, A._Object, ['fn']);
A._Number = {
  times(fn) {
    return Array(+this).fill(0).map((v, i) => fn(i));
  },
};
A._ArrayLike = {
  last() {
    return this[this.length - 1];
  },
  remove(i) {
    return this.mince().removeIndex(i).join``;
  },
  random() {
    return this[Math.round(Math.random() * this.length)];
  },
  rend(n) {
    return [this.slice(0, n), this.slice(n)];
  },
};
Object.assign(String.prototype, A._String, A._ArrayLike);
Object.assign(Array.prototype, A._Array, A._ArrayLike);
Object.assign(Number.prototype, A._Number);
Object.assign(Object.prototype, A._Object);
