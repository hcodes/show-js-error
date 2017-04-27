'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const cleancss = require('gulp-cleancss');
const include = require('gulp-include');
const less = require('gulp-less');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const destDir = './dist/';

gulp.task('less', function() {
    return gulp
        .src('src/main.less')
        .pipe(rename('show-js-error.css'))
        .pipe(less())
        .pipe(gulp.dest(destDir));
});

gulp.task('less-min', ['less'], function() {
    return gulp
        .src(destDir + 'show-js-error.css')
        .pipe(cleancss())
        .pipe(rename('show-js-error.min.css'))
        .pipe(gulp.dest(destDir));
});

gulp.task('js', function() {
    return gulp
        .src('src/show-js-error.js')
        .pipe(include())
        .pipe(concat('show-js-error.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('js-custom', function() {
    return gulp
        .src('src/show-js-error.custom.js')
        .pipe(include())
        .pipe(concat('show-js-error.custom.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('js-min', ['js'], function() {
    return gulp
        .src(destDir + 'show-js-error.js')
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(rename('show-js-error.min.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('js-custom-min', ['js-custom'], function() {
    return gulp
        .src(destDir + 'show-js-error.custom.js')
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(rename('show-js-error.custom.min.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('default', [
    'js',
    'js-min',

    'js-custom',
    'js-custom-min',

    'less',
    'less-min'
]);
