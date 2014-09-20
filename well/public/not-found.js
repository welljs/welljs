//страница 404 по-умолчанию, если не найдена пользовательская
wellDefine('Well:Public:NotFound', function () {
	this.use('Well:Public:Layout');
	this.configure({
		template: 'Well:Well:Public:NotFound',
		layout: 'Well:Public:Layout',
		type: 'view',
		isDefault: true
	});
	return function () {
		return Backbone.View.extend({
			initialize: function () {

			},
			render: function () {
				this.$el.html(this.template.render());
			}

		});
	}
});
