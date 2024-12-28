export type EngineDrawConfig = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

export type WithPartial<T, K extends keyof T> = T & {[P in K]?: T[P]};

export type EngineDraw = WithPartial<EngineDrawConfig, 'id' | 'name'>;

export type EngineUpdate = WithPartial<EngineUpdateConfig<'engine' | 'phaser'>, 'id' | 'name'>;

export type EngineUpdateConfig<K extends keyof EngineUpdateEvents> = {
    id: number | string;
    name: string;
    eventType: K;
    fn: (evt: EngineUpdateEvents[K]) => void;
};

export type PhaserEvent = {
    phasePercentage: 0;
    phasePercentageReversed: 1;
};

export type EngineUpdateEvents = {
    engine: EngineUpdateEvent;
    phaser: PhaserEvent;
};

export type EngineUpdateCustomEvent = object;

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

export type EngineProperties = {
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
