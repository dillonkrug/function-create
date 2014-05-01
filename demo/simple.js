require('../');


var Parent = function(msg){
	this.field = msg
}

Parent.staticProperty = 'I\'m a test class!';

var Test = Function.create(Parent, function($super){
	$super('hello');
	this.field += ' world.';
});

console.log(Test.staticProperty);	// -> logs: "I'm a test class!"

var obj = new Test();

console.log(obj.field);				// -> logs: "hello world."
