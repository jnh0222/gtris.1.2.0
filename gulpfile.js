'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-clean'),
	stylish = require('jshint-stylish'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	uglifycss = require('gulp-uglifycss'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin');

// paths
var DIR = {
	SRC: 'src',
	DEST: 'dist',
	MAP: 'map'
};
var SRC = {// input file
	JS: DIR.SRC + '/js/**/*.js',
	SCSS: DIR.SRC + '/sass/*.s+(a|c)ss',
	IMG: DIR.SRC + '/images/*'
};
var dist = DIR.DEST; // output file

// task
gulp.task('clean-css', function() {
	return gulp.src(dist + '/*.css', {read: false}).pipe(clean());
});

gulp.task('clean-js', function() {
	return gulp.src(dist + '/*.js', {read: false}).pipe(clean());
});

gulp.task('lint-js', ['clean-js'], function() {
	gulp.src(SRC.JS)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('sass', ['clean-css'], function() {
	gulp.src(SRC.SCSS)
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
	.pipe(sourcemaps.write(DIR.MAP))
	.pipe(gulp.dest(dist));
});

gulp.task('js', ['lint-js'], function() {
	return browserify(DIR.SRC + '/js/entry.js')
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write(DIR.MAP))
	.pipe(gulp.dest(dist));
});

// watch
gulp.task('watch',['clean-css','clean-js'], function() {
	gulp.watch(SRC.SCSS, ['sass']);
	gulp.watch(SRC.JS, ['js']);
});

// min build
gulp.task('min-js', function(){
	gulp.src(dist +'/*.js')
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest(dist));
});
gulp.task('min-css', function() {
	gulp.src(dist +'/*.css')
	.pipe(uglifycss({ //배포용
		"maxLineLen": 80,
		"uglyComments": true
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest(dist));
});

// image minify
gulp.task('imagemin', function() {
	gulp.src(SRC.IMG)
	.pipe(imagemin())
	.pipe(gulp.dest(dist + '/images'))
});

// default
gulp.task('default', ['sass','js','watch']);