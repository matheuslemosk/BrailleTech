// Rotas da API de traduções (todas começam com /api/traducoes)

const express = require('express');
const controller = require('../controllers/traducaoController');

const router = express.Router();

router.post('/', controller.salvar);
router.get('/', controller.listar);
router.get('/ultima', controller.buscarUltima); // precisa vir antes de '/:id'
router.get('/:id', controller.buscarUma);

module.exports = router;
