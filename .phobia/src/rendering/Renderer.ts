import * as Phobia from 'phobia';

export class Renderer {
    private _canvas: HTMLCanvasElement;
    public _context2D: Phobia.RenderingContext;

    constructor(canvas?: string|HTMLCanvasElement) {
        if (!canvas) {
            const newCanvas = document.createElement('canvas');
            if (!(newCanvas instanceof HTMLCanvasElement)) throw new TypeError(`newCanvas must be an instance of ${HTMLCanvasElement.name}, but got ${typeof HTMLCanvasElement}`);
            this._canvas = newCanvas;
            this._context2D = new Phobia.RenderingContext2D(this._canvas);
        } else if (typeof canvas === 'string') {
            const canvasElement = document.getElementById(canvas);
            if (!canvasElement) throw new ReferenceError(`canvasElement is not valid.`);
            if (!(canvasElement instanceof HTMLCanvasElement)) throw new TypeError(`canvasElement must be an instance of ${HTMLCanvasElement.name}, but got ${typeof canvasElement}`);
            this._canvas = canvasElement;
            this._context2D = new Phobia.RenderingContext2D(this._canvas);
        } else {
            this._canvas = canvas;
            this._context2D = new Phobia.RenderingContext2D(this._canvas);
        }
        document.body.appendChild(this._canvas);
    }
}