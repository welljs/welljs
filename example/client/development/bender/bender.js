(function () {
	'use strict';
	var App = function (opts) {
		this.Events = _.extend(Backbone.Events, {});
		this.options = opts;
		!opts.router && (this.options.router = 'Bender:Router');
		!opts.strategy && (this.options.strategy = 'Bender:Strategy');
		this.init();
	};

	_.extend(App.prototype,{
		requireConfig: function () {
			requirejs.config({
				baseUrl: this.options.appPath,
				paths: {
					views: '/my-app/views',
					bender: '/bender'
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
			this.Views = new (Modules.get('Bender:Views'));
			this.Templates = new (Modules.get('Bender:Templates'));
			this.Router = new(Modules.get('Bender:Router'));
			this.Strategy = new(Modules.get(this.options.strategy));
			return this;
		},

		onCoreLoadError: function (err) {
			console.log(err.message);
		},

		//SomeModule:Name -> some-module/name
		transformToPath: function (name) {
			return name.split(/(?=[A-Z])/).join('-').toLowerCase().split(':-').join('/');
		},

		//some/file-name -> Some:FileName
		transformToName: function (path) {
			path = this.capitalize(path.split('/')).join(':');
			return this.capitalize(path.split('-')).join('');
		},

		//transform first letter to uppercase in all array items
		capitalize: function (arr) {
			return _.map(arr, function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			});
		}
	});

	window.Bender = App;
})();