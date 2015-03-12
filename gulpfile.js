var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	wiredep = require('wiredep').stream,
	autoprefixer = require('gulp-autoprefixer'),
	inject = require('gulp-inject'),
	filter = require('gulp-filter');


gulp.task('sass', ['scss'], function () {		
	return gulp.src('./src/styles/**/*.scss')
		.pipe(sass())		
		.pipe(autoprefixer())
		.pipe(gulp.dest('./src/styles'))
		.pipe(browserSync.reload({stream: true}));	
});

gulp.task('scss', function () {
	return gulp.src('./src/styles/main.scss')
		.pipe(wiredep({
			directory: './bower_components'			
		}))
		.pipe(gulp.dest('./src/styles'));
})

gulp.task('inject', function () {
	return gulp.src('./src/index.html')
		.pipe(inject(
			gulp.src(['./src/styles/**/*.css','./src/scripts/**/*.js'], {read :false}),
			{relative: false}
		))
		.pipe(wiredep({
			directory: './bower_components'				
		}))
		.pipe(gulp.dest('./src'));
});

gulp.task('serve', ['sass', 'inject'], function () {
	browserSync({
        server: {
            baseDir: './',
            index: 'src/index.html',
            //directory: true,
            routes: {                
                '/bower_components': '../bower_components'
            }
        }, 
        port: 9000,
        ui: {
        	port: 9001
        }
    });

    gulp.watch('./src/styles/**/*.scss', ['sass']);
    gulp.watch(['./src/**/*.html','./src/scripts/**/*.js'], browserSync.reload);
});
