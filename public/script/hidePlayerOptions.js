function hidePlayerOptions() {
    const attackingPokemons =
        document.getElementsByClassName('attackingPokemon');

    for (let attackingPokemon of attackingPokemons) {
        attackingPokemon.addEventListener('change', function () {
            if (this.value == 'attack') {
                this.classList.remove('hideNext');
            } else {
                this.classList.add('hideNext');
            }

            console.log(this.value);
        });
    }
}

hidePlayerOptions();
