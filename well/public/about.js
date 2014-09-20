//страница по-умолчанию, если приложение не создано или не найдено
wellDefine('Well:Public:About', function () {
	this.use('Well:Public:Layout');
	this.configure({
		template: 'Well:Well:Public:About',
		layout: 'Well:Public:Layout',
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
