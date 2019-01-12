'use strict';

const
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    paths = require('./paths'),
    currentYear = new Date().getFullYear(),
    text = `/*! show-js-error | © ${currentYear} Denis Seleznev | MIT License */\n`;

function copyright() {
    return gulp.src(`${paths.dest}/*.js`)
        .pipe(replace(/^/, text))
        .pipe(gulp.dest(paths.dest));
}

module.exports = copyright;
