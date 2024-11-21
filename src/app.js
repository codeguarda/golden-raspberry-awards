const express = require('express');
const { initializeDatabase } = require('./database');
const routes = require('./routes')

const app = express();
const PORT = 3000;
const setupSwagger = require('./swagger');

// Configuração Swagger
setupSwagger(app);

// Middleware
app.use(express.json());

// Rotas
app.use('/producers', routes);

// Inicialização do banco de dados e servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar a aplicação:', error);
  });
