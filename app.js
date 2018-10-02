var http = require('http');
var express       = require('express');
var path          = require('path');
//var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
 
var routes = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');
var models = require('./models/notes');

var models = require('./models-mongoose/notes');
// var models = require('./models/notes');
models.connect("mongodb://localhost/notes", function(err) {
    if(err)
    throw err;
});
notes.configure(models);
routes.configure(models);
// var models = require('./models-sequelize/notes');
// models.connect({
//     dbname: "notes",
//     username: "root",
//     password: "123456",
//     params: {
//         host: "127.0.0.1",
//         dialect: "mysql"
//     }
// },
// function(err) {
//     if(err)
//         throw err;
// });
notes.configure(models);
routes.configure(models);

var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

 
app.use('/', routes.index);
app.use('/users', users);
app.get('/noteadd', notes.add);
app.post('/notesave', notes.save);
app.use('/noteview', notes.view);
app.use('/noteedit', notes.edit);
app.use('/notedestroy', notes.destroy);
app.post('/notedodestroy', notes.dodestroy);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: {}
    });
});
 
module.exports = app;

var server = http.Server(app);
var io = require('socket.io').listen(server);
app.set('port', 3000);
 
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
 
io.sockets.on('connection', function(socket) {
    socket.on('notetitles', function(fn) {        
        models.titles(function(err, titles) {
            if(err) {
                util.log(err); 
            } else {
                fn(titles);
            }
        });
     });
  
    var broadcastUpdated = function(newnote) {
        socket.emit('noteupdated', newnote);
    }
    models.emitter.on('noteupdated', broadcastUpdated);
    socket.on('disconnect', function() {
       models.emitter.removeListener('noteupdated', broadcastUpdated);
    });
 
    var broadcastDeleted = function(notekey) {
       socket.emit('notedeleted', notekey);
    }
    models.emitter.on('notedeleted', broadcastDeleted);
    socket.on('disconnect', function() {
        models.emitter.removeListener('notedeleted', broadcastDeleted);
    });
 
});