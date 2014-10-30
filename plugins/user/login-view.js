wellDefine('Plugins:User:LoginView', function (app, modules) {
	var module = this;
	this.set({
		template: 'jopa'
	});
	this.exports(function (options) {
	  var View = function () {};
		View.prototype.start = function (arg) {
			console.log(options + ': ', module);
		};
		return new View();
	});
});