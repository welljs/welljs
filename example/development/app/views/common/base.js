wellDefine('Views:Common:Base', function (app) {
	this.export(function(){
		return Backbone.View.extend({
			initialize: function () {
				console.log('base initialized');
			}
		});
	});
});
