(function () {
	'use strict';
	var app;
	//------- Module API
	var Module = function (name, fn, next) {
		this.name = name;
		this.deps = [];
		this.config = {};
		this.onCompleteFns = [];
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
			this.config = options || {};
			return this;
		},

		getConfigParam: function (prop) {
			return this.config[prop];
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
			}.bind(this), function (err) {
				console.log('Error in deps requiring...');
				console.log(err);
			});
			return this;
		}
	});
	// ------------- end of Module

	//---------- Queue API
	var Queue = function (names, next, controller) {
		this.modules = {};
		this.controller = controller;
		this.names = names;
		this.next = next;
		app.Events.on('MODULE_DEFINED', this.onModuleDefined, this);
	};
	_.extend(Queue.prototype, {
		onModuleDefined: function (module) {
			//если модуль из этой очереди, то удалить его из очереди
			if (this.exist(module.name)) {
				this.modules[module.name] = module;
				this.names.splice(this.names.indexOf(module.name), 1);
			}

			//когда все модули загружены
			if (!this.names.length){
				app.Events.off('MODULE_DEFINED', this.onModuleDefined, this);
				//формирую список модулей и их зависимостей
				_.each(this.modules, function (module) {
					_.each(module.deps, function (dep) {
						!this.modules[dep] && (this.modules[dep] = this.controller.getModule(dep))
					}, this)
				}, this);
				//колбэк самого первого уровня вложенности (относительно очереди)
				this.next(this.modules, this);
			}
			return this;
		},

		exist: function (moduleName) {
			return _.find(this.names, function (module) {
				return module === moduleName;
			});
		}
	});
	// --------- end of Queue

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

		getModule: function (name) {
			return this.modules[name];
		},

		define: function (moduleName, fn) {
			var controller = this;
			new Module(moduleName, fn, function (module) {
				controller.modules[moduleName] = module;
				app.Events.trigger('MODULE_DEFINED', module);
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
			//если модули уже загружены - вызов
			if (!missing.length) return next();
			new Queue(_.clone(missing), next, this);
			missing = _.map(missing, function (moduleName) {
				return app.transformToPath(moduleName);
			}, this);
			//requirejs call
			require(missing, function(){}, err);
			return this;
		},

		exist: function (moduleName) {
			return _.find(this.modules, function (module) {
				return module.name === moduleName;
			}, this);
		},

		findMissing: function (list) {
			return _.filter(list, function (moduleName) {
				return !this.exist(moduleName);
			}, this);
		}
	});
	window.BenderModuleController = Controller;
})();