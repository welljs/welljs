//страница по-умолчанию, если приложение не создано или не найдено
wellDefine('Well:Defaults:About', function () {
	this.configure({
		template: ':About',
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
