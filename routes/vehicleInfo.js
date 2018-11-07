
/*
** modifies GM http object to meet specs required for retrieving GM Vehicle Info Service and responds with custom Smartcar object
** @param {object} req - http request object
** @param {object} res - http response object
** @param {object} app - express application
** @param {object} APIrequest - module used to send http requests
*/
module.exports = function getVehicleInfo(req, res, app, APIrequest, next){
  HttpObject = app.get('GMHttpObject');                                         //get generic http GM request object

  /* perform customizations */
  HttpObject.url = HttpObject.url.concat('getVehicleInfoService');              //assign custom vehicle info url to http request object

  /* send API request to GM API and perform callback */
  APIrequest(HttpObject, function(err, APIResponse, body){

    /* print and respond with GM API error if GM API Request fails */
    if(err || body.status != '200'){
      res.status(400).send(body);
    }
    else if(body == 'Bad Request'){
      res.status(400).send('Bad Request');
    }
    /* create custom response object */
    else {

      /* populate response object with vehicle info */
      /* ternary operator assigns doorcount for 4 or 2 doors - Statement must be added to include different num of door vehicles */
      var responseObject = {'vin':body.data.vin.value,
                            'color':body.data.color.value,
                            'doorCount':body.data.fourDoorSedan.value ? 4 : (body.data.twoDoorCoupe.value ? 2 : null),
                            'driveTrain':body.data.driveTrain.value};

      /* send response */
      res.status(200).send(responseObject);
    }
  });
}
