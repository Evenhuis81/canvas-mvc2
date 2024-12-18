export type EngineUpdate = {
    id?: number | string;
    name?: string;
    // fn: (deltaTime: number) => void;
    fn: (evt: EngineUpdateEvent) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export type EngineDraw = Omit<EngineUpdate, 'fn'> & {fn: () => void};

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
    draws: EngineDraw[];
    requestID: number;
    stop: boolean;
    timePassed: number;
    lastTime: number;
    stats: boolean;
    statsActive: boolean;
};
