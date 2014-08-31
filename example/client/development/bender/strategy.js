benderDefine('Bender:Strategy', function (app) {
	return function () {
		app.Router.configure({
			actions: {
				'/': 'Views:Pages:Home',
				'page-one': 'Views:Pages:PageOne'
			},

			routes: [
				/^[A-Za-z0-9\/_-]{0,24}$/
			],

			beforeStart: function () {
				console.log('before router start');
			},

			afterStart: function () {
				console.log('after router start');
			}
		});

		app.Views.configure({
			layoutHolder: 'body'
		});
	}
});
