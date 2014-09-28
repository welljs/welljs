wellDefine('Utils:HandlebarsHelpers', function (app) {
	this.export(function () {
		Handlebars.registerHelper('url', function (route) {
			if (route === '/')
				route = '';
			return '/#' + route;
		});
		Handlebars.registerHelper('copyright', function () {
			return '©' + new Date().getFullYear();
		});
	});
});