'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const paths = require('./paths');

function jsMin() {
    return gulp
        .src(`${paths.dest}/*.js`)
        .pipe(uglify({output: {comments: /^!/}}))
        .pipe(rename((path) => {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(paths.dest));
}

module.exports = jsMin;
