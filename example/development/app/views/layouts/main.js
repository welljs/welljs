wellDefine('Views:Layouts:Main', function (app) {
	this.use('Views:Partials:Header');
	this.options({
		template: 'Layouts:Main',
		partials: [
			'Partials:Header'
		]
	});
	this.exports(function () {
		return Backbone.View.extend({
			initialize: function (options) {
				Handlebars.registerPartial('header', app.Templates.get('Partials:Header').render());
				app.Events.on('PAGE_RENDERED', this.onPageRendered, this);
			},
			render: function () {
				this.$el.html(this.template.render());
				this.header = app.Views.initialize('Views:Partials:Header', {
					el: this.$('#site-header')
				});
				this.pageContainer = this.$('.page');
				return this;
			},
			onPageRendered: function () {
				this.$('.highlight pre').each(function(i, block) {
					hljs.highlightBlock(block);
				});
			}
		});
	});
});