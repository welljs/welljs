var AutoInits = new (function () {
	var mods = {};
	function A () {}
	A.prototype.add = function (opts) {
		var key = Object.keys(opts)[0];
		mods[key] = opts[key];
	};

	A.prototype.initialize = function (modname) {

	};
	return A;
}())();
