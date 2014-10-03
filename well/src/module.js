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
		!this.deps.length ? next(this)	: this.waitForDeps(next);
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
