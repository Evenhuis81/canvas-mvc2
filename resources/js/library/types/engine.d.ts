export type EngineDrawConfig = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

export type EngineDraw = MakeOptional<EngineDrawConfig, 'id' | 'name'>;

export type EngineUpdate = MakeOptional<EngineUpdateConfig, 'id' | 'name'>;

// export type EngineDraw = {
//     id?: number | string;
//     name?: string;
//     fn: (deltaTime: DOMHighResTimeStamp) => void;
// };

export type EngineUpdateConfig = {
    id: number | string;
    name: string;
    fn: (evt: EngineUpdateEvent) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
    phasePercentage: number;
    phasePercentageReverse: number;
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
    on: () => void;
    off: () => void;
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
