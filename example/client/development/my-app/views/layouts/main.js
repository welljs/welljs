benderDefine('Views:Layouts:Main', function (app) {
	this.configure({
		template: 'Views:Layouts:Main'
	});
	return app.Views.Base.extend({
		initialize: function () {
			this.render();
		},
		render: function () {
			this.$el.html(this.template.render({page: app.Views.currentPage}))
		}
	});
});