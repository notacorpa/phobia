// main.ts
import {
    Runtime,
    GameInstance
} from "phobia";
import { MyWorld } from "./worlds/my-world";

const rt = new Runtime();

rt.onInit = (gi: GameInstance) => {
};

rt.onReady = (gi: GameInstance) => {
    alert("Hello, world!");
};

rt.init();