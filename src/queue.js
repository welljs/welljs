	var Queue = function (names, next, undefined) {
		this.modules = {};
		this.names = modulesController.findMissing(names);
		this.next = next;
		this.clones = [];
		this.waitingForOriginal = [];

		if (!this.names.length) {
			this.names = this._extendNames(names);
			this.orderedMods = this.names.slice(0);
			this.modules = modulesController.pack(names);
			return this.complete();
		}

		app.on('MODULE_DEFINED', this.onModuleDefined, this);
		this.names = this._extendNames(this.names);
		this.orderedMods = this.names.slice(0);
		!app.isProduction && this.enqueue(this.names);
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

		_exist: function (a) {
			return !!_.find(this.names, function (m) {
				return a.name === m.name;
			});
		},

		_findMissing: function (mods) {
			var r = [];
			_.each(mods, function (m) {
				!this._exist(m) && !modulesController.exist(m.name) && r.push(m);
			}, this);
			return r;
		},

		onModuleDefined: function (module) {
			if (app.isProduction) {
				this.handleModule(module);
				(this.isQueueEmpty() && this.complete());
			}
			else if (this.isModuleFromThisQueue(module.name)) {
				this.handleModule(module);
				var deps = this._findMissing(module.getDeps());
				deps.length 
					? this.enqueue(deps)
					: (this.isQueueEmpty() && this.complete());
			}
		},

		handleModule: function (module) {
			var m, len, i;
			var names = this.names;
			var origName = 'Original:'+module.name;
			if (module.get('isClone')) {
				this.clones.push(origName);
				modulesController.add(module);
			}
			//is someone's original
			else if ((i = this.clones.indexOf(origName)) !== -1) {
				this.clones.splice(i, 1);
				module.name = origName;
				modulesController.add(module);
			}
			// plain module
			else {
				modulesController.add(module);
			}

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
			}) || this.clones.indexOf('Original:' + moduleName) !== -1;
		}
	});

