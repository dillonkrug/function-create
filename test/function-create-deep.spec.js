// require('function-create');
require('../src/function-create'); 



describe('Function.create with $super', function() {
	
	it('should set the input function\'s prototype to the input prototype', function() {
		var protoCallCount = 0;
		var protoFn = function(msg) {
			protoCallCount++;
			this.test = msg;
		};

		var inputFn = function namedInput($super, m){
			$super(m);
			this.subinit = 'yes';
		};

		protoFn.protoA = 'hello';
		protoFn.protoB = 'goodbye';

		var a = {
			res: Function.create(protoFn, inputFn, {
				ownA: {
					value: 1234
				},
				ownB: {
					value: true
				}
			}, true)
		};

		var b = {};

		expect(a.res.ownA).toBe(1234);
		expect(a.res.ownB).toBe(true);
		expect(a.res.protoA).toBe('hello');
		expect(a.res.protoB).toBe('goodbye');
		expect(a.res.hasOwnProperty('ownA')).toBe(true);
		expect(a.res.hasOwnProperty('ownB')).toBe(true);
		expect(a.res.hasOwnProperty('protoA')).toBe(false);
		expect(a.res.hasOwnProperty('protoB')).toBe(false);

		expect(Object.getPrototypeOf(a.res)).toBe(protoFn);

		//since it's a wrapped function
		expect(a.res).not.toBe(inputFn);
		expect(a.res.name).toBe('namedInput');

		expect(a.test).toBeUndefined();
		expect(a.subinit).toBeUndefined();

		a.res('TestMessage');
		expect(protoCallCount).toBe(1);
		expect(a.test).toBe('TestMessage');
		expect(a.subinit).toBe('yes');

		a.res.call(b, 'NewMessage');

		expect(protoCallCount).toBe(2);
		expect(b.test).toBe('NewMessage');
		expect(b.subinit).toBe('yes');

		var lowerFn = function iHaveAName($super, stuff) {
			$super('LOWERMESSAGE');
			this.level3 = true;
			this.stuff = 'things' + stuff;
		};

		var c = {
			fn: Function.create(a.res, lowerFn, {
				lowerA: {
					value: 'level3A',
					enumerable: true
				},
				lowerB: {
					value: 'level3B',
					enumerable: true
				}
			})
		};

		expect(c.fn.protoA).toBe('hello');
		expect(c.fn.protoB).toBe('goodbye');
		expect(c.fn.ownA).toBe(1234);
		expect(c.fn.ownB).toBe(true);
		expect(c.fn.lowerA).toBe('level3A');
		expect(c.fn.lowerB).toBe('level3B');
		expect(c.fn.hasOwnProperty('lowerA')).toBe(true);
		expect(c.fn.hasOwnProperty('lowerB')).toBe(true);
		expect(c.fn.hasOwnProperty('ownA')).toBe(false);
		expect(c.fn.hasOwnProperty('ownB')).toBe(false);
		expect(c.fn.hasOwnProperty('protoA')).toBe(false);
		expect(c.fn.hasOwnProperty('protoB')).toBe(false);

		expect(Object.getPrototypeOf(c.fn)).toBe(a.res);
		expect(Object.getPrototypeOf(Object.getPrototypeOf(c.fn))).toBe(protoFn);

		//since it's a wrapped function
		expect(c.fn).not.toBe(lowerFn);
		expect(c.fn.name).toBe(lowerFn.name);
		expect(c.fn.length).toBe(1);
		expect(c.fn.length).toBe(lowerFn.length - 1);

		expect(c.test).toBeUndefined();
		expect(c.subinit).toBeUndefined();
		expect(c.stuff).toBeUndefined();

		c.fn(' and stuff');
		expect(protoCallCount).toBe(3);
		expect(c.test).toBe('LOWERMESSAGE');
		expect(c.subinit).toBe('yes');
		expect(c.stuff).toBe('things and stuff');







	});

});