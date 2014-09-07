benderDefine('MyStrategy', function (app) {
	//если надо использовать глобально как app.PluginName то указать через
//	this.use('Plugins:Bender:BreadCrumbs as BreadCrumbs');
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Views:Pages:Home',
				'page-one': 'Views:Pages:PageOne',
				'page-two': 'Views:Pages:PageOne',
				'settings': 'Views:Pages:Settings'
			},
			routes: [
				/^[A-Za-z0-9\/_-]{0,24}$/
			]
		});

		app.Views.configure({
			layoutHolder: 'body'
		});

		app.Templates.configure({
//			precompiled: true,
			html: '/my-app/views/templates/html/'
		});

		Handlebars.registerHelper('url', function (route) {
			return '/#' + route;
		});

	}
});
