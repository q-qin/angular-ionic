var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
// var html2js = require(gulp-html2js);


gulp.task('server', function() {
    plugins.connect.server({
        host: 'localhost',
        port: 8989,
        //root:['yyg/app/','yyg/','./','./../../','../'],
        //
        root: ['apps/', './'],
        middleware: function(connect, opt) {
            return [];
        }
    });
});

gulp.task('test', function() {
    plugins.connect.server({
        host: 'localhost',
        port: 9999,
        //root:['yyg/app/','yyg/','./','./../../','../'],
        //
        root: ['dest/'],
        middleware: function(connect, opt) {
            return [];
        }
    });
});

var project = 'pages';
// var project = 'sign';
// var activity = 'sign';

//清理
gulp.task('clean', function() {
    return gulp.src([
            'dest/*',
            '!dest/sftp-config.json'
        ], {
            read: false
        })
        .pipe(plugins.clean());
});

//压缩JS
gulp.task('js', function() {
    return gulp.src(['apps/' + project + '/scripts/*.js'])
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('dest/' + project + '/scripts/'))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.rename('all.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/' + project + '/scripts/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/' + project + '/version/scripts'));
});

//framework
gulp.task('framework', function() {
    return gulp.src([
            'apps/public/scripts/lib/layer/layer.js',
            'apps/public/scripts/lib/swiper/swiper-3.3.1.min.js',
            'apps/' + project + '/lib/ionic/js/ionic.bundle.js'
        ])
        .pipe(plugins.concat('framework.js'))
        .pipe(gulp.dest('dest/' + project + '/framework'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('framework.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/' + project + '/framework/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/' + project + '/version/framework'));
});
//压缩css
gulp.task('css', function() {
    return gulp.src([
            'apps/public/scripts/lib/swiper/swiper-3.3.1.min.css',
            'apps/public/scripts/lib/layer/layer.css',
            'apps/' + project + '/lib/ionic/css/ionic.css',
            'apps/' + project + '/css/*.css'
        ])
        .pipe(plugins.concat('all.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/' + project + '/css/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/' + project + '/version/css/'));
    //.pipe(gulp.dest('dest/css'));
});

gulp.task('md5', function() {
        return gulp.src([
                'apps/public/scripts/lib/md5/md5.js'
            ])
            .pipe(gulp.dest('dest/' + project + '/framework/'));
    })
    //压缩HTML
gulp.task('html', function() {
    return gulp.src(['apps/' + project + '/templates/**'])
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/' + project + '/templates'));
});
//压缩index.html
gulp.task('index', function() {
    var assets = plugins.useref.assets();

    return gulp.src(['apps/' + project + '/index.html'])
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(plugins.useref())
        // .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/' + project + '/'));
});
//版本号
gulp.task('dev', ['index', 'css', 'js', 'html', 'framework'], function() {
    return gulp.src(['dest/' + project + '/version/**/*.json', 'dest/' + project + '/index.html'])
        .pipe(plugins.revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dest/' + project + '/'));
});


gulp.task('images', function() {
    return gulp.src(['apps/' + project + '/images/*', 'apps/' + project + '/images/**/*'])
        .pipe(gulp.dest('dest/' + project + '/images/'));
});

gulp.task('fonts', function() {
    return gulp.src(['apps/' + project + '/lib/ionic/fonts/*'])
        .pipe(gulp.dest('dest/' + project + '/fonts/'));
});

gulp.task('manifest', function() {
    return gulp.src(['apps/' + project + '/manifest.json'])
        .pipe(gulp.dest('dest/' + project + '/'));
});


gulp.task('default', ['js', 'html', 'css', 'images', 'fonts','manifest', 'framework', 'index', 'dev']);