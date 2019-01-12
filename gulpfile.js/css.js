'use strict';

const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const less = require('gulp-less');
const rename = require('gulp-rename');
const paths = require('./paths');

function css() {
    return gulp
        .src(paths.css)
        .pipe(rename('show-js-error.css'))
        .pipe(less())
        .pipe(gulp.dest(paths.dest));
}

function cssMin() {
    return gulp
        .src(`${paths.dest}/show-js-error.css`)
        .pipe(cssnano())
        .pipe(rename('show-js-error.min.css'))
        .pipe(gulp.dest(paths.dest));
}

module.exports = gulp.series(css, cssMin);
