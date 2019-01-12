'use strict';

const
    gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    paths = require('./paths');

function css() {
    return gulp
        .src(paths.css)
        .pipe(less())
        .pipe(gulp.dest(paths.dest));
}

function cssMin() {
    return gulp
        .src(`${paths.dest}/*.css`)
        .pipe(cssnano())
        .pipe(rename((path) => {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(paths.dest));
}

module.exports = gulp.series(css, cssMin);
