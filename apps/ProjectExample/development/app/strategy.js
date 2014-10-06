wellDefine('Strategy', function (app, undefined) {
	this.use('Vendor:JqueryWell');
	this.use('Vendor:UnderscoreWell');
	this.use('Vendor:BackboneWell');
	this.use('Vendor:HandlebarsWell');
	this.use('Vendor:HighlightPackWell');
	this.use('Plugins:Sawbones:Router');
	this.use('Plugins:Sawbones:Views');
	this.use('Plugins:Sawbones:Templates');
	this.use('Utils:HandlebarsHelpers');
	this.use('Utils:Helpers');

	this.exports(function () {

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
			app.Events = _.extend(Backbone.Events, {});
			app.Router = new (Modules.get('Plugins:Sawbones:Router')());
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

			app.Templates = new (Modules.get('Plugins:Sawbones:Templates'));
			app.Views = new (Modules.get('Plugins:Sawbones:Views'));
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

			$(document).ready(function () {
				app.Router.start();
			})
		};
		return new WellSite();
	});
});
