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

	_.extend(Main.prototype, {
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
			var self = this;
			new Module(moduleName, fn, function (module) {
				modulesController.modules[moduleName] = module;
				modulesController.trigger('MODULE_DEFINED', module);
			});
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