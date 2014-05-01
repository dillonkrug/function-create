var fnProto = Function.prototype;

function checkForFunctionProto(p) {
	while (p && (p = Object.getPrototypeOf(p))) {
		if (p === fnProto) return true;
	}
	return false;
}

function parseArgs(fn) {
	return fn.toString()
	// match the function [name ... ] (arg, list)
	.match(/function(?:[\s\w\$\_]+)?\s*\(([^\)]*)\)/)[1]
	// remove single line comments
	.replace(/\/\/.*/g, '')
	// remove whitespace
	.replace(/\s/g, '')
	// remove multi-line comments
	.replace(/\/\*.*?\*\//g, '')
	// split list of arguments
	.split(',');
}

if (typeof Object.setPrototypeOf !== 'function') {
	Object.setPrototypeOf = function setPrototypeOf(obj, proto) {
		obj.__proto__ = proto;
		return obj;
	};
}

function getWrappedFunction(proto, fn, argList) {
	return eval(
		'(function(p,f){\n' +
		'	return function ' + fn.name + ' (' + argList.join(', ') + '){\n' +
		'		var l=arguments.length,i=0,scope=this,\n' +
		'			args=[function(){ return p.apply(scope, arguments) }];\n' +
		'		for (;i<l;args.push(arguments[i++]));\n' +
		'		return f.apply(scope, args);\n' +
		'	};' +
		'});'
	)(proto, fn);
}

function cloneFunction(fn) {
	return eval('(function ' + fn.name + ' (' + parseArgs(fn).join(', ') + '){ return fn.apply(this, arguments); })');
}

function FnCreate(proto, fn, props, clone) {

	if (arguments.length === 0) throw new Error('Function.create requires at least one argument');

	// optionally check that the resulting function will have bind/call/apply/toString set properly.
	if (FnCreate.forceFunctionPrototype && !checkForFunctionProto(proto)) throw new TypeError('Function prototype may only be a Function');

	var protoIsFn 		= (typeof proto === 'function'),
		targetIsFn 		= (typeof fn === 'function'),
		preserveArity 	= clone || props === true,
		argList 		= targetIsFn && parseArgs(fn),
		doSuper 		= argList && argList.shift() === '$super',
		outFn 			= fn,
		outProto 		= proto,
		objProps 		= props;

	if (!protoIsFn && doSuper) throw new TypeError('$super can not be used when Function.create is called with a non-function prototype');


	if (protoIsFn) {
		// if proto is a function, then we can enable $super goodness
		if (targetIsFn) {
			if (doSuper) {
				if (preserveArity) {
					outFn = getWrappedFunction(outProto, fn, argList);
				} else {
					outFn = function() {
						var l = arguments.length, i = 0, scope = this,
							args = [ function() { return outProto.apply(scope, arguments) } ];
						for (; i < l; args.push(arguments[i++]));
						return fn.apply(scope, args);
					};
				}
			}
		} else {
			// if no target function is passed in, we assume wa want it to inherit the parent exactly
			if (preserveArity) {
				outFn = cloneFunction(outProto);
			} else {
				outFn = function() { return outProto.apply(this, arguments) };
			}
		}
	} else {
		if (!targetIsFn) throw new TypeError('Function.create requires at least one function argument');

		var flag = false, i;
		for (i in fnProto) {
			if (!outProto[i]) {
				if (!flag) {
					// don't modify the original proto object.
					outProto = Object.create(outProto);
					flag = true;
				}
				outProto[i] = fnProto[i];
			}
		}

		for (i in fnProto) if (typeof outProto[i] === 'undefined') outProto[i] = fnProto[i];

	}

	Object.setPrototypeOf(outFn, outProto);

	if (protoIsFn) Object.setPrototypeOf(outFn.prototype, outProto.prototype);


	if (!targetIsFn && !objProps) {
		objProps = outFn;
	}

	if (objProps && typeof objProps === 'object') {
		Object.defineProperties(outFn, objProps);
	}

	return outFn;
}

FnCreate.forceFunctionPrototype = false;


if (typeof Function.create !== 'function') {
	Function.create = FnCreate;
}

	module.exports = FnCreate;
