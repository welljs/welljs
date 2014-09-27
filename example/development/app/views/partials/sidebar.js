wellDefine('Views:Partials:Sidebar', function (app) {
	this.use('Views:Common:Base');
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
				this.subscribe();
			},
			subscribe: function () {
				this.$('button').on('click', function () {
					console.log('ok');
				});
				return this;
			}
		});
	};
});