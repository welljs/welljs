benderDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Common:Base');
	this.configure({
		template: 'Views:Layouts:Main'
	});
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render({page: app.Views.currentPage}));
				return this;
			}
		});
	};
});