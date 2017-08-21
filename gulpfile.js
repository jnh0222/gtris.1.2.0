'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');

// paths
var DIR = {
	MAP: 'map'
};

/* variables */
var paths = {
	src: {
		gt_scss: 'css/**/*.scss',
	},
	dist: {
		gt_css: 'css/',
	}
}

// task
gulp.task('sass', function () {
	return gulp.src(paths.src.gt_scss)
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
	.pipe(sourcemaps.write(DIR.MAP))
		.pipe(gulp.dest( paths.dist.gt_css ));
});

// watch
gulp.task('watch', function () {
	gulp.watch( paths.src.gt_scss, ['sass']);
});

gulp.task('default', ['sass', 'watch']);
