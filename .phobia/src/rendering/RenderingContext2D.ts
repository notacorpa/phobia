import * as Phobia from 'phobia';

export class RenderingContext2D extends Phobia.RenderingContext {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        const ctx = this._canvas.getContext('2d');
        if (!ctx) throw new ReferenceError(`Failed to get 2D rendering context.`);
        if (!(ctx instanceof CanvasRenderingContext2D)) throw new TypeError(`Failed to get 2D rendering context.`);
        this._ctx = ctx;
    }

    public override drawRect(p1: Phobia.Vector2, p2: Phobia.Vector2, p3: Phobia.Vector2, p4: Phobia.Vector2): void {
        const ctx = this._ctx;
        if (!ctx) throw new ReferenceError(`Failed to get 2D rendering context.`);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Optional: fill the rectangle
        ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
        ctx.fill();
    }
}