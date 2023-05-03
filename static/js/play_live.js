const gameGrid = document.querySelector('#game-window');
const gameInfo = document.querySelector('#game-info-window');
// const startButton = document.querySelector('#start-game');
let startButton;
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
        <div id="waiting-message">
        <h1 class="pad-30">Chain Reaction</h1>
        <h2 class="pad-30" id="waiting-message">
            <span style="margin-right: 10px;">Waiting for the game leader to start the game</span>
            <span class="donutSpinner smallSpinner"></span>
        </h2>
        </div>
    `;

    // ! Select the start button and add the event listener here
    // The script can't select the start button properly before
    // DOM content is loaded for some reason.
    startButton = document.querySelector('#start-game');
    startButton.addEventListener('click', startGame);
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

function startGame() {
    console.log('Starting game');
    const width = document.querySelector('#width').value
    const height = document.querySelector('#height').value;
    if (width > 15 || width < 5) {
        alert('Number of cells per row must be between 5 and 15');
        return;
    }
    if (height > 15 || height < 5) {
        alert('Number of rows must be between 5 and 15');
        return;
    }
    const data = {
        action: 'start-game',
        height: height,
        width: width
    }
    socket.send(JSON.stringify(data));
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
        socket.send(JSON.stringify(message));
    }

    if (data.action === 'leader-election') {
        if (data.leader === null && gameLeader === null) {
            gameLeader = localPlayer;
            document.querySelector('#game-info-container').removeAttribute('style');
            document.querySelector('#waiting-message').remove();
        }
        else if (!gameLeader) {
            gameLeader = data.leader;
        }
        let playerAdded = false;
        for (let p of game.players) {
            if (p.name === data.sender) playerAdded = true;
        }
        if (!playerAdded) addPlayerToGame(data.sender);
    }

    if (data.action === 'start-game') {
        const newGame = new Game(gameGrid, [], parseInt(data.width), parseInt(data.height));
        for (let p of game.players) newGame.players.push(p);
        gameGrid.innerHTML = '';
        game = newGame;
        game.setupGrid();
        game.render();
        if (isSmallScreen) gameGrid.scrollIntoView(true);
    }
}