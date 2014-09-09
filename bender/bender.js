(function () {
	'use strict';
	var App = function (options) {
		var opts = this.options = options || {};
		var defs = this.defaults = {
			strategy: 'Bender:Public:Strategy',
			router: 'Bender:Router'
		};

		if (!window.ENV)
			window.ENV = 'development';

		this.isProduction = (ENV && ENV === 'production');
		this.Events = _.extend(Backbone.Events, {});
		this.options.router = this.transformToName(opts.router) || defs.router;
		this.options.strategy = this.transformToName(opts.strategy) || defs.strategy;
		this.init();
	};

	_.extend(App.prototype,{
		requireConfig: function () {
			requirejs.config({
				baseUrl: this.options.appRoot,
				paths: {
					bender: this.options.benderRoot
				}
			});
			return this;
		},

		init: function () {
			this.Modules = new BenderModuleController(this);
			this.requireConfig();
			this.loadCore();
		},

		loadCore: function () {
			this.Modules.require(
				[
					'Bender:Models',
					'Bender:Templates',
					'Bender:Views',
					this.options.router,
					this.options.strategy
				],
				this.onCoreLoaded.bind(this),
				this.onCoreLoadError.bind(this)
			);
		},

		onCoreLoaded: function () {
			var Modules = this.Modules;
			this.Models = new (Modules.get('Bender:Models'));
			this.Router = new(Modules.get('Bender:Router'));
			this.Templates = new (Modules.get('Bender:Templates'));
			this.Views = new (Modules.get('Bender:Views'));
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
				this.options.strategy = this.defaults.strategy;
				this.options.router = this.defaults.router;
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
		},

		getDefaultsPath: function () {
			return '/bender/public/'
		}
	});

	window.Bender = App;
})();