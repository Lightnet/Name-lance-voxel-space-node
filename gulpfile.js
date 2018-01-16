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
    server.start.bind(server);
});

//gulp.task('serverscripts', function() {
    //server.start.bind(server);
//});

gulp.task('serverscripts',()=>{
    server.start.bind(server)();
});

//watch files changes and auto compile file.
gulp.task('watch', () =>{
    gulp.watch(['src/client/*.js','src/common/*.js'],['scripts']);

    gulp.watch(['src/server/*.js'],['serverscripts']);
});

gulp.task('serve', function() {
    //var server = gls.new('main.js');
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['src/**/*.js','*.html'], function (file) {
        server.notify.apply(server, [file]);
    });
    
    gulp.watch('myapp.js', server.start.bind(server)); //restart my server

    //gulp.watch('src/server/MyServerEngine.js', server.start.bind(server)); //restart my server

    // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
    gulp.watch('main.js', function() {
        server.start.bind(server)()
    });
});

//main entry call task or default task call
gulp.task('default',['scripts','serve','watch']);