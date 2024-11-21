import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Golden Raspberry Awards API',
      version: '1.0.0',
      description: 'API para obter os intervalos de prêmios do Golden Raspberry Awards',
    },
  },
  apis: ['./src/routes.js'], // Arquivos que contêm as definições das rotas
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
