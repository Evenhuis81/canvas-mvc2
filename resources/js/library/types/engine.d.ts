import {BaseID, WithOptional} from '.';

type EngineFunction = {
    draw: (timeStamp: DOMHighResTimeStamp) => void;
    update: (event: EngineUpdateEvent) => void;
};

type EngineFunctionMap = {
    [K in keyof EngineFunction]: UpdateOrDraw<K>[];
};

type UpdateOrDraw<T extends keyof EngineFunction> = {
    type: T;
    id: BaseID;
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
    removeUpdate: (id: BaseID) => void;
    removeDraw: (id: BaseID) => void;
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
        ids: () => (BaseID | undefined)[];
    };
    draws: {
        length: () => number;
        ids: () => (BaseID | undefined)[];
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
