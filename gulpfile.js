// =============================================================================
//  This file is the entry point for gulp. Here are defined it's tasks for
//  compiling
// =============================================================================

var gulp    = require('gulp');
var del     = require('del');               // Delete files
var inject  = require('gulp-inject');       // Inject imports on html
var uglify  = require("gulp-uglify");       // Minify javascript
var cssmin  = require("gulp-minify-css");   // Minify CSS
var htmlmin = require('gulp-minify-html');  // Minify HTML
var rename  = require('gulp-rename');       // Rename files
var util    = require("gulp-util");         // Log results
var maps    = require("gulp-sourcemaps");   // Sourcemaps for minified files

/* Make build default task */
gulp.task("default", ["build"], function(){/* DO NOTHING */});

// IMG TASKS                                                          IMG TASKS
// -----------------------------------------------------------------------------
gulp.task("move-img", function(){
    return gulp.src("./public/src/img/*")
        .pipe(gulp.dest("./public/dist/img"));
});

// CSS TASKS                                                          CSS TASKS
// -----------------------------------------------------------------------------
gulp.task('clean-css', function (cb) {
    del(['./public/dist/**/*.css'], cb);
});

gulp.task('css', ['clean-css'],function(){
    return gulp.src('./public/src/**/*.css')
        .pipe(cssmin()).on('error', util.log)
        .pipe(rename({
            extname: '.min.css'
        })).on('error', util.log)
        .pipe(gulp.dest('./public/dist/'));
});

// JAVASCRIPT TASKS                                            JAVASCRIPT TASKS
// -----------------------------------------------------------------------------
gulp.task('clean-js', function (cb) {
    del(["./public/dist/**/*.js"], cb);
});

gulp.task("js", ["clean-js"],function(){
    return gulp.src("./public/src/**/*.js")
        .pipe(maps.init()).on('error', util.log)
        //.pipe(uglify({mangle: false})).on('error', util.log)
        .pipe(rename({
            extname: ".min.js"
        })).on('error', util.log)
        .pipe(maps.write()).on('error', util.log)
        .pipe(gulp.dest("./public/dist/"));
});

// HTML TASKS                                                        HTML TASKS
// -----------------------------------------------------------------------------
gulp.task("clean-html", function(cb) {
    del(['./public/dist/**/*.html'], cb);
});

gulp.task("move-html", ["clean-html"], function(){
    return gulp.src("./public/src/**/*.html")
        .pipe(gulp.dest("./public/dist/"));
});

// BUILD TASKS                                                      BUILD TASKS
// -----------------------------------------------------------------------------
gulp.task("build", ["move-html", "move-img", "css", "js"], function(){
    var sources = gulp.src(['./public/dist/**/*.js', './dist/**/*.css'], {read: false});
    gulp.src("./public/dist/**/*.html")
        .pipe(inject(sources, {relative: true})).on('error', util.log)
        //.pipe(htmlmin({
            //empty: true,
            //cdata: false,
            //comments: false,
            //conditionals: false,
            //spare: false,
            //quotes: false,
            //loose: true
        //})).on('error', util.log)
        .pipe(gulp.dest("./public/dist"));
});
