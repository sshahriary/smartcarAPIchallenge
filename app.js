/* npm modules */
var express = require('express');
const APIrequest = require('request');              //request module used to request data from GM API
const bodyParser = require('body-parser');          //used to parse POST requests
/* node modules */
  /* routes */
const vehicleInfoRouter = require('./routes/vehicleInfo');
const securityInfoRouter = require('./routes/vehicleSecurity');
const energyInfoRouter = require('./routes/vehicleEnergy');
const engineActionRouter = require('./routes/vehicleEngine');
  /* responses */
const sendError = require('./responses/sendError');

/* set up application */
var app = express();                                          //application is instance of express framework
var router = express.Router();
app.use(bodyParser.json());
process.env.GMAPIUrl = 'http://gmapi.azurewebsites.net/';     //GM api url
process.env.IDLimit = 1000;


/*
** middleware function that creates generic GM request to be modified later by request type
** @param {object} req - http request object
** @param {object} res - http response object
** @param {function} next
*/
var createRequest = function(req, res, next){

  /* save ID as string, no overflow, GM handles unkown ID's */
  const vehicleId = String(req.params.id);                                  //id provided in path: ID check done by GM

  /* handle ID length exceeding a limit */
  if(vehicleId.length > process.env.IDLimit){
    var error = new Error('Vehicle Id exceeds character limit');
    error.status = 400;
    next(error);
  } else {
    /* generic http request configs definition */
      var HttpObject = {
        url: process.env.GMAPIUrl,                                 //base GM url
        method: 'POST',                                            //default POST
        headers: {"content-type": "application/json"},             //default JSON
        json: {"id": vehicleId, "responseType":"JSON"}             //default post data
      };

      /* set data to use throughout app */
      app.set('GMHttpObject', HttpObject);
      next();
  }
}

/* perform callback on path request */
app.use('/vehicles/:id', createRequest);
/* mount router to path */
app.use('/vehicles/:id', router);

/* router handling */

  /* assign router for POST request engine path */
router.post('/engine', function(req, res, next){
  engineActionRouter(req, res, app, APIrequest, next);
});

  /* assign router for GET request vehicle info path */
router.get('/', function(req, res, next){
  vehicleInfoRouter(req, res, app, APIrequest, next);
});

  /* assign router for GET request security path */
router.get('/doors', function(req, res, next){
  securityInfoRouter(req, res, app, APIrequest, next);
});

  /* assign router for GET request fuel path */
router.get('/fuel', function(req, res, next){
  energyInfoRouter(req, res, app, APIrequest, next);
});

  /* assign router for GET request battery path */
router.get('/battery', function(req, res, next){
  energyInfoRouter(req, res, app, APIrequest, next);
});

  /* invalid path error to error handler */
app.use(function(req, res, next){
  var error = new Error('Page not found');
  error.status = 404;
  next(error);
});

/* error handler: handles specific errors with custom response object */
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    error.status = 400;
    error.message = 'Invalid JSON';
    sendError(res, error);
  } else {
    sendError(res, error);
  }
});

module.exports = app;
