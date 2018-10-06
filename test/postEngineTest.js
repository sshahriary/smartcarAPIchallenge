/*npm modules*/
var chai = require('chai');
var chaiHttp = require('chai-http');
var APIrequest = require('request');              //request module used to request data from GM API
var request = require('supertest');

/*node modules*/
var server = require('../server');

/* test setup */
var expect = require('chai').expect;
let should = chai.should();
chai.use(chaiHttp);

describe('/POST vehicle engine', () => {

  it('perform POST with action START. Success/Error depends on API', function(done) {
    chai.request(server)
      .post('/vehicles/1234/engine')
      .set('Content-Type', 'application/json')
      .send({'action':'START'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        done();
      });
  });

  it('perform POST with unknown action. respond with error object', function(done) {
    chai.request(server)
      .post('/vehicles/1234/engine')
      .set('Content-Type', 'application/json')
      .send({'action':'STOOP'})
      .end(function(err, res){
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('reason');
        done();
      });
  });

  it('perform POST with action STOP. respond with error object', function(done) {
    chai.request(server)
      .post('/vehicles/1235/engine')
      .set('Content-Type', 'application/json')
      .send({'action':'STOP'})
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        done();
      });
  });


});
