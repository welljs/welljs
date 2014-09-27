wellDefine('Views:Pages:Docs', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Partials:DocsSidebar');
	this.configure({
		template: 'Pages:Docs'
	});
	return function () {
	  return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.sidebar = app.Views.initialize('Views:Partials:DocsSidebar', {
					el: this.$('docs-sidebar')
				});
				this.$el.html(this.template.render());
				return this;
			}
		});
	};
});