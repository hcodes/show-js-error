'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const include = require('gulp-include');
const paths = require('./paths');

function jsCustom() {
    return gulp
        .src(paths.jsCustom)
        .pipe(include())
        .pipe(concat('show-js-error.custom.js'))
        .pipe(gulp.dest(paths.dest));
}

module.exports = jsCustom;
