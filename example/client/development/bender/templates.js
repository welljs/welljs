benderDefine('Bender:Templates', function (app) {
	return function () {
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
			this._start();
		};

		//controllers api
		_.extend(Controller.prototype, {
			configure: function (opts) {
				this.config = opts;
				return this;
			},

			_start: function () {
				this.config.precompiled && this._processCompiled();
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

			load: function (names, next, err) {
				var paths = [];
				var self = this;
				//name может быть массивом или обычным названием модуля. надо привести все к массиву
				_.isString(names) && (names = [names]);

				for (var i = names.length - 1; i >= 0; i-- ) {
					var name = names[i];
					this.exist(name)
						? names.splice(i, 1)
						: paths.push(app.transformToPath(name));
				}
				var defs = [];
				_.each(paths, function (file, index) {
					var path = this.isNotFound(names[index]) ? '/' : this.config.html;
					defs.push(
						this.getAjax(path, file, err)
					);
				},self);
				$.when.apply($, defs).then(
						_.isFunction(next) && next
				);
			},

			load404: function (path, file) {
				this.load(path || 'bender/public/', file || 'not-found');
			},

			//from html
			getAjax: function (path, file, err) {
				return $.ajax({
					url: path + file +'.html',
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
			}
		});
		return new Controller();
	};
});