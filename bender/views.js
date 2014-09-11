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

			getPartials: function (module) {
				var mod = (typeof module === 'string') ? this.getModule(module) : module;
				if (!mod) return false;
				return mod.getConfigParam('partials') || [];
			},

			getTemplate: function (module) {
				var mod = (typeof module === 'string') ? this.getModule(module) : module;
				if (!mod) return false;
				var name = mod.getConfigParam('template');
				return app.Templates.get(name) || name;
			},

			onModuleDefined: function (module) {
				if (module.isView) {
					/// есть шаблон или нет
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

			complete: function (module) {
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

				if (!_.isEmpty(templates)) {
					app.Templates.load(templates, function () {
						app.Events.trigger('MODULE_COMPLETED', module);
					});
				}
			},

			waitOnQueueComplete: function (modules, next) {
				var missing = {};

				if (_.isEmpty(missing)) {
					_.each(modules, function (mod) {
						if (_.isString(this.getTemplate(mod)))
							missing[mod.name] = _.clone(mod);
						else
							mod.isComplete = true;
					}, this);
				}

				app.Events.on('MODULE_COMPLETED', function (module) {
					if (!missing[module.name])
						return;
					delete missing[module.name];
					if (_.isEmpty(missing)) {
						app.Events.off('MODULE_COMPLETED');
						module.isComplete = true;
						return next.call(this)
					}
				}, this);

			},

			tryToRender: function (action, params) {
				var page = app.Modules.getModule(action.module);
				var self = this;

				// если страница еще  не загружена, то ожидается загрузка модуля загрузки,
				// всех зависимостей в т.ч. шаблонов, и после этого делается еще одна попытка рендера
				if (!page || !page.isComplete) {
					this.showOverlay();
					return app.Modules.require([action.module], function (modules, queue) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					}, function () {
						app.Router.go404();
					});
				}

				//когда загружены все данные, можно отрендерить лэйаут и страницу
				this.renderLayout(this.getLayout(page), params);
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
