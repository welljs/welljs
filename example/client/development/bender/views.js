benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('Router:PageChanged', this.tryToRender, this);
			app.Events.on('Module:Defined', this.onModuleDefined, this);
		};
		_.extend(Controller.prototype, {
			//initialized views
			active: {},
			//view modules
			modules: {},

			config: {},

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
			},

			tryToRender: function (action, params) {
				var mod = app.Modules.findBy('route', action.route),
					controller = this;
				//if module exist
				if (mod) {
					this.render(action.module, params);
				}
				//else download module, and try again
				else{
					this.showOverlay();
					app.Modules.require([action.module], function () {
						controller.tryToRender(action, params);
						controller	.hideOverlay();
					}, function(){});
				}
			},

			render: function (viewName, params) {
				var view = (!this.isActivated(viewName))
					? this.activate(viewName)
					: this.getActive(viewName);

				_.isFunction(view.render) && view.render(params);
				return this;
			},

			getActive: function (viewName) {
			  return this.active[viewName];
			},

			activate: function (viewName) {
				var template = this.getTemplate(viewName);
				return this.active[viewName] = new (this.get(viewName))({
					template: template
				});
			},

			isActivated: function (viewName) {
				return this.active[viewName];
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
