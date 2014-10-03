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