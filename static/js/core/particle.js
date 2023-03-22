class Particle {
    constructor(player) {
        this.player = player;
        this.atomicity = 1;
    }

    increaseAtomicity() {
        this.atomicity++;
    }
}