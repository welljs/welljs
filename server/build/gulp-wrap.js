module.exports = function (app, opts) {
	var wrap = app.wrap;
	var gulp = app.gulp;
	var rename = app.rename;
	console.log('opts---: ', opts);
	gulp.src(opts.from + opts.file + '.js')
		.pipe(wrap("wellDefine('" + opts.name + "', function () {\n\tthis.exports(function(){\n\t <%= contents %>\n\t});\n});"))
		.pipe(rename(opts.file.replace('.', '-') + '-well.js'))
		.pipe(gulp.dest(opts.to));
};