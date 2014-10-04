module.exports = function (app) {
	var gulp = app.gulp;
	var fs = require('fs');
	var _ = app._;
	var wrap = require('./gulp-wrap.js');
	gulp.task('wrapVendor', function () {
		var rec = JSON.parse(fs.readFileSync(__dirname + '/vendor.json'));
		_.each(rec, function (file) {
			wrap(app, {
				file: file.name,
				from: '../../vendor/src'+ file.from,
				to: '../../vendor/',
				name: app.utils.transformToName('vendor/' + file.name + '-well')
			});
		});
	});
};