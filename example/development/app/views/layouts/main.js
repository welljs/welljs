wellDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Partials:Sidebar');
	this.use('Views:Partials:Header');
	this.configure({
		template: 'Layouts:Main',
		partials: [
			'Partials:Sidebar',
			'Partials:Header'
		]
	});
	return function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
				Handlebars.registerPartial('sidebar', app.Templates.get('Partials:Sidebar').render());
				Handlebars.registerPartial('header', app.Templates.get('Partials:Header').render());
			},
			render: function () {
				this.$el.html(this.template.render());
				this.sidebar = app.Views.initialize('Views:Partials:Sidebar', {
					el: this.$('#page-sidebar')
				});
				this.header = app.Views.initialize('Views:Partials:Header', {
					el: this.$('#site-header')
				});
				this.sidebar.render();
				this.pageContainer = this.$('.page-content');
				return this;
			}
		});
	};
});