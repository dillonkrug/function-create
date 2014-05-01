
var _slice = Array.prototype.slice;
function slice(a) {
	return _slice.call(a);
}

function toArgs() {
	for (var o=[],l=arguments.length,i=0;i<l;o[i] = arguments[i++]);
	return o;
}




function testA() {
	var args = slice(arguments);

	for (var o = 0, i = args.length - 1; i >= 0; i--) o += args[i];
	return o;
}
function testB() {
	var args = _slice.call(arguments);

	for (var o = 0, i = args.length - 1; i >= 0; i--) o += args[i];
	return o;
}
function testC() {
	var args = toArgs.apply(null, arguments);

	for (var o = 0, i = args.length - 1; i >= 0; i--) o += args[i];
	return o;
}

function testD() {
	for (var args=[],l=arguments.length,i=0;i<l;args.push(arguments[i++]));

	for (var o = 0, i = args.length - 1; i >= 0; i--) o += args[i];
	return o;
}
function testE() {
	for (var args=[],l=arguments.length,i=0;i<l;args[i] = arguments[i++]);

	for (var o = 0, i = args.length - 1; i >= 0; i--) o += args[i];
	return o;
}

function timed(fn) {
	var diff, time = process.hrtime();
	fn();
	diff = process.hrtime(time);
	// console.log(fn.name, ((diff = )/1e6) + 'ms');
	return 	((diff[0] * 1e9) + diff[1])/1e6;

}


function compare() {
	var tmp, n = 50, fns = [], l, i, times = {}, x;
	for (l=arguments.length,i=0;i<l;fns.push(arguments[i++]));
	if (typeof fns[0] === 'number') {
		n = fns[0];
		fns.shift();
	}
	for (l=fns.length,i=0;i<l;times[fns[i++].name]=0);

	for (i = 0; i < n; i++) {
		console.log((i+1) + '/' + n + '\t');
		for(x=0;x<l;x++) {
			times[fns[x].name] += (tmp = timed(fns[x]))/n;
		}
		fns.sort(function() { return Math.random()-0.5; })
	}
	// for(i in times) {
		console.log('AVG', JSON.stringify(times, null, '\n'));
	// }
}

var n = 0

compare(20, 
	function justSlice() {
		n = 0;
		for(var i = 0; i<200000; i++) n += testA(1, 2, 3, 4, 5);
	},
	function _sliceCall() {
		n = 0;
		for(var i = 0; i<200000; i++) n += testB(1, 2, 3, 4, 5);
	},
	function toArgsApply() {
		n = 0;
		for(var i = 0; i<200000; i++) n += testC(1, 2, 3, 4, 5);
	},
	function forPush() {
		n = 0;
		for(var i = 0; i<200000; i++) n += testD(1, 2, 3, 4, 5);
	},
	function forAssign() {
		n = 0;
		for(var i = 0; i<200000; i++) n += testE(1, 2, 3, 4, 5);
	}
);