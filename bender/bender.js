(function () {
	'use strict';
	var App = function (options) {
		this.isProduction = options.isProduction;
		this.defaults = {
			strategy: 'Bender:Public:Strategy',
			router: 'Plugins:Bender:Router',
			templates: 'Plugins:Bender:Templates',
			views: 'Plugins:Bender:Views',
			models: 'Plugins:Bender:Models',
			collections: 'Plugins:Bender:Collections'
		};
		this.options = _.extend(this.defaults, options);
		this.Events = _.extend(Backbone.Events, {});
		this.init();
	};

	_.extend(App.prototype,{
		requireConfig: function () {
			requirejs.config({
				waitSeconds: 60,
				baseUrl: this.options.appRoot,
				paths: {
					bender: this.options.benderRoot,
					plugins: this.options.pluginsRoot
				}
			});
			return this;
		},

		init: function () {
			this.Modules = new BenderModuleController(this);
			if (!this.isProduction)
				this.requireConfig();
			this.loadCore();
		},

		loadCore: function () {
			var options = this.options;
			this.Modules.require(
				[
					options.templates,
					options.views,
					options.router,
					options.strategy,
					options.models,
					options.collections
				],
				this.onCoreLoaded.bind(this),
				this.onCoreLoadError.bind(this)
			);
		},

		onCoreLoaded: function () {
			var Modules = this.Modules;
			this.Models = new (Modules.get(this.options.models));
			this.Collections = new (Modules.get(this.options.collections));
			this.Router = new(Modules.get(this.options.router));
			this.Templates = new (Modules.get(this.options.templates));
			this.Views = new (Modules.get(this.options.views));
			this.Strategy = new(Modules.get(this.options.strategy));
			return this;
		},

		onCoreLoadError: function (err) {
			console.log(err.message);
			if (this.reloaded) {
				console.log('Error in project loading! Cant find Benderjs root');
			}
			else {
				console.log('Defaults will be loaded');
				this.options = (this.defaults.strategy = 'Bender:Public:Strategy');
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

	window.Bender = new App(window.BenderConfig || {});
})();