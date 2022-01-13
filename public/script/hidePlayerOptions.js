function changeToPlayer2() {
    document.getElementById('instructions').innerText =
        'Jugador 2 elije sus acciones';
    let player1Options = document.getElementsByClassName('player1-options');
    for (let options of player1Options) {
        options.classList.add('hidden');
    }
    let player2Options = document.getElementsByClassName('player2-options');
    for (let options of player2Options) {
        options.classList.remove('hidden');
    }
    document.getElementById('prepare-fight-btn').classList.remove('d-none');
    document.getElementById('prepare-fight-btn').classList.add('d-block');
    document.getElementById('pass-player-2-btn').classList.add('d-none');
}

function prepareToFight() {
    document.getElementById('instructions').innerText = 'Listos para pelear';
    let player2Options = document.getElementsByClassName('player2-options');
    for (let options of player2Options) {
        options.classList.add('hidden');
    }
    document.getElementById('fight-btn').classList.remove('d-none');
    document.getElementById('fight-btn').classList.add('d-block');
    document.getElementById('prepare-fight-btn').classList.add('d-none');
}

function setEventListeners() {
    document
        .getElementById('pass-player-2-btn')
        .addEventListener('click', changeToPlayer2);
    document
        .getElementById('prepare-fight-btn')
        .addEventListener('click', prepareToFight);
}

setEventListeners();
