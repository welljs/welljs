wellDefine('Well:Defaults:Strategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Well:Defaults:About',
				'not-found': 'Well:Defaults:NotFound'
			},
			routes: [
				/^[A-Za-z0-9\/_-]{0,24}$/
			]
		});

		app.Views.configure({
			layoutHolder: 'body',
			notFoundModule: ':NotFound',
			layoutModule: ':Main',
			html: '/'
		});

		//роутер конфигурируется в конце, либо убрать из него хистори старт
		Handlebars.registerHelper('url', function (route) {
			return '/#' + route;
		});

		app.start();

	}
});