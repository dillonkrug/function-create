var createA = require('./function-createbetter-eval');
var createB = require('./function-create-global-super');

var x, aaa, bbb;


var protoFn = function() {
	x+=Math.random();
};
protoFn.test = 'asdfasdf';

var targetFnA = function($super) {
	return Math.random() + $super();
};
var targetFnB = function() {
	return Math.random() + $super();
};

aaa = createA(protoFn, targetFnA, true);
bbb = createB(protoFn, targetFnB, true);





function timed(fn) {
	var diff, time = process.hrtime();
	fn();
	diff = process.hrtime(time);
	console.log(fn.name, ((diff = (diff[0] * 1e9) + diff[1])/1e6) + 'ms');
	return 	diff;

}


function compare(a, b, n) {
	var ta = 0, tb = 0;
	n = n || 50;
	for (var i = 0; i < n; i++) {
		// console.log('SET', i+1);
		if (i%2) {
			ta += timed(a)/n;
			tb += timed(b)/n;
		} else {
			tb += timed(b)/n;
			ta += timed(a)/n;
		}
	}

	console.log((ta/1e6) + '\t'+ (tb/1e6));
}


compare(function aaaaa() {
	for(var i = 0; i<100000; i++) aaa();
}, function bbbbb() {
	for(var i = 0; i<100000; i++) bbb();
}, 10);

