benderDefine('Views:Pages:PageOne', function (app) {
	this.use('Views:Common:Base');
	this.configure({
		layout: 'Main',
		template: 'Pages:PageOne',
		route: '/page-one'
	});
	return function () {
	  return app.Views.get('Views:Common:Base').extend({
			initialize: function () {
				this.render();
			},
			render: function () {
				this.$el.html(this.template.render());
				return this;
			}
		});
	};
});