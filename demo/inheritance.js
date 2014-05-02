



var Model = function Model(name){
	// ...
};

Model.staticMethod = function() {
	// ...
};

Model.protoype.method = function (arg) {
	// ...
};

var SuperModel = function SuperModel(name){
	Model.call(this, name);
	// ...
};

SuperModel.staticMethod = Model.staticMethod;

SuperModel.protoype = Object.create(Model.prototype);


Supermodel.protoype.another = function() {
	// ...
};



///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////











var Model = function Model(name){
	// ...
};

Model.staticMethod = function() {
	// ...
};

Model.protoype.method = function (arg) {
	// ...
};

var SuperModel = Function.create(Model, function SuperModel($super, name) {
	$super(name);
	// ...
});

Supermodel.protoype.another = function() {
	// ...
};













