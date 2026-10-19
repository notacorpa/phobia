// sound.ts

import { 
    Base,

    LOADED,
    PLAY,
    PAUSE
} from "phobia";

export class Sound extends Base {
    private _audio: HTMLAudioElement;
    private _isPlaying: boolean = false;

    constructor(url: string) {
        super();

        this._audio = new Audio(url);
        this._audio.onload = () => this._onLoad;
    }

    private _onLoad() {
        this.fire(LOADED);
    }

    public play(): void {
        this._audio.play();
        this._isPlaying = true;
        this.fire(PLAY);
    }

    public pause(): void {
        this._audio.pause();
        this._isPlaying = false;
        this.fire(PAUSE);
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }
}