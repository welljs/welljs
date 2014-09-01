benderDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Parts:Sidebar');
	this.configure({
		template: 'Layouts:Main'
	});
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
//				this.sidebar = new (app.Views.get('Views:Parts:Sidebar'));
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render());
				this.pageContainer = this.$('.page-content');
				return this;
			}
		});
	};
});