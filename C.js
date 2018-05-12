// My C.js code from ClassExtendFunctional

const C = {
  __: ['Placeholder'],
};
C.curry = (fn, name) => {
  // get ready for some spaghetti code
  // the flow of this is kind of complicated because it needs to be
  const argnames = fn.toString().match(/([.\w]+,*\s*)+/)[0].split`,`.map(v => v.replace(/\s/, ''));
  const len = argnames.length;
  // Gets the parameter names from the provided function
  const proto = Object.create(null);
  function buildObject(args = [], rest = [], argNamesReceived = []) {
    // Object.assign to make new copies of the objects
    if (argNamesReceived.length === len) {
      // if we've gotten all of the arguments that are needed
      return fn(...args.concat(rest));
    }
    const obj = Object.create(proto);
    argNamesReceived.forEach((v) => obj[v] = () => console.error(`Already received argument ${v}!`));
    // remove values that already have been given
    obj.args = args;
    obj.rest = rest;
    obj.argNamesReceived = argNamesReceived;
    // make sure that that the new object has the new copies
    return obj;
  }
  argnames.forEach((v, i) => {
    let argname = v;
    if (v[0] === '.') {
      // if it's a gather
      argname = v.slice(3);
      // Slice off the "..."
      proto[argname] = function rest(...a) {
        const args = this.args.slice();
        const argNamesReceived = this.argNamesReceived.slice();
        // there's only one gather allowed per arrow function
        // it's okay to set rest with "="
        argNamesReceived.push(argname);
        return buildObject(args, a, argNamesReceived);
      }
    } else {
      proto[argname] = function argument(a) {
        const args = this.args.slice();
        const rest = this.rest.slice();
        const argNamesReceived = this.argNamesReceived.slice();
        args[i] = a;
        argNamesReceived.push(argname);
        return buildObject(args, rest, argNamesReceived);
      }
    }
  });
  return buildObject();
};
C.class = (name, proto) => {
  const classInstance = function classBuilder(...args) {
    if (!(this instanceof classInstance)) {
      // if the classInstance is not being called with new
      const cI = new classInstance(...args);
      Object.setPrototypeOf(cI, proto);
      // Add stuff onto the prototype chain
      return cI;
      // this return blocks all further code
    }
    if (proto.hasOwnProperty('constructor')) {
      // if there's a constructor in proto we want to run it
      proto.constructor.apply(this, args);
    }
  };
  classInstance.prototype = proto;
  // make instanceof work properly
  classInstance.displayName = name;
  // make debug nice
  classInstance.extend = (nam, nproto) => C.class(nam, Object.setPrototypeOf(nproto, proto));
  // extend: str => obj => fn
  classInstance.static = obj => Object.assign(classInstance, obj);
  // static: obj => obj
  // assign some properties to the classInstance
  return classInstance;
};
// C.class.displayName = 'class';
// class: str => obj => fn
