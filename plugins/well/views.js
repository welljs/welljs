wellDefine('Plugins:Well:Views', function (app) {
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

			getConfigParam: function (name) {
				return this.config[name];
			},

			getPartials: function (module) {
				if (module) {
					var mod = _.isString(module) ? this.getModule(module) : module;
					return mod.getConfigParam('partials') || [];
				}
			},

			getTemplate: function (module) {
				if (module) {
					var mod = _.isString(module) ? this.getModule(module) : module;
					var name = mod.getConfigParam('template');
					return app.Templates.get(name) || name;
				}
			},

			onModuleDefined: function (module) {
				if (module.isView) {
					this.complete(module);
					this.set(module);
				}
			},

			isCurrentLayout: function (viewName) {
				return !!(this.currentLayout && this.currentLayout.name === viewName);
			},

			complete: function (module) {
				function terminate(){
					module.isComplete = true;
					app.Events.trigger('MODULE_COMPLETED', module);
				}

				if (app.isProduction)
					return terminate();

				var templates = [];
				var template = this.getTemplate(module);
				if (template) {
					templates.push({
						name: template,
						path: this.getHtmlPath(module) + app.transformToPath(module.getConfigParam('template'))
					});
				}

				_.each(this.getPartials(module), function (partial) {
					templates.push({
						name: partial,
						path: this.getHtmlPath(module) + app.transformToPath(partial)
					});
				}, this);

				if (_.isEmpty(templates))
					return terminate();

				//если есть шаблоны, то заргужаются
				else {
					app.Templates.load(templates, function () {
						return terminate();
					});
				}
			},

			getIncomplete: function (modules) {
				var res = [];
				_.each(modules, function (mod) {
					if (!mod.isComplete)
						res.push(mod.name);
				});
				return res;
			},

			waitOnQueueComplete: function (modules, next) {
				var incomplete = this.getIncomplete(modules);
				if (_.isEmpty(incomplete)) return;
				app.Events.on('MODULE_COMPLETED', function (module) {
					var index = incomplete.indexOf(module.name);
					//проверка на то, из текущей ли очереди загружен модуль
					if (index !== -1) {
						incomplete.splice(index, 1);
						if (!incomplete.length) {
							app.Events.off('MODULE_COMPLETED');
							return next.call(this)
						}
					}
				}, this);
			},

			tryToRender: function (action, params) {
				var page, layout, self = this, o, layoutName, pageName;

				this.showOverlay();

				if (_.isString(action)) {
					layoutName = this.getConfigParam('layoutModule') || 'Well:Defaults:Layout';
					pageName = action;
				}
				//не определена рутером
				else if (!action) {
					layoutName = this.getConfigParam('layoutModule') || 'Well:Defaults:Layout';
					pageName = this.getConfigParam('notFoundModule') || 'Well:Defaults:NotFound';
				}
				else {
					layoutName = action.layout || 'Well:Defaults:Layout';
					pageName = action.page;
				}

				layout = this.getModule(layoutName);
				//загрузка лэйаута
				if (!layout) {
					return app.Modules.require([layoutName], function (modules, queue) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					});
				}
				//если лэйаут загружен, но не загружены его зависимости, то ожидание всех зависимостей
				else if (!layout.isComplete) {
					(o = {})[layout.name] = layout;
					return this.waitOnQueueComplete(o, function () {
						self.tryToRender(action, params);
					});
				}

				page = this.getModule(pageName);
				if (!page) {
					return app.Modules.require([pageName], function (modules, queue) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					}, function () {
						if (!self.getModule('Well:Defaults:NotFound')) {
							return app.Modules.require(['Well:Defaults:NotFound'], function (modules, queue) {
								self.waitOnQueueComplete(modules, function () {
									self.tryToRender('Well:Defaults:NotFound', params);
								});
							});
						}
						app.Router.go('not-found');
					});
				}
				//если страница загружена, но не загружены её зависимости, то ожидание всех зависимостей
				else if (!page.isComplete) {
					(o = {})[page.name] = page;
					return this.waitOnQueueComplete(o, function () {
						self.tryToRender(action, params);
					});
				}

				//когда загружены все данные, можно отрендерить лэйаут и страницу
				this.renderLayout(layout, params);
				this.renderPage(page, params);
				this.hideOverlay();
				return this;
			},

			renderPage: function (module, params) {
				this.currentPage = module;
				module.el = this.currentLayout.view.pageContainer;
				return this.render(module, params);
			},

			renderLayout: function (module, params) {
				if (this.isCurrentLayout(module.name))
					return this.currentLayout.view;
				this.currentLayout = module;
				module.el = $(this.config.layoutHolder);
				return this.currentLayout.view = this.render(module, params);
			},

			render: function (module, params) {
				var view = (this.isInitialized(module.name))
					? this.getInitialized(module)
					: this.initialize(module);

				if (_.isFunction(view.render)) {
					view.render(params);
				}
				return view;
			},

			getInitialized: function (module) {
				var view = this.initialized[module.name];
				view.$el = module.el;
				return view;
			},

			initialize: function (module, options) {
				_.isString(module) && (module = this.getModule(module));
				if (!module)
					throw 'View module not found';
				var template = this.getTemplate(module);
				var viewName = module.name;
				var view = this.initialized[viewName] = new (this.get(viewName))(_.extend({
					template: template,
					el: module.el
				}, options));
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
			},

			getHtmlPath: function (module) {
				return (module.getConfigParam('isDefault'))
					? '/'
					: (this.config.templates || '/');
			}

		});
		return new Controller();
	}
});
