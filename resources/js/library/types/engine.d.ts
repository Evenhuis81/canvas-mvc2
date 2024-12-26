// Common cases for library types (all that is connected with the library):
// Incoming = plain (for user, ie. EngineUpdate)
// Internal usage exisiting or slightly modified types = ...Config (ready to set, no more modifications on this one)

export type EngineDrawConfig = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

export type WithPartial<T, K extends keyof T> = T & {[P in K]?: T[P]};

export type EngineDraw = WithPartial<EngineDrawConfig, 'id' | 'name'>;

export type EngineUpdate = WithPartial<EngineUpdateConfig, 'id' | 'name' | 'eventType'>;

export type EngineUpdateConfig = {
    id: number | string;
    name: string;
    eventType: 'engine' | 'custom';
    fn: (evt: EngineUpdateEvent) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: EngineUpdate) => void;
    setDraw: (draw: EngineDraw) => void;
    removeUpdate: (id: number | string) => void;
    removeDraw: (id: number | string) => void;
    info: EngineInfo;
    createStats: (context: CanvasRenderingContext2D) => EngineStatistics;
}

export type EngineStatistics = {
    on: Function;
    off: Function;
};

export type EngineInfo = {
    updates: {
        length: () => number;
        ids: () => (string | number | undefined)[];
    };
    draws: {
        length: () => number;
        ids: () => (string | number | undefined)[];
    };
    time: {
        passed: () => number;
        last: () => number;
    };
};

export type EngineEvents<T extends object> = {
    engine: EngineUpdateEvent;
    custom: T;
};

export type EngineProperties = {
    updates: EngineUpdateConfig[];
    draws: EngineDrawConfig[];
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
