// engine/event.ts

export class Event {
    constructor(public name: string, public callback: Function) {}
}

export class EventDispatcher {
    private events: Event[] = [];

    public on(event: string|Event, callback: Function|null = null) {
        if (typeof event === 'string' && callback !== null) {
            this.events.push(new Event(event, callback));
        } else if (event instanceof Event) {
            this.events.push(event);
        }
    }

    public fire(event: string) {
        for (const e of this.events) {
            if (e.name === event) e.callback();
        }
    }
}