wellDefine('Plugins:User:Main', function (app, modules) {
	this.use(':Model', {as: 'UserModel', autoInit: true});
	this.use(':LoginView');
	this.use(':RegisterView');
	this.exports(function () {
		var module = this;
		var User = function () {};
		User.prototype._getTemplate = function (name, next) {
			$.ajax({
				url: '',
				context: this,
				success: function () {

				}
			})
		};
		User.prototype.showRegister = function () {

		};

		User.prototype.showLogin = function () {
			var loginView = module.LoginView({
				model: module.UserModel()
			});
			loginView.start('show login');
		};

		return User;

	});
});