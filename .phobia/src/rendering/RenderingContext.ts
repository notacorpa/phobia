import * as Phobia from 'phobia';

export abstract class RenderingContext {
    protected _canvas: HTMLCanvasElement;
    protected _ctx?: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public drawRect(p1: Phobia.Vector2, p2: Phobia.Vector2, p3: Phobia.Vector2, p4: Phobia.Vector2): void {}
}