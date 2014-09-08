benderDefine('Helpers', function (app) {
	return function () {
		return {
			getFileName: function (modName) {
				return /:([^:]+)$/.exec('www:eee:qqq')[1];
			}
		};
	};
});