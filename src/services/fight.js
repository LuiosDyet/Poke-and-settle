module.exports = {
    setDefenders: function (battle) {
        const defending = [];
        Object.entries(battle).forEach(([battle, action]) => {
            if (action[1] == 'defend') {
                const defenderId = action[0];
                defending.push(defenderId);
            }
        });
        return defending;
    },
    setTeams: function (
        fight,
        action,
        player1Pokes,
        player2Pokes,
        player1PokesAtt,
        player2PokesAtt
    ) {
        //set teams
        const [attackerId, attack, defenderId] = action;
        let attackerArray;
        let defenderArray;
        let callOfAttack = false;
        if (fight % 2 == 0) {
            attackerArray = player1PokesAtt;
            defenderArray = player2Pokes;
        } else {
            attackerArray = player2PokesAtt;
            defenderArray = player1Pokes;
        }
        const attackerPokemon = attackerArray.find((pokemon) => {
            return attackerId == pokemon.id;
        });
        let defenderPokemon = defenderArray.find((pokemon) => {
            return defenderId == pokemon.id;
        });
        if (!defenderPokemon) {
            //call of attack
            callOfAttack = true;
        }
        return [attackerPokemon, defenderPokemon, callOfAttack];
    },
    calculateDmgAndHp: function (attackerPokemon, defenderPokemon, defending) {
        //calculate dmg and hp
        const dPIsDefending = defending.includes(defenderPokemon.id);
        const dmgDefended = dPIsDefending
            ? ((defenderPokemon.defense / 2) * attackerPokemon.attack) / 100
            : 0;
        const dmgDone = attackerPokemon.attack - dmgDefended;
        const hpRemaining = defenderPokemon.hp - dmgDone;
        defenderPokemon = { ...defenderPokemon, hp: hpRemaining };
        return [defenderPokemon, dPIsDefending, dmgDefended, hpRemaining];
    },
    createLog: function (
        attackerPokemon,
        defenderPokemon,
        dPIsDefending,
        dmgDefended,
        hpRemaining,
        log
    ) {
        //create log

        log.push(
            `${attackerPokemon.name} atacó a ${defenderPokemon.name} por ${
                attackerPokemon.attack
            } puntos de daño,${
                dPIsDefending
                    ? ` ${defenderPokemon.name} defendió un  ${
                          defenderPokemon.defense / 2
                      }% o ${dmgDefended} vida,`
                    : ''
            } ${defenderPokemon.name} ${
                hpRemaining <= 0
                    ? ' murió.'
                    : ` ahora le queda ${hpRemaining} puntos de vida.`
            }`
        );
        return log;
    },
    recreateTeams: function (
        fight,
        player1Pokes,
        player2Pokes,
        defenderPokemon
    ) {
        //recreate teams
        if (fight % 2 == 0) {
            player2Pokes = player2Pokes.filter((pokemon) => {
                return pokemon.id != defenderPokemon.id;
            });
            if (hpRemaining > 0) {
                player2Pokes = [...player2Pokes, defenderPokemon];
            }
        } else {
            player1Pokes = player1Pokes.filter((pokemon) => {
                return pokemon.id != defenderPokemon.id;
            });
            if (hpRemaining > 0) {
                player1Pokes = [...player1Pokes, defenderPokemon];
            }
        }
        return [player1Pokes, player2Pokes];
    },
    attack: function (battle, player1Pokes, player2Pokes) {
        //BUG Estas dos variables son porque si muere el atacante antes de atacar no hay ataque y hay error
        const player1PokesAtt = player1Pokes;
        const player2PokesAtt = player2Pokes;
        const defending = this.setDefenders(battle);
        let log = [];
        Object.entries(battle).forEach(([fight, action]) => {
            if (action[1] == 'attack') {
                [attackerPokemon, defenderPokemon, callOfAttack] =
                    this.setTeams(
                        fight,
                        action,
                        player1Pokes,
                        player2Pokes,
                        player1PokesAtt,
                        player2PokesAtt
                    );
                if (callOfAttack) {
                    return;
                }
                [defenderPokemon, dPIsDefending, dmgDefended, hpRemaining] =
                    this.calculateDmgAndHp(
                        attackerPokemon,
                        defenderPokemon,
                        defending
                    );
                log = this.createLog(
                    attackerPokemon,
                    defenderPokemon,
                    dPIsDefending,
                    dmgDefended,
                    hpRemaining,
                    log
                );
                [player1Pokes, player2Pokes] = this.recreateTeams(
                    fight,
                    player1Pokes,
                    player2Pokes,
                    defenderPokemon
                );
            }
        });
        return [player1Pokes, player2Pokes, log];
    },

    results: function (battle, player1Pokes, player2Pokes) {
        [player1Pokes, player2Pokes, log] = this.attack(
            battle,
            player1Pokes,
            player2Pokes
        );
        return [player1Pokes, player2Pokes, log];
    },
};
