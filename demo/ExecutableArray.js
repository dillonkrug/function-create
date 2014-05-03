require('../src/function-create');

var Promise = require('bluebird'),

	arrProto = Array.prototype,

	protoFn = function() {};

// 
// [NOTE] function.length and array.length don't play nice together, 
//        so we can't just use Function.create(Array.prototype, function(){ ... })

Object.getOwnPropertyNames(arrProto).forEach(function(fname){
	// assign array methods to proto function
	// skip length, toString, etc.
	if (typeof protoFn[fname] !== 'undefined') return;
	var fn = arrProto[fname];
	protoFn[fname] = function(){
		return fn.apply(this.__fnlist__, arguments);
	};
});

protoFn.invoke = function(scope, args, opts){
	scope = scope || null;
	opts = opts || {};
	var res, spread = opts.spread, i, l = this.__fnlist__.length;
	switch (opts.mode) {
		case 'pipe':
			// execute as a synchronous series
			res = this.__fnlist__[0].apply(scope, args);
			for (i = 1; i < l; i++) {
				res = this.__fnlist__[i].apply(scope, Array.isArray(res) && spread ? res : [res]);
			}
		break;
		case 'async': 
			// execute it as an asynchronous series;
			res = Promise.all(args).bind(scope);
			this.__fnlist__.forEach(function(fn) { res = res.spread(fn); });
		break;
		case 'linear':
			/* falls through */
		default:
			// execute as a list of functions, all with the same original arguments
			for (i = 0; i < l; i++) res = this.__fnlist__[i].apply(scope, args);
		break;
	}
	return res;
};




// a factory function to create executable arrays.

function ExecutableArray(opts, fns) {
	var hooked = Function.create(protoFn, function() {
		var args = arrProto.slice.call(arguments);
		return hooked.invoke(this, args, opts);
	}, {
		__fnlist__: {
			value: fns || []
		}
	});
	return hooked;
}

module.exports = ExecutableArray;


///////////////////////////////////////////////////////////
////////////////////////  EXAMPLE  ////////////////////////
///////////////////////////////////////////////////////////


var fibbonaciStart		= function() { return [1, 1]; },
	fibbonaciStep		= function(l, r) { return [r, l+r]; },
	fibbonaciFinish		= function(l, r) { return l+r; },

	_log = function(msg){
		return function(l, r){ console.log(l + '\t' +  msg); return [l, r]; };
	};


var fibbonaci = ExecutableArray({mode: 'pipe', spread: true}, [
	fibbonaciStep,
	fibbonaciStep,
	_log('I\'m in the original fn list' ),
	fibbonaciStep,
	fibbonaciStep,
	fibbonaciStep,
	fibbonaciStep,
	fibbonaciStep,
]);

fibbonaci.unshift(fibbonaciStart);
fibbonaci.splice(5, 0, _log('I was spliced into position 4'));
fibbonaci.splice(8, 0, _log('I was spliced into position 8'));
fibbonaci.push(_log('I\'m the final _log() before the finishing function'));
fibbonaci.push(fibbonaciFinish);


fibbonaci();
	// logs: 2	I'm in the original fn list
	// logs: 3	I was spliced into position 4
	// logs: 8	I was spliced into position 8
	// logs: 21	I'm the final _log() before the finishing function
	// -> output: 55
