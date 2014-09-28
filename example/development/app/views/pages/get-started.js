wellDefine('Views:Pages:GetStarted', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Partials:GetStartedSidebar');
	this.options({
		template: 'Pages:GetStarted'
	});
	this.export(function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render());
				this.sidebar = new (app.Views.get('Views:Partials:GetStartedSidebar'))({
					el: this.$('.get-started-sidebar')
				});
				return this;
			}
		});
	});
});