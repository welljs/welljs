benderDefine('Bender:Router', function (app) {
	return Backbone.Router.extend({
		currentPage: null,
		initialize: function () {
			var router = this;
			this.route(/^[A-Za-z0-9\/_-]{0,24}$/, 'proxy');
			Backbone.history.handlers.push({
				route: /(.*)/,
				callback: function () {
					router.go('/');
					return this;
				}
			});
		},

		proxy: function () {
			var args = this.parseUrl(Backbone.history.fragment);
			Actions.exec(args.action, args.params);
			this.currentPage = args.action === '/' ? '' : args.action;
		},

		go: function (url) {
			Backbone.history.navigate(url, {trigger: true});
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
