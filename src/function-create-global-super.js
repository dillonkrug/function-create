var fnProto = Function.prototype;

function checkForFunctionProto(p) {
	while(p && (p = Object.getPrototypeOf(p))) {
		if (p === fnProto) return true;
	}
	return false;
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




function FnCreate(proto, fn, props, wrap) {

	if (arguments.length === 0) throw new Error('Function.create requires at least one argument');

	// optionally check that the resulting function will have bind/call/apply/toString set properly.
	if (FnCreate.checkProto && !checkForFunctionProto(proto)) throw new TypeError('Function prototype may only be a Function');

	var protoIsFn = (typeof proto === 'function'),
		targetIsFn = (typeof fn === 'function'),
		doInherit = wrap === true || props === true || fn === true;
		outFn = fn;

	if (!targetIsFn && !props) {
		props = fn;
		fn = null;
	}

	if (protoIsFn && doInherit){
		// if proto is a function, then we can enable $super goodness
		if (targetIsFn) {
			outFn = function createdFunction (){
				var before = global.$super, ret, scope = this;
				global.$super = function() { return proto.apply(scope, arguments); };
				ret = fn.apply(this, arguments);
				global.$super = before;
				return ret;
			};
		} else {
			// if no target function is passed in, we assume wa want it to inherit the parent exactly
			outFn = function() {
				return proto.apply(this, arguments);
			};
		}
	} else {

		if (!targetIsFn) throw new TypeError('Function.create requires at least one function argument');

		outfn = fn;

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