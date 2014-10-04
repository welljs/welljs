//страница 404 по-умолчанию, если не найдена пользовательская
wellDefine('Well:Defaults:NotFound', function () {
	this.use(':Layout');
	this.options({
		template: ':NotFound',
		type: 'view',
		isDefault: true
	});
	this.exports(function () {
		return Backbone.View.extend({
			initialize: function () {

			},
			render: function () {
				this.$el.html(this.template.render());
			}

		});
	});
});
