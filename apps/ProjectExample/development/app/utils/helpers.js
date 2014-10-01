wellDefine('Utils:Helpers', function (app) {
	this.export(function () {
		return {
			translate: function () {

			},

			getFileName: function (modName) {
				return /:([^:]+)$/.exec('www:eee:qqq')[1];
			}
		};
	});
});