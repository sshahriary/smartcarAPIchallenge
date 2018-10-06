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

describe('/GET security info', () => {

  it('verify correct request and response object', function(done) {
    chai.request(server)
      .get('/vehicles/1234/doors')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('Array');
        for(i = 0; i < res.body.length; i++){
          res.body[i].should.have.property('location');
          res.body[i].should.have.property('locked');
        }
        done();
      });
  });

  it('verify invalid ID returns error response object', function(done) {
    chai.request(server)
      .get('/vehicles/12334/doors')
      .end(function(err, res){
        res.should.have.status(400);
        res.body.should.have.property('status');
        res.body.should.have.property('reason');
        done();
      });
  });

})
