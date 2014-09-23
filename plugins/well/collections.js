wellDefine('Plugins:Well:Collections', function (app) {
	return function () {
		var Controller = function () {};
		_.extend(Controller.prototype, {
			storage: {},
			get: function (collectionName) {
				return this.storage[collectionName];
			},
			set: function (collectionName, impl) {
				this.storage[collectionName] = impl;
			}
		});
		return new Controller();
	}
});