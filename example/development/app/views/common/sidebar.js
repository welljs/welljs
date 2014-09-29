wellDefine('Views:Common:Sidebar', function (app) {
	this.use(':Base');
	this.export(function () {
		return app.Views.get('Views:Common:Base').extend({
			initialize: function (options) {
				this.docBody = $('html, body');
				this.activeitem = this.$('.active');
				app.Events.on('PAGE_RENDERED', this.onPageRendered, this)
			},
			onPageRendered: function () {
				this.$('.link').on('click', $.proxy(this.onLinkClick, this));
				return this;
			},
			onLinkClick: function (e) {
				e.preventDefault();
				var target = $(e.target);
				var l = $('#'+ (target.attr('data-link') || ''));
				if (l.length)
					this.docBody.animate({ scrollTop: l.offset().top - 70  }, 450);
				this.activeitem.removeClass('active');
				this.activeitem = target.addClass('active');
			}
		});
	});
});