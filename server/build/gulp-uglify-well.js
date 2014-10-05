module.exports = function (app) {
	var gulp = app.gulp;
	gulp.task('uglifyWell', function () {
		gulp.src(app.wellRoot + 'well.js')
			.pipe(app.concat('well.min.js'))
			.pipe(app.uglify())
			.pipe(gulp.dest(app.wellRoot))
	});
};