	var Modules = function(mainApp){
		this.app = mainApp;
		this.modules = {};
		this.init();
	};

	Modules.prototype.get = function (name) {
		return this.modules[name].exportFn;
	};

	Modules.prototype.getModule = function (name) {
		return this.modules[name];
	};

	Modules.prototype.define = function (moduleName, fn) {
		var self = this;
		new Module(moduleName, fn, function (module) {
			self.modules[moduleName] = module;
			self.app.Events.trigger('MODULE_DEFINED', module);
		}, this.app);
		return this;
	};

	Modules.prototype.init = function () {
		window.wellDefine = this.define.bind(this);
		return this;
	};

	//поиск по атрибутам которые указаны в this.options(). например по шаблону или по пути
	Modules.prototype.findBy = function (criteria, value) {
		return _.find(this.modules, function (module) {
			return module.config[criteria] === value;
		}, this);
	};

	//AMD provider wrapper
	Modules.prototype.require = function (modules, next, err) {
		var missing = this.findMissing(modules);
		//если модули уже загружены - вызов
		if (!missing.length)
			return next(this.pack(modules));

		new Queue(_.clone(missing), next, this.app);

		if (!this.app.isProduction) {
			missing = _.map(missing, function (moduleName) {
				return this.app.transformToPath(moduleName);
			}, this);
			this.vendorRequire(missing, function(){}, err);
		}
		return this;
	};

	//override this method to configure your AMD vendor
	Modules.prototype.requireConfig = function () {
		var options = this.app.options;
		requirejs.config({
			urlArgs: options.cache === false ? (new Date()).getTime() :  '',
			waitSeconds: 60,
			baseUrl: options.appRoot,
			paths: {
				well: options.wellRoot,
				plugins: options.pluginsRoot,
				vendor: options.vendorRoot
			}
		});
		return this;
	};

	//override this method to setup your AMD vendor
	Modules.prototype.vendorRequire = function (modules, next, err) {
		//requirejs call
		require(modules, next, err);
	};

	Modules.prototype.exist = function (moduleName) {
		return _.find(this.modules, function (module) {
			return module.name === moduleName;
		}, this);
	};

	Modules.prototype.findMissing = function (list) {
		return _.filter(list, function (moduleName) {
			return !this.exist(moduleName);
		}, this);
	};

	Modules.prototype.pack = function (names) {
		var res = {};
		_.each(names, function (name) {
			res[name] = this.getModule(name);
		}, this);
		return _.extend(res, this.getDeps(res));
	};

	Modules.prototype.getDeps = function (modules) {
		var res = {};
		_.each(modules, function (module) {
			_.each(module.deps, function (dep) {
				res[dep] = this.getModule(dep);
			}, this)
		}, this);
		return res;
	};

	window.WellModuleModules = Modules;