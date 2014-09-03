benderDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Parts:Sidebar');
	this.configure({
		template: 'Layouts:Main',
		partials: ['Parts:Sidebar']
	});
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render({page: app.Views.currentPage.name}));
				this.sidebarHolder = this.$('#page-sidebar');
				this.sidebar = app.Views.initialize('Views:Parts:Sidebar', {
//					el:
				});
				this.sidebar.render();
				this.pageContainer = this.$('.page-content');
				return this;
			}
		});
	};
});