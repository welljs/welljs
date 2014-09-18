benderDefine('Bender:Router', function (app) {
	return Backbone.Router.extend({
		currentPage: null,
		initialize: function (options) {
			this.config = {};
			Handlebars.registerHelper('url', function (route) {
				return '/#' + route;
			});

		},

		defineRoutes: function (routes) {
			var router = this;
			//Backbone routes
			_.each(routes, function (route) {
				this.route(route, 'proxy');
			}, this);
			Backbone.history.handlers.push({
				route: /(.*)/,
				callback: function () {
					router.go('/');
					return this;
				}
			});
			return this;
		},

		proxy: function () {
			var args = this.parseUrl(Backbone.history.fragment);
			this.currentPage = args.route === '/' ? '' : args.route;
			app.Events.trigger('ROUTER_PAGE_CHANGED', this.getRouteAction(args.route), args.params);
		},

		go: function (url) {
			Backbone.history.navigate(url, {trigger: true});
		},

		go404: function () {
			this.go('/' + this.get404Args().route);
		},

		configure: function (config) {
			if (!config.actions['not-found'])
				config.actions['not-found'] = 'Bender:Public:NotFound';
			this.config = config;
			this.config.pushState = config.pushState || false;
			this.defineRoutes(config.routes);
			this.beforeStart = config.beforeStart || function(){};
			return this;
		},

		start: function () {
			_.isFunction(this.beforeStart) && this.beforeStart();
			Backbone.history.start({pushState: this.config.pushState});
		},

		getRouteAction: function (route) {
			var mod = this.config.actions[route];
			return mod
				? {
						module: mod,
						route: route
					}
				: this.get404Args()
		},

		get404Args: function () {
			return {
				module: 'Bender:Public:NotFound',
				route: 'not-found'
			};
		},

		parseUrl: function (url) {
			var args = url.split('/');
			return {
				route: args[0] || '/',
				params: args[1] || ''
			};
		}
	});
});
