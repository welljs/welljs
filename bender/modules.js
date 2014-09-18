(function () {
	'use strict';
	var app;
	//------- Module API
	var Module = function (name, fn, next) {
		this.name = name;
		this.deps = [];
		this.config = {};
		this.onCompleteFns = [];
		this.controller = app.Modules;
		try {
			this.implementation = fn.call(this, app);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}

		this.setType(this.config.type || name.split(':')[0]);

		_.isEmpty(this.deps)
			? next(this)
			: this.waitForDeps(next);
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
			if (type.substr(-1) === 's')
				type = type.slice(0, -1);
			switch (type.toLowerCase()) {
				case 'view': this.isView = true; break;
				case 'model': this.isModel = true; break;
				case 'collection': this.isCollection = true; break;
				case 'plugin': this.isPlugin = true; break;
				case 'bender': this.isCore = true; break;
			}
			this.config['type'] = type;
			return this;
		},

		waitForDeps: function (next) {
			var deps = _.clone(this.controller.findMissing(this.deps));
			var self = this;

			//тут ожидается define всех зависимостей
			function handle(module) {
				var index = self.deps.indexOf(module.name);
				if (index === -1) return;
				deps.splice(index, 1);
				if (_.isEmpty(deps)) {
					app.Events.off('MODULE_DEFINED', handle, this);
					next(self);
				}

			}
			// на продакше модули собраны в один файл.
			// их не надо подгружать, нужно просто дождаться пока определятся нужные
			if (app.isProduction) {
				app.Events.on('MODULE_DEFINED', handle, this);
			}
			else {
				//на девелопменте разобраны по файлам и их надо подгружать
				app.Modules.require(this.deps, function () {
					next(this);
				}.bind(this), function (err) {
					console.log('Error in deps requiring...');
					console.log(err);
				});
			}
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
			//если есть зависимость, добавить ее в массив

			//если модуль из этой очереди, то удалить его из очереди
			if (this.exist(module.name)) {
				this.modules[module.name] = module;
				this.names.splice(this.names.indexOf(module.name), 1);
			}

			//когда все модули загружены
			if (!this.names.length){
				app.Events.off('MODULE_DEFINED', this.onModuleDefined, this);

				//формирую список модулей и их зависимостей
				var exportList =_.extend(this.modules, this.controller.getDeps(this.modules));
				//колбэк самого первого уровня вложенности (относительно очереди)
				this.next(exportList, this);
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
			var self = this;
			new Module(moduleName, fn, function (module) {
				self.modules[moduleName] = module;
				app.Events.trigger('MODULE_DEFINED', module);
			});
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
			if (_.isEmpty(missing)) {
				return next(this.pack(modules));
			}
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
		},

		pack: function (names) {
			var res = {};
			_.each(names, function (name) {
				res[name] = this.getModule(name);
			}, this);
			return _.extend(res, this.getDeps(res));
		},

		getDeps: function (modules) {
			var res = {};
			_.each(modules, function (module) {
				_.each(module.deps, function (dep) {
					res[dep] = this.getModule(dep);
				}, this)
			}, this);
			return res;
		}
	});
	window.BenderModuleController = Controller;
})();