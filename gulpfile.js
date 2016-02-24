var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    destDir = './dist/';

var paths = {
    less: [
        'src/show-js-error.less'
    ],
    js: [
        'src/show-js-error.js',
        'src/show-js-error.init.js'
    ],
    jsCustom: [
        'src/show-js-error.js'
    ]
};

gulp.task('less', function() {
    return gulp
        .src(paths.less)
        .pipe(less())
        .pipe(gulp.dest(destDir));
});

gulp.task('js', function() {
    return gulp
        .src(paths.js)
        .pipe(concat('show-js-error.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('js-custom', function() {
    return gulp
        .src(paths.jsCustom)
        .pipe(concat('show-js-error.custom.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('default', ['js', 'js-custom', 'less']);
