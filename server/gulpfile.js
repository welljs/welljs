var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var _ = require('underscore');
var rename = require('gulp-rename');

var dev = '../client/development';
var prod = '../client/production/';
var prodJs = prod + 'js/';
var prodHbs = prod + 'handlebars/';

function vendors(libs) {
	var path = dev + '/bender/bender/vendors/';
	return  _.map(libs, function (lib) {
		return path + lib + '.js';
	});
}

gulp.task('vendors', function () {
	gulp.src(vendors(['jquery', 'underscore', 'backbone', 'handlebars']))
		.pipe(concat('vendors.min.js'))
//		.pipe(uglify())
		.pipe(gulp.dest(prodJs));
});

var bdr = dev + '/bender/bender';
gulp.task('bender', function () {
	gulp.src([bdr + '/modules.js', bdr + '/bender.js'])
		.pipe(concat('bender.min.js'))
//		.pipe(uglify())
		.pipe(gulp.dest(prodJs));
});

gulp.task('plugins', function () {
	gulp.src(dev + '/plugins/**/*.js')
		.pipe(concat('plugins.min.js'))
//		.pipe(uglify())
		.pipe(gulp.dest(prodJs));
});

gulp.task('templates', function () {
	gulp.src(dev + '/e-store/templates/**/*.html')
		.pipe(rename(function (path) {
			path.extname = '.handlebars';
		}))
		.pipe(gulp.dest(prodHbs));
});

gulp.task('app', function () {
	gulp.src(['!'+dev + '/e-store/my-strategy.js', dev + '/e-store/**/*.js'])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(prodJs));
});

gulp.task('strategy', function () {
	gulp.src([prodJs + 'app.min.js', dev + '/e-store/my-strategy.js'])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(prodJs));
});

gulp.task('default', ['vendors', 'bender', 'plugins', 'templates', 'app', 'strategy'], function () {});