wellDefine('Well:Public:Strategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Well:Public:About',
				'not-found': 'Well:Public:NotFound'
			},
			routes: [
				/^[A-Za-z0-9\/_-]{0,24}$/
			]
		});

		app.Views.configure({
			layoutHolder: 'body',
			templates: '/',
			html: true
		});

		//роутер конфигурируется в конце, либо убрать из него хистори старт
		Handlebars.registerHelper('url', function (route) {
			return '/#' + route;
		});

		app.start();

	}
});