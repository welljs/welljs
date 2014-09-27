wellDefine('Utils:Helpers', function (app) {
	return function () {
		return {
			translate: function () {

			},

			getFileName: function (modName) {
				return /:([^:]+)$/.exec('www:eee:qqq')[1];
			}
		};
	};
});