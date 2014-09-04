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
				var templates = _.union([this.getTemplate(module)], this.getPartials(module));
				var defs = [];
				var self = this;
				_.each(templates, function (template) {
					defs.push(this.loadTemplate())
				},this);
				$.when.apply(null, function () {
					_.each(templates, function (template) {
						if (_.isString(template)) {
							this.loadTemplate(template, function () {
								//событие должно

							})
						}
					}, self);
				}).then(function () {
					app.Events.trigger('MODULE_COMPLETED', module);
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

			waitOnQueueComplete: function (modules, next) {
				var missing = {};
				app.Events.on('MODULE_COMPLETED', function (module) {
					if (_.isEmpty(missing)) {
						_.each(modules, function (mod) {
							if (_.isString(this.getTemplate(mod)))
								missing[mod.name] = _.clone(mod);
						}, this);
					}

					if (!missing[module.name])
						return;

					delete missing[module.name];
					if (_.isEmpty(missing)) {
						app.Events.off('MODULE_COMPLETED');
						return next.call(this)
					}
				}, this);

			},

			tryToRender: function (action, params) {
				var page = app.Modules.findBy('route', action.route);
				var self = this;

				// если страница еще  не загружена, то ожидается загрузка модуля загрузки,
				// всех зависимостей в т.ч. шаблонов, и после этого делается еще одна попытка рендера
				if (!page) {
					this.showOverlay();
					return app.Modules.require([action.module], function (modules, queue) {
						self.waitOnQueueComplete(modules, function () {
							self.tryToRender(action, params);
						});
					});
				}

				var layout = this.getLayout(page);
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

			initialize: function (viewName, options) {
				var template = this.getTemplate(viewName);
				var module = this.getModule(viewName);
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
			}

		});
		return new Controller();
	}
});
