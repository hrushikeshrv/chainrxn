const gameSettings = document.querySelector('#game-settings-window');
const gameGrid = document.querySelector('#game-window');
const gameInfo = document.querySelector('#game-info-window');

const nPlayers = document.querySelector('#n-players').value;

function randomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
}

const players = [];
for (let i = 0; i < nPlayers; i++) {
    players.push(new Player(randomColor()));
}

const startButton = document.querySelector('#start-game');

let game = null;

function createGame() {
    if (game) return;
    const width = document.querySelector('#width').value;
    const height = document.querySelector('#height').value;
    game = new Game(gameGrid, players, width, height);
    game.setupGrid();
    game.render();
}

startButton.addEventListener('click', createGame);