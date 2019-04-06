'use strict';

const util = require("util");
var debug = require('debug')('opendiaries:front');
var http = require('http');

// make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const compress = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const routes = require("./routes");
const path = require("path");

const app = express();
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// secure apps by setting various HTTP headers
app.use(helmet());
app.use(express.static(path.resolve(__dirname,"..", "dist")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/', routes);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
});
// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
    const host = "https://theopendiaries.com";
    if(err.status == 404){
        return res.status(404).render("404", {host:host});
    }
    else{
        return res.status(500).render("500", {host:host});
    }
}
);


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3002');
app.set('port', port);
app.set("debug", debug);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
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

function onError(error) {
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
  console.log('Listening on ' + bind);
}


module.exports = app;
