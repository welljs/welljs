benderDefine('Views:Pages:Cart', function (app) {
	this.use('Views:Common:Base');
	this.use('Views:Layouts:Main');
	this.configure({
		layout: 'Views:Layouts:Main',
		template: 'Pages:Catalog',
		route: '/catalog'
	});
	return function () {
	  return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.template = options.template;
			},
			render: function () {
				var goods = [
					{
						name: 'Camera',
						id: 1,
						brand: 'Sony'
					},
					{
						name: 'Smartphone',
						id: 2,
						brand: 'Nokia'
					},
					{
						name: 'TV',
						id: 3,
						brand: 'Samsung'
					}
				];
				this.$el.html(this.template.render({goods: goods}));
				return this;
			}
		});
	};
});