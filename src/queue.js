	var Queue = function (names, next, undefined) {
		this.modules = {};
		this.names = modulesController.findMissing(names);
		this.next = next;
		if (this.names) {
			modulesController.on('MODULE_DEFINED', this.onModuleDefined, this);
			return app.vendorRequire(this._namesToPaths(this.names), function(){}, function (err) {
				next(err);
			});
		}
		else
			return next(undefined, modulesController.pack(names));
	};

	_.extend(Queue.prototype, {
		modules: {},
		names: null,
		next: null,
		autoinits: [],
		isQueueEmpty: function () {
			return !this.names.length;
		},

		_namesToPaths: function (names) {
			return _.map(names, function (name) {
				return app.transformToPath(name);
			}, this);
		},

		onModuleDefined: function (module, undefined) {
			//если модуль из этой очереди, то удалить его из очереди
			if (!this.isModuleFromThisQueue(module.name))
				return;

			this.modules[module.name] = module;
			this.names.splice(this.names.indexOf(module.name), 1);
			if ()

			//когда все модули загружены
			if (this.isQueueEmpty()) {
				modulesController.off('MODULE_DEFINED', this.onModuleDefined, this);
				//формирую список модулей и их зависимостей
				var exportList =_.extend(this.modules, modulesController.getDeps(this.modules));
				//колбэк самого первого уровня вложенности (относительно очереди)
				this.next(undefined, exportList);
			}
			return this;
		},

		isModuleFromThisQueue: function (moduleName) {
			return !!_.find(this.names, function (module) {
				return module === moduleName;
			});
		}
	});

