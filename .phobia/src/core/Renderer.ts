import * as Phobia from 'phobia';

export class Renderer extends Phobia.Base {
    private game: Phobia.Game;
    private canvas!: HTMLCanvasElement;
    private context2D!: CanvasRenderingContext2D;

    constructor(game: Phobia.Game) {
        super();

        this.game = game;
    }
}