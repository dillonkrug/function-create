// var create_wrappedEval = require('./function-create-eval-wrapper');
var createBaseEval = require('./function-create');


var x = 0, y = 0;
var protoFn = function(a,b,c,d) {
	x += a+b+c+d+Math.random();
};
protoFn.test = 'asdfasdf';

var targetFnA = function($super, a, b) {
	y += Math.random() + $super(1, 2, a, b);
};

// var vm = require('vm');

var resA, resB, resC, resD, resE, resF, resG;

function timed(fn) {
	var diff, time = process.hrtime();
	fn();
	diff = process.hrtime(time);
	// console.log(fn.name, ((diff = )/1e6) + 'ms');
	return 	((diff[0] * 1e9) + diff[1])/1e6;

}

function rSort() { return Math.random()-0.5; }

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
		fns.sort(rSort);
	}
	// for(i in times) {
		console.log(times);
	// }
}

// function getLiteral() {
// 	return function(){ return Math.random() };
// }
// function getEvaled() {
// 	return eval('(function(){ return Math.random() })');
// }
// function getEvaledWrapped() {
// 	return eval('(function(){ return function(){ return Math.random() } })')();
// }

// function getNewFunc() {
// 	return (new Function('return Math.random();'));
// }

// function getNewFuncWrapped() {
// 	return (new Function('return (function(){ return Math.random() });'))();
// }

// function getVM() {
// 	return vm.runInThisContext('(function(){ return Math.random() })');
// }

// function getVMWrapped() {
// 	return vm.runInThisContext('(function(){ return function(){ return Math.random() } })')();
// }


compare(50, 
	function usingNormal() {
		for(var i = 0; i<10000; i++) resB = createBaseEval(protoFn, targetFnA, false);
	},
	function usingPrsrve() {
		for(var i = 0; i<10000; i++) resA = createBaseEval(protoFn, targetFnA, false, true);
	}
	// function usingLite() {
	// 	for(var i = 0; i<100000; i++) resA = getLiteral();
	// },
	// function usingEval() {
	// 	for(var i = 0; i<100000; i++) resB = getEvaled();
	// },
	// function usingEvaW() {
	// 	for(var i = 0; i<100000; i++) resC = getEvaledWrapped();
	// },
	// function usingFunc() {
	// 	for(var i = 0; i<100000; i++) resD = getNewFunc();
	// },
	// function usingFunW() {
	// 	for(var i = 0; i<100000; i++) resE = getNewFuncWrapped();
	// },
	// function usingVM__() {
	// 	for(var i = 0; i<100000; i++) resF = getVM();
	// },
	// function usingVMWr() {
	// 	for(var i = 0; i<100000; i++) resG = getVMWrapped();
	// }
);

compare(50, 
	function execNormal() {
		for(var i = 0; i<100000; i++) resA(3,4);
	},
	function execPrsrve() {
		for(var i = 0; i<100000; i++) resB(3,4);
	}
	// function execLite() {
	// 	for(var i = 0; i<1000000; i++) resA();
	// },
	// function execEval() {
	// 	for(var i = 0; i<1000000; i++) resB();
	// },
	// function execEvaW() {
	// 	for(var i = 0; i<1000000; i++) resC();
	// },
	// function execFunc() {
	// 	for(var i = 0; i<1000000; i++) resD();
	// },
	// function execFunW() {
	// 	for(var i = 0; i<1000000; i++) resE();
	// },
	// function execVM__() {
	// 	for(var i = 0; i<1000000; i++) resF();
	// },
	// function execVMWr() {
	// 	for(var i = 0; i<1000000; i++) resG();
	// }
); 



// var ts = Date.now();

// console.profile('build-normal-' + ts);
// for(var i = 0; i<10000; i++) resA = Function.create(protoFn, targetFnA, false, false);
// console.profileEnd('build-normal-' + ts);
// console.profile('build-preserve-' + ts);
// for(var i = 0; i<10000; i++) resB = Function.create(protoFn, targetFnA, false, true);
// console.profileEnd('build-preserve-' + ts);

// console.profile('exec-normal-' + ts);
// for(var i = 0; i<100000; i++) resA(3,4)
// console.profileEnd('exec-normal-' + ts);
// console.profile('exec-preserve-' + ts);
// for(var i = 0; i<100000; i++) resB(3,4);
// console.profileEnd('exec-preserve-' + ts);