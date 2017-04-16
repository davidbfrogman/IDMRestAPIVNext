var gulp = require('gulp');
var debug = require('gulp-debug');
var ts = require('gulp-typescript');
var debug =  require('debug');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var mapSources = require('@gulp-sourcemaps/map-sources');
var paths = require('../paths');
 
gulp.task('build-system', function () {
    // gulp.src('src/**/*.ts')
    //   .pipe(gulp.dest('dist'));
    gutil.log(`== building typescript to ${paths.output} ==`);
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(mapSources(function(sourcePath, file) {
            return file.base + sourcePath; //I'm not sure if this will always work but it works for now.
        }))
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(paths.output));
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