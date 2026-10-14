import { Vector2 } from "phobia";

export class GraphNode {
    public absolutePosition: Vector2 = new Vector2(0, 0);
    public relativePosition: Vector2 = new Vector2(0, 0);
    public children: GraphNode[] = [];

    constructor() {
        
    }
}