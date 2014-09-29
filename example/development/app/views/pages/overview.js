wellDefine('Views:Pages:Overview', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Partials:OverviewSidebar');
	this.options({
		template: 'Pages:Overview'
	});
	this.export(function () {
		return app.Views.get('Views:Common:Base').extend({
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