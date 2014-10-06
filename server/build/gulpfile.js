var app = {
	vendorRoot: '../../vendor/',
	wellRoot: '../../well/',
	pluginsRoot: '../../plugins/',
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
require('./gulp-uglify-vendor.js')(app);
require('./gulp-uglify-well.js')(app);
require('./gulp-uglify-sawbones.js')(app);

app.gulp.task('default', function () {});