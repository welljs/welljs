var gulp = require('gulp');
var bower = require('bower');

gulp.task('deps', function (cb) {
	debugger;
	bower.command.install(['well'], {save: true}, {})
		.on('end', function () {
			debugger;
		})
});

gulp.task('default', ['deps'], function () {

});