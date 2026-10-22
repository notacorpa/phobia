import * as Phobia from 'phobia';

export class Vector2 {
    private _x: number;
    private _y: number;

    constructor(x?: number|number[]|Vector2, y?: number) {
        if (!x) {
            this._x = 0;
            this._y = 0;
        } else if (typeof x === 'number') {
            this._x = x;
            if (!y) throw new TypeError(`y must be a number, but got ${typeof y}.`);
            this._y = y;
        } else if (Array.isArray(x)) {
            if (x.length !== 2) throw new RangeError(`Array length must be exactly 2.`);
            for (const v of x) {
                if (!(typeof x === 'number')) throw new TypeError(`Array must only consist of numbers.`);
            }
            this._x = x[0];
            this._y = x[1];
        } else {
            this._x = x.x;
            this._y = x.y;
        }
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(newX: number) {
        this._x = newX;
    }

    public set y(newY: number) {
        this._y = newY;
    }
}