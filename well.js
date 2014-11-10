(function(){
	 'use strict'; 
 	var app;
	var modulesController;
	var noop = function(){};
	//a bit of functionality borrowed from Underscore.js
	var Utils = function () {};
	var nativeKeys = Object.keys;

	var ObjProto = Object.prototype;
	var hasOwnProperty =  ObjProto.hasOwnProperty;
	var toString = ObjProto.toString;
	var nativeBind = Function.prototype.bind;

	var createCallback = function(func, context, argCount) {
		if (context === void 0) return func;
		switch (argCount == null ? 3 : argCount) {
			case 1: return function(value) {
				return func.call(context, value);
			};
			case 2: return function(value, other) {
				return func.call(context, value, other);
			};
			case 3: return function(value, index, collection) {
				return func.call(context, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(context, accumulator, value, index, collection);
			};
		}
		return function() {
			return func.apply(context, arguments);
		};
	};

	Utils.prototype.iteratee = function (value, context, argCount) {
		if (this.isFunction(value)) return createCallback(value, context, argCount);
		if (this.isObject(value)) return this.matches(value);
		return this.property(value);
	};

	Utils.prototype.matches  = function (attrs) {
		var pairs = this.pairs(attrs), length = pairs.length;
		return function(obj) {
			if (obj == null) return !length;
			obj = new Object(obj);
			for (var i = 0; i < length; i++) {
				var pair = pairs[i], key = pair[0];
				if (pair[1] !== obj[key] || !(key in obj)) return false;
			}
			return true;
		};
	};

	Utils.prototype.pairs = function(obj) {
		var keys = this.keys(obj);
		var length = keys.length;
		var pairs = Array(length);
		for (var i = 0; i < length; i++) {
			pairs[i] = [keys[i], obj[keys[i]]];
		}
		return pairs;
	};


	Utils.prototype.property = function(key) {
		return function(obj) {
			return obj[key];
		};
	};


	Utils.prototype.isFunction = function (obj) {
		return typeof obj == 'function' || false;
	};

	Utils.prototype.each = function (obj, iteratee, context) {
		if (obj == null) return obj;
		iteratee = createCallback(iteratee, context);
		var i, length = obj.length;
		if (length === +length) {
			for (i = 0; i < length; i++) {
				iteratee(obj[i], i, obj);
			}
		} else {
			var keys = this.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				iteratee(obj[keys[i]], keys[i], obj);
			}
		}
		return obj;
	};

	Utils.prototype.map = function (obj, iteratee, context) {
		if (obj == null) return [];
		iteratee = this.iteratee(iteratee, context);
		var keys = obj.length !== +obj.length && this.keys(obj),
			length = (keys || obj).length,
			results = Array(length),
			currentKey;
		for (var index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			results[index] = iteratee(obj[currentKey], currentKey, obj);
		}
		return results;
	};


	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	Utils.prototype.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};


	Utils.prototype.keys = function (obj) {
		if (!this.isObject(obj)) return [];
		if (nativeKeys) return nativeKeys(obj);
		var keys = [];
		for (var key in obj) if (this.has(obj, key)) keys.push(key);
		return keys;
	};

	Utils.prototype.extend = function (obj) {
		if (!this.isObject(obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	Utils.prototype.isObject = function (obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	Utils.prototype.isString = function (obj) {
		var type = typeof obj;
		return type === 'string' && !!obj;
	};

	Utils.prototype.isArray = function (obj) {
		return toString.call(obj) === '[object Array]';
	};

	Utils.prototype.clone = function (obj) {
		if (!this.isObject(obj)) return obj;
		return this.isArray(obj) ? obj.slice() : this.extend({}, obj);
	};


	// Determine if at least one element in the object matches a truth test.
	// Aliased as `any`.
	Utils.prototype.some = function(obj, predicate, context) {
		if (obj == null) return false;
		predicate = this.iteratee(predicate, context);
		var keys = obj.length !== +obj.length && this.keys(obj),
			length = (keys || obj).length,
			index, currentKey;
		for (index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			if (predicate(obj[currentKey], currentKey, obj)) return true;
		}
		return false;
	};


	Utils.prototype.find = function (obj, predicate, context) {
		var result;
		predicate = this.iteratee(predicate, context);
		this.some(obj, function(value, index, list) {
			if (predicate(value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};

	Utils.prototype.filter = function (obj, predicate, context) {
		var results = [];
		if (obj == null) return results;
		predicate = this.iteratee(predicate, context);
		this.each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	};

	Utils.prototype.merge = function () {
		var res = [];
		this.each(arguments, function (arg) {
			var length = arg.length;
			var i = -1;
			var value;
			while(++i < length) {
				value = arg[i];
				if (res.indexOf(value) === -1)
					res.push(value);
			}
		});
		return res;
	};

	Utils.prototype.parseName = function (moduleName) {
		var t = moduleName.split(':');
		var name = t[t.length - 1];
		t.splice(-1, 1);
		return {
			alias: t.join(':'),
			name: name
		};
	};

	var _ = _ ? _ : new Utils();
	//Events ideas little borrowed from Backbone.js
	var EventsController = function () {
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

		return {
			on: function (name, callback, context) {
				this._events || (this._events = {});
				var events = this._events[name] || (this._events[name] = []);
				events.push({callback: callback, context: context, ctx: context || this});
				return this;
			},

			off: function (name, callback, context) {
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
			},

			trigger: function (name) {
				if (!this._events) return this;
				var args = [].slice.call(arguments, 1);
				var events = this._events[name];
				var allEvents = this._events.all;
				if (events) triggerEvents(events, args);
				if (allEvents) triggerEvents(allEvents, arguments);
				return this;
			}
		};
	};

	var Module = function (name, fn) {
			_.extend(this, {
				name: name,
				deps: [],
				options: {},
				isComplete: true,
				exportsFn: noop
			});
			try {
				fn.call(this, app, modulesController);
			}
			catch (e) {
				console.log('error in module: ' + name);
			}
			app.trigger('MODULE_DEFINED', this);
	};

	_.extend(Module.prototype, {
		use: function (moduleName, options) {
			options = options || {};
			this.deps.push({name: this._toFullName(moduleName), options: options});
			return this;
		},

		set: function (options, value) {
			if (_.isString(options) && !!value)
				this.options[options] = value;
			if (_.isObject(options) && !!options)
				_.extend(this.options, options);
			return this;
		},

		exports: function (fn) {
			this.exportsFn = fn;
			return this;
		},

		get: function (prop) {
			return this.options[prop];
		},

		init: function () {
			console.log('xxx: ', this.name);
			return this.exportsFn.call(this.get('context') || this);
		},

		getAlias: function () {
			var t = this.name.split(':');
			t.splice(-1, 1);
			return t.join(':');
		},

		getShorthand: function () {
			var t = this.name.split(':');
			return t.splice(-1, 1);
		},

		getDeps: function () {
			return this.deps;
		},

		_isShortHand: function (name) {
			return name[0] === ':';
		},

		_toFullName: function (name) {
			if (!this._isShortHand(name))
				return name;
			var t = this.name.split(':');
			t.splice(-1, 1);
			return	t.join(':') + name;
		}
	});


	var Queue = function (names, next, undefined) {
		this.modules = {};
		this.names = modulesController.findMissing(names);
		this.next = next;

		if (!this.names.length)
			return next(undefined, modulesController.pack(names));

		app.on('MODULE_DEFINED', this.onModuleDefined, this);
		this._extendNames();
		this.orderedDeps = this.names.slice(0);
		this.enqueue(this.names);
	};

	_.extend(Queue.prototype, {

		isQueueEmpty: function () {
			return !this.names.length;
		},

		_extendNames: function (args) {
			args = args || this.names;
			this.names = _.map(args, function (arg) {
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
				deps.length ? this.enqueue(deps) : (this.isQueueEmpty() && this.complete());
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
			return app.vendorRequire(this._namesToPaths(this.names), noop, function (err) {
				self.complete(err);
			});
		},

		complete: function (err) {
			app.off('MODULE_DEFINED', this.onModuleDefined, this);
			var exportList =_.extend(this.modules, modulesController.getDeps(this.modules));
			this.init();
			this.next(err, exportList);
		},

		init: function (deps, context) {
			var self = this;
			_.each(deps || this.orderedDeps, function (dep) {
				var mod = modulesController.getModule(dep.name);
				var deps = mod.getDeps();
				if (deps.length) {
					self.init(deps, mod);
					context && (context[dep.options.as || _.parseName(dep.name).name] = mod.init());
				}
				else
					context[dep.options.as || _.parseName(dep.name).name] = mod.init();
			})
		},

		isModuleFromThisQueue: function (moduleName) {
			return !!_.find(this.names, function (module) {
				return module.name === moduleName;
			});
		}
	});


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
					res[dep.name] = this.getModule(dep.name);
				}, this)
			}, this);
			return res;
		}

	});

	var Main = function (options, undefined) {
		app = this;
		_.extend(this, {
			isProduction: options.isProduction,
			options: options,
			name: options.appName || 'WellApp'
		});
		window[this.name] = this;
		window.wellDefine = this.define.bind(this);
		//turn off amd support
		if (typeof define === 'function' && define.amd)
			define.amd = undefined;
		this.init();
	};

	_.extend(Main.prototype, EventsController(), {
		init: function () {
			var options = this.options;
			if (_.isFunction(options.vendorRequire))
				Main.prototype.vendorRequire = options.vendorRequire;
			if (_.isFunction(options.requireConfig))
				Main.prototype.requireConfig = options.requireConfig;

			modulesController = this.Modules = new Modules(this);
			if (!this.isProduction)
				this.requireConfig(options);

			if (!options.strategy)
				return console.log('There is no application strategy defined');

			var self = this;
			this.require([options.strategy], function (err) {
				if (err)
					return console.log('Error in strategy loading! ', err);
				var mod = self.Modules.getModule(options.strategy);
				mod.init();
			});
		},

		define: function (moduleName, fn) {
			new Module(moduleName, fn);
			return this;
		},

		transformToPath: function (name) {
			return name ? name.split(/(?=[A-Z])/).join('-').toLowerCase().split(':-').join('/') : name;
		},

		//AMD provider wrapper
		require: function (modules, next) {
			new Queue(modules, next);
			return this;
		},

		vendorRequire: function (modules, next, err) {
			//requirejs call
			require(modules, next, err);
		},

		//override this method to configure your AMD vendor
		requireConfig: function (options) {
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
		},

		transformToName: function (path) {
			if (!path) return;
			path = this.capitalize(path.replace(/^\//, '').split('/')).join(':');
			return this.capitalize(path.split('-')).join('');
		},

		capitalize: function (arr) {
			return _.map(arr, function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			});
		}
	});
	new Main(window.WellConfig || {});  
})();