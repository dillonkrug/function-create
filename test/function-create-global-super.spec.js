// require('function-create');
require('../'); 

describe('Test implementation of Object.setPrototypeOf', function() {
	it('should set the target object\'s prototype to the input prototype', function() {
		var proto = {
			propA: 'hello',
			propB: 'goodbye'
		};

		var target = {
			ownA: 1234,
			ownB: true
		};

		Object.setPrototypeOf(target, proto);

		expect(target.ownA).toBe(1234);
		expect(target.ownB).toBe(true);
		expect(target.propA).toBe('hello');
		expect(target.propB).toBe('goodbye');
		expect(target.hasOwnProperty('ownA')).toBe(true);
		expect(target.hasOwnProperty('ownB')).toBe(true);
		expect(target.hasOwnProperty('propA')).toBe(false);
		expect(target.hasOwnProperty('propB')).toBe(false);
		expect(Object.getPrototypeOf(target)).toBe(proto);

	});
});


describe('Test basic usage of Function.create', function() {
	
	it('should set the input function\'s prototype to the input prototype', function() {
		var proto = {
			propA: 'hello',
			propB: 'goodbye'
		};

		var target = function() {};

		target.ownA = 1234;
		target.ownB = true;

		var result = Function.create(proto, target);

		expect(result.ownA).toBe(1234);
		expect(result.ownB).toBe(true);
		expect(result.propA).toBe('hello');
		expect(result.propB).toBe('goodbye');
		expect(result.hasOwnProperty('ownA')).toBe(true);
		expect(result.hasOwnProperty('ownB')).toBe(true);
		expect(result.hasOwnProperty('propA')).toBe(false);
		expect(result.hasOwnProperty('propB')).toBe(false);
		expect(Object.getPrototypeOf(result)).toBe(proto);

	});

	it('should add properties to the resulting function per the property descriptors', function() {
		var proto = {
			propA: 'hello',
			propB: 'goodbye'
		};

		var result = Function.create(proto, function(){

		}, {
			ownA: {
				value: 1234
			},
			ownB: {
				value: true
			}
		});

		expect(result.ownA).toBe(1234);
		expect(result.ownB).toBe(true);
		expect(result.propA).toBe('hello');
		expect(result.propB).toBe('goodbye');
		expect(result.hasOwnProperty('ownA')).toBe(true);
		expect(result.hasOwnProperty('ownB')).toBe(true);
		expect(result.hasOwnProperty('propA')).toBe(false);
		expect(result.hasOwnProperty('propB')).toBe(false);
		expect(Object.getPrototypeOf(result)).toBe(proto);

	});
});


describe('Function.create with $super', function() {
	
	it('should set the input function\'s prototype to the input prototype', function() {
		var protoCallCount = 0;
		var protoFn = function(msg) {
			protoCallCount++;
			this.test = msg;
		};

		var inputFn = function(m){
			$super(m);
			this.subinit = 'yes';
		}

		protoFn.protoA = 'hello';
		protoFn.protoB = 'goodbye';

		var result = Function.create(protoFn, inputFn, {
			ownA: {
				value: 1234
			},
			ownB: {
				value: true
			}
		}, true);


		var a = {
			res: result
		};

		var b = {};

		expect(result.ownA).toBe(1234);
		expect(result.ownB).toBe(true);
		expect(result.protoA).toBe('hello');
		expect(result.protoB).toBe('goodbye');
		expect(result.hasOwnProperty('ownA')).toBe(true);
		expect(result.hasOwnProperty('ownB')).toBe(true);
		expect(result.hasOwnProperty('protoA')).toBe(false);
		expect(result.hasOwnProperty('protoB')).toBe(false);

		expect(Object.getPrototypeOf(result)).toBe(protoFn);

		//since it's a wrapped function
		expect(result).not.toBe(inputFn);
		expect(result.name).toBe('createdFunction');

		expect(a.test).toBeUndefined()
		expect(a.subinit).toBeUndefined()

		a.res('TestMessage');
		expect(protoCallCount).toBe(1);
		expect(a.test).toBe('TestMessage');
		expect(a.subinit).toBe('yes');

		result.call(b, 'NewMessage');

		expect(protoCallCount).toBe(2);
		expect(b.test).toBe('NewMessage');
		expect(b.subinit).toBe('yes');

	});

});

describe('Function.create with signature', function() {

	it('[ Object ] should throw', function() {
		function bad() {
			Function.create({test: true});
		}
		expect(bad).toThrow();
	});
	it('[ Object, true ] should throw', function() {
		function bad() {
			Function.create({test: true}, true);
		}
		expect(bad).toThrow();
	});
	it('[ Object, true, true ] should throw', function() {
		function bad() {
			Function.create({test: true}, true, true);
		}
		expect(bad).toThrow();
	});
	it('[ Object, true, true, true ] should throw', function() {
		function bad() {
			Function.create({test: true}, true, true, true);
		}
		expect(bad).toThrow();
	});

	it('[ Object, Function ] should return target function', function() {
		function fn() {}

		var res = Function.create({test:true}, fn);

		expect(res).toBe(fn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);

	});

	it('[ Object, Function, Object ] should return target function with properties', function() {
		function fn() {}

		var res = Function.create({test:true}, fn, {
			desc: {
				value: 'hello'
			}
		});

		expect(res).toBe(fn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);
		expect(res.desc).toBe('hello');
		expect(res.hasOwnProperty('desc')).toBe(true);

	});

	it('[ Object, Function, true ] should return target function (no parent fn to wrap with.)', function() {
		function fn() {}

		var res = Function.create({test:true}, fn, true);

		expect(res).toBe(fn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);

	});

	it('[ Function, Function ] should return target function (no inherit flag.)', function() {
		function protoFn() {}
		function targetFn() {}

		protoFn.test = true;

		var res = Function.create(protoFn, targetFn);

		expect(res).toBe(targetFn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);

	});

	it('[ Function, Function, Object ] should return target function (with own properties.)', function() {
		function protoFn() {}
		function targetFn() {}

		protoFn.test = true;

		var res = Function.create(protoFn, targetFn, {
			desc: {
				value: 'hello'
			}
		});

		expect(res).toBe(targetFn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);
		expect(res.desc).toBe('hello');
		expect(res.hasOwnProperty('desc')).toBe(true);


	});

	it('[ Function, Function, true ] should return wrapper function', function() {
		function protoFn() {}
		function targetFn() {}

		protoFn.test = true;

		var res = Function.create(protoFn, targetFn, true);

		expect(res).not.toBe(targetFn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);

	});

	it('[ Function, Function, Object, true ] should return wrapper function', function() {
		function protoFn() {}
		function targetFn() {}

		protoFn.test = true;

		var res = Function.create(protoFn, targetFn, {
			desc: {
				value: 'hello'
			}
		}, true);

		expect(res).not.toBe(targetFn);
		expect(res.test).toBe(true);
		expect(res.hasOwnProperty('test')).toBe(false);
		expect(res.desc).toBe('hello');
		expect(res.hasOwnProperty('desc')).toBe(true);

	});

});



