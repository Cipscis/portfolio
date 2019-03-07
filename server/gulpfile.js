var gulp = require('gulp');
var sass = require('gulp-sass');

var paths = {
	src: './assets/scss/**/*.scss',
	dest: './assets/css'
};

function style() {
	return gulp.src(paths.src)
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(gulp.dest(paths.dest));
}

function watch() {
	gulp.watch(paths.src, style);
}

exports.build = gulp.series(style);