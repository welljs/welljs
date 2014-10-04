wellDefine('Plugins:BackboneWell:Router', function (app) {
	this.export(function () {
		return Backbone.Router.extend({
			currentPage: null,
			initialize: function (options) {
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
				this.currentPage = args.route === '/' ? '' :  args.route;
				app.Events.trigger('ROUTER_PAGE_CHANGED', this.getRouteAction(args.route), {route: args.route, params: args.params});
				this.customLayout = null;
			},

			go: function (url, options) {
				if (options)
					this.customLayout = options.layout;
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
				var action = this.config.actions[route];

				if (!this.customLayout)
					return action;

				return _.isObject(action)
					? (action['layout'] = this.customLayout)
					: {
					page: action,
					layout: this.customLayout
				}
			},

			parseUrl: function (url) {
				var args = url.split('/');
				return {
					route: args[0] ? '/' + args[0] : '/',
					params: args[1] || ''
				};
			}
		});
	});
});
