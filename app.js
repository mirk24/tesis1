
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

///////////////conexion a base de datos
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mitesis', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', function (err) {
  console.log(err);
  return;
});
db.once('open', function() {
  // we're connected!
  console.log('todo legal');
});
mongoose.set('debug',true)
//////////////////////////////////////

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');


/////////////////////dominio.com/persona/////////////////////////
var perRouter= require('./routes/persona');
var estRouter= require('./routes/estacion');
var moniRouter= require('./routes/monitoreo');
var combustible= require('./routes/combustible');
var ventas=require('./routes/importar');
fileUpload=require("express-fileupload");
var app = express();
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  /*res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');*/
  //res.header("Access-Control-Allow-Origin", '*'); //<--
  
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers",
  'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
res.header('Access-Control-Allow-Credentials', true);
  next();
});


/*+++++++CONEXION DE ARDUINO LADO DEL CLIENTE++++++++*/


const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;
var express = require('express');
var app2 = express();
var  server  = require('http').Server(app2);
var io = require('socket.io')(server);
app2.set('view engine', 'html');
server.listen(process.env.PORT || 3800);  
monitoreo=require("./modelos/monitoreo.model");
const port= new Serialport('COM8', {
    baudRate: 2400
});

const parser = port.pipe(new Readline({delimiter:'\r\n'}));

parser.on('open', function () {
    console.log('connection is opened');
});

io.sockets.on('connection', function (socket) {
  parser.on('data', function (data) {
      q=new monitoreo();
      //console.log(data);
      //**if(data!=''){
         //try{
       //js=JSON.parse(data);
       
       // q.temp_actual=js.dato2;
        //q.lectura_actual=js.dato1;
        //q.fecha=new Date(Date.now());
        //q.estado=1;
        //q.save();
       //}
       //catch{}
      //} 
      
      console.log(data);
      //let t=JSON.parse(data);
      socket.emit('data',data);
  });
  /**socket.on('subscribe', function (data) {
      socket.join(data.room);
  });
  socket.on('arriv', function (data) {
      console.log(data);
      io.sockets.in('invitor').emit('send message',data);
  });

  socket.on('unsubscribe', function (data) {
      socket.leave(data.room);
  });**/
});

  


/**************** */

app.use('/', indexRouter);
app.use('/users', usersRouter);

//////////////////////Rutas/////////////////////////////////

app.use('/api/persona', perRouter);
app.use('/api/estacion', estRouter);
app.use('/api/monitoreo', moniRouter);
app.use('/api/ventas', ventas);
app.use('/api/combustible', combustible);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
