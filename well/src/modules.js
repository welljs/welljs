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
			fn.call(this, app);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}
		this._setType(this.config.type || name.split(':')[0]);
		_.isEmpty(this.deps)
			? next(this)
			: this.waitForDeps(next);
	};

	Module.prototype.use = function (module) {
		this.deps.push(this._toFullName(module));
		return this;
	};

	Module.prototype.options = function (options) {
		var opts = options || {};
		opts.template = this._toFullName(opts.template);
		this.config = opts;
		return this;
	};

	Module.prototype.export = function (fn) {
		this.exportFn = fn;
		return this;
	};

	Module.prototype.getOption = function (prop) {
		return this.config[prop];
	};

	Module.prototype._isShortHand = function (name) {
		return name[0] === ':';
	};

	Module.prototype._toFullName = function (name) {
		if (!this._isShortHand(name))
			return name;
		var t = this.name.split(':');
		t.splice(-1, 1);
		return	t.join(':') + name;
	};

	Module.prototype._setType = function (type) {
		if (type.substr(-1) === 's')
			type = type.slice(0, -1);
		switch (type.toLowerCase()) {
			case 'view': this.isView = true; break;
			case 'model': this.isModel = true; break;
			case 'collection': this.isCollection = true; break;
			case 'plugin': this.isPlugin = true; break;
			case 'well': this.isCore = true; break;
		}
		this.config['type'] = type;
		return this;
	};

	Module.prototype.waitForDeps =  function (next) {
		// на продакше модули собраны в один файл.
		// их не надо подгружать, нужно просто дождаться пока определятся нужные
		if (app.isProduction) {
			next(this);
		}
		else {
			var deps = _.clone(this.controller.findMissing(this.deps));
			//на девелопменте разобраны по файлам и их надо подгружать
			app.Modules.require(this.deps, function () {
				next(this);
			}.bind(this), function (err) {
				console.log('Error in deps requiring...');
				console.log(err);
			});
		}
		return this;
	};
	// ------------- end of Module

	//---------- Queue API
	var Queue = function (names, next, controller) {
		this.modules = {};
		this.controller = controller;
		this.names = names;
		this.next = next;
		app.Events.on('MODULE_DEFINED', this.onModuleDefined, this);
	};

	Queue.prototype.onModuleDefined = function (module) {
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
	};

	Queue.prototype.exist = function (moduleName) {
		return _.find(this.names, function (module) {
			return module === moduleName;
		});
	};
	// --------- end of Queue

	//--------- Controller API
	var Controller = function(mainApp){
		app = mainApp;
		this.modules = {};
		this.init();
	};

	Controller.prototype.get = function (name) {
		return this.modules[name].exportFn;
	};

	Controller.prototype.getModule = function (name) {
		return this.modules[name];
	};

	Controller.prototype.define = function (moduleName, fn) {
		var self = this;
		new Module(moduleName, fn, function (module) {
			self.modules[moduleName] = module;
			app.Events.trigger('MODULE_DEFINED', module);
		});
		return this;
	};

	Controller.prototype.init = function () {
		window.wellDefine = this.define.bind(this);
		return this;
	};

//поиск по атрибутам которые указаны в this.options(). например по шаблону или по пути
	Controller.prototype.findBy = function (criteria, value) {
		return _.find(this.modules, function (module) {
			return module.config[criteria] === value;
		}, this);
	};

  //AMD provider wrapper
	Controller.prototype.require = function (modules, next, err) {
		var missing = this.findMissing(modules);
		//если модули уже загружены - вызов
		if (_.isEmpty(missing))
			return next(this.pack(modules));

		new Queue(_.clone(missing), next, this);

		if (!app.isProduction) {
			missing = _.map(missing, function (moduleName) {
				return app.transformToPath(moduleName);
			}, this);
			this.vendorRequire(missing, function(){}, err);
		}
		return this;
	};

	//override this method to setup your AMD vendor
	Controller.prototype.vendorRequire = function (modules, next, err) {
		//requirejs call
		require(modules, next, err);
	};

	Controller.prototype.exist = function (moduleName) {
		return _.find(this.modules, function (module) {
			return module.name === moduleName;
		}, this);
	};

	Controller.prototype.findMissing = function (list) {
		return _.filter(list, function (moduleName) {
			return !this.exist(moduleName);
		}, this);
	};

	Controller.prototype.pack = function (names) {
		var res = {};
		_.each(names, function (name) {
			res[name] = this.getModule(name);
		}, this);
		return _.extend(res, this.getDeps(res));
	};

	Controller.prototype.getDeps = function (modules) {
		var res = {};
		_.each(modules, function (module) {
			_.each(module.deps, function (dep) {
				res[dep] = this.getModule(dep);
			}, this)
		}, this);
		return res;
	};


	window.WellModuleController = Controller;
})();