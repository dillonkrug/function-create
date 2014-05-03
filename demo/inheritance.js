
///////////////////////////////////////////////////////
////////////////////  TRADITIONAL  ////////////////////
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

var SuperModel = function SuperModel(name){
	Model.call(this, name);
	// ...
};

SuperModel.staticMethod = Model.staticMethod;

SuperModel.protoype = Object.create(Model.prototype);

SuperModel.protoype.another = function() {
	// ...
};



///////////////////////////////////////////////////////
/////////////////  Function.create()  /////////////////
///////////////////////////////////////////////////////


var Model = function Model(name){
	// ...
};

Model.staticMethod = function() {
	// ...
};

Model.protoype.method = function () {
	// ...
};

var SuperModel = Function.create(Model, function SuperModel($super, name) {
	$super(name);
	// ...
});

// static methods are automatically inherited (and if they change on the parent function, they also change everywhere else)

SuperModel.protoype.another = function() {
	// ...
};


