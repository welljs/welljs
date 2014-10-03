(function(){
	 'use strict'; 
 	//Events ideas little borrowed from Backbone
	var EventsController = function () {};
	EventsController.prototype.on = function (name, callback, context) {
		this._events || (this._events = {});
		var events = this._events[name] || (this._events[name] = []);
		events.push({callback: callback, context: context, ctx: context || this});
		return this;
	};

	EventsController.prototype.off = function (name, callback, context) {
		var retain, ev, events, names, i, l, j, k;
		if (!name && !callback && !context) {
			this._events = void 0;
			return this;
		}
		names = name ? [name] : _.keys(this._events);
		for (i = 0, l = names.length; i < l; i++) {
			name = names[i];
			if (events = this._events[name]) {
				this._events[name] = retain = [];
				if (callback || context) {
					for (j = 0, k = events.length; j < k; j++) {
						ev = events[j];
						if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
							(context && context !== ev.context)) {
							retain.push(ev);
						}
					}
				}
				if (!retain.length) delete this._events[name];
			}
		}
		return this;
	};

	var triggerEvents = function(events, args) {
		var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
		switch (args.length) {
			case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
			case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
			case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
			case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
			default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
		}
	};

	EventsController.prototype.trigger = function (name) {
		if (!this._events) return this;
		var args = [].slice.call(arguments, 1);
		var events = this._events[name];
		var allEvents = this._events.all;
		if (events) triggerEvents(events, args);
		if (allEvents) triggerEvents(allEvents, arguments);
		return this;
	};
	var Module = function (name, fn, next, app) {
		_.extend(this, {
			app: app,
			name: name,
			deps: [],
			config: {},
			onCompleteFns: []
		});
		try {
			fn.call(this, app);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}
		this._setType(this.config.type || name.split(':')[0]);
		_.isEmpty(this.deps) ? next(this)	: this.waitForDeps(next);
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
		if (this.app.isProduction) {
			next(this);
		}
		else {
			var Modules = this.app.Modules;
			var deps = _.clone(Modules.findMissing(this.deps));
			var self = this;
			//на девелопменте разобраны по файлам и их надо подгружать
			Modules.require(this.deps, function () {
				next(self);
			}, function (err) {
				console.log('Error in deps requiring...', err);
			});
		}
		return this;
	};

	var Queue = function (names, next, app) {
		this.modules = {};
		this.app = app;
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
		if (!this.names.length) {
			var app = this.app;
			app.Events.off('MODULE_DEFINED', this.onModuleDefined, this);
			//формирую список модулей и их зависимостей
			var exportList =_.extend(this.modules, app.Modules.getDeps(this.modules));
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
		if (_.isEmpty(missing))
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
	var App = function (options) {
		this.isProduction = options.isProduction;
		this.defaults = {
			strategy: 'Well:Defaults:Strategy',
			router: 'Plugins:BackboneWell:Router',
			templates: 'Plugins:BackboneWell:Templates',
			views: 'Plugins:BackboneWell:Views',
			models: 'Plugins:BackboneWell:Models',
			collections: 'Plugins:BackboneWell:Collections'
		};
		this.options = _.extend(this.defaults, options);
		this.Events = _.extend(options.eventsEngine || new EventsController());
		window[this.options.appName || 'Well'] = this;
		this.init();
	};

	_.extend(App.prototype,{

		//вынести в контроллер модулей
		requireConfig: function () {
			requirejs.config({
				urlArgs: this.options.cache === false ? (new Date()).getTime() :  '',
				waitSeconds: 60,
				baseUrl: this.options.appRoot,
				paths: {
					well: this.options.wellRoot,
					plugins: this.options.pluginsRoot,
					vendor: this.options.vendorRoot
				}
			});
			return this;
		},

		init: function () {
			this.Modules = new Modules(this);
			if (!this.isProduction)
				this.requireConfig();
			this.loadCore();
		},

		loadCore: function () {
			var options = this.options;
			var self = this;
			this.Modules.require(
				[
					options.templates,
					options.views,
					options.router,
					options.models,
					options.collections
				],
				function () {
					self.onCoreLoaded.call(self);
				},
				function () {
					self.onCoreLoadError.call(self);
				});
		},

		onCoreLoaded: function () {
			var Modules = this.Modules;
			var self = this;
			this.Models = new (Modules.get(this.options.models));
			this.Collections = new (Modules.get(this.options.collections));
			this.Router = new(Modules.get(this.options.router));
			this.Templates = new (Modules.get(this.options.templates));
			this.Views = new (Modules.get(this.options.views));
			this.Modules.require([this.options.strategy], function () {
					self.Strategy = new(Modules.get(self.options.strategy));
				},
				function (err) {
					self.onCoreLoadError.call(self, err);
				});
			return this;
		},

		onCoreLoadError: function (err) {
			console.log('Welljs: ', err.message);
			if (this.reloaded) {
				console.log('Error in project loading! Can\'t find Welljs root');
			}
			else {
				console.log('Defaults will be loaded');
				this.options.strategy = (this.defaults.strategy = 'Well:Defaults:Strategy');
				this.loadCore();
				this.reloaded = true;
			}
		},

		start: function () {
			this.Router.start();
		},

		//SomeModule:Name -> some-module/name
		transformToPath: function (name) {
			return name ? name.split(/(?=[A-Z])/).join('-').toLowerCase().split(':-').join('/') : name;
		},

		//some/file-name -> Some:FileName
		transformToName: function (path) {
			if (!path) return;
			path = this.capitalize(path.replace(/^\//, '').split('/')).join(':');
			return this.capitalize(path.split('-')).join('');
		},

		//transform first letter to uppercase in all array items
		capitalize: function (arr) {
			return _.map(arr, function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			});
		},

		getFileName: function (modName) {
			return /:([^:]+)$/.exec(modName)[1];
		}
	});

	new App(window.WellConfig || {});  
})();