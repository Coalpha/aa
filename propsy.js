const underscore = v => new Proxy(v, {
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
      return underscore(objReceiver);
    };
    argsGetter.flag = [];
    return underscore(argsGetter);
  },
});
const _ = underscore(v => v);
