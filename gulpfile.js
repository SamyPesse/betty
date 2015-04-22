var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
    return gulp.src('./public/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});


gulp.task('default', ['less']);