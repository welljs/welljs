wellDefine('Views:Pages:Overview', function (app) {
	this.use('Views:Common:Page');
	this.use('Views:Partials:OverviewSidebar');
	this.options({
		template: 'Pages:Overview'
	});
	this.exports(function () {
		return app.Views.get('Views:Common:Page').extend({
			render: function () {
				this.$el.html(this.template.render());
				this.sidebar = new (app.Views.get('Views:Partials:OverviewSidebar'))({
					el: this.$('.overview-sidebar')
				});
				return this;
			}
		});
	});
});