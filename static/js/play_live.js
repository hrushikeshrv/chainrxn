const gameGrid = document.querySelector('#game-window');
const gameInfo = document.querySelector('#game-info-window');
const startButton = document.querySelector('#start-game');
const gameOverBanner = document.querySelector('#game-over');
const isSmallScreen = gameGrid.offsetWidth < 900;

let maxID = 0;
let game = null;

document.addEventListener('DOMContentLoaded', () => {
    const data = {
        action: 'player-joined',
        playerName: playerName,
    }
    console.log('Sending data');
    socket.onopen = () => socket.send(JSON.stringify(data));
})

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data);
}

function addPlayerToGame(playerName) {
    const player = new Player(randomColor(), maxID++);
    game.players.push(player);
    const playerRow = document.createElement('div');
    playerRow.classList.add('player-row', 'flexbox-row', 'pad-30');
    playerRow.dataset.playerId = player.id;
    playerRow.innerHTML = `
    <span class="player-name">${playerName}</span>
    <span class="player-color" style="background-color: ${player.color}"></span>
    <span class="refresh-color" title="Change color" style="margin-left: 20px; cursor: pointer;" data-player-id="${i}">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
    </span>
    `;
    playerRow.querySelector('.refresh-color').addEventListener('click', () => {
        changePlayerColor(player, playerRow, game);
    })
    gameInfo.appendChild(playerRow);
}