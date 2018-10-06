//npm modules
var http = require('http');
//node modules
var app = require('./app.js');


//global var
const port = 3000;

//store port in express
app.set('port', port);

//Listen on provided port, on all network interfaces.
var server = http.createServer(app);
server.listen(port);

module.exports = server;
