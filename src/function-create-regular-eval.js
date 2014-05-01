var fnProto = Function.prototype;

function checkForFunctionProto(p) {
	while(p && (p = Object.getPrototypeOf(p))) {
		if (p === fnProto) return true;
	}
	return false;
}

function parseArgs(fn) {
	return fn.toString()
	// match the function [name ... ] (arg, list)
	.match(/function(?:[\s\w\$\_]+)?\s*\(([^\)]*)\)/)[1]
	// remove single line comments
	.replace(/\/\/.*/g, "")
	// remove whitespace
	.replace(/\s/g, "")
	// remove multi-line comments
	.replace(/\/\*.*?\*\//g, "")
	// split list of arguments
	.split(',');
}

if (typeof Object.setPrototypeOf !== 'function') {
	Object.setPrototypeOf = function setPrototypeOf(obj, proto) {
		obj.__proto__ = proto;
		return obj;
	};
}

function isEmptyObj(obj) {
	return (Object.getPrototypeOf(obj) === Object.prototype) && Object.getOwnPropertyNames(obj).length === 0;
}


var fnCall = Function.prototype.call;
var slice = fnCall.bind(Array.prototype.slice);

function getWrappedFunction(proto, fn, argList) {
	var out;
	eval(
		'out = function ' + fn.name + ' (' + argList.join(', ') + '){\n' +
		'	var l=arguments.length,i=0,scope = this\n' +
		'		args=[function(){ return proto.apply(scope, arguments) }];\n' +
		'	for (;i<l;args.push(arguments[i++]));\n' + 
		'	return fn.apply(this, args);\n' +
		'};'
		);
	return out;
}

function FnCreate(proto, fn, props) {

	if (arguments.length === 0) throw new Error('Function.create requires at least one argument');

	// optionally check that the resulting function will have bind/call/apply/toString set properly.
	if (FnCreate.checkProto && !checkForFunctionProto(proto)) throw new TypeError('Function prototype may only be a Function');

	var protoIsFn = (typeof proto === 'function'),
		targetIsFn = (typeof fn === 'function'),
		argList = targetIsFn && parseArgs(fn),
		doInherit = argList && argList.shift() === '$super';
		outFn = fn;

	if (!protoIsFn && doInherit) throw new TypeError('$super can not be used when Function.create is called with a non-function prototype');

	if (!targetIsFn && !props) {
		props = fn;
		fn = null;
	}

	if (protoIsFn){
		// if proto is a function, then we can enable $super goodness
		if (targetIsFn) {
			if (doInherit) {
				outFn = getWrappedFunction(proto, fn, argList);
			} else {
				outFn = fn;
			}
		} else {
			// if no target function is passed in, we assume wa want it to inherit the parent exactly
			outFn = function() {
				return proto.apply(this, arguments);
			};
		}			
	} else {

		if (!targetIsFn) throw new TypeError('Function.create requires at least one function argument');

		outFn = fn;

		var flag = false;
		for(var i in fnProto) {
			if (!proto[i]) {
				if (!flag) {
					// don't modify the proto object.
					proto = Object.create(proto);
					flag = true;
				}
				proto[i] = fnProto[i];
			}
		}

		for(var i in fnProto) {
			if (!proto[i]) proto[i] = fnProto[i];
		}

	}

	// console.log('PROPS ARE', props);

	Object.setPrototypeOf(outFn, proto);
	if (protoIsFn) Object.setPrototypeOf(outFn.prototype, proto.prototype);

	if (props && typeof props === 'object') {
		Object.defineProperties(outFn, props);
	}

	return outFn;
}

FnCreate.checkProto = false;


if (typeof Function.create !== 'function') {
	Function.create = FnCreate;
}

module.exports = FnCreate;