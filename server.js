/* npm modules */
var http = require('http');
/* node modules */
var app = require('./app.js');


/* get port from environment variable */
var port = normalizeport(process.env.PORT || '3000');
/* store port in express */
app.set('port', port);

/* Listen on provided port, on all network interfaces. */
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);

module.exports = server;

/*
** event listener for http server "error" event
** @param {object} error - specific error event
*/
function onError(error){

  if(error.syscall !== 'listen'){
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  /* handle specific listen error with user friendly message */
  switch(error.code){
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

/*
** parses string value into integer for port number usage
** @param {string} value - requested port number
*/
function normalizeport(value){
  var port = parseInt(value, 10);

  if(isNaN(port)){
    //named pipe
    return value;
  }

  if(port >= 0){
    //port number
    return port;
  }

  return false;
}
