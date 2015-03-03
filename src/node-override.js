var path = require('path');
Main.prototype.requireConfig = function () {};
Main.prototype.vendorRequire = function (modules, next, err) {
	var res = [];
	_.each(modules, function (module) {
		res.push(require(path.join(process.cwd(), module + '.js')));
	});
	return res;
};
