wellDefine('Views:Pages:NotFound', function (app) {
	this.use('Views:Common:Page');
	this.options({
		template: 'Pages:NotFound'
	});
	this.export(function () {
		return app.Views.get('Views:Common:Page').extend({});
	});
});