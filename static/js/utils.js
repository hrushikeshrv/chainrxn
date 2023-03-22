function randomColor() {
    /*
    Returns a random hex color
     */
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function updateCellBorder(cells, window, color) {
    /*
    Updates the game grid's border color to `color`.
     */
    for (let cell of cells) {
        cell.style.borderColor = color;
    }
    window.style.borderColor = color;
}


function changePlayerColor(player, playerRow, game) {
    /*
    Changes a player's particle color, updates it in the game info,
    and renders the game grid again.
     */
    const newColor = randomColor();
    player.color = newColor;
    playerRow.querySelector('.player-color').style.backgroundColor = newColor;
    game.updateCellBorder();
    game.render();
}