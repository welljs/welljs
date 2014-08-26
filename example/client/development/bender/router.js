benderDefine('Bender:Router', function (app) {
	return Backbone.Router.extend({
		currentPage: null,
		initialize: function () {
		},

		defineRoutes: function (routes) {
			var router = this;
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
			this.currentPage = args.action === '/' ? '' : args.action;
			app.Events.trigger('Router:PageChanged', args.action, args.params);
		},

		go: function (url) {
			Backbone.history.navigate(url, {trigger: true});
		},

		configure: function (config) {
			this.defineRoutes(config.routes);
			this.loadPages(config.pages);
			return this;
		},

		loadPages: function (pages) {
			app.Modules.require(pages, this.onPagesLoaded, function (err) {
				console.log(err);
			});
			return this;
		},

		onPagesLoaded: function () {
			console.log(arguments);
		},

		parseUrl: function () {
			var args = url.split('/');
			return {
				action: args[0] || '/',
				params: args[1] || ''
			};
		}
	});
});
