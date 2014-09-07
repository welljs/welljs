//страница 404 по-умолчанию, если не найдена пользовательская
benderDefine('Bender:Public:NotFound', function () {
	this.use('Bender:Public:Strategy');
//	this.use('Bender:Public:Layout');
	this.configure({
		template: 'Bender:Public:NotFound',
		layout: 'Bender:Public:Layout',
		type: 'view'
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
