const projectFolder = 'dist';
const sourceFolder = 'src';


const path = {
    build: {
        html: `${projectFolder}/`,
        css: `${projectFolder}/css/`,
        js: `${projectFolder}/js/`,
        img: `${projectFolder}/img/`,
        fonts: `${projectFolder}/fonts/`,
    },
    src: {
        html: `${sourceFolder}/*.html`,
        css: `${sourceFolder}/sass/style.scss`,
        js: `${sourceFolder}/js/script.js`,
        img: `${sourceFolder}/img/**/*.+(png|jpg|gif|ico|svg|webp)`,
        fonts: `${sourceFolder}/fonts/*.ttf`,
    },
    watch: {
        html: `${sourceFolder}/**/*.html`,
        css: `${sourceFolder}/sass/**/*.{scss, sass, css}`,
        js: `${sourceFolder}/js/**/*.js`,
        img: `${sourceFolder}/img/**/*.{jpg, png, svg, gif, ico, webp}`,
    },
    clean: `./${projectFolder}/`,
};

/* jshint ignore:start */
const {
    src,
    dest
} = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser-js');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');


function browserSync() {
    browsersync.init({
        server: {
            baseDir: path.clean,
        },
        port: 3000,
        notify: false,
    });
}


const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
};

const css = () => {
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(
            groupMedia()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true,
            })
        )
        .pipe(dest(path.build.css))
        .pipe(cleanCSS())
        .pipe(rename({
            extname: '.min.css',
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
};

const js = () => {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest(path.build.js))
        .pipe(terser({
            mangle: {
                toplevel: true
            }
        }))
        .on('error', function (error) {
            this.emit('end');
        })
        .pipe(rename({
            extname: '.min.js',
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
};

const images = () => {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        // .pipe(imagemin())
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
};


const clean = () => {
    return del(path.clean);
};


const watchFiles = () => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
};

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;

/* jshint ignore:end */