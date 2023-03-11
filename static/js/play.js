const gameSettings = document.querySelector('#game-settings-window');
const gameGrid = document.querySelector('#game-window');
const gameInfo = document.querySelector('#game-info-window');
const startButton = document.querySelector('#start-game');


let game = null;
let gridCells = null;

function createGame() {
    /*
    Initialize the game grid, create the player objects, and render the grid.
    Performs the following actions -
    - Initializes the game grid and clears it's innerHTML
    - Creates player objects for each player
    - Renders the grid
    - Populates the game info panel
     */

    if (game) return;
    gameGrid.innerHTML = '';

    const nPlayers = document.querySelector('#n-players').value;
    if (nPlayers > 10 || nPlayers < 2) {
        alert('Players must be between 2 and 10');
        return;
    }
    const players = [];
    for (let i = 0; i < nPlayers; i++) {
        players.push(new Player(randomColor()));
    }

    const width = document.querySelector('#width').value;
    if (width > 15 || width < 5) {
        alert('Number of cells per row must be between 5 and 15');
        return;
    }
    const height = document.querySelector('#height').value;
    if (height > 15 || height < 5) {
        alert('Number of rows must be between 5 and 15');
        return;
    }
    game = new Game(gameGrid, players, width, height);
    game.setupGrid();
    game.render();
    gridCells = document.querySelectorAll('.chainrxn-cell');

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerInfoRow = document.createElement('div');
        playerInfoRow.classList.add('player-row', 'flexbox-row', 'pad-30');
        playerInfoRow.dataset.playerId = i.toString();
        playerInfoRow.innerHTML = `
            <span class="player-name">Player ${i+1}</span>
            <span class="player-color" style="background-color: ${player.color}"></span>
            <span class="refresh-color" title="Change color" style="margin-left: 20px; cursor: pointer;" data-player-id="${i}">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
            </span>
        `;
        playerInfoRow.querySelector('.refresh-color').addEventListener('click', () => {
            changePlayerColor(player, playerInfoRow, game);
        });
        gameInfo.appendChild(playerInfoRow);
    }
}

startButton.addEventListener('click', createGame);