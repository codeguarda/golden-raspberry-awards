const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Certifique-se de que o servidor está exportado em app.js
const { initializeDatabase } = require('../src/database');

chai.use(chaiHttp);
const { expect } = chai;

describe('API: Producers Intervals', () => {
  before(async () => {
    await initializeDatabase();
  });

  it('Deve retornar os intervalos mínimos e máximos corretamente', (done) => {
    chai
      .request(app)
      .get('/producers/intervals')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('min');
        expect(res.body).to.have.property('max');
        expect(res.body.min).to.be.an('array');
        expect(res.body.max).to.be.an('array');
        done();
      });
  });
});