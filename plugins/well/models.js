wellDefine('Plugins:Well:Models', function (app) {
	return function () {
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
			return this.modules[name].implementation();
		};

		Controller.prototype.set = function (module) {
			this.modules[module.name] = module;
		};

		return new Controller();
	}
});