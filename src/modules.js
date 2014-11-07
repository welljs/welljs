	var Modules = function(mainApp) {};

	_.extend(Modules.prototype, {
		modules: {},
		get: function (name) {
			return this.modules[name].exportsFn;
		},

		add: function (module) {
			return this.modules[module.name] = module;
		},

		getModule: function (name) {
			return this.modules[name];
		},

		//поиск по атрибутам которые указаны в this.options(). например по шаблону или по пути
		findBy: function (option, value) {
			return _.find(this.modules, function (module) {
				return module.options[option] === value;
			}, this);
		},

		filterBy: function (option, value) {
			if (!option || !value) return;
			return _.filter(this.modules, function (module) {
				return module.props[option] === value;
			}, this);
		},

		exist: function (moduleName) {
			return !!this.modules[moduleName];
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
					res[dep] = this.getModule(dep.name);
				}, this)
			}, this);
			return res;
		}

	});
