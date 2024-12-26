export type EngineUpdate = {
    id: number | string;
    name: string;
    eventType: 'engine' | 'custom';
    fn: <K extends keyof UpdateEvents>(evt: UpdateEvents[K]) => void;
};

export type CustomUpdateEvent = object;

export type UpdateEvents = {
    engine: EngineUpdateEvent;
    custom: CustomUpdateEvent;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export type EngineDraw = Omit<EngineUpdate, 'fn' | 'eventType'> & {fn: (deltaTime: DOMHighResTimeStamp) => void};

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
    updates: EngineUpdate[];
    updateEvent: EngineUpdateEvent;
    customEvent: CustomUpdateEvent;
    draws: EngineDraw[];
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
