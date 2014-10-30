	var Modules = function(mainApp) {};

	_.extend(Modules.prototype, EventsController(), {
		modules: {},
		get: function (name) {
			return this.modules[name].exportsFn;
		},

		getModule: function (name) {
			return this.modules[name];
		},

		//поиск по атрибутам которые указаны в this.options(). например по шаблону или по пути
		findBy: function (option, value) {
			return _.find(this.modules, function (module) {
				return module.props[option] === value;
			}, this);
		},

		filterBy: function (option, value) {
			if (!option || !value) return;
			return _.filter(this.modules, function (module) {
				return module.props[option] === value;
			}, this);
		},

		//AMD provider wrapper
		require: function (modules, next, undefined) {
			new Queue(modules, next);
			return this;
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
