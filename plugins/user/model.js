wellDefine('Plugins:User:Model', function (app, modules) {
	this.exports(function (options) {
		var M = function () {
			this.attrs = {};
		};
		M.prototype.set = function (key, value) {
		  this.attrs[key] = value;
		};
		M.prototype.get = function (attr) {
			return this.attrs[attr];
		};
		return M;
	});
});