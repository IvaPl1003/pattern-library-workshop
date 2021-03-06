// Setup courtesy of Rachel Andrews - https://github.com/rachelandrew/smashing-fractal/

'use strict';

const gulp         = require('gulp');
const fractal      = require('./fractal.js');
const logger       = fractal.cli.console;
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const path         = require('path');

gulp.task('sass',function() {
    return gulp.src('global/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('watch', ['sass'], function() {
   gulp.watch([
        'components/**/*.scss',
        'core/**/*.scss'
        ], ['sass']);
});

function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
        })
    });
}

gulp.task('fractal:start', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

gulp.task('default', ['fractal:start', 'sass', 'watch']);