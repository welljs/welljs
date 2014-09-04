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

			transformNames: function (paths) {
				return _.map(paths, function (path) {
					//если шаблон уже загружен, то
					return this.exist(name) ? this.exist(name) : app.transformToName(path);
				});
			},

			//from html
			load: function (path, next, err) {
				var names = [];
				var self = this;
				_.isString(path) && (path = [path]);
				for (var i = path.len - 1; i >= 0; i-- ) {
					this.exist(name)
						? path.splice(i, 1)
						: names.push(path[i] = app.transformToName(path[i]));
				}
				var defs = [];
				_.each(path, function (file) {
					defs.push(
						$.ajax({
							url: this.config.html + file +'.html',
							dataType: 'html',
							context: this,
							success: function (html) {
								var template = create({
									path: path,
									renderer: Handlebars.compile(html)
								});
								this.storage[name] = template;
							},
							error: function (res) {
								_.isFunction(err) && err(res);
							}
						})
					);
				},self);
				$.when.apply($, defs).then(_.isFunction(next) && next());
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