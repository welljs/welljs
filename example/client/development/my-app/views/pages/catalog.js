benderDefine('Views:Pages:Settings', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Layouts:Main');
	this.configure({
		layout: 'Views:Layouts:Main',
		template: 'Pages:PageOne',
		route: '/page-one'
	});
	return function () {
	  return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render());
				return this;
			}
		});
	};
});