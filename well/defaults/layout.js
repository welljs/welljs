//если в пользовательском приложении лэйаут не указан, будет использоваться этот
wellDefine('Well:Defaults:Layout', function () {
	this.configure({
		type: 'view',
		template: ':Layout',
		isDefault: true
	});
	return function () {
		return Backbone.View.extend({
			initialize: function () {
			},

			render: function () {
				this.$el.html(this.template.render());
				this.pageContainer = this.$('.main');
			}
		});
	}
});
