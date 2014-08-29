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
		require: function (modules, cbk, err) {
			var missing = this.findMissing(modules);
			for (var i = 0; i < missing.length; i++) {
				missing[i] = app.transformToPath(missing[i]);
			}

			//создать очередь

			//requirejs call
			require(missing, function () {
				//если есть зависимости, надо дождаться их
			}, err);
		},

		exist: function (moduleName) {
			return _.find(this.modules, function (module) {
				return module.name === moduleName;
			}, this);
		},

		findMissing: function (list) {
			return _.filter(list, function (moduleName) {
				!this.exist(moduleName);
			});
		}
	});
	window.BenderModuleController = Controller;
})();