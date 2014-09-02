benderDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Parts:Sidebar');
	this.configure({
		template: 'Layouts:Main'
	});
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.sidebar = app.Views.initialize('Views:Parts:Sidebar');
				Handlebars.registerPartial('sidebar', this.sidebar.$el);
				this.sidebar.render();
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render({page: app.Views.currentPage.name}));
				this.pageContainer = this.$('.page-content');
				return this;
			}
		});
	};
});