benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('Router:PageChanged', this.tryToRender, this);
			app.Events.on('Module:Defined', this.onModuleDefined, this);
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
				return (mod.config && mod.config.template)
					? app.Templates.get(mod.config.template)
					: {};
			},

			onModuleDefined: function (module) {
				if (module.isView) {
					this.set(module);
				}
				return this;
			},

			tryToRender: function (action, params) {
				var module = app.Modules.findBy('route', action.route);
				//if module exist
				if (module) {
					this.render(action.module, params);
					this.hideOverlay();
				}
				//else download module, and try again
				else{
					this.showOverlay();
					app.Modules.require([action.module], function () {
						this.tryToRender(action, params);
					}.bind(this), function(){});
				}
				return this;
			},

			render: function (viewName, params) {
				var layout;
				var view = (!this.isInitialized(viewName))
					? this.initialize(viewName)
					: this.getInitialized(viewName);

				if (_.isFunction(view.render)) {
					view.render(params);
					this.currentPage = viewName;
					this.currentLayout = layout;
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
				return this.initialized[viewName];
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
