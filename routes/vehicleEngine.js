
/*
** modifies GM http object to meet specs required for GM Action Engine Service and responds with custom Smartcar object
** @param {object} req - http request object
** @param {object} res - http response object
** @param {object} app - express application
** @param {object} APIrequest - module used to send http requests
*/
module.exports = function postVehicleEngine(req, res, app, APIrequest, next){
  var command = req.body.action;                                            //get command from request body

  /* perform initial check before sending to GM API */
  if(command != "START" && command != "STOP"){
    /* send custom error object if invalid */
    var error = new Error('Uknown command: ' + command);
    error.status = 400;
    next(error);
  } else {
    var HttpObject = app.get('GMHttpObject');                                 //retrieve generic Http Object

    /* perform customizations */
    command = command.concat('_VEHICLE');
    HttpObject.json['command'] = command;                                     //supply command 'START_VEHICLE|STOP_VEHICLE'
    HttpObject.url = HttpObject.url.concat('actionEngineService');

    /* send API request to GM API and perform callback */
    APIrequest(HttpObject, function(err, APIResponse, body){
      /* print and respond with GM API error if GM API Request fails */
      if(err || body.status == '400'){
        var error = new Error('GM API Error - ' + body.reason);
        error.status = 400;
        next(error);
      }
      /* create custom response object */
      else {
        /* initialize response object and data needed */
        var result = body.actionResult.status;
        var responseObject = {'status': null};
        /* populate response object with GM response info */
        if(result == 'EXECUTED'){
          responseObject.status = 'success';
        } else if(result == 'FAILED'){
          responseObject.status = 'error';
        }

        /* send response */
        res.status(200).send(responseObject);
      }
    });
  }
}
