wellDefine('MyStrategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Views:Pages:Home',
				'cart': 'Views:Pages:Cart',
				'catalog': 'Views:Pages:Catalog',
				'catalog/:id': 'Views:Pages:Catalog'
			},
			routes: [
				//зачем это?
				/^[A-Za-z0-9\/_-]{0,24}$/
			]
		});

		app.Views.configure({
//			notFoundModule: 'Views:Pages:NotFound',
			layoutHolder: 'body',
			layoutModule: 'Views:Layouts:Main',
			templates: '/app/templates/'
		});


		Handlebars.registerHelper('url', function (route) {
			return '/#' + route;
		});

		app.Modules.require(['Helpers'], function (modules) {
			app.Helpers = new(app.Modules.get('Helpers'));
		});

		$(document).ready(function () {
			app.start();
		});
	}
});
