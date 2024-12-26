export type EngineDraw = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

export type EngineUpdate<K extends keyof UpdateEvents<object>> = {
    id: number | string;
    name: string;
    eventType: K;
    fn: (evt: UpdateEvents<object>[K]) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: EngineUpdate<keyof UpdateEvents<object>>) => void;
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

export type UpdateEvents<CustomUpdateEvent extends object> = {
    engine: EngineUpdateEvent;
    custom: CustomUpdateEvent;
};

export type EngineProperties<K extends object> = {
    updates: EngineUpdate<keyof UpdateEvents<object>>[];
    events: UpdateEvents<K>;
    draws: EngineDraw[];
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
