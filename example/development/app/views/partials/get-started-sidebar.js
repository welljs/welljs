wellDefine('Views:Partials:GetStartedSidebar', function (app) {
	this.use('Views:Common:Sidebar');
	this.export(function () {
		return app.Views.get('Views:Common:Sidebar').extend({});
	});
});