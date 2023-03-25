function randomColor() {
    /*
    Returns a random hex color
     */
    let colors = [
        '#FF2A2A',
        '#FF672A',
        '#FFA52A',
        '#FFD52A',
        '#EFFF2A',
        '#A8FF2A',
        '#67FF2A',
        '#2AFF41',
        '#2AFFAE',
        '#2AFFE5',
        '#2AEFFF',
        '#2AB8FF',
        '#2A74FF',
        '#2A34FF',
        '#742AFF',
        '#B22AFF',
        '#EF2AFF',
        '#FF2AB2',
        '#FF2A67'
    ]
    return colors[Math.floor(Math.random() * colors.length)];
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

function printPropagationSet(p) {
    let s = '';
    for (let cell of p) {
        s += '[' + p.toString() + '], ';
    }
    console.log(s);
}