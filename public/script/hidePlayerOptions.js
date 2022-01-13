function changeToPlayer2() {
    document.getElementById('instruction-player-1').innerText =
        'Esperá que el jugador 2 elija sus acciones';
    document
        .getElementById('instruction-player-1')
        .classList.remove('btn-success');
    document.getElementById('instruction-player-1').classList.add('disabled');
    document
        .getElementById('instruction-player-1')
        .classList.add('btn-warning');
    document.getElementById('instruction-player-2').innerText =
        'Elegí las acciones y clickea acá';
    document
        .getElementById('instruction-player-2')
        .classList.remove('disabled');
    document
        .getElementById('instruction-player-2')
        .classList.remove('btn-warning');
    document
        .getElementById('instruction-player-2')
        .classList.add('btn-success');
    let player1Options = document.getElementsByClassName('player1-options');
    for (let options of player1Options) {
        options.classList.add('hidden');
    }
    let player2Options = document.getElementsByClassName('player2-options');
    for (let options of player2Options) {
        options.classList.remove('hidden');
    }
}

function prepareToFight() {
    document.getElementById('instruction-player-1').innerText =
        'Listo para pelear';
    document.getElementById('instruction-player-2').innerText =
        'Listo para pelear';
    document.getElementById('instruction-player-2').classList.add('disabled');
    document
        .getElementById('instruction-player-2')
        .classList.add('btn-warning');
    let player2Options = document.getElementsByClassName('player2-options');
    for (let options of player2Options) {
        options.classList.add('hidden');
    }
    document.getElementById('fight-btn').classList.remove('hidden');
}

function setEventListeners() {
    document
        .getElementById('instruction-player-1')
        .addEventListener('click', changeToPlayer2);
    document
        .getElementById('instruction-player-2')
        .addEventListener('click', prepareToFight);
}

setEventListeners();
