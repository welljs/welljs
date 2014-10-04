//если в пользовательском приложении лэйаут не указан, будет использоваться этот
wellDefine('Well:Defaults:Layout', function () {
	this.options({
		type: 'view',
		template: ':Layout',
		isDefault: true
	});
	this.export(function () {
		return Backbone.View.extend({
			initialize: function () {
			},

			render: function () {
				this.$el.html(this.template.render());
				this.pageContainer = this.$('.main');
			}
		});
	});
});
