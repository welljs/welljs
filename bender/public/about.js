//страница по-умолчанию, если приложение не создано или не найдено
benderDefine('Bender:Public:About', function () {
	this.use('Bender:Public:Layout');
	this.configure({
		template: 'Bender:Public:About',
		layout: 'Bender:Public:Layout',
		route: '/',
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
