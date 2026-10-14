import { Vector2 } from "phobia";

export class GraphNode {
    public absolutePosition: Vector2 = new Vector2(0, 0);
    public relativePosition: Vector2 = new Vector2(0, 0);
    private _children: GraphNode[] = [];

    constructor() {

    }

    public get children(): GraphNode[] {
        return this._children;
    }
}