'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    jshint = require('gulp-jshint'),
    eslint = require('gulp-eslint'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    nodemon = require('gulp-nodemon'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream');

var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('styles', function() {
  gulp.src(['client/stylus/**/*.styl'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(stylus())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/styles/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/styles/'))
});

// http://stackoverflow.com/questions/22330103/how-to-include-node-modules-in-a-separate-browserify-vendor-bundle
gulp.task('scripts-vendor', function() {
  return gulp.src(['client/scripts/noop.js'], { read: false })
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(browserify({ debug: false }))
    .on('prebundle', function(bundle) {
      bundle.require('react');
      bundle.require('react-dom');
      bundle.require('react-router');
    })
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts/'));
});

gulp.task('scripts-app', function() {
  return gulp.src(['client/scripts/App.js'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sourcemaps.init())
    .pipe(browserify({ debug: true, transform: 'babelify' }))
    .on('prebundle', function(bundle) {
      bundle.external('react');
      bundle.external('react-dom');
      bundle.external('react-router');
    })
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/scripts/'));
});

// gulp.task('scripts-old', function() {
//   return gulp.src(['client/scripts/**/*.js'])
//     .pipe(plumber({
//       errorHandler: function (error) {
//         console.log(error.message);
//         this.emit('end');
//     }}))
//     .pipe(browserify({ debug: false }))
//     .pipe(babel({ compact: false }))
//     .pipe(concat('bundle.js'))
//     .pipe(gulp.dest('public/scripts/'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('public/scripts/'));
// });

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    // nodemon our expressjs server
    script: 'server.js',
    // watch core server file(s) that require server restart on change
    watch: ['server.js', 'server/**/*.js']
  })
  .on('start', function onStart() {
    // ensure start only got called once
    if (!called) { cb(); }
    called = true;
  })
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

gulp.task('browser-sync', ['nodemon'], function() {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',
    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,
    // open the proxied app in chrome
    browser: 'google chrome'
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['scripts-vendor', 'scripts-app', 'browser-sync'], function() {
  gulp.watch('client/scripts/**/*.js', ['scripts-vendor', 'scripts-app', browserSync.reload]);
  gulp.watch('client/stylus/**/*.styl',  ['styles', browserSync.reload]);
  gulp.watch('public/**/*.html', ['bs-reload']);
});
