const express = require('express');
const mainController = require('../controller/mainController');
const router = express.Router();

const redirect = require('../middleware/redirect');

router.get('/', mainController.getPokemons);

router.post('/choose/:id', redirect, mainController.choosePokemon);

router.get('/battle', redirect, mainController.prepareBattleField);

router.post('/fight', redirect, mainController.fight);

router.get('/endgame', mainController.winner);

module.exports = router;
