require('../');

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


ninja.attack(pirate);	// -> logs: [ silence... ]
pirate.attack(ninja);	// [DRAW]
ninja.attack(pirate);	// -> logs: [ silence... ]
pirate.attack(ninja);	// -> logs: Yarrrr!
ninja.attack(pirate);	// -> logs: [ silence... ]
pirate.attack(ninja);	// -> logs: Yarrrr!
ninja.attack(pirate);	// [LOSS]
pirate.attack(ninja);	// -> logs: Yarrrr!

console.log(ninja); 	// -> logs: { skill: 8, end: 4, str: 0, exp: 4, catchPhrase: '[ silence... ]' }
console.log(pirate);	// -> logs: { skill: 6, end: 6, str: 32, exp: 4, catchPhrase: 'Yarrrr!', booty: 50 }