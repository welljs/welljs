benderDefine('Bender:Strategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Views:Pages:Home',
				'page-one': 'Views:Pages:PageOne'
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
	}
});
