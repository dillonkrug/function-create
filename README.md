Function.create
===============

Function.create(proto, fn, props) — Object.create() for functions


Just as you might create an object with a given prototype, this module allows you to create a function with a given prototype.

When used with two functions, if the first parameter of the second function is `$super`, it will be automatically filled with a reference to the parent function, bound to the inheriting function's scope.

An example is probably better than trying to figure out what that actually means...


```javascript

var Parent = function(){
	this.field = 'hello'
}

Parent.staticProperty = 'I\'m a test class!';

var Test = Function.create(Parent, function($super){
	$super();
	this.field += ' world.';
});

console.log(Test.staticProperty);	// -> logs: "I'm a test class!"

var obj = new Test();

console.log(obj.field);				// -> logs: "hello world."

```


Usage
===============

**Function.create**(*prototype*, *inputFunction*, *propertyDescriptor*, *preserveArity*)

 - prototype: the prototype for the target function
 - inputFunction: the target function 
 - propertyDescriptor: a property descriptor ([MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties))
 - preserveArity: if true, the name and parameters for the `inputFunction` will be preserved. **NOTE** this uses eval and is accordingly slower.

### NOTE: 
this is kinda wonky, but sometimes Function.create returns `inputFunction`, and sometimes it is a new function (which calls `inputFunction`).

The intended use is `Function.create(proto, function literal(){ /* not a variable */ })`, so it shouldn't be a problem.  I may standardize it in the future.  for now it just does whatever will run faster.  If the `prototype` passed in is not a function, it will always return `inputFunction`



More Examples
===============

```javascript
var fn = Function.create({
	propA: 'hello',
}, function() {
	return 'Hello World!';
}, {
	own: {
		value: 'test'
	}
});

fn(); 							// -> "Hello World"

fn.hasOwnProperty('propA')		// -> false
fn.propA 						// -> "hello"

fn.hasOwnProperty('own')		// -> true
fn.own 							// -> "test"

```

```javascript

var Fighter = function(skill, endurance, name, catchPhrase){
	this.skill = skill;
	this.end = endurance;
	this.str = 100;
	this.exp = 0;
	this.catchPhrase = catchPhrase;
};

Fighter.prototype.attack = function(target){
	console.log(this.skill, this.skill*this.str, target.skill*target.str);
	var won = this.skill*this.str > target.skill*target.str;
	if(won) console.log(this.catchPhrase);
	this.str -= Math.round(100/(this.end));
	this.exp++;
	return won;
};

var Ninja = Function.create(Fighter, function($super, name){
	$super(8, 4, name, '[ silence... ]');
});

var Pirate = Function.create(Fighter, function($super, name){
	$super(6, 6, name, 'Yarrrr!');
	this.booty = 0;
});

Pirate.prototype.attack = Function.create(Pirate.prototype.attack, function($super, target){
	var won = $super(target);
	this.booty += (won ? 1 : -1) * 25;
});

var pirate = new Pirate('RedBeard');

var ninja = new Ninja('Fred');


ninja.attack(pirate);	// -> logs: "[ silence... ]"
pirate.attack(ninja);	// [DRAW]
ninja.attack(pirate);	// -> logs: "[ silence... ]"
pirate.attack(ninja);	// -> logs: "Yarrrr!"
ninja.attack(pirate);	// -> logs: "[ silence... ]"
pirate.attack(ninja);	// -> logs: "Yarrrr!"
ninja.attack(pirate);	// [LOSS]
pirate.attack(ninja);	// -> logs: "Yarrrr!"

console.log(ninja); 	// -> logs: { skill: 8, end: 4, str: 0, exp: 4, catchPhrase: '[ silence... ]' }
console.log(pirate);	// -> logs: { skill: 6, end: 6, str: 32, exp: 4, catchPhrase: 'Yarrrr!', booty: 50 }


```


Info
===============

This is a little bit hackish.  It uses Object.setPrototypeOf if it's available, but otherwise it sets the __proto__ property directly which is not ideal.  

My hope in creating this module is that it will eventually be replace by a built-in method.