wellDefine('Views:Pages:GetStarted', function (app) {
	this.use('Views:Common:Base');
	this.configure({
		template: 'Pages:GetStarted'
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