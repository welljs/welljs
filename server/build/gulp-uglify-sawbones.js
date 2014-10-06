module.exports = function (app, opts) {
	var gulp = app.gulp;
	gulp.task('uglsawb', function () {
		var dir = app.pluginsRoot + 'sawbones/';
		gulp.src(dir + '*.js')
			.pipe(app.concat('sawbones.min.js'))
			.pipe(app.uglify())
			.pipe(gulp.dest(dir))
	});
};

