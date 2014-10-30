//var autoInits = [];
var Module = function (name, fn, next) {
		_.extend(this, {
			name: name,
			deps: [],
			options: {},
			isComplete: true,
			exportsFn: function(){}
		});
		try {
			fn.call(this, app, modulesController);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}
//		this._setType(this.options.type || name.split(':')[0]);
		!this.deps.length ? next(this)	: this.waitForDeps(next);
	};

	_.extend(Module.prototype, {
		use: function (moduleName, options, undefined) {
			var self = this;
			options = options || {};
			if (options.autoInit) {
				var as = options.as || _.parseName(this._toFullName(moduleName)).name;
				var o={};
				AutoInits.add((o[this.name] = {name: moduleName, as: as}));

//				autoInits.push(moduleName);
//				this._closeInitHandler('MODULE_AUTO_INIT:'+this._toFullName(moduleName), options.as || _.parseName(this._toFullName(moduleName)).name)
			}
			this.deps.push({name: this._toFullName(moduleName), options: options});
			return this;
		},

		set: function (options) {
			this.options = options || {};
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

		_isShortHand: function (name) {
			return name[0] === ':';
		},

		_toFullName: function (name) {
			if (!this._isShortHand(name))
				return name;
			var t = this.name.split(':');
			t.splice(-1, 1);
			return	t.join(':') + name;
		},

//		_setType: function (type) {
//			if (type.substr(-1) === 's')
//				type = type.slice(0, -1);
//			switch (type.toLowerCase()) {
//				case 'view': this.isView = true; break;
//				case 'model': this.isModel = true; break;
//				case 'collection': this.isCollection = true; break;
//				case 'plugin': this.isPlugin = true; break;
//				case 'well': this.isCore = true; break;
//			}
//			this.options['type'] = type;
//			return this;
//		},

//		_closeInitHandler: function (event, prop) {
//			var self = this;
//			modulesController.on(event, function (module) {
//				self[prop] = module.init();
//				modulesController.off(event, null, self);
//			}, this);
//		},
//
//		_defineDeps: function () {
//			var self = this;
//			_.each(this.deps, function (dependency) {
//				var prop = dependency.options.as || _.parseName(dependency.name).name;
//				this[prop] = modulesController.get(dependency.name);
//				if (dependency.options.autoInit) {
//					this._closeInitHandler('MODULE_AUTO_INIT:' + dependency.name, prop);
//				}
//			}, this)
//		},

		waitForDeps: function (next) {
			// на продакше модули собраны в один файл.
			// их не надо подгружать, нужно просто дождаться пока определятся нужные
			if (app.isProduction) {
//				this._defineDeps();
				next(this);
			}
			else {
				this.isComplete = false;
				var depsNames = _.map(this.deps, function (dep) {
					return dep.name;
				});
				var deps = _.clone(modulesController.findMissing(depsNames));
				var self = this;
				//на девелопменте разобраны по файлам и их надо подгружать
				modulesController.require(depsNames, function (err, modules) {
					if (err)
						return console.log('Error in deps requiring...', err);
//					self._defineDeps();
					next(self);
				});
			}
			return this;
		}
	});

