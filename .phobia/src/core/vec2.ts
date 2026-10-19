// core/vec2.ts

export class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number|Vec2, y: number = 0) {
        this.x = x instanceof Vec2 ? x.x : x;
        this.y = x instanceof Vec2 ? x.y : y;
    }
}