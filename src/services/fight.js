const res = require('express/lib/response');

module.exports = {
    data: {},
    shuffleBattleOrder: function () {
        this.data.pokeArray.sort(function () {
            return Math.random() - 0.5;
        });
    },
    assignActions: function () {
        const battle = this.data.battle;
        this.data.pokeArray.map((pokemon) => {
            Object.entries(battle).forEach(([id, action]) => {
                if (id == pokemon.id) {
                    pokemon[action[0]] = action[1];
                }
            });
        });
    },
    battle: function () {
        this.data.pokeArray.forEach((pokemon) => {
            if (pokemon.hasOwnProperty('attacking') && pokemon.hp > 0) {
                attackingPokemon = pokemon;
                defendingPokemon = this.data.pokeArray.find((pokemonDef) => {
                    return pokemonDef.id == attackingPokemon.attacking;
                });
                this.data.attackingPokemon = attackingPokemon;
                this.data.defendingPokemon = defendingPokemon;
                if (defendingPokemon.hp > 0) {
                    this.calculateDmgAndHp();
                }
            }
        });
    },
    calculateDmgAndHp: function () {
        let dmgToDefender = 0;
        let dmgToAttacker = 0;
        if (this.data.defendingPokemon.hasOwnProperty('defend')) {
            const dmgDefended = Math.floor(
                (this.data.defendingPokemon.defense *
                    this.data.attackingPokemon.attack) /
                    100
            );
            dmgToDefender = this.data.attackingPokemon.attack - dmgDefended;
            dmgToAttacker = dmgDefended;
        } else {
            dmgToDefender = this.data.attackingPokemon.attack;
        }
        this.data.attackingPokemon = {
            ...this.data.attackingPokemon,
            hp: this.data.attackingPokemon.hp - dmgToAttacker,
        };
        this.data.defendingPokemon = {
            ...this.data.defendingPokemon,
            hp: this.data.defendingPokemon.hp - dmgToDefender,
        };

        this.data.dmgToDefender = dmgToDefender;
        this.data.dmgToAttacker = dmgToAttacker;
        this.createLog();
        console.log(`this.data.log`, this.data.log);
        this.updateHp();
    },
    createLog: function () {
        const attackLog = `${this.data.attackingPokemon.name} atacó a ${this.data.defendingPokemon.name} por ${this.data.attackingPokemon.attack} puntos de daño.`;
        const defendLog = this.data.defendingPokemon.hasOwnProperty('defend')
            ? ` ${this.data.defendingPokemon.name} defendió un  ${this.data.defendingPokemon.defense}% y retribuyó a ${this.data.attackingPokemon.name} ${this.data.dmgToAttacker} puntos de daño.`
            : '';
        const newHpDefender =
            this.data.defendingPokemon.hp >= 0
                ? ` A ${this.data.defendingPokemon.name} le quedan ${this.data.defendingPokemon.hp} puntos de vida.`
                : '';
        const newHpAttacker =
            this.data.attackingPokemon.hp >= 0 &&
            this.data.defendingPokemon.hasOwnProperty('defend')
                ? ` A ${this.data.attackingPokemon.name} le quedan ${this.data.attackingPokemon.hp} puntos de vida.`
                : '';
        const casualties =
            this.data.defendingPokemon.hp <= 0
                ? ` ${this.data.defendingPokemon.name} murió.`
                : '' + this.data.attackingPokemon.hp <= 0
                ? ` ${this.data.attackingPokemon.name} murió.`
                : '';
        const fightLog =
            attackLog + defendLog + newHpDefender + newHpAttacker + casualties;
        this.data.log.push(fightLog);
    },
    updateHp: function () {
        this.data.pokeArray.map((pokemon) => {
            if (pokemon.id == this.data.defendingPokemon.id) {
                pokemon.hp = this.data.defendingPokemon.hp;
            }
            if (pokemon.id == this.data.attackingPokemon.id) {
                pokemon.hp = this.data.attackingPokemon.hp;
            }
        });
    },
    removeDead: function (req) {
        const deadId = [];
        this.data.pokeArray.forEach((pokemon) => {
            if (pokemon.hp <= 0) {
                deadId.push(pokemon.id);
            }
        });
        const player1PokesId = [];
        req.session.player1Pokes.forEach((pokemon) => {
            player1PokesId.push(pokemon.id);
        });
        const player1Pokes = [];
        const player2Pokes = [];
        for (let pokemon of this.data.pokeArray) {
            if (player1PokesId.includes(pokemon.id)) {
                if (pokemon.hp > 0) {
                    player1Pokes.push(pokemon);
                }
            } else {
                if (pokemon.hp >= 0) {
                    player2Pokes.push(pokemon);
                }
            }
        }

        req.session.player1Pokes = player1Pokes;
        req.session.player2Pokes = player2Pokes;
        console.log(`deadId`, deadId);
        console.log(`req.session.player1Pokes`, req.session.player1Pokes);
        console.log(`req.session.player2Pokes`, req.session.player2Pokes);
    },
    results: function (req) {
        this.data.battle = req.body;
        this.data.pokeArray = req.session.pokeArray;
        this.shuffleBattleOrder();
        this.data.log = [];
        this.assignActions();
        this.battle();
        this.removeDead(req);
        req.session.log = this.data.log;
    },
};
