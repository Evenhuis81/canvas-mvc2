import {PhaserUpdateEvent} from 'games/phaser/types';

export type EngineDrawConfig = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

export type EngineDraw = MakeOptional<EngineDrawConfig, 'id' | 'name'>;

export type EngineUpdate<K extends keyof EngineUpdateEvents> = MakeOptional<EngineUpdateConfig<K>, 'id' | 'name'>;

// export type EngineDraw = {
//     id?: number | string;
//     name?: string;
//     fn: (deltaTime: DOMHighResTimeStamp) => void;
// };

export type EngineUpdateEvents = {
    engine: EngineUpdateEvent;
    custom: PhaserUpdateEvent;
};

export type EngineUpdateConfig<K extends keyof EngineUpdateEvents> = {
    id: number | string;
    name: string;
    type: K;
    fn: (evt: EngineUpdateEvents[K]) => void;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: <K extends keyof EngineUpdateEvents>(update: EngineUpdate<K>) => void;
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
