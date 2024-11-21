import express from 'express';
import { initializeDatabase } from './database.js';
import routes from './routes.js';
import setupSwagger from './swagger.js';

const app = express();
const PORT = 3000;

// Configuração do Swagger
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

export default app;
