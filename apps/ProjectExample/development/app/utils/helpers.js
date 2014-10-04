wellDefine('Utils:Helpers', function (app) {
	this.exports(function () {
		return {
			translate: function () {

			},

			getFileName: function (modName) {
				return /:([^:]+)$/.exec('www:eee:qqq')[1];
			}
		};
	});
});