wellDefine('MyStrategy', function (app) {
	this.export(function () {
		var WellSite = function () {
			var self = this;
			app.Modules.require([
					'Utils:HandlebarsHelpers',
					'Utils:Helpers'
				],
				function (modules) {
					self.onLoad.call(self);
				},
				function (err) {
					console.log('wellLog: ', err);
				}
			);
		};

		_.extend(WellSite.prototype, {
			onLoad: function () {
				app.Router.configure({
					actions: {

						'/': 'Views:Pages:GetStarted',
						'/features': {
							page: 'Views:Pages:Features',
							layout: 'Views:Layouts:Main'
						},
						'/docs': {
							page: 'Views:Pages:Docs'
						}
					},
					//backbone router rules
					routes: [
						/^[A-Za-z0-9\/_-]{0,24}$/
					]
				});

				//Views plugin config
				app.Views.configure({
					notFoundModule: 'Views:Pages:NotFound',
					layoutHolder: '#site-container',
					layoutModule: 'Views:Layouts:Main',
					//relative to this dir will be calculated templates name
					templates: '/app/templates/'
				});
				//global Helpers
				app.Helpers = new(app.Modules.get('Utils:Helpers'));
				//initializing Handlebars helpers
				new (app.Modules.get('Utils:HandlebarsHelpers'));
				app.start();
			}
		});
		return new WellSite();
	});
});
