function getWrappedFunction(proto, fn, argList) {
	return eval(
		'(function(p,f){\n' + 
		'	return function ' + fn.name + ' (' + argList.join(', ') + '){\n' +
		'		var l=arguments.length,i=0,scope=this,\n' +
		'			args=[function(){ return p.apply(scope, arguments) }];\n' +
		'		for (;i<l;args.push(arguments[i++]));\n' + 
		'		return f.apply(scope, args);\n' +
		'	};'+
		'});'
	)(proto, fn);
}

module.exports = getWrappedFunction;