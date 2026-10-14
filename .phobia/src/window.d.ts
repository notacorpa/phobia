// window.d.ts
export {};

declare global {
    interface Window {
        __PHOBIA_DEBUG_MODE__?: boolean;
        __ENGINE_VERSION__: string;
    }

    const READY = 'ready';
};