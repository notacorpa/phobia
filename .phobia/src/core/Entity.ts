/**
 * @file Entity.ts
 * @copyright (c) 2026 Aedan Maki | Phobia
 * @license MIT - https://opensource.org/licenses/MIT
 */

import { Vector3 } from 'phobia';

export class Entity {
    private _worldPosition: Vector3;
    private _parent: Entity|null = null;
    private _children: Entity[] = [];

    constructor() {
        this._worldPosition = new Vector3(0, 0, 0);
    }

    public GetWorldPosition(): Vector3 {
        return this._worldPosition;
    }

    public SetWorldPosition(newWorldPosition: Vector3): void {
        this._worldPosition = newWorldPosition;
    }

    public GetChildren(): Entity[] {
        return this._children;
    }

    public GetParent(): Entity|null {
        return this._parent;
    }
}