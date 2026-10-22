import * as Phobia from 'phobia';

export class Base {
    private eventListeners: Phobia.EventListener[] = [];

    private on_implementation(event: string, callback: Function) {}
    private fire_implementation(event: string, ...args: any[]) {}

    public on(event: string, callback: Function) {
        this.on_implementation(event, callback);
        this.eventListeners.push(new Phobia.EventListener(event, callback));
    }

    public fire(event: string, ...args: any[]) {
        this.fire_implementation(event, ...args);
        for (const e of this.eventListeners) {
            if (e.event === event) e.callback(...args, this);
        }
    }
}