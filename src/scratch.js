var args = ['a','b','c','d','e']

// for (var args=[],l=arguments.length,i=0;i<l;args.push(arguments[i++]));
// var l, i, times = [];
// for (l=args.length,i=0;i<l;times.push(0), i++);

console.log(args.sort(function() { return Math.random()-0.5; }));