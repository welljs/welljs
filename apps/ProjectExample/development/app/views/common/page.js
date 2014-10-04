wellDefine('Views:Common:Page', function (app) {
	this.exports(function(){
		return Backbone.View.extend({
			render: function () {
				this.$el.html(this.template.render());
				this.subscribe();
				return this;
			},
			subscribe: function () {

			}
		});
	});
});
