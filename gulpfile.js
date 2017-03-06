'use strict';

/**
 * CONFIGURATION
 */

// Modules
var argv         = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var cleanCSS     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var cp           = require('child_process');
var del          = require('del');
var gulp         = require('gulp');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');

// Local settings
var config = require('./gulp.config.js');
var paths  = config.paths;
var jekyll = config.jekyll;

/**
 * PRIMARY TASKS
 */

/**
 * `gulp`
 * Default task cleans, compiles assets and builds _site/
 */
gulp.task('default', function(done) {
  runSequence('clean', 'bundle', 'build-assets', 'build-jekyll', 'serve', done);
});

/**
 * Build assets: CSS & JS
 */
gulp.task('build-assets', function(done) {
  runSequence('sass', 'js', done);
});

/**
 * `gulp build`
 * Builds _site directory
 * 
 * Set JEKYLL_ENV
 * --development (default) 
 * --production
 * --debug
 * 
 * Remove dependencies and assets, then recompile
 * --clean 
 */
 gulp.task('build', function(done) {
  if (argv.clean) {
    runSequence('default', done);
  } else {
    runSequence('build-jekyll', done);    
  }
 })

/**
 * `gulp serve`
 * Builds and serves _site directory
 * 
 * See `gulp build` for command line options
 */
gulp.task('serve', function(done) {
  runSequence('browser-sync', 'watch', done)
});

/**
 * `gulp netlify`
 * Compiles assets, builds _site/ for production
 *
 * Note: Netlify automatically installs package.json and Gemfile dependencies
 */
gulp.task('netlify', function(done) {
  argv.production = true;
  runSequence('build-assets', 'build-jekyll', done);
})

/**
 * SECONDARY TASKS
 */

// Generates Jekyll _site directory
gulp.task('build-jekyll', function(done) {

  var env = function() {
    if (argv.production) {
      process.env.JEKYLL_ENV = 'production';
    } else if (argv.debug) {
      process.env.JEKYLL_ENV = 'debug';
    } else {
      process.env.JEKYLL_ENV = 'development';
    }

    return process.env;
  }();
  
  browserSync.notify('Building jekyll:' + env.JEKYLL_ENV);

  var args = ['exec','jekyll','build'].concat(jekyll.build[env.JEKYLL_ENV]);
  var opts = {stdio: 'inherit', env: env};

  return cp.spawn('bundle', args, opts).on('close', done);
})

// Rebuild Jekyll site and reload page
gulp.task('rebuild-jekyll', ['build-jekyll'], function() {
  browserSync.reload();
})

// Compile sass to minified & mapped css files
gulp.task('sass', function() {
  browserSync.notify('Compiling stylesheet')
  return gulp.src(paths.sass + '/**/*')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});

// Minify js files
gulp.task('js', function() {
  browserSync.notify('Compiling JavaScript')
  return gulp.src(paths.js + '/**/*')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.script))
})

// Watch for changes 
gulp.task('watch', function() {
  gulp.watch(paths.js + '/**/*', ['js'])
  gulp.watch(paths.sass + '/**/*', ['sass'])
  gulp.watch(jekyll.watch, ['rebuild-jekyll']);
});

// Serve generated _site with BrowserSync
gulp.task('browser-sync', function() {
  browserSync({
    port: config.port,
    server: {
      baseDir: paths.dest
    },
    host: config.host
  });
});

// Installs gem bundle
gulp.task('bundle', function(done) {
  cp.spawn('bundle', ['install'], {stdio: 'inherit'})
    .on('close', done);
})

// Deletes build files, _site dir and compiled CSS and JS
gulp.task('clean', function() {
  return del(config.clean)
})

/**
 * REFERENCES (aka people I stole from)
 *
 * https://gist.github.com/agragregra/79be7c57271c81258a51
 * http://savaslabs.com/2016/10/19/optimizing-jekyll-with-gulp.html
 * https://aaronlasseigne.com/2016/02/03/using-gulp-with-jekyll/
 */