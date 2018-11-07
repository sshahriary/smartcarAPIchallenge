module.exports = function(res, error){
  res.status(error.status || 500);
  res.json({'status':error.status, 'message': error.message});
  res.send();
}
