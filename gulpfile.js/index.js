'use strict';
'use strict';

const gulp = require('gulp');
const clean = require('./clean');
const css = require('./css');
const js = require('./js');
const jsCustom = require('./js-custom');
const jsMin = require('./js-min');

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(js, jsCustom, css),
    jsMin
));
