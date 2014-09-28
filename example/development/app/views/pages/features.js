wellDefine('Views:Pages:Features', function (app) {
	this.use('Views:Common:Base');
	this.options({
		template: 'Pages:Features'
	});
	this.export(function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				this.$el.html(this.template.render());
				return this;
			}
		});
	});
});