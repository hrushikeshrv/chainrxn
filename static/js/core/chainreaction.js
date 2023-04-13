class Game {
    constructor(window, players, width=7, height=9) {
        this.window = window;
        this.width = width; // Number of cells per row
        this.height = height; // Number of rows
        this.players = players;
        this.turn = 0;
        this.grid = []; // A 2D array storing the positions of the particles
        this.DOMcells = []; // An array storing the DOM elements of each individual cell in the grid
        this.winner = null; // The winner of the game
        this.lobbyLeader = null; // The leader of the lobby, who starts the game

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
        if (Object.values(particles)[0] === 1) return false;
        this.winner = Object.keys(particles)[0];
        return true;
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
            else {
                particleElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-react-native" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="${particle.player.color}" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M6.357 9c-2.637 .68 -4.357 1.845 -4.357 3.175c0 2.107 4.405 3.825 9.85 3.825c.74 0 1.26 -.039 1.95 -.097" />
                      <path d="M9.837 15.9c-.413 -.596 -.806 -1.133 -1.18 -1.8c-2.751 -4.9 -3.488 -9.77 -1.63 -10.873c1.15 -.697 3.047 .253 4.974 2.254" />
                      <path d="M6.429 15.387c-.702 2.688 -.56 4.716 .56 5.395c1.783 1.08 5.387 -1.958 8.043 -6.804c.36 -.67 .683 -1.329 .968 -1.978" />
                      <path d="M12 18.52c1.928 2 3.817 2.95 4.978 2.253c1.85 -1.102 1.121 -5.972 -1.633 -10.873c-.384 -.677 -.777 -1.204 -1.18 -1.8" />
                      <path d="M17.66 15c2.612 -.687 4.34 -1.85 4.34 -3.176c0 -2.11 -4.408 -3.824 -9.845 -3.824c-.747 0 -1.266 .029 -1.955 .087" />
                      <path d="M8 12c.285 -.66 .607 -1.308 .968 -1.978c2.647 -4.844 6.253 -7.89 8.046 -6.801c1.11 .679 1.262 2.706 .56 5.393" />
                      <path d="M12.26 12.015h-.01c-.01 .13 -.12 .24 -.26 .24a0.263 .263 0 0 1 -.25 -.26c0 -.14 .11 -.25 .24 -.25h-.01c.13 -.01 .25 .11 .25 .24" />
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
        for (let cell of this.DOMcells) {
            cell.style.borderColor = this.getCurrentPlayer().color;
        }
        this.window.style.borderColor = this.getCurrentPlayer().color;
    }

    getMaxAtomicity(row, col) {
        if (row === 0 || row === this.height - 1) {
            if (col === 0 || col === this.width - 1) return 1;
            return 2;
        }
        if (col === 0 || col === this.width - 1) return 2;
        return 3;
    }

    propagate(propagationSet, player) {
        /*
        Propagates the chain reaction for all the particle positions that are in the
        propagationSet.
         */
        let [row, col] = [...propagationSet.shift()];
        if (
            this.grid[row][col]
            && this.getMaxAtomicity(row, col) < this.grid[row][col].atomicity
        ) {

            if (this.grid[row][col] - this.getMaxAtomicity(row, col) > 0) {
                this.grid[row][col].atomicity -= this.getMaxAtomicity(row, col);
            } else {
                this.grid[row][col] = null;
            }
            let neighbours = this.getCellNeighbours(row, col);
            for (let n of neighbours) {
                if (this.grid[n[0]][n[1]]) {
                    this.grid[n[0]][n[1]].player = player;
                    this.grid[n[0]][n[1]].increaseAtomicity();
                    if (this.grid[n[0]][n[1]].atomicity > this.getMaxAtomicity(n[0], n[1])) {
                        propagationSet.push(n);
                    }
                } else {
                    this.addParticle(n[0], n[1], player);
                }
            }
            this.render();

        }
        // Delay the next propagation by 0.35s for visual effect
        if (propagationSet.length > 0)
            setTimeout(() => {
                if (!this.isOver()) {
                    this.propagate(propagationSet, player);
                }
            }, 300);
    }

    play(row, col) {
        /*
        Run the game loop given the current player added a particle at the passed
        row and column
         */
        if (this.isOver()) return;
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
            this.propagate([[row, col]], this.getCurrentPlayer());
            this.render();
            this.turn = (this.turn + 1) % this.players.length;
            this.updateCellBorder();
        }
    }
}