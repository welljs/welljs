	var Module = function (name, fn) {
			_.extend(this, {
				name: name,
				deps: [],
				options: {},
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

