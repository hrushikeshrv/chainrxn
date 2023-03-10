class Game {
    constructor(window, players, width=6, height=9) {
        this.window = window;
        this.width = width;
        this.height = height;
        this.players = players;
        this.turn = 0;
        this.grid = [];

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
                rowElement.appendChild(cellElement);
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
        let particleElement = document.createElement('div')
        if (!particle) particle.classList.add('chainrxn-particle-empty');
        else particle.classList.add(`chainrxn-particle-${particle.atomicity}`);
        return particleElement;
    }

    render() {
        this.window.querySelectorAll('.chainrxn-cell').forEach(cell => {
            cell.innerHTML = '';
        })
        for (let row of this.grid) {
            for (let cell of row) {
                cell?.appendChild(this.renderCell(cell));
            }
        }
    }
}