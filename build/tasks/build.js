var gulp = require('gulp');
var debug = require('gulp-debug');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
 
gulp.task('build-system', function () {
    gulp.src('src/**/*.ts')
      .pipe(gulp.dest('dist'));

    gutil.log('== building typescript to dist ==');
    var tsProject = ts.createProject('tsconfig.json');

    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
        .pipe(tsProject()).js
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest('dist'));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system'],
    callback
  );
});