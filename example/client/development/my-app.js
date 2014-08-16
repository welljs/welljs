(function () {
	//Strategy is what should do application, after Bender initialize.
	function MyStrategy (app) {
		this.app = app;
		this.run();
	}

	_.extend(MyStrategy.prototype, {
		run: function () {
			debugger;
		}
	});

	new Bender({
		appPath: '/my-app/',
		strategy: MyStrategy
	});
})();
