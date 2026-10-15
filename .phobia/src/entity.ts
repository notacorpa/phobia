// entity.ts
import {
    GameObject,
    GameInstance,
    Vec2
} from "phobia";

export class Entity implements GameObject {
    /**
     * The current game instance.
     */
    readonly gi: GameInstance;

    /**
     * This entity's name.
     */
    private _name: string;

    /**
     * An array that contains all this entity's children.
     */
    private _children: Entity[];
    
    /**
     * The entity's position in the world.
     */
    private _worldPosition: Vec2;

    /**
     * The entity's position relative to it's parent.
     */
    private _localPosition: Vec2;

    /**
     * Constructor
     */
    constructor(gi: GameInstance, name: string) {
        this.gi = gi;
        this._name = name;
        this._children = [];

        // Set default positions
        this._worldPosition = new Vec2(0, 0);
        this._localPosition = new Vec2(0, 0);
    }

    /**
     * Get the entity's current world position.
     */
    public getWorldPosition(): Vec2 {
        return this._worldPosition;
    }

    /**
     * Get the entity's current local position.
     */
    public getLocalPosition(): Vec2 {
        return this._localPosition;
    }

    /**
     * Get the entity's children.
     */
    public getChildren(): Entity[] {
        return this._children;
    }

    /**
     * Get the entity's name.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Set the entity's name.
     */
    public set name(newName: string) {
        this._name = newName;
    }
}