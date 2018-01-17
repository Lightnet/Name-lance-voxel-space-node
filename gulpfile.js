var gulp = require('gulp');
var bro = require('gulp-bro');
var rename = require('gulp-rename');
var gls = require('gulp-live-server');

var server = gls.new('main.js');

// Basic usage 
gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src(['src/client/clientMain.js','!nodejs-physijs'])
        .pipe(bro())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./dist/'));
    //server.start.bind(server);
});

gulp.task('serverrestart',()=>{
    //console.log("server restart...");
    //server.start.bind(server)();
});

//watch files changes and auto compile file.
gulp.task('watch', () =>{
    //gulp.watch(['src/client/clientMain.js'],['scripts']);
    gulp.watch(['src/client/*.js','src/server/*.js','src/common/*.js'],['scripts','serverrestart']);
});

gulp.task('serve', function() {
    //var server = gls.new('main.js');
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['src/client/*.js','src/common/*.js','src/server/*.js','*.html'], function (file) {
        server.notify.apply(server, [file]);
        //server.notify();
        console.log("files change?");
        server.start.bind(server)();
    });

    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    gulp.watch('main.js', function() {
        server.start.bind(server)()
    });
});

//main entry call task or default task call
gulp.task('default',['scripts','serve','watch']);