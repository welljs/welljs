benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {};
		_.extend(Controller.prototype, {
			views: {},
			get: function (viewName) {
				return this.models[viewName];
			},

			set: function (viewName, impl) {
				this.models[viewName] = impl;
			},

			//-----------------------------------------------
			tryToRender: function (route, params) {
				var page = this.getByRoute(route);

			}
		});
		return new Controller();
	}
});
