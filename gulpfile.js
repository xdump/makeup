var gulp           = require('gulp'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	spritesmith	   = require('gulp.spritesmith'),
	buffer         = require('vinyl-buffer'),
    merge          = require('merge-stream'),
	notify         = require("gulp-notify");

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'web'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "xdump", //Demonstration page: http://xdump.localtunnel.me
	});
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('.makeup/app/sass/**/*.sass', ['sass']);
	gulp.watch('.makeup/app/js/**/*.js', ['js']);
	gulp.watch(['web/*.html'], browserSync.reload); // add ", 'views/**/*.php'" for yii2 project
});

gulp.task('sass', function() {
	return gulp.src('.makeup/app/sass/**/*.sass')
		.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('web/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([
			'.makeup/app/libs/jquery/jquery.min.js',
			'.makeup/app/js/**/*.js',
			])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('web/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', ['sprite-png', 'sprite-jpg'], function() {
	return gulp.src('.makeup/app/img/**/*')
		.pipe(cache(imagemin([], {})))
		.pipe(gulp.dest('web/img')); 
});

gulp.task('sprite-png', function () {
    var spriteData = gulp.src('.makeup/app/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite_png.css',
        padding: 30
    }));
    var imgStream = spriteData.img
        .pipe(buffer())
        //.pipe(imagemin([], {}))
        .pipe(gulp.dest('.makeup/app/img/'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('.makeup/app/sass/'));
    return merge(imgStream, cssStream);
});

gulp.task('sprite-jpg', function () {
    var spriteData = gulp.src('.makeup/app/sprite/*.jpg').pipe(spritesmith({
        imgName: 'sprite.jpg',
        cssName: '_sprite_jpg.css',
        padding: 30
    }));
    var imgStream = spriteData.img
        .pipe(buffer())
        //.pipe(imagemin([], {}))
        .pipe(gulp.dest('.makeup/app/img/'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('.makeup/app/sass/'));
    return merge(imgStream, cssStream);
});

gulp.task('removedist', function() { return del.sync('web'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
