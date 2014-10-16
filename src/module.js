var autoInits = [];
var Module = function (name, fn, next, app) {
		_.extend(this, {
			app: app,
			name: name,
			deps: [],
			props: {},
			isComplete: true,
			exportFn: function(){}
		});
		try {
			fn.call(this, app);
		}
		catch (e) {
			console.log('error in module: ' + name);
		}
		this._setType(this.props.type || name.split(':')[0]);
		!this.deps.length ? next(this)	: this.waitForDeps(next);
	};

	_.extend(Module.prototype, {
		use: function (module, autoInit) {
			autoInit && autoInits.push(module);
			this.deps.push(this._toFullName(module));
			return this;
		},

		options: function (options) {
			var opts = options || {};
			opts.template = this._toFullName(opts.template);
			this.props = opts;
			return this;
		},

		exports: function (fn) {
			this.exportFn = fn;
			return this;
		},

		getOption: function (prop) {
			return this.props[prop];
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

		_setType: function (type) {
			if (type.substr(-1) === 's')
				type = type.slice(0, -1);
			switch (type.toLowerCase()) {
				case 'view': this.isView = true; break;
				case 'model': this.isModel = true; break;
				case 'collection': this.isCollection = true; break;
				case 'plugin': this.isPlugin = true; break;
				case 'well': this.isCore = true; break;
			}
			this.props['type'] = type;
			return this;
		},

		waitForDeps: function (next) {
			// на продакше модули собраны в один файл.
			// их не надо подгружать, нужно просто дождаться пока определятся нужные
			if (this.app.isProduction) {
				next(this);
			}
			else {
				this.isComplete = false;
				var Modules = this.app.Modules;
				var deps = _.clone(Modules.findMissing(this.deps));
				var self = this;
				//на девелопменте разобраны по файлам и их надо подгружать
				Modules.require(this.deps, function (err, modules) {
					if (err)
						return console.log('Error in deps requiring...', err);
					next(self);
				});
			}
			return this;
		}
	});

