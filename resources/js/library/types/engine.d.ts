import {WithOptional} from '.';

type EngineFunction = {
    draw: (timeStamp: DOMHighResTimeStamp) => void;
    update: (event: EngineUpdateEvent) => void;
};

type EngineFunctionMap = {
    [K in keyof EngineFunction]: UpdateOrDraw<K>[];
};

type UpdateOrDraw<T extends keyof EngineFunction> = {
    type: T;
    id: string | number | symbol;
    name: string;
    fn: EngineFunction[T];
};

export type EngineDraw = WithOptional<Omit<UpdateOrDraw<'draw'>, 'type'>, 'id' | 'name'>;

export type EngineUpdate = WithOptional<Omit<UpdateOrDraw<'update'>, 'type'>, 'id' | 'name'>;

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export type EngineSet = <T extends keyof EngineFunctionMap>(updateOrDraw: UpdateOrDraw<T>, set?: boolean) => void;

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    handle: EngineSet;
    setUpdate: (update: EngineUpdate) => void;
    setDraw: (draw: EngineDraw) => void;
    removeUpdate: (id: number | string | symbol) => void;
    removeDraw: (id: number | string | symbol) => void;
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
