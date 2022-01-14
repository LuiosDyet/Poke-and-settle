const express = require('express');
const mainController = require('../controller/mainController');
const router = express.Router();

router.get('/', mainController.getPokemons);

router.post('/choose/:id', mainController.choosePokemon);

router.get('/battle', mainController.prepareBattleField);

router.post('/fight', mainController.fight);

router.get('/endgame', mainController.winner);

module.exports = router;
