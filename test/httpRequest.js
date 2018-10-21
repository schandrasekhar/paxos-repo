process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var { describe, it } = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let db = require('../db');
let should = chai.should();


chai.use(chaiHttp);

describe('messages route', () => {

    /*
      Testing the /messages/:hash GET route
    */
    describe('Http GET /messages', () => {
      it('it should retrieve a previously saved hash function', function(done) {
          db.save("key", "value");
          chai.request(server)
          .get('/messages/key')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('value');
            done();
          });
      });
    });

    /*
     * Testing the /messages POST route
     */
    describe('Http POST /messages', () => {
        it('it should create a hash of a given string', (done) => {
            let data = {
                "message": "foo"
            };
            chai.request(server)
                .post('/messages')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('digest').eql('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
                    done();
                });
        });
    });
});