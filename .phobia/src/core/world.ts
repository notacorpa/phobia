// core/world.ts
import { GameInstance, GameObject, Scene } from "phobia";

export abstract class World implements GameObject {
    public gi: GameInstance;
    public readonly root: Scene;

    constructor(gi: GameInstance) {
        this.gi = gi;
        this.root = new Scene(this.gi);
    }
}