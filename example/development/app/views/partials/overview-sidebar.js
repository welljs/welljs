wellDefine('Views:Partials:OverviewSidebar', function (app) {
	this.use('Views:Common:Sidebar');
	this.exports(function () {
		return app.Views.get('Views:Common:Sidebar').extend({});
	});
});