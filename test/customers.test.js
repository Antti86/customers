const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../index');
const query = require('../db/customers');
const should = chai.should();
chai.use(chaihttp);


describe('/GET customers', () => {
  it('should GET all customers', (done) => {
    chai.request(app)
      .get('/api/customers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});


const testCustomer = {
  firstname: "etunimi",
  lastname: "sukunimi",
  email: "email.com",
  phone: "045425234"
};

describe('/POST customers', () => {
  it('Should create a new customer in the database', (done) => {
    chai.request(app)
      .post('/api/customers')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testCustomer))
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('firstname');
        res.body.should.have.property('lastname');
        res.body.should.have.property('email');
        res.body.should.have.property('phone');
        done();
      });
  });
});

