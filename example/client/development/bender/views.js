benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('ROUTER_PAGE_CHANGED', this.tryToRender, this);
			app.Events.on('MODULE_DEFINED', this.onModuleDefined, this);
		};
		_.extend(Controller.prototype, {
			//initialized views
			initialized: {},
			//view modules
			modules: {},
			config: {},
			currentLayout: null,
			currentPage: null,
			configure: function (options) {
				this.config = options;
			},

			get: function (viewName) {
				return this.modules[viewName].implementation();
			},

			getModule: function (viewName) {
				return this.modules[viewName];
			},

			set: function (module) {
				this.modules[module.name] = module;
				return this;
			},

			getTemplate: function (module) {
				var mod = (typeof module === 'string') ? this.getModule(module) : module;
				if (!mod) return false;
				var name = mod.getConfigParam('template');
				return app.Templates.get(name) || name;
			},

			onModuleDefined: function (module) {
				if (module.isView) {
					this.complete(module);
					this.set(module);
				}
				return this;
			},

			getLayout: function (module) {
				return this.getModule(module.getConfigParam('layout'));
			},

			isCurrentLayout: function (viewName) {
				return !!(this.currentLayout && this.currentLayout.name === viewName);
			},


			//загружает модуль вьюхи со всеми зависимостями. шаблоном в т.ч.
			complete: function (module, cbk) {
				var next = _.isFunction(cbk) ? cbk : function () {};
				function getTemplate (module, next) {
					var template = this.getTemplate(module);
					//если шаблон строка, значит он еще не загружен. подгружается и запускается колбэк
					_.isString(template)
						? this.loadTemplate(template, function () {
								next.call(this);
							})
						:	next.call(this);
				}

				function onCompleted () {
					module.isCompleted = true;
					delete module.inProgress;
					next.call(self)
				}

				module.inProgress = true;
				var self = this;

				// если вьюха уже загружена, то подгружается только шаблон
				// если шаблон тоже подгружен, то сразу сработает колбэк
				if (_.isObject(module))
					return getTemplate.call(this, module, onCompleted);

				// загружается модуль вьюхи, после этого шаблон, после этого вызов колбэка.
				// если шаблон уже есть, то сразу колбэк
				return app.Modules.require([module], function () {
					//к этому моменту заргужен модуль и все его зависимости
					module = self.getModule(module);
					getTemplate.call(self, module, onCompleted);
				});
			},

			loadTemplate: function (name, next) {
				var controller = this;
				app.Templates.load(app.transformToPath(name), function () {
					next.call(controller);
				}, function (err) {
					console.log(err);
				});
			},

			tryToRender: function (action, params) {
				var page = app.Modules.findBy('route', action.route),
					controller = this;

				//если страница еще не скачана - скачать
				if (!page || !page.isCompleted) {
					return this.complete(action.module, function () {
						controller.tryToRender(action, params);
					});
				}

				var layout = this.getLayout(page) || {};
				if (!layout || !layout.isCompleted) {
					return this.complete(layout, function () {
						controller.tryToRender(action, params);
					});
				}

				this.currentPage = page;
				if(!this.isCurrentLayout(layout.name)) {
					this.currentLayout = layout;
					if (!layout.el)
						layout.el = $(this.config.layoutHolder);
					this.render(layout.name, params);
				}
				this.render(page.name, params);
				this.hideOverlay();
				return this;
			},

			render: function (viewName, params) {
				var view = (this.isInitialized(viewName))
					? this.getInitialized(viewName)
					: this.initialize(viewName);

				if (_.isFunction(view.render)) {
					view.render(params);
				}
				return this;
			},

			getInitialized: function (viewName) {
				return this.initialized[viewName];
			},

			initialize: function (viewName) {
				var template = this.getTemplate(viewName);
				var module = this.getModule(viewName);
				var view = this.initialized[viewName] = new (this.get(viewName))({
					template: template,
					el: module.el
				});
				view.template = template;
				return view;
			},

			isInitialized: function (viewName) {
				return !!this.initialized[viewName];
			},

			showOverlay: function () {
				this.isOverlayVisible = true;
			},

			hideOverlay: function () {
				this.isOverlayVisible = false;
			}

		});
		return new Controller();
	}
});
