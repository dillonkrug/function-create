


// var test;

// (function(xxx){

// 	test = new Function('console.log(xxx);');


// }(123));

// test();



// var a = function(){
// 		return x+= Math.random();
// 	},
// 	b,
// 	x = 0,
// 	y = 0;

// eval('b = function(){return y+= Math.random()};');

// var n = 0;
// m = 23;

// function c() {
// 	n++;
// }

// function d() {
// 	m++;
// }
// function timed(fn) {
// 	var diff, time = process.hrtime();
// 	fn();
// 	diff = process.hrtime(time);
// 	console.log(fn.name, ((diff = (diff[0] * 1e9) + diff[1])/1e6) + 'ms');
// 	return 	diff;

// }


// function compare(a, b, n) {
// 	var ta = 0, tb = 0;
// 	n = n || 50;
// 	for (var i = 0; i < n; i++) {
// 		// console.log('SET', i+1);
// 		if (i%2) {
// 			ta += timed(a)/n;
// 			tb += timed(b)/n;
// 		} else {
// 			tb += timed(b)/n;
// 			ta += timed(a)/n;
// 		}
// 	}

// 	console.log((ta/1e6) + '\t'+ (tb/1e6));
// }


// compare(function normal() {
// 	for(var i = 0; i<1000000; i++) c();
// }, function evalled() {
// 	for(var i = 0; i<1000000; i++) d();
// }, 10);

// console.log(n, m)

