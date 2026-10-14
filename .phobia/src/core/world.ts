import {
    GraphNode
} from "phobia";

export class World {
    private _root: GraphNode = new GraphNode();

    constructor() {

    }

    public get root(): GraphNode {
        return this._root;
    }
}