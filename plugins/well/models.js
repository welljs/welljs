benderDefine('Plugins:Bender:Models', function (app) {
	return function () {
		var Controller = function () {};
		_.extend(Controller.prototype, {
			models: {},
			get: function (modelName) {
				return this.models[modelName];
			},
			set: function (modelName, impl) {
				this.models[modelName] = impl;
			}
		});
		return new Controller();
	}
});