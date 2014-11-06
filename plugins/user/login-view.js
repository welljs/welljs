wellDefine('Plugins:User:LoginView', function (app, modules) {
	this.exports(function (options) {
		var L = function (opts) {
			_.extend(this, {
				model: opts.model,
				$el: opts.el,
				options: opts
			});
			this.$('.submit').on('click', this.submit.bind(this));
		};

		L.prototype.$ = function (selector) {
			return this.$el.find(selector);
		};

		L.prototype.auth = function (login, pass) {
			var err = 'bad username or password';
			if (login === 'demo' && pass === '1234')
				this.onLoginSuccess();
			else
				this.options.onLoginError ? this.options.onLoginError(err) : alert(err);
		};

		L.prototype.onLoginSuccess = function () {
			this.model.set('name', 'John Doe');
			if (this.options.onLoginSuccess)
				this.options.onLoginSuccess();
		};

		L.prototype.submit = function () {
			var login = this.$('input[name=name]').val();
			var pass = this.$('input[name=pass]').val();
			if (login && pass)
				this.auth(login, pass);
			else
				alert('Error: fill in all necessary fields!');
		};
		return L;
	});
});