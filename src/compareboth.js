var createBaseEval = require('./function-create');
// var createEvalIsolated = require('./function-create-isolated');
// var createBetterEvalSlice = require('./function-create-better-eval-slice');
// var createBetterEval = require('./function-create-better-eval');
// var createNewFunction = require('./function-create-new-function');
// var createRegularEval = require('./function-create-regular-eval');
// var createVMContext = require('./function-create-vm-this-context');
var createGlobalSuper = require('./function-create-global-super');
// var createBaseEval = require('./function-create');
// var createBetterEvalBound = require('./function-create-bind-better-eval');
// var createNewFunctionBound = require('./function-create-bind-new-function');
// var createRegularEvalBound = require('./function-create-bind-regular-eval');
// var createVMContextBound = require('./function-create-bind-vm-this-context');
// var createGlobalSuper = require('./function-create-global-super');

var resA, resB, resC, resD, resE, resF, resG, resH, resI, resJ, resK, resL;

var x = 0, y = 0;
var protoFn = function(a,b,c,d) {
	x += a+b+c+d+Math.random();
};
protoFn.test = 'asdfasdf';

var targetFnA = function($super) {
	y += Math.random() + $super(1, 2, 3, 4);
};
var targetFnB = function() {
	x += Math.random() + $super(1, 2, 3, 4);
};


function timed(fn) {
	var diff, time = process.hrtime();
	fn();
	diff = process.hrtime(time);
	// console.log(fn.name, ((diff = )/1e6) + 'ms');
	return 	((diff[0] * 1e9) + diff[1])/1e6;

}

function baseLine() {
	return 
};


function compare() {
	var tmp, n = 50, fns = [], l, i, times = {}, x;
	for (l=arguments.length,i=0;i<l;fns.push(arguments[i++]));
	if (typeof fns[0] === 'number') {
		n = fns[0];
		fns.shift();
	}
	for (l=fns.length,i=0;i<l;times[fns[i++].name]=0);

	for (i = 0; i < n; i++) {
		// console.log((i+1) + '/' + n + '\t');
		for(x=0;x<l;x++) {
			times[fns[x].name] += (tmp = timed(fns[x]))/n;
		}
		fns.sort(function() { return Math.random()-0.5; });
	}
	// for(i in times) {
		console.log('AVG', times);
	// }
}


compare(50, 
	function buildBaseEval() {
		for(var i = 0; i<12000; i++) resA = createBaseEval(protoFn, targetFnA, true);
	},
	function buildGlobalSuper() {
		for(var i = 0; i<12000; i++) resB = createGlobalSuper(protoFn, targetFnB, true);
	}
);

compare(50, 
	function execBaseEval() {
		for(var i = 0; i<600000; i++) resA();
	}, 
	function execGlobalSuper() {
		for(var i = 0; i<600000; i++) resB();
	});