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
			this
				._process()
				._registerHelpers();
		};

		//controllers api
		_.extend(Controller.prototype, {

			get: function (name) {
				return this.storage[name];
			},

			_process: function () {
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
					debugger;
				});

				return this;
			}
		});
		return new Controller();
	};
});