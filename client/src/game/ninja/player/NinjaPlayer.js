import Player from "../../../auth/Player";

/**
 * Player objects for users playing NinjaGame
 */
export class NinjaPlayer extends Player {
    constructor({username, color}) {
        super(username);
        this.username = username;
        this.color = color;
    }
    getColor() {
        return this.color;
    }
}