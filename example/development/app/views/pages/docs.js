wellDefine('Views:Pages:Docs', function (app) {
	this.use('Views:Common:Base');
	this.configure({
		template: 'Pages:Docs'
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