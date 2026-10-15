// vec2.ts

export class Vec2 {
    /**
     * The X coordinate
     */
    public x: number;

    /**
     * The Y coordinate
     */
    public y: number;

    /**
     * Create a new instance of Vec2
     * 
     * @param {Vec2|number} x - A Vec2 or the X coordinate.
     * @param {number} [y=0] - The Y coordinate.
     */
    constructor(x: Vec2|number, y: number = 0) {
        this.x = x instanceof Vec2 ? x.x : x;
        this.y = x instanceof Vec2 ? x.y : y;
    }
}