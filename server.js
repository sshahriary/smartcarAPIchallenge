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

module.exports = server;


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
