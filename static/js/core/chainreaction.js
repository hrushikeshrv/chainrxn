class Game {
    constructor(window, players, width=7, height=9) {
        this.window = window;
        this.width = width; // Number of cells per row
        this.height = height; // Number of rows
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
                cellElement.style.width = Math.floor(this.window.offsetWidth / this.width).toString() + 'px';
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

    getCurrentPlayer() {
        /*
        Returns the current player object
         */
        return this.players[this.turn];
    }

    getCellNeighbours(row, col) {
        let neighbours = [];
        for (let delta of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            if (row + delta[0] >= 0 && row + delta[0] < this.height) {
                if (col + delta[1] >= 0 && col + delta[1] < this.width)
                    neighbours.push([row + delta[0], col + delta[1]]);
            }
        }
        return neighbours;
    }

    renderCell(particle) {
        /*
        Returns a DOM element that should be placed inside a .chainrxn-cell element
         */
        let particleElement = document.createElement('div')
        if (!particle) {
            particleElement.classList.add('chainrxn-particle-empty');
        }
        else {
            particleElement.classList.add(
                `chainrxn-particle-${particle.atomicity}`,
                `chainrxn-particle-player-${particle.player.id}`
            );
            particleElement.dataset.atomicity = particle.atomicity;
            if (particle.atomicity === 1) {
                particleElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle" width="33" height="33" viewBox="0 0 24 24" stroke-width="1.5" stroke="${particle.player.color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <circle cx="12" cy="12" r="9" />
                </svg>
                `;
            }
            else if (particle.atomicity === 2) {
                particleElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-atom-2" width="33" height="33" viewBox="0 0 24 24" stroke-width="1.5" stroke="${particle.player.color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="21" x2="12" y2="21.01" />
                  <line x1="3" y1="9" x2="3" y2="9.01" />
                  <line x1="21" y1="9" x2="21" y2="9.01" />
                  <path d="M8 20.1a9 9 0 0 1 -5 -7.1" />
                  <path d="M16 20.1a9 9 0 0 0 5 -7.1" />
                  <path d="M6.2 5a9 9 0 0 1 11.4 0" />
                </svg>
                `
            }
            else if (particle.atomicity === 3) {
                particleElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-atom" width="33" height="33" viewBox="0 0 24 24" stroke-width="1.5" stroke="${particle.player.color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <line x1="12" y1="12" x2="12" y2="12.01" />
                      <path d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10" transform="rotate(45 12 12)" />
                      <path d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10" transform="rotate(-45 12 12)" />
                    </svg>
                `;
            }
        }

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

    addParticle(row, col, player) {
        /*
        Adds a particle for the given player at the given row and
        column on the grid
         */
        if (!this.grid[row][col]) {
            this.grid[row][col] = new Particle(player);
        }
        else {
            if (this.grid[row][col].player !== player) {
                throw new Error(`Cell ${row}, ${col} already contains a different player's particle.`)
            }
            this.grid[row][col].increaseAtomicity();
        }
    }

    updateCellBorder() {
        updateCellBorder(this.DOMcells, this.window, this.getCurrentPlayer().color);
    }

    getMaxAtomicity(row, col) {
        if (row === 0 || row === this.height - 1) {
            if (col === 0 || col === this.width - 1) return 1;
            return 2;
        }
        if (col === 0 || col === this.width - 1) return 2;
        return 3;
    }

    propagate(row, col, propagationSet=null) {
        /*
        Propagates the chain reaction starting at the passed row and column
         */
        if (this.getMaxAtomicity(row, col) > this.grid[row][col].atomicity) return;
        if (!propagationSet) propagationSet = new Set([[row, col]]);
        let currentPlayer = this.getCurrentPlayer();

        let neighbours = this.getCellNeighbours(row, col);
        for (let n of neighbours) {
            let [row, col] = [...n];
            this.grid[row][col].player = currentPlayer;
            this.grid[row][col].increaseAtomicity();
            if (this.grid[row][col].atomicity > this.getMaxAtomicity(row, col)) propagationSet.add(n);
        }
    }

    play(row, col) {
        /*
        Run the game loop given the current player added a particle at the passed
        row and column
         */
        let played = false;
        if (this.grid[row][col]) {
            if (this.getCurrentPlayer() === this.grid[row][col].player) {
                this.grid[row][col].increaseAtomicity();
                played = true;
            }
        }
        else {
            this.addParticle(row, col, this.players[this.turn]);
            played = true;
        }
        if (played) {
            this.propagate(row, col);
            this.render();
            this.turn = (this.turn + 1) % this.players.length;
            this.updateCellBorder();
        }
    }
}