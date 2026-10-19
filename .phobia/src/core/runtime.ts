// core/runtime.ts
import { GameInstance, Renderer } from "phobia";

export class Runtime {
    private _canvas: HTMLCanvasElement;
    private _renderer: Renderer;
    public readonly gi: GameInstance;
    public onInit!: Function;
    public onReady!: Function;

    constructor() {
        this.gi = new GameInstance(this);
        const canvas = document.createElement("canvas");
        canvas.classList.add("phobia-canvas");
        document.body.appendChild(canvas);
        this._canvas = canvas;
        this._renderer = new Renderer(this.gi, this._canvas);
    }

    init() {
        this.onInit(this.gi);

        if (document.readyState === 'complete') {
            this.onReady(this.gi);
        } else {
            window.onload = () => {
                this.onReady(this.gi);
            };
        }
    }
}