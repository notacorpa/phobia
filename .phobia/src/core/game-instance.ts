// core/game-instance.ts
import { Runtime, World } from "phobia";

export class GameInstance {
    public readonly rt: Runtime;
    private _worlds: World[] = [];

    constructor(rt: Runtime) {
        this.rt = rt;
    }

    registerWorld(world: World) {
        this._worlds.push(world);
    }
}