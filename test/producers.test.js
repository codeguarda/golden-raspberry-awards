const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const { expect } = chai;

chai.use(chaiHttp);


describe('Testes de Integração - API de Intervalos de Prêmios', () => {
  it('Deve retornar os intervalos mínimos e máximos no formato esperado', (done) => {
    chai
      .request(app)
      .get('/producers/intervals')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('min').that.is.an('array');
        expect(res.body).to.have.property('max').that.is.an('array');

        // Verificar estrutura de um item de "min"
        const minItem = res.body.min[0];
        expect(minItem).to.have.all.keys('producer', 'interval', 'previousWin', 'followingWin');

        // Verificar estrutura de um item de "max"
        const maxItem = res.body.max[0];
        expect(maxItem).to.have.all.keys('producer', 'interval', 'previousWin', 'followingWin');

        done();
      });
  });
});
