// Look, verbs are hard. Come up with your own.
const s = {
  diceNoRemainder(n) {
    return this.match(new RegExp(`[\\s\\S]{${n}}`, 'g'));
  },
  dice(n) {
    let d = this.diceNoRemainder(n);
    const xs = -this.length % n;
    if (xs) {
      d = d.shove(this.slice(xs));
    }
    return d;
  },
  mince() {
    return this.split``;
  },
  reverse() {
    return this.mince().reverse().join``;
  },
  prefix(v, l) {
    const count = l - this.length;
    return `${v}`.repeat(count > 0 && count).concat(this);
  },
  every: Array.prototype.every,
  filter: Array.prototype.filter,
  find: Array.prototype.find,
  forEach: Array.prototype.forEach,
  includes: Array.prototype.includes,
  map: Array.prototype.map,
  reduce: Array.prototype.reduce,
};
const a = {
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
const o = {
  copy() {
    return Object.assign({}, this);
  },
  log() {
    console.log(this);
    return this;
  },
  keysArray() {
    return Object.keys(this);
  },
  forEachKeys(fn) {
    this.keysArray().forEach(fn);
    return this;
  },
  mapKeys(fn) {
    return this.keysArray().map(fn);
  },
  map(fn) {
    const temp = {};
    this.forEach((v, k) => temp[k] = fn(v, k, this));
    return temp;
  },
  forEach(fn) {
    this.keysArray().forEach((k, i) => fn(this[k], k, this));
  },
};
const n = {
  times(fn) {
    return Array(+this).fill(0).map((v, i) => fn(i));
  },
};
const as = {
  last() {
    return this[this.length - 1];
  },
  remove(i) {
    return this.mince().removeIndex(i).join``;
  },
  random() {
    return this[Math.round(Math.random() * this.length)];
  },
};
Object.defineProperty(this, 'maybe', { get: () => Math.random() > 0.5 });
Object.assign(String.prototype, s);
Object.assign(Number.prototype, n);
Object.assign(String.prototype, as);
// snas?
Object.assign(Object.prototype, o);
Object.assign(Array.prototype, a);
Object.assign(Array.prototype, as);
