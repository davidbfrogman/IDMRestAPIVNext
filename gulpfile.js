var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');
 
gulp.task('build', function () {
    gutil.log('== building typescript to dist ==')
    return gulp.src('server/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: "commonjs",
            target: "es6",
            sourceMap: true
        }))
        .pipe(gulp.dest('dist'));
});