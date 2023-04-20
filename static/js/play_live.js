const gameGrid = document.querySelector('#game-window');
const gameInfo = document.querySelector('#game-info-window');
const startButton = document.querySelector('#start-game');
const gameOverBanner = document.querySelector('#game-over');
const isSmallScreen = gameGrid.offsetWidth < 900;

let maxID = 0;
let game = new Game(gameGrid, [], 7, 9);
let localPlayer;
let gameLeader = null;

game.DOMcells.forEach(cell => {
    cell.addEventListener('click', () => {
        // ! First check if it is this player's turn, if not, return.
        if (game.getCurrentPlayer() !== localPlayer) return;
        game.play(parseInt(cell.dataset.rowIndex), parseInt(cell.dataset.columnIndex));

        if (game.isOver()) {
            gameOverBanner.style.display = 'block';
            const winnerHeading = gameOverBanner.querySelector('#winner-heading');
            winnerHeading.textContent = game.winner;
            winnerHeading.style.backgroundColor = game.winner;
        }

        const data = {
            action: 'cell-clicked',
            row: parseInt(cell.dataset.rowIndex),
            col: parseInt(cell.dataset.columnIndex),
        }
        socket.send(JSON.stringify(data));
    })
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#game-info-container').style.display = 'none';
    document.querySelector('#game-settings-window').innerHTML += `
        <h2 class="pad-30" id="waiting-message">Waiting for the leader to start the game</h2>
    `;
    const data = {
        action: 'player-joined',
        playerName: playerName,
    }
    socket.onopen = () => socket.send(JSON.stringify(data));
})

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    handleData(data);
}

function addPlayerToGame(playerName) {
    const player = new Player(randomColor(), maxID++, playerName);
    if (game.players.length === 0) localPlayer = player;
    game.players.push(player);
    const playerRow = document.createElement('div');
    playerRow.classList.add('player-row', 'flexbox-row', 'pad-30');
    playerRow.dataset.playerId = player.id;
    playerRow.innerHTML = `
    <span class="player-name">${playerName}</span>
    <span class="player-color" style="background-color: ${player.color}"></span>
    <span class="refresh-color" title="Change color" style="margin-left: 20px; cursor: pointer;" data-player-id="${player.id}">
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

function handleData(data) {
    if (data.action === 'player-joined') {
        addPlayerToGame(data.playerName);
        // Send a websocket message saying I don't know who the leader is.
        const message = {
            action: "leader-election",
            sender: playerName,
            leader: gameLeader
        }
        console.log('New player joined, sending leader info', message);
        socket.send(JSON.stringify(message));
    }

    if (data.action === 'leader-election') {
        console.log('Received leader message. Leader is currently', gameLeader);
        if (data.leader === null && gameLeader === null) {
            gameLeader = localPlayer;
            console.log('Setting game leader to self');
            document.querySelector('#game-info-container').removeAttribute('style');
            document.querySelector('#waiting-message').remove();
        }
        else if (!gameLeader) {
            gameLeader = data.leader;
            console.log('Setting game leader to ', data.leader);
        }
        let playerAdded = false;
        for (let p of game.players) {
            console.log(p.name);
            if (p.name === data.sender) playerAdded = true;
        }
        if (!playerAdded) addPlayerToGame(data.sender);
    }
}