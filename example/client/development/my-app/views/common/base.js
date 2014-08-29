benderDefine('Views:Common:Base', function (app) {
    return function(){
			return Backbone.Views.extend({
				initialize: function () {
					console.log('base initialized');
				}
			});
		};
});
