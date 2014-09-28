wellDefine('Plugins:Well:Templates', function (app) {
	this.export(function () {
			//template api
			function create (opts) {
				return {
					path: opts.path,
					render: function (data) {
						return opts.renderer(data)
					}
				}
			}

			// constructor
			var Controller = function () {
				this.storage = {};
				this.config = {};
				this.defaults = {};
				this._start();
			};

			//controllers api
			_.extend(Controller.prototype, {
				configure: function (opts) {
					this.config = opts;
					return this;
				},

				_start: function () {
					if (app.isProduction)
						this._processCompiled();
					this._registerHelpers();
					return this;
				},

				get: function (name) {
					return this.storage[name];
				},

				exist: function (name) {
					return this.storage[name];
				},

				isNotFound: function (name) {
					return (name.indexOf('NotFound') !== -1 || name.indexOf('not-found') !== -1);
				},

				load: function (files, next, err) {
					var missing = _.filter(files, function (file) {
						return !this.exist(file.name)
					}, this);

					var defs = [];
					_.each(missing, function (file, index) {
						defs.push(
							this.getAjax(file.path, file.name, err)
						);
					}, this);
					$.when.apply($, defs).then(
							_.isFunction(next) && next
					);
				},

				//from html
				getAjax: function (path, file, err) {
					return $.ajax({
						url: path + '.html',
						dataType: 'html',
						context: this,
						success: function (html) {
							var template = create({
								path: path,
								renderer: Handlebars.compile(html)
							});
							this.storage[app.transformToName(file)] = template;
						},
						error: function (res) {
							_.isFunction(err) && err(res);
						}
					})
				},

				//from precompiled
				_processCompiled: function () {
					var templates = Handlebars.templates;
					for(var path in templates) {
						if (!templates.hasOwnProperty(path)) continue;
						this.storage[app.transformToName(path)] = create({
							path: path,
							renderer: templates[path]
						});
					}
					return this;
				},

				_registerHelpers: function () {
					Handlebars.registerHelper('partial', function (name) {
						var view = (!app.Views.isInitialized(name))
							? app.Views.initialize(name)
							: app.Views.getInitialized(name);
						return view ? view.$el.html() : '';
					});
					return this;
				},

				getHtmlPath: function (module) {
					return (module.getOption('isDefault'))
						? '/'
						: (this.config.html || '/');
				}
			});
			return new Controller();
		}
	);
});