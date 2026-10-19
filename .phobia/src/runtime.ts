// runtime.ts

import { 
    Base,

    INIT,
    READY,
    TICK
} from "phobia";

export class Runtime extends Base {
    constructor() {
        super();
    }
    
    public start(): void {
        this.fire(INIT);

        if (document.readyState === "complete") {
            this.fire(READY);
        } else {
            window.addEventListener("load", () => {
                this.fire(READY);
            });
        }
    }
}