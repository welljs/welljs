wellDefine('Strategy', function (app, undefined) {
	this.use('Vendor:JqueryWell');
	this.use('Vendor:UnderscoreWell');
	this.use('Vendor:BackboneWell');
	this.use('Vendor:HandlebarsWell');
	this.use('Vendor:HighlightPackWell');
	this.use('Plugins:BackboneWell:Router');
	this.use('Plugins:BackboneWell:Views');
	this.use('Plugins:BackboneWell:Templates');
	this.use('Utils:HandlebarsHelpers');
	this.use('Utils:Helpers');

	this.export(function () {

		var WellSite = function () {
			this.init();
		};

		WellSite.prototype.init = function () {
			var Modules = app.Modules;
			Modules.get('Vendor:JqueryWell')();
			Modules.get('Vendor:UnderscoreWell')();
			Modules.get('Vendor:BackboneWell')();
			Modules.get('Vendor:HandlebarsWell')();
			Modules.get('Vendor:HighlightPackWell')();
			app.Router = new (Modules.get('Plugins:BackboneWell:Router')());
			app.Router.configure({
				actions: {
					'/': 'Views:Pages:Overview',
					'/installation': 'Views:Pages:Installation',
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

			app.Templates = new (Modules.get('Plugins:BackboneWell:Templates'));
			app.Views = new (Modules.get('Plugins:BackboneWell:Views'));
			app.Views.configure({
				notFoundModule: 'Views:Pages:NotFound',
				layoutHolder: '#site-container',
				layoutModule: 'Views:Layouts:Main',
				//relative to this dir will be calculated templates name
				templates: '/app/templates/'
			});
			//global Helpers
			app.Helpers = new(Modules.get('Utils:Helpers'));
			//initializing Handlebars helpers
			new (Modules.get('Utils:HandlebarsHelpers'));

			app.Router.start();
		};
		return new WellSite();
	});
});
