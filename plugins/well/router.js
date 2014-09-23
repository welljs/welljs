wellDefine('Plugins:Well:Router', function (app) {
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

		configure: function (config) {
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
			return this.config.actions[route];
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
