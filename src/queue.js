	var Queue = function (names, next, undefined) {
		this.modules = {};
		this.names = modulesController.findMissing(names);
		this.next = next;

		if (!this.names.length)
			return next(undefined, modulesController.pack(names));

		app.on('MODULE_DEFINED', this.onModuleDefined, this);
		this.names = this._extendNames(this.names);
		this.orderedMods = this.names.slice(0);
		this.enqueue(this.names);
	};

	_.extend(Queue.prototype, {

		isQueueEmpty: function () {
			return !this.names.length;
		},

		_extendNames: function (args) {
			return _.map(args, function (arg) {
				return _.isString(arg) ? {name: arg, options: {}} : arg;
			})
		},

		_toPaths: function (args) {
			return _.map(args, function (arg) {
				return app.transformToPath(arg.name);
			}, this);
		},

		onModuleDefined: function (module) {
			if (this.isModuleFromThisQueue(module.name)) {
				this.handleModule(module);
				var deps = modulesController.findMissing(module.getDeps());
				deps.length 
					? this.enqueue(deps)
					: (this.isQueueEmpty() && this.complete());
			}
		},

		handleModule: function (module) {
			modulesController.add(module);
			var names = this.names;
			var i, m, len;
			this.modules[module.name] = module;
			for (i = 0, len = names.length; i < len; i++ ) {
				m = names[i];
				if (m.name === module.name)
					break;
			}
			module.set(m.options);
			this.names.splice(i, 1);
		},

		enqueue: function (args) {
			var self = this;
			this.names = _.merge(this.names, args);
			return app.vendorRequire(this._toPaths(this.names), noop, function (err) {
				self.complete(err);
			});
		},

		complete: function (err) {
			app.off('MODULE_DEFINED', this.onModuleDefined, this);
			this.initModules();
			var exportList =_.extend(this.modules, modulesController.getDeps(this.modules));
			this.next(err, exportList);
		},

		initModules: function (deps, context) {
			var self = this;
			_.each(deps || this.orderedMods, function (dep) {
				var mod = modulesController.getModule(dep.name);
				var deps = mod.getDeps();
				var prop = dep.options.as || _.parseName(dep.name).name;
				if (deps.length)
					self.initModules(deps, mod);
				context && self.bindProp(context, prop, dep.options.autoInit !== false ? mod.init() : modulesController.get(dep.name));
			});
		},

		bindProp: function (context, prop, value) {
			context[prop] = value;
		},

		isModuleFromThisQueue: function (moduleName) {
			return !!_.find(this.names, function (module) {
				return module.name === moduleName;
			});
		}
	});

