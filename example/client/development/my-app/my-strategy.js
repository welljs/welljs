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
			layoutHolder: 'body',
			templates: '/my-app/views/templates/html/',
			html: true
		});

		Handlebars.registerHelper('url', function (route) {
			return '/#' + route;
		});

		app.Modules.require(['Helpers'], function (modules) {
			app.Helpers = new(app.Modules.get('Helpers'));
		});

		app.start();
	}
});
