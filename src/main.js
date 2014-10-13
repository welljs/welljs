	var Main = function (options, undefined) {
		this.isProduction = options.isProduction;
		this.options = options;
		this.name = this.options.appName || 'WellApp';
		window[this.name] = this;
		//turn off amd support
		if (typeof define === 'function' && define.amd)
			define.amd = undefined;
		this.init();
	};

	_.extend(Main.prototype, {
		init: function () {
			this.Modules = new Modules(this);
			if (!this.isProduction)
				this.Modules.requireConfig();

			if (!this.options.strategy)
				return console.log('There is no application strategy defined');

			var self = this;
			this.Modules.require([this.options.strategy], function () {
					self.Strategy = new(self.Modules.get(self.options.strategy));
				},
				function (err) {
					console.log('Error in strategy loading! ', err);
				});
		},
		transformToPath: function (name) {
			return name ? name.split(/(?=[A-Z])/).join('-').toLowerCase().split(':-').join('/') : name;
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