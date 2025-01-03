import {MakeOptional} from '.';

export type EngineDrawConfig = {
    id: number | string;
    name: string;
    fn: (deltaTime: DOMHighResTimeStamp) => void;
};

export type EngineUpdateConfig<C extends object> = Omit<EngineDrawConfig, 'fn'> & {
    fn: (evt: EngineUpdateEvent<C>) => void;
};

export type EngineDraw = MakeOptional<EngineDrawConfig, 'id' | 'name'>;

export type EngineUpdate<C extends object> = MakeOptional<EngineUpdateConfig<C>, 'id' | 'name'>;

// export type EngineCustomUpdateEvent<C extends object> = C;

export type EngineUpdateEvent<C extends object> = InternalEngineUpdateEvent & C;

export type InternalEngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export interface Engine<C extends object> {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    setUpdate: (update: EngineUpdate<C>) => void;
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
