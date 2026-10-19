// core/renderer.ts

import { GameObject, GameInstance } from "phobia";

export class Renderer implements GameObject {
    public readonly gi: GameInstance;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    constructor(gi: GameInstance, canvas: HTMLCanvasElement) {
        this.gi = gi;
        this._canvas = canvas;
        const ctx = this._canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get rendering context.");
        this._ctx = ctx;
    }
}