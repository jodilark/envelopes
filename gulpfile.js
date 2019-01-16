var gulp = require('gulp')
,sourcemaps = require('gulp-sourcemaps')
, sass = require('gulp-sass')
, CacheBuster = require('gulp-cachebust')
, cachebust = new CacheBuster()
, concat = require('gulp-concat')
, babel = require('gulp-babel')
, print = require('gulp-print').default
, uglify = require('gulp-uglify')

var gulpPath = {
jsSource: ['./public/js/**/*.js', '.public/js/*.js']
,scss: ['./public/styles/*.*css', './public/styles/fonts/*.*css', './public/js/components/**/*.*css']
}

gulp.task ('build-css', function (){
return gulp.src(gulpPath.scss) 
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cachebust.resources())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/dist'))
})

gulp.task('build-js', function() {
return gulp.src(gulpPath.jsSource)               
  .pipe(sourcemaps.init())
  .pipe(print())                        
  .pipe(babel({ presets: ['@babel/env'] }))
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write('./')) 
  .pipe(gulp.dest('./public/dist/js')); 
});

gulp.task('build', ['build-css', 'build-js'], function() {
return gulp.src('index.html')
    .pipe(cachebust.references())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
gulp.watch('./public/index.html')
gulp.watch(gulpPath.scss, ['build']);
gulp.watch(gulpPath.jsSource, ['build']);
});