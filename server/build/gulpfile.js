var app = {
	gulp: require('gulp'),
	concat: require('gulp-concat'),
	uglify: require('gulp-uglify'),
	_: require('underscore'),
	rename: require('gulp-rename'),
	wrap: require("gulp-wrap")
};

app.utils = require('./utils.js')(app);
require('./gulp-wrap-vendor.js')(app);
require('./gulp-build-well.js')(app);

app.gulp.task('default', function () {});