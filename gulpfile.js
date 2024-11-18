const gulp = require('gulp');
const inlineCss = require('gulp-inline-css');

gulp.task('default', function () {
  return gulp
    .src('src/templates/*.html')
    .pipe(inlineCss({ removeStyleTags: false }))
    .pipe(gulp.dest('build/templates'));
});
