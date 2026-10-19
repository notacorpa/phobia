// base.ts

import { EventListener } from "phobia";

export class Base {
    private _eventListeners: EventListener[] = [];

    public on(event: string, callback: Function): EventListener {
        const el = new EventListener(event, callback);
        this._eventListeners.push(el);
        return el;
    }

    public fire(event: string): void {
        for (const e of this._eventListeners) {
            if (e.event === event) {
                e.callback();
            }
        }
    }
}