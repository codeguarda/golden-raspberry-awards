const express = require('express');
const { getProducersWithIntervals } = require('../controllers/producerController');

const router = express.Router();

// Rotas
router.get('/intervals', getProducersWithIntervals);

module.exports = router;




/**
 * @swagger
 * /producers/intervals:
 *   get:
 *     summary: Retorna os produtores com o menor e maior intervalo entre prêmios consecutivos.
 *     responses:
 *       200:
 *         description: Sucesso ao obter os intervalos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 min:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       producer:
 *                         type: string
 *                       interval:
 *                         type: integer
 *                       previousWin:
 *                         type: integer
 *                       followingWin:
 *                         type: integer
 *                 max:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       producer:
 *                         type: string
 *                       interval:
 *                         type: integer
 *                       previousWin:
 *                         type: integer
 *                       followingWin:
 *                         type: integer
 */
