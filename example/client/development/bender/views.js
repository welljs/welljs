benderDefine('Bender:Views', function (app) {
	return function(){
		var Controller = function () {
			app.Events.on('Router:PageChanged', this.tryToRender, this);
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

			tryToRender: function (action, params) {
				var mod = app.Modules.findBy('route', action.route);
				//if module exist
				if (mod) {
					this.render(action.module, params);
				}
				//else download module, and try again
				else{
					this.showOverlay();
					app.Modules.require([action.module], function () {
						this.tryToRender(action, params);
						this.hideOverlay();
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
