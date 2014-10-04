wellDefine('Views:Pages:Installation', function (app) {
	this.use('Views:Common:Page');
	this.options({
		template: 'Pages:Installation'
	});
	this.exports(function () {
		return app.Views.get('Views:Common:Page').extend({});
	});
});