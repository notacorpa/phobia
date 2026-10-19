// core/scene.ts
import { GameObject, GameInstance } from "phobia";

export class Scene implements GameObject {
    public readonly gi: GameInstance;
    private _children: Scene[] = [];

    constructor(gi: GameInstance) {
        this.gi = gi;
    }
}