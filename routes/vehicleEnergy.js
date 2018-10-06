
/*
** modifies GM http object to meet specs required for retrieving GM Fuel/Battery Info Service and responds with custom Smartcar object
** @param {object} req - http request object
** @param {object} res - http response object
** @param {object} app - express application
** @param {object} APIrequest - module used to send http requests
*/
module.exports = function getEnergyInfo(req, res, app, APIrequest){
  HttpObject = app.get('GMHttpObject');                                         //get generic http GM request object

  /* perform customizations */
  HttpObject.url = HttpObject.url.concat('getEnergyService');                   //assign custom vehicle fuel url to http request object

  /* send API request to GM API and perform callback */
  APIrequest(HttpObject, function(err, APIResponse, body){

    /* print and respond with GM API error if GM API Request fails */
    if(err || body.status != '200'){
      res.status(400).send(body);
    }
    /* create custom response object */
    else {

      /* initialize response object */
      var responseObject = {'percent':null};

      /* assign energy percentage based on energy type returns null means energy type not supported */
      if(req.url == '/fuel'){
        var percentage = body.data.tankLevel.value;
        is_null(percentage, responseObject);
      } else if (req.url == '/battery'){
        var percentage = body.data.batteryLevel.value;
        is_null(percentage, responseObject);
      }

      /* send response */
      res.status(200).send(responseObject);
    }
  });
}

/*
** Helper function - looks at percentage provided. if null, assign null. otherwise, assign percentage
** @param {number} energyVal - fuel/battery percentage
** @param {object} responseObj - smartCar response object
*/
function is_null(energyVal, responseObj){
  if(energyVal == null){
    responseObj.percent = null;
  } else {
    responseObj.percent = Number(energyVal);
  }
}
