benderDefine('Bender:Router', function (app) {
	return Backbone.Router.extend({
		currentPage: null,
		initialize: function () {
			this.config = {};
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
			if (!config.actions['404'])
				config.actions['404'] = 'Views:Pages:404';
			this.config = config;
			this.defineRoutes(config.routes);
			this.beforeStart = config.beforeStart || function(){};
//			this.start();
			return this;
		},

		start: function () {
			_.isFunction(this.beforeStart) && this.beforeStart();
			Backbone.history.start();
		},

		onPagesLoaded: function () {
			console.log(arguments);
		},

		getRouteAction: function (route) {
			return {
					module: this.config.actions[route] || '404',
					route: route
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
