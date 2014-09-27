wellDefine('Views:Partials:DocsSidebar', function (app) {
	this.use('Views:Common:Sidebar');
	return function () {
		return app.Views.get('Views:Common:Sidebar').extend({});
	};
});