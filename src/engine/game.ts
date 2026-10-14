// engine/game.ts

export class Game {
    private gameReadyCallbacks: Function[] = [];

    constructor() {
        window.onload = () => this._onLoaded();
    }

    public ready(callback: Function) {
        if (document.readyState === 'complete') callback(); else {
            this.gameReadyCallbacks.push(callback);
        }
    }

    private _onLoaded() {
        for (const c of this.gameReadyCallbacks) {
            c();
        }
    }
}