	var Main = function (options, undefined) {
		this.isProduction = options.isProduction;
		this.options = options;
		this.Events = new EventsController();
		window[this.options.appName || 'Well'] = this;
		//turn off amd support
		if (typeof define === 'function' && define.amd)
			define.amd = undefined;
		this.init();
	};

	Main.prototype.init = function () {
		this.Modules = new Modules(this);
		if (!this.isProduction)
			this.Modules.requireConfig();
		var self = this;
		this.Modules.require([this.options.strategy], function () {
				self.Strategy = new(self.Modules.get(self.options.strategy));
			},
			function (err) {
				console.log('Error in project loading! Can\'t find Welljs root', err);
			});
	};

	Main.prototype.transformToPath = function (name) {
		return name ? name.split(/(?=[A-Z])/).join('-').toLowerCase().split(':-').join('/') : name;
	};

	//some/file-name -> Some:FileName
	Main.prototype.transformToName = function (path) {
		if (!path) return;
		path = this.capitalize(path.replace(/^\//, '').split('/')).join(':');
		return this.capitalize(path.split('-')).join('');
	};

	//transform first letter to uppercase in all array items
	Main.prototype.capitalize = function (arr) {
		return _.map(arr, function (str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		});
	};

	Main.prototype.getFileName = function (modName) {
		return /:([^:]+)$/.exec(modName)[1];
	};

	new Main(window.WellConfig || {});