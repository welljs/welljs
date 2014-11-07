	var Queue = function (names, next, undefined) {
		this.modules = {};
		this.names = modulesController.findMissing(names);
		this.names = this._extendNames(names);
		this.next = next;
		if (this.names.length) {
			app.on('MODULE_DEFINED', this.onModuleDefined, this);
			this.enqueue(this.names);
		}
		else
			return next(undefined, modulesController.pack(names));
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

		_namesToPaths: function (args) {
			return _.map(args, function (arg) {
				return app.transformToPath(arg.name);
			}, this);
		},

		onModuleDefined: function (module) {
			if (this.isModuleFromThisQueue(module.name)) {
				this.handleModule(module);
				var deps = module.getDeps();
				if (deps.length) {
					// надо заставить модуль слушать MODULE_DEFINED своих зависимостей.
					// когда все задефайнятся - инициализировать его
					this.enqueue(deps);
				}
				else {
					this.tryToComplete();
				}

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
			return app.vendorRequire(this._namesToPaths(this.names), function(){}, function (err) {
				self.next(err);
			});
		},

		tryToComplete: function () {
			if (this.isQueueEmpty()) {
				this.complete();
			}
		},

		complete: function () {
			app.off('MODULE_DEFINED', this.onModuleDefined, this);
			//формирую список модулей и их зависимостей
			var exportList =_.extend(this.modules, modulesController.getDeps(this.modules));
			//колбэк самого первого уровня вложенности (относительно очереди)
			this.next(undefined, exportList);
		},

		isModuleFromThisQueue: function (moduleName) {
			return !!_.find(this.names, function (module) {
				return module.name === moduleName;
			});
		}
	});

