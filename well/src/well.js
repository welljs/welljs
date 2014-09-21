(function () {
	'use strict';
	var App = function (options) {
		this.isProduction = options.isProduction;
		this.defaults = {
			strategy: 'Well:Public:Strategy',
			router: 'Plugins:Well:Router',
			templates: 'Plugins:Well:Templates',
			views: 'Plugins:Well:Views',
			models: 'Plugins:Well:Models',
			collections: 'Plugins:Well:Collections'
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
					well: this.options.wellRoot,
					plugins: this.options.pluginsRoot
				}
			});
			return this;
		},

		init: function () {
			this.Modules = new WellModuleController(this);
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
			function () {
				self.onCoreLoadError.call(self);
			});
			return this;
		},

		onCoreLoadError: function (err) {
			console.log(err.message);
			if (this.reloaded) {
				console.log('Error in project loading! Cant find Welljs root');
			}
			else {
				console.log('Defaults will be loaded');
				this.options = (this.defaults.strategy = 'Well:Public:Strategy');
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

	window.Well = new App(window.WellConfig || {});
})();