'use strict';

const express = require("express");
const path = require("path");
var http = require('http');




const app = express();

// app.get(["*.js", "*.css"], function (req, res, next) {
//   req.url = req.url + '.gz';
//   res.set('Content-Encoding', 'gzip');
//   next();
// });


app.use(express.static(path.resolve(__dirname, "dist")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



const apppRoutes = [
  "/",
  "/login",
  "/signup", 
  "/verify-email", 
  "/privacy-policy", 
  "/read-public-diaries",
  "/note/:id",
  "/my-account",
  "/my-diary",
  "/my-diary/paper",
  "/user-diary/:userId",
  "/forgot-password"
];


app.get(appRoutes, (req,res,next)=>{
    // return res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    let meta = {
      title: res.locals.title || "My App | Your Online Digital Diary",
      description: res.locals.description || "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling"
    }
    res.locals = {...res.locals, ...meta};
    res.render("app");
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>{ // eslint-disable-line no-unused-vars
  // res.status(err.status).json({
  //   message: err.isPublic ? err.message : httpStatus[err.status],
  //   stack: config.env === 'development' ? err.stack : undefined
  // })
  // console.log(err);
  const host = "https://theopendiaries.com";
  if(err.status == 404){
    return res.status(404).render("404", {host:host});
  }else{
    return res.status(500).render("500", {host:host});
  }
});


var server = http.createServer(app);
var port = normalizePort(app.get("port") || '8081');
server.listen(port);

server.on('error', onListenError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onListenError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// console.log('Listening on'+ bind);
}


module.exports = app;
