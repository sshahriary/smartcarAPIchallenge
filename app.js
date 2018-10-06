/* npm modules */
var express = require('express');
const APIrequest = require('request');              //request module used to request data from GM API
const bodyParser = require('body-parser');          //used to parse POST requests
/* node modules */
const vehicleInfoRouter = require('./routes/vehicleInfo');
const securityInfoRouter = require('./routes/vehicleSecurity');
const energyInfoRouter = require('./routes/vehicleEnergy');
const engineActionRouter = require('./routes/vehicleEngine');

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
    res.status(400).send({'status':400, 'reason':'Vehicle ID exceeds limit'});
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
router.post('/engine', function(req, res){
  engineActionRouter(req, res, app, APIrequest);
});

/* assign router for GET request vehicle info path */
router.get('/', function(req, res){
  vehicleInfoRouter(req, res, app, APIrequest);
});

/* assign router for GET request security path */
router.get('/doors', function(req, res){
  securityInfoRouter(req, res, app, APIrequest);
});

/* assign router for GET request fuel path */
router.get('/fuel', function(req, res){
  energyInfoRouter(req, res, app, APIrequest);
});

/* assign router for GET request battery path */
router.get('/battery', function(req, res){
  energyInfoRouter(req, res, app, APIrequest);
});


app.use(function(req, res){
       res.sendStatus(404);
   });

module.exports = app;
