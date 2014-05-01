Function.create
===============

Function.create(proto, fn, props) — Object.create() for functions


Just as you might create an object with a given prototype, this module allows you to create a function with a given prototype.




Usage
===============

**Function.create**(*prototype*, *targetFunction*, *propertyDescriptor*)

 - prototype: the prototype for the target function
 - targetFunction: the target function 
 - propertyDescriptor: a property descriptor ([MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties))

### NOTE: 
Function.create modifies the `targetFunction`.  It does not actually create a new function, so as to avoid using `eval` or `new Function()`;

Examples
===============

```javascript
var proto = {
	propA: 'hello',
	propB: 'goodbye'
};

var fn = Function.create(proto, function() {
	console.log('Hello World!');
});

fn(); 
	// -> logs: "Hello World"

console.log(fn.hasOwnProperty('propA'), fn.propA)
	// -> logs: false, "hello"

console.log(fn.hasOwnProperty('propB'), fn.propA)
	// -> logs: false, "goodbye"

```

### NOTE:
In the above example, `fn` will no longer have Function.prototype in it's prototype chain.  This means that `fn.bind` and `fn.apply` are no longer defined, and `fn.toString()` returns `"[object Function]"`

```javascript
var protoFn = function(){};

protoFn.extend = function(){}


var fn = Function.create(proto, function() {
	console.log('Hello World!');
});

fn(); 
	// -> logs: "Hello World"

console.log(fn.hasOwnProperty('propA'), fn.propA)
	// -> logs: false, "hello"

console.log(fn.hasOwnProperty('propB'), fn.propA)
	// -> logs: false, "goodbye"

```


Info
===============
This is not a built-in method, and it's a little bit hackish.  It uses Object.setPrototypeOf if it's available, but otherwise it sets the __proto__ property directly which is not ideal.  My hope in createing this module is that it will eventually be replace by a built-in method.