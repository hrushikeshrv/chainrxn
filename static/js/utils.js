function randomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
}

function updateCellBorder(cells, color) {
    /*
    Updates the game grid's border color to `color`.
     */
    for (let cell of cells) {
        cell.style.borderColor = color;
    }
}
