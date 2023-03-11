class Game {
    constructor(window, players, width=6, height=9) {
        this.window = window;
        this.width = width;
        this.height = height;
        this.players = players;
        this.turn = 0;
        this.grid = []; // A 2D array storing the positions of the particles
        this.DOMcells = []; // An array storing the DOM elements of each individual cell in the grid

        for (let i = 0; i < height; i++) {
            this.grid.push(new Array(width).fill(null));
        }
    }

    setupGrid() {
        for (let i = 0; i < this.height; i++) {
            let rowElement = document.createElement('div');
            rowElement.classList.add('chainrxn-row', 'flexbox-row');
            rowElement.style.height = Math.floor(this.window.offsetHeight / this.height).toString() + 'px';
            for (let j = 0; j < this.width; j++) {
                let cellElement = document.createElement('div');
                cellElement.classList.add('chainrxn-cell', 'flexbox-row', 'ajc');
                cellElement.dataset.rowIndex = i.toString();
                cellElement.dataset.columnIndex = j.toString();
                rowElement.appendChild(cellElement);
                this.DOMcells.push(cellElement);
            }
            this.window.appendChild(rowElement);
        }
    }

    isOver() {
        let particles = {};
        for (let row of this.grid) {
            for (let cell of row) {
                if (cell instanceof Particle) {
                    particles[cell.player.color] = (particles[cell.player.color] || 0) + 1;
                }
            }
        }

        if (Object.keys(particles).length  !== 1) return false;
        return Object.values(particles)[0] > 1;
    }

    renderCell(particle) {
        /*
        Returns a DOM element that should be placed inside a .chainrxn-cell element
         */
        let particleElement = document.createElement('div')
        if (!particle) particleElement.classList.add('chainrxn-particle-empty');
        else particleElement.classList.add(`chainrxn-particle-${particle.atomicity}`);
        particleElement.dataset.atomicity = particle ? particle.atomicity : 0;
        return particleElement;
    }

    render() {
        this.window.querySelectorAll('.chainrxn-cell').forEach(cell => {
            cell.innerHTML = '';
        })
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const index = this.width * i + j;
                this.DOMcells[index].appendChild(this.renderCell(this.grid[i][j]));
            }
        }
    }
}