'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const include = require('gulp-include');
const paths = require('./paths');

function js() {
    return gulp
        .src(paths.js)
        .pipe(include())
        .pipe(concat('show-js-error.js'))
        .pipe(gulp.dest(paths.dest));
}

module.exports = js;
