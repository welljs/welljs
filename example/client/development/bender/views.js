benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('Router:PageChanged', this.tryToRender, this);
			app.Events.on('Modules:Defined', this.onModuleDefined, this);
		};
		_.extend(Controller.prototype, {
			//initialized views
			active: {},
			//view modules
			modules: {},
			get: function (viewName) {
				return this.modules[viewName];
			},

			set: function (viewName, impl) {
				this.modules[viewName] = impl;
			},

			onModuleDefined: function (module) {
				if (module.isView()) {
					this.modules[module.name] = module;
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
					}, this);
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
			  this.active[viewName] = new (this.get(viewName))
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
