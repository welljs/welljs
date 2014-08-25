benderDefine('Views:Pages:PageOne', function (app) {
	this.configure({
		layout: 'Main',
		template: 'Pages:PageOne',
		route: '/'
	});
	return function () {
	  return app.Views.Base.extend({
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