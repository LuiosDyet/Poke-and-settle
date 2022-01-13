const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    })
);

app.listen(3001);

app.get('/', async (req, res) => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const tempPokeArray = [
        { id: 804, name: 'naganadel', hp: 73, attack: 73, defense: 73 },
        { id: 58, name: 'growlithe', hp: 55, attack: 70, defense: 45 },
        { id: 250, name: 'ho-oh', hp: 106, attack: 130, defense: 90 },
        { id: 575, name: 'gothorita', hp: 60, attack: 45, defense: 70 },
        { id: 247, name: 'pupitar', hp: 70, attack: 84, defense: 70 },
        { id: 536, name: 'palpitoad', hp: 75, attack: 65, defense: 55 },
        { id: 156, name: 'quilava', hp: 58, attack: 64, defense: 58 },
        { id: 109, name: 'koffing', hp: 40, attack: 65, defense: 95 },
        { id: 435, name: 'skuntank', hp: 103, attack: 93, defense: 67 },
        { id: 664, name: 'scatterbug', hp: 38, attack: 35, defense: 40 },
        { id: 81, name: 'magnemite', hp: 25, attack: 35, defense: 70 },
        { id: 335, name: 'zangoose', hp: 73, attack: 115, defense: 60 },
    ];
    try {
        let pokeArray;
        if (tempPokeArray) {
            req.session.pokeArray = req.session.pokeArray ?? tempPokeArray;
        }

        if (!req.session.pokeArray) {
            const pokeCount = (
                await (await fetch('https://pokeapi.co/api/v2/pokemon/')).json()
            ).count;
            const randomArray = Array.from({ length: 200 }, () =>
                Math.floor(Math.random() * pokeCount)
            );
            pokeArray = [];
            let i = 0;
            do {
                const data = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${randomArray[i]}`
                );
                i++;
                if (data.status === 200) {
                    const p = await data.json();
                    const pokemon = {
                        id: p.id,
                        name: capitalizeFirstLetter(p.name),
                        hp: p.stats[0].base_stat,
                        attack: p.stats[1].base_stat,
                        defense: p.stats[2].base_stat,
                    };
                    pokeArray.push(pokemon);
                }
            } while (pokeArray.length < 12 || i >= randomArray.length);
            req.session.pokeArray = pokeArray;
        } else {
            pokeArray = req.session.pokeArray;
        }
        if (!req.session.currentPlayer) {
            req.session.currentPlayer = 1;
        }
        const currentPlayer = req.session.currentPlayer;
        res.render('index', { pokeArray, currentPlayer });
    } catch (error) {
        console.log(`error`, error);
    }
});

app.post('/choose/:id', (req, res) => {
    const pokeArray = req.session.pokeArray;
    const selectedPokemonIndex = pokeArray.findIndex(
        (pokemon) => pokemon.id == req.params.id
    );
    const selectedPokemon = pokeArray.splice(selectedPokemonIndex, 1);
    req.session.pokeArray = pokeArray;
    if (!req.session.player2Pokes) {
        req.session.player2Pokes = [];
    }
    if (!req.session.player1Pokes) {
        req.session.player1Pokes = [];
    }
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
    if (
        req.session.player1Pokes.length + req.session.player2Pokes.length >=
        6
    ) {
        return res.redirect('/battle');
    }
    res.redirect('back');
});

app.get('/battle', (req, res) => {
    let log;
    if (req.session.log) {
        log = req.session.log;
    }
    const player1Pokes = req.session.player1Pokes;
    const player2Pokes = req.session.player2Pokes;
    const currentPlayer = req.session.currentPlayer
        ? req.session.currentPlayer
        : 1;
    req.session.player1Pokes = player1Pokes;
    req.session.player2Pokes = player2Pokes;
    const old = req.session.old;
    console.log(`old`, old);
    res.render('battle', {
        player1Pokes,
        player2Pokes,
        log,
        currentPlayer,
        old,
    });
});

app.post('/fight', (req, res) => {
    // if (req.session.currentPlayer == 1) {
    //     req.session.currentPlayer = 2;
    //     return res.redirect('back');
    // } else if (req.session.currentPlayer == 2) {
    //     req.session.currentPlayer = 'fight';
    //     return res.redirect('back');
    // } else {
    //     req.session.currentPlayer = 1;
    const battle = req.body;
    let player1Pokes = req.session.player1Pokes;
    let player2Pokes = req.session.player2Pokes;
    const log = [];
    const defending = [];
    Object.entries(battle).forEach(([battle, action]) => {
        if (action[1] == 'defend') {
            const defenderId = action[0];
            defending.push(defenderId);
        }
    });
    Object.entries(battle).forEach(([battle, action]) => {
        if (action[1] == 'attack') {
            const [attackerId, attack, defenderId] = action;
            let attackerArray;
            let defenderArray;
            if (battle % 2 == 0) {
                attackerArray = player1Pokes;
                defenderArray = player2Pokes;
            } else {
                attackerArray = player2Pokes;
                defenderArray = player1Pokes;
            }
            const attackerPokemon = attackerArray.find((pokemon) => {
                return attackerId == pokemon.id;
            });
            let defenderPokemon = defenderArray.find((pokemon) => {
                return defenderId == pokemon.id;
            });
            if (!defenderPokemon) {
                return;
            }
            const dPIsDefending = defending.includes(defenderId);
            const dmgDefended = dPIsDefending
                ? ((defenderPokemon.defense / 2) * attackerPokemon.attack) / 100
                : 0;
            const dmgDone = attackerPokemon.attack - dmgDefended;
            const hpRemaining = defenderPokemon.hp - dmgDone;
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
            defenderPokemon = { ...defenderPokemon, hp: hpRemaining };
            if (battle % 2 == 0) {
                player2Pokes = player2Pokes.filter((pokemon) => {
                    return pokemon.id != defenderId;
                });
                if (hpRemaining > 0) {
                    player2Pokes = [...player2Pokes, defenderPokemon];
                }
            } else {
                player1Pokes = player1Pokes.filter((pokemon) => {
                    return pokemon.id != defenderId;
                });
                if (hpRemaining > 0) {
                    player1Pokes = [...player1Pokes, defenderPokemon];
                }
            }
        }
    });
    req.session.player1Pokes = player1Pokes;
    req.session.player2Pokes = player2Pokes;
    req.session.log = log;

    if (player1Pokes.length == 0 || player2Pokes.length == 0) {
        return res.redirect('/endgame');
    } else {
        return res.redirect('back');
    }
    // }
});

app.get('/endgame', (req, res) => {
    let winner;
    if (req.session.player1Pokes.length == 0) {
        winner = 'Ganó el jugador 2';
    } else {
        winner = 'Ganó el jugador 1';
    }
    req.session.destroy();
    res.render('endgame', { winner });
    console.log(`req.session`, req.session);
});