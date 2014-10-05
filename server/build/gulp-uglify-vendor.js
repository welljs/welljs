module.exports = function (app) {
	var gulp = app.gulp;
	gulp.task('uglifyVendor', function () {
		gulp.src([app.vendorRoot + '*.js'])
			.pipe(app.concat('vendor.min.js'))
			.pipe(app.uglify())
			.pipe(gulp.dest(app.vendorRoot))
	});
};