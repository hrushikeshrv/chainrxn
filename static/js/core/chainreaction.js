class Game {
    constructor(window, players, width=7, height=9) {
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
            particleElement.style.backgroundColor = particle.player.color;
            particleElement.innerHTML = particle.atomicity;
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

    getMaxAtomicity(row, col) {

    }

    propagate(row, col) {
        /*
        Propagates the chain reaction starting at the passed row and column
         */
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
        }
    }
}