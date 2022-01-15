function attacked() {
    const attackingPokemons =
        document.getElementsByClassName('attackingPokemon');

    for (let attackingPokemon of attackingPokemons) {
        attackingPokemon.addEventListener('change', function () {
            if (this.value == 'attacking') {
                this.classList.remove('hideNext');
            } else {
                this.classList.add('hideNext');
            }
        });
    }
}

attacked();
