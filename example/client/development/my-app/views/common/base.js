benderDefine('Views:Common:Base', function (app) {
    return function(){
			return Backbone.View.extend({
				initialize: function () {
					console.log('base initialized');
				}
			});
		};
});
