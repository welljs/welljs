benderDefine('MyStrategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Views:Pages:Home',
				'cart': 'Views:Pages:Cart',
				'catalog': 'Views:Pages:Catalog'
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

		app.start();
	}
});
