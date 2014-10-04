//страница по-умолчанию, если приложение не создано или не найдено
wellDefine('Well:Defaults:About', function () {
	this.options({
		template: ':About',
		type: 'view',
		isDefault: true
	});
	this.export(function () {
		return Backbone.View.extend({
			initialize: function () {

			},
			render: function () {
				this.$el.html(this.template.render());
			}
		});
	});
});
