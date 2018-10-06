
/*
** modifies GM http object to meet specs required for retrieving GM Vehicle Security Info Service and responds with custom Smartcar object
** @param {object} req - http request object
** @param {object} res - http response object
** @param {object} app - express application
** @param {object} APIrequest - module used to send http requests
*/
module.exports = function getVehicleSecurity(req, res, app, APIrequest){
  HttpObject = app.get('GMHttpObject');                                         //get generic http GM request object

  /* perform customizations */
  HttpObject.url = HttpObject.url.concat('getSecurityStatusService');           //assign custom security url to http request object

  /* send API request to GM API and perform callback */
  APIrequest(HttpObject, function(err, APIResponse, body){

    /* print and respond with GM API error if GM API Request fails */
    if(err || body.status != '200'){
      res.status(400).send(body);
    }
    /* create custom response object */
    else {

      /* initialize response object and data needed*/
      var responseObject = [];
      var doorsArray = body.data.doors.values;

      /* for each door, push {door_location : is_locked} object */
      for(i = 0; i < doorsArray.length; i++){
        var obj = {};
        obj['location'] = doorsArray[i].location.value;
        obj['locked'] = doorsArray[i].locked.value == 'True' ? true : false ;
        responseObject.push(obj);
      }

      /* send response */
      res.status(200).send(responseObject);
    }
  });
}
