(function () {
	var app;

	//------- Module API
	var Module = function (name, fn) {
		this.name = name;
		this.deps = [];
		this.config = {};
		try {
			this.implementation = fn.call(this, app);
		}
		catch (e) {
			console.log('error in module:');
			console.log(name);
		}

	};
	_.extend(Module.prototype, {
		use: function (module) {
			this.deps.push(module);
			return this;
		},

		configure: function (options) {
			this.config = options;
			return this;
		},

		isView: function () {
			return this.config.type === 'Views';
		}
	});


	//--------- Controller API
	var Controller = function(mainApp){
		app = mainApp;
		this.modules = {};
		this.init();
	};
	_.extend(Controller.prototype, {
		get: function (name) {
			return this.modules[name].implementation;
		},

		define: function (moduleName, fn) {
			var  module = new Module(moduleName, fn);
			module.config['type'] = moduleName.split(':')[0];
			this.modules[moduleName] = module;
			app.Events.trigger('Modules:Defined', module);
			return this;
		},

		init: function () {
			window.benderDefine = this.define.bind(this);
			return this;
		},

		findBy: function (criteria, value) {
			return _.find(this.modules, function (module) {
				return module.config[criteria] === value;
			}, this);
		},

		//requirejs wrapper
		require: function (modules, cbk, err) {
			for (var i = 0; i < modules.length; i++) {
				modules[i] = app.transformToPath(modules[i]);
			}
			require(modules, cbk, err);
		}
	});
	window.BenderModuleController = Controller;
})();