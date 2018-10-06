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

  describe('/GET vehicle info', () => {

    it('verify info response object with valid vehicle ID', function(done) {
      chai.request(server)
        .get('/vehicles/1234')
        .end(function(err, res){
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('vin');
          res.body.should.have.property('color');
          res.body.should.have.property('doorCount');
          res.body.should.have.property('driveTrain');
          done();
        });
    });

    it('verify error response with invalid vehicle ID (alphanumeric)', function(done) {
      chai.request(server)
        .get('/vehicles/12s#43-45@!@^\de3b4')
        .end(function(err, res){
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('reason');
          done();
        });
    });

    it('verify error response with empty/invalid request path', function(done) {
      chai.request(server)
        .get('/vehicles/ ')
        .end(function(err, res){
          res.should.have.status(404);
          done();
        });
    });

    it('verify error response with mistyped/invalid request path', function(done) {
      chai.request(server)
        .get('/vehicle/1234')
        .end(function(err, res){
          res.should.have.status(404);
          done();
        });
    });

    it('verify error response with exceeding character limit for ID', function(done) {
      chai.request(server)
        .get('/vehicles/'+('a'.repeat(10000)))
        .end(function(err, res){
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('reason');
          done();
        });
    });

  });
