const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// const tempPokeArray = [
//     { id: 804, name: 'naganadel', hp: 73, attack: 73, defense: 73 },
//     { id: 58, name: 'growlithe', hp: 55, attack: 70, defense: 45 },
//     { id: 250, name: 'ho-oh', hp: 106, attack: 130, defense: 90 },
//     { id: 575, name: 'gothorita', hp: 60, attack: 45, defense: 70 },
//     { id: 247, name: 'pupitar', hp: 70, attack: 84, defense: 70 },
//     { id: 536, name: 'palpitoad', hp: 75, attack: 65, defense: 55 },
//     { id: 156, name: 'quilava', hp: 58, attack: 64, defense: 58 },
//     { id: 109, name: 'koffing', hp: 40, attack: 65, defense: 95 },
//     { id: 435, name: 'skuntank',  hp: 103, attack: 93, defense: 67 },
//     { id: 664, name: 'scatterbug', hp: 38, attack: 35, defense: 40 },
//     { id: 81, name: 'magnemite', hp: 25, attack: 35, defense: 70 },
//     { id: 335, name: 'zangoose', hp: 73, attack: 115, defense: 60 },
// ];

module.exports = {
    useLocalStorage: function () {
        // if (tempPokeArray) {
        //     req.session.pokeArray = req.session.pokeArray ?? tempPokeArray;
        // }
    },
    totalPokemons: async function () {
        const allPokemons = await (
            await fetch('https://pokeapi.co/api/v2/pokemon/')
        ).json();
        const count = allPokemons.count;
        return count;
    },
    randomArray: function (pokeCount) {
        return Array.from({ length: 200 }, () =>
            Math.floor(Math.random() * pokeCount)
        );
    },
    populateArray: async function (randomArray) {
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
        return pokeArray;
    },
    shuffleArray: function (req) {
        pokeArray = req.session.pokeArray;
        pokeArray.sort(function () {
            return Math.random() - 0.5;
        });
        return pokeArray;
    },
    startingCurrentPlayer: function (req) {
        if (!req.session.currentPlayer) {
            req.session.currentPlayer = 1;
        }
        const currentPlayer = req.session.currentPlayer;
        return currentPlayer;
    },
    getPokeArray: async function (req) {
        let pokeArray;
        this.useLocalStorage;

        if (!req.session.pokeArray) {
            const pokeCount = await this.totalPokemons();
            const randomArray = this.randomArray(pokeCount);
            pokeArray = await this.populateArray(randomArray);
            req.session.pokeArray = pokeArray;
        } else {
            pokeArray = this.shuffleArray(req);
        }
        const currentPlayer = this.startingCurrentPlayer(req);
        return [pokeArray, currentPlayer];
    },
};
