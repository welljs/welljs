//страница 404 по-умолчанию, если не найдена пользовательская
benderDefine('Bender:Public:NotFound', function () {
	this.use('Bender:Public:Layout');
//	this.use('Bender:Public:Layout');
	this.configure({
		template: 'Bender:Bender:Public:NotFound',
		layout: 'Bender:Public:Layout',
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
