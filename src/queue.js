	var Queue = function (names, next, app) {
		this.modules = {};
		this.app = app;
		this.names = names;
		this.next = next;
		app.Modules.on('MODULE_DEFINED', this.onModuleDefined, this);
	};

	_.extend(Queue.prototype, {
		_initializeAutoinited: function () {
			_.each(autoInits, function (moduleName) {
				var fn = this.app.Modules.get(moduleName);
				if (_.isFunction(fn))
					fn();
			}, this);
		},

		isQueueEmpty: function () {
			return !this.names.length;
		},

		onModuleDefined: function (module, undefined) {
			//если модуль из этой очереди, то удалить его из очереди
			if (!this.isModuleFromThisQueue(module.name))
				return;

			this.modules[module.name] = module;
			this.names.splice(this.names.indexOf(module.name), 1);

			//когда все модули загружены
			if (this.isQueueEmpty()) {
				var app = this.app;
				app.Modules.off('MODULE_DEFINED', this.onModuleDefined, this);
				//формирую список модулей и их зависимостей
				var exportList =_.extend(this.modules, app.Modules.getDeps(this.modules));
				//колбэк самого первого уровня вложенности (относительно очереди)
				this._initializeAutoinited();
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

