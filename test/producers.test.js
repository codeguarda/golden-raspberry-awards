import app from '../src/app.js';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;

describe('Producers API', () => {
  it('Deve retornar os intervalos mínimos e máximos no formato esperado', (done) => {
    chai
      .request(app)
      .get('/producers/intervals')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('min');
        expect(res.body).to.have.property('max');
        done();
      });
  });
});
