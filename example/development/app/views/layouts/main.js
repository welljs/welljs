wellDefine('Views:Layouts:Main', function (app) {
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
				Handlebars.registerPartial('sidebar', app.Templates.get('Parts:Sidebar').render());
			},
			render: function () {
				this.$el.html(this.template.render());
				this.sidebar = app.Views.initialize('Views:Parts:Sidebar', {
					el: this.$('#page-sidebar')
				});
				this.sidebar.render();
				this.pageContainer = this.$('.page-content');
				return this;
			}
		});
	};
});