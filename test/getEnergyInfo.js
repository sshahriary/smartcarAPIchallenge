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

describe('/GET energy info', () => {

  it('valid fuel request for vehicle that is fuel type', function(done) {
    chai.request(server)
      .get('/vehicles/1234/fuel')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('percent');
        done();
      });
  });

  it('valid battery request for vehicle that is fuel type', function(done) {
    chai.request(server)
      .get('/vehicles/1234/battery')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('percent');
        done();
      });
  });

  it('valid battery request for vehicle that is battery type', function(done) {
    chai.request(server)
      .get('/vehicles/1235/battery')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('percent');
        done();
      });
  });

});
