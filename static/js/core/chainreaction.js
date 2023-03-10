import Particle from './particle';
import Player from './player';

export default class Game {
    constructor(window, players, width=6, height=9) {
        this.window = window;
        this.players = players;
        this.turn = 0;
        this.grid = [];
        for (let i = 0; i < height; i++) {
            this.grid.push(new Array(width).fill(null));
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
}