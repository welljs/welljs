benderDefine('Views:Pages:Home', function (app) {
	this.configure({
		layout: 'Main',
		template: 'Pages:Home',
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