benderDefine('Bender:Public:Strategy', function (app) {
	return function () {
		//это должно конфигурироваться до загрузки модулей

		app.Router.configure({
			actions: {
				'/': 'Bender:Public:About',
				'not-found': 'Bender:Public:NotFound'
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