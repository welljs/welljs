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

			getTemplate: function (module, next) {
				var mod = (typeof module === 'string') ? this.getModule(module) : module;
				if (!mod) return false;
				var name = mod.getConfigParam('template');
				return app.Templates.get(name) || name;
			},

			onModuleDefined: function (module) {
				module.isView && this.set(module);
				return this;
			},

			getLayout: function (module) {
				return this.getModule(module.getConfigParam('layout'));
			},

			isCurrentLayout: function (viewName) {
				return !!(this.currentLayout && this.currentLayout.name === viewName);
			},

			load: function (name, next) {
				var controller = this;
				var module = this.getModule(name);
				if (!module) {
					app.Modules.require([name], function () {
						controller.loadTemplate(controller.getTemplate(name), next);
					});
				}
				else {
					controller.loadTemplate(controller.getTemplate(name), next);
				}
				return this;
			},

			loadTemplate: function (name, next) {
				var controller = this;
				app.Templates.load(app.transformToPath(name), function () {
					next.call(controller);
				}, function (err) {
					console.log(err);
				});
			},

			isReady: function (module) {
				if (!module) return false;
				return !!module && $.isPlainObject(this.getTemplate(module));
			},

			tryToRender: function (action, params) {
				var page = app.Modules.findBy('route', action.route);

				if (!this.isReady(page)) {
					return this.load(action.module, function () {
						this.tryToRender(action, params);
					});
				}

				var layout = this.getLayout(page);
				if (!this.isReady(layout)) {
					return this.load(layout.name, function () {
						this.tryToRender(action, params);
					});
				}

				if(!this.isCurrentLayout(layout.name)) {
					this.currentLayout = layout;
					this.render(layout.name, params);
				}
				this.currentPage = page;
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
				var view = this.initialized[viewName] = new (this.get(viewName))({
					template: template
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
