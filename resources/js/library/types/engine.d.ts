export type EngineUpdate = {
    id?: number | string;
    name?: string;
    fn: (evt: EngineUpdateEvent) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
    phasePercentage: number;
    phasePercentageReverse: number;
};

export type EngineDraw = Omit<EngineUpdate, 'fn'> & {fn: (deltaTime: DOMHighResTimeStamp) => void};

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
    draws: EngineDraw[];
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
