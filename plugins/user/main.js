wellDefine('Plugins:User:Main', function (app, modules) {
	this.use(':Model', {as: 'UserModel'});
	this.use(':LoginView');
	this.set({
		template: 'form'
	});
	this.exports(function () {
		var mod = this;
		var User = function (opts) {
			this.options = opts || {};
			this.appendCss();
			this.loadTemplate(function (err, html) {
				if (err)
					throw err;
				this.onTemplateLoaded(html);
			}.bind(this));
			this.model = new mod.UserModel();
		};


		User.prototype.appendCss = function () {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = 'plugins/user/style.css';
			document.getElementsByTagName("head")[0].appendChild(link);
		};

		User.prototype.loadTemplate = function (next) {
			$.get('plugins/user/' + mod.get('template') + '.html', function (html) {
				next(null, html);
			}).fail(function (err) {
				next(err.statusText)
			});
		};

		User.prototype.onTemplateLoaded = function (html) {
			this.render(html);
			new mod.LoginView({
				el: $('.login-form'),
				model: this.model,
				onLoginSuccess: this.options.onLoginSuccess,
				onLoginError: this.options.onLoginError
			});
		};

		User.prototype.render = function (html) {
			$('#site-container').html(html);
		};

		return User;
	});
});