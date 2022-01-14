module.exports = {
    getSelectedPokemon: function (req) {
        const pokeArray = req.session.pokeArray;
        const selectedPokemonIndex = pokeArray.findIndex(
            (pokemon) => pokemon.id == req.params.id
        );
        const selectedPokemon = pokeArray.splice(selectedPokemonIndex, 1);
        req.session.pokeArray = pokeArray;
        return selectedPokemon;
    },
    createTeamContainers: function (req) {
        if (!req.session.player2Pokes) {
            req.session.player2Pokes = [];
        }
        if (!req.session.player1Pokes) {
            req.session.player1Pokes = [];
        }
    },
    assignToTeam: function (req) {
        this.createTeamContainers(req);
        const selectedPokemon = this.getSelectedPokemon(req);
        if (req.session.currentPlayer === 1) {
            req.session.player1Pokes = [
                ...req.session.player1Pokes,
                ...selectedPokemon,
            ];
            req.session.currentPlayer = 2;
        } else {
            req.session.player2Pokes = [
                ...req.session.player2Pokes,
                ...selectedPokemon,
            ];
            req.session.currentPlayer = 1;
        }
    },
};
