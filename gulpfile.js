const gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    babel = require('gulp-babel');

gulp.task('common-js', ()=> {
    return gulp.src([
        'app/js/common.js',
    ])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
})
;

gulp.task('js', ['common-js'], ()=> {
    return gulp.src([
        'app/libs/jquery/jquery-3.2.1.min.js',
        'app/libs/popper/popper.js',
        'app/libs/bootstrap/dist/js/bootstrap.min.js',
        'app/libs/aos-master/dist/aos.js',
        'app/js/common.js', // Всегда в конце
    ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
})
;

gulp.task('browser-sync', ()=> {
    browserSync({
                    server: {
                        baseDir: 'app'
                    },
                    notify: false
                });
})
;

gulp.task('sass', ()=> {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) // Опционально, закомментировать при отладке
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
})
;

gulp.task('watch', ['sass', 'js', 'browser-sync'], ()=> {
    gulp.watch('app/sass/**/*.scss', ['sass']);
gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
gulp.watch('app/*.html', browserSync.reload);
})
;

gulp.task('imagemin', ()=> {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
})
;

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], ()=> {
    const buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

const buildCss = gulp.src([
    'app/css/main.min.css',
]).pipe(gulp.dest('dist/css'));

const buildJs = gulp.src([
    'app/js/scripts.min.js',
]).pipe(gulp.dest('dist/js'));

const buildFonts = gulp.src([
    'app/fonts/**/*',
]).pipe(gulp.dest('dist/fonts'));
})
;

gulp.task('removedist', ()=> {
    return del.sync('dist');
})
;
gulp.task('clearcache', ()=> {
    return cache.clearAll();
})
;

gulp.task('default', ['watch']);
