// interface/event-system.ts

export class EventListener {
    constructor(public readonly event: string, public readonly callback: Function) {}
}