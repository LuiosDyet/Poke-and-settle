const createPokeArray = require('../services/createPokeArray');
const createTeams = require('../services/createTeams');
const fight = require('../services/fight');

module.exports = {
    getPokemons: async (req, res) => {
        const [pokeArray, currentPlayer] = await createPokeArray.getPokeArray(
            req
        );
        res.render('index', { pokeArray, currentPlayer });
    },
    choosePokemon: (req, res) => {
        createTeams.assignToTeam(req);
        //end teamSelection
        if (
            req.session.player1Pokes.length + req.session.player2Pokes.length >=
            6
        ) {
            req.session.pokeArray = [
                ...req.session.player1Pokes,
                ...req.session.player2Pokes,
            ];
            return res.redirect('/battle');
        }
        res.redirect('back');
    },
    prepareBattleField: (req, res) => {
        let log;
        if (req.session.log) {
            log = req.session.log;
        }
        const player1Pokes = req.session.player1Pokes;
        const player2Pokes = req.session.player2Pokes;
        const currentPlayer = req.session.currentPlayer
            ? req.session.currentPlayer
            : 1;
        res.render('battle-field', {
            player1Pokes,
            player2Pokes,
            log,
            currentPlayer,
        });
    },
    fight: (req, res) => {
        fight.results(req);
        if (
            req.session.player1Pokes.length == 0 ||
            req.session.player2Pokes.length == 0
        ) {
            return res.redirect('/endgame');
        } else {
            return res.redirect('back');
        }
    },
    winner: (req, res) => {
        let winner;
        if (req.session.player1Pokes.length == 0) {
            winner = 'Ganó el jugador 2';
        } else if (req.session.player2Pokes.length == 0) {
            winner = 'Ganó el jugador 1';
        } else {
            winner = '¡Es un empate!';
        }
        let log = req.session.log;
        req.session.destroy();
        res.render('end-game', { winner, log });
    },
};
