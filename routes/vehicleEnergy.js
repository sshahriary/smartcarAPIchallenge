
/*
** modifies GM http object to meet specs required for retrieving GM Fuel/Battery Info Service and responds with custom Smartcar object
** @param {object} req - http request object
** @param {object} res - http response object
** @param {object} app - express application
** @param {object} APIrequest - module used to send http requests
*/
module.exports = function getEnergyInfo(req, res, app, APIrequest, next){
  HttpObject = app.get('GMHttpObject');                                         //get generic http GM request object

  /* perform customizations */
  HttpObject.url = HttpObject.url.concat('getEnergyService');                   //assign custom vehicle fuel url to http request object

  /* send API request to GM API and perform callback */
  APIrequest(HttpObject, function(err, APIResponse, body){

    /* print and respond with GM API error if GM API Request fails */
    if(err || body.status != '200'){
      var error = new Error('GM API Error - ' + body.reason);
      error.status = 400;
      next(error);
    }
    /* create custom response object */
    else {
      /* initialize response object */
      var percentage = null;
      var responseObject = {'percent': null};

      /* assign energy percentage based on energy type; returns error on null means energy type not supported */
      switch(req.url){
        case '/fuel':
          percentage = body.data.tankLevel.value;
          break;
        case '/battery':
          percentage = body.data.batteryLevel.value;
          break;
        default:
          percentage = null;                                                    //default to null, should be reach invalid path before this
      }
      /* null means invalid energy type - send error */
      if(percentage === 'null'){
        var error = new Error('Invalid vehicle type for requested energy type');
        error.status = 422;
        next(error);
      } else {
        /* valid energy/vehicle type match - send response */
        responseObject.percent = Number(percentage);
        res.status(200).send(responseObject);
      }
    }
  });
}
