wellDefine('Plugins:BackboneWell:PageView', function (app) {
	this.export(function (args) {
		var args = args  || {};
		var basicView = args.extendedFrom || Backbone.View;
		return basicView.extend({
			setTemplate: function (name) {
				this.template = app.Templates.get(name);
			}
		});
	});
});