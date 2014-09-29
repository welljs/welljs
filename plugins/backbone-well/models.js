wellDefine('Plugins:BackboneWell:Models', function (app) {
	this.export(function () {
		var Controller = function () {
			this.initialized ={};
			this.modules = {};
			this.config = {};
			app.Events.on('MODULE_DEFINED', this.onModuleDefined, this);
		};

		Controller.prototype.onModuleDefined = function (module) {
			if (module.isModel)
				this.set(module)
		};

		Controller.prototype.get = function (name) {
			return this.modules[name].exportFn();
		};

		Controller.prototype.set = function (module) {
			this.modules[module.name] = module;
		};

		return new Controller();
	});
});