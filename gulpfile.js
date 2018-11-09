const { readFileSync } = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rimraf = require('rimraf');
const browserSync = require('browser-sync');

const { src, dest } = gulp;
const task = gulp.task.bind(gulp);
const watch = gulp.watch.bind(gulp);

task('slides', () => {
  src('src/presentations/**/*.html')
    .pipe(tap(file => {
      const html = file.contents.toString();
      const parsed = html
        .replace(
          /\bslide:(.+?)\s/g,
          (m, source) => {
            try {
              const slide = readFileSync(`src/slides/${source}.html`, 'utf-8');
              return slide;
            } catch (e) {
              console.error(`Slide not found: ${source}`);
              return m;
            }
          }
        );
      file.contents = Buffer.from(parsed);
    }))
    .pipe(dest('public'));
});
task('slides+reload', [ 'slides' ], () => browserSync.reload());

task('css', () => {
  src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/css'))
    .pipe(browserSync.stream());
});

task('js', () => {
  // No compilation provided, just use ES modules.
  // Provide your own compilation if you want, though.
  src('src/js/**/*.js')
    .pipe(dest('public/js'));
});
task('js+reload', [ 'js' ], () => browserSync.reload());

task('static', () => {
  src('static/**/*')
    .pipe(dest('public'));

  src([
      'node_modules/p-slides/components/**/*.js',
      'node_modules/p-slides/*.js',
      'node_modules/p-slides/css/**/*.css',
      'node_modules/prismjs/prism.js',
      'node_modules/prismjs/themes/prism-okaidia.css',
      'node_modules/delaunator/index.js'
    ], { base: './node_modules' })
    .pipe(dest('public/vendor'));
});
task('static+reload', [ 'static' ], () => browserSync.reload());

task('clean', () => {
  rimraf.sync('public');
});

task('serve', [ 'default' ], () => {
  browserSync.init({
    ghostMode: false,
    server: {
      baseDir: './public'
    }
  });

  watch('src/styles/**/*.scss', [ 'css' ]);
  watch('src/{presentation,slides}/**/*.html', [ 'slides+reload' ]);
  watch('src/js/**/*.js', [ 'js+reload' ]);
  watch('static/**/*', [ 'static+reload' ]);
});

task('watch:css', () => {
  watch('src/styles/**/*.scss', [ 'css' ]);
});
task('watch:slides', () => {
  watch('src/{presentation,slides}/*.html', [ 'slides' ]);
});
task('watch:static', () => {
  watch([ 'static/**/*' ], [ 'static' ]);
});

task('watch', [ 'watch:static', 'watch:css', 'watch:slides' ]);
task('default', [ 'static', 'css', 'slides', 'js' ]);
