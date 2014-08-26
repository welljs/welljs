benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('Router:PageChanged', this.tryToRender, this);
		};
		_.extend(Controller.prototype, {
			views: {},
			get: function (viewName) {
				return this.models[viewName];
			},

			set: function (viewName, impl) {
				this.models[viewName] = impl;
			},

			findByRoute: function (route) {

			},

			tryToRender: function (route, params) {
				debugger;
				!this.isOverlayVisible && this.showOverlay();
				var mod = app.Modules.get(this.findByRoute(route));
				if (!mod)
					app.Modules.require();
			},

			showOverlay: function () {
				this.isOverlayVisible = true;
			},

			hideOverlay: function () {
				this.isOverlayVisible = false;
			}

		});
		return new Controller();
	}
});
