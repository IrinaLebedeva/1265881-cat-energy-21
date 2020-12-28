const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourceMap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postCss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoPrefixer = require("autoprefixer");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const htmlMin = require("gulp-htmlmin");
const imageMin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgStore = require("gulp-svgstore");
const sync = require("browser-sync").create();
const del = require("del");

const sourceDirName = "source";
const buildDirName = "build";

//Clean
const clean = () => {
  return del(buildDirName);
};

exports.clean = clean;

// Styles
const styles = () => {
  return gulp.src(sourceDirName + "/sass/style.scss")
    .pipe(plumber())
    .pipe(sourceMap.init())
    .pipe(sass())
    .pipe(postCss([
      autoPrefixer()
    ]))
    .pipe(gulp.dest(buildDirName + "/css"))
    .pipe(postCss([
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourceMap.write("."))
    .pipe(gulp.dest(buildDirName + "/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Scripts
const scripts = () => {
  return gulp.src(sourceDirName + "/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest(buildDirName + "/js"))
    .pipe(sync.stream())
}

exports.scripts = scripts;

//HTML
const html = () => {
  return gulp.src(sourceDirName + "/*.html")
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(buildDirName))
}

exports.html = html;

//Images
const images = () => {
  return gulp.src(sourceDirName + "/img/**/*.{jpg,png,svg}")
    .pipe(imageMin([
      imageMin.mozjpeg({progressive: true}),
      imageMin.optipng({optimizationLevel: 3}),
      imageMin.svgo({
        plugins: [
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest(buildDirName + "/img"))
}

exports.images = images;

//Create WebP
const createWebp = () => {
  return gulp.src(sourceDirName + "/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(buildDirName + "/img"))
}

exports.createWebp = createWebp;

//Svg svg sprite
const createSprite = () => {
  return gulp.src(sourceDirName + "/img/icons/*.svg")
    .pipe(svgStore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(buildDirName + "/img"))
}

exports.createSprite = createSprite;

//Copy
const copy = () => {
  return gulp.src(
      [
        sourceDirName + "/fonts/*.{woff2,woff}",
        sourceDirName + "/*.ico"
      ],
      {
        base: sourceDirName
      })
    .pipe(gulp.dest(buildDirName))
}

exports.copy = copy;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: buildDirName
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch(sourceDirName + "/sass/**/*.scss", gulp.series(styles));
  gulp.watch(sourceDirName + "/js/script.js", gulp.series(scripts));
  gulp.watch(sourceDirName + "/*.html", gulp.series(html, sync.reload));
}

exports.build = gulp.series(
  clean,
  gulp.parallel(
    copy,
    styles,
    scripts,
    html,
    createSprite,
    images,
    createWebp
  )
);

exports.default = gulp.series(
  clean,
  gulp.parallel(
    copy,
    styles,
    scripts,
    html,
    createSprite,
    images,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
