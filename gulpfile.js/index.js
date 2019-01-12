'use strict';

const
    gulp = require('gulp'),
    clean = require('./clean'),
    copyright = require('./copyright'),
    css = require('./css'),
    js = require('./js'),
    jsCustom = require('./js.custom'),
    jsMin = require('./js.min');

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(js, jsCustom, css),
    jsMin,
    copyright
));
