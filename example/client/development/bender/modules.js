(function () {
	var app;

	//------- Module API
	var Module = function (name, fn, next) {
		this.name = name;
		this.deps = [];
		this.config = {};
		try {
			this.implementation = fn.call(this, app);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}
		this.setType(name.split(':')[0]);
		this.deps.length ? this.loadDeps(next) : next(this);
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

		setType: function (type) {
			switch (type) {
				case 'Views': this.isView = true; break;
				case 'Models': this.isModel = true; break;
				case 'Collections': this.isCollection = true; break;
				case 'Plugins': this.isPlugin = true; break;
				case 'Bender': this.isCore = true; break;
			}
			this.config['type'] = type;
			return this;
		},

		loadDeps: function (next) {
			app.Modules.require(this.deps, function () {
				next(this);
			}, function (err) {
				console.log('Error in deps requiring...');
				console.log(err);
			});
			return this;
		}
	});
	// ------------- end of Module

	//---------- Queue API
	var Queue = function (modules, cbk, err) {
		this.modules = modules;
		app.Events.on('Modules:Defined', this.onModuleDefined, this);
	};
	_.extend(Queue.prototype, {
		onModuleDefined: function (module) {
			if (this.exist(module)) {
				debugger;

			}
		},

		exist: function (moduleName) {
			return _.find(this.modules, function (module) {
				return module === moduleName;
			});
		},

		terminate: function () {

		}
	});
	// --------- end of Queue

	//--------- Controller API
	var Controller = function(mainApp){
		app = mainApp;
		this.modules = {};
		this.queue = {};
		this.init();
	};
	_.extend(Controller.prototype, {
		get: function (name) {
			return this.modules[name].implementation;
		},

		define: function (moduleName, fn) {
			var controller = this;
			new Module(moduleName, fn, function (module) {
				controller.modules[moduleName] = module;
				app.Events.trigger('Modules:Defined', module);
			}.bind(this));
			return this;
		},

		init: function () {
			window.benderDefine = this.define.bind(this);
			return this;
		},

		//поиск по атрибутам которые указаны в this.configure(). например по шаблону или по пути
		findBy: function (criteria, value) {
			return _.find(this.modules, function (module) {
				return module.config[criteria] === value;
			}, this);
		},

		//requirejs wrapper
		require: function (modules, next, err) {
			var missing = this.findMissing(modules);
			for (var i = 0; i < missing.length; i++) {
				missing[i] = app.transformToPath(missing[i]);
			}
			//если модули уже загружены - вызов
			if (!missing.length) next();

			var queue = new Queue(missing);

				//requirejs call
			require(missing, function () {
				queue.terminate();
			}, err);
		},

		exist: function (moduleName) {
			return _.find(this.modules, function (module) {
				return module.name === moduleName;
			}, this);
		},

		findMissing: function (list) {
			return _.filter(list, function (moduleName) {
				!this.exist(moduleName) && !this.inQueue(moduleName);
			});
		}
	});
	window.BenderModuleController = Controller;
})();