import {BaseID, WithOptional} from '.';

type EngineFunction = {
    draw: (timeStamp: DOMHighResTimeStamp) => void;
    update: (event: EngineUpdateEvent) => void;
};

type EngineFunctionMap = {
    [K in keyof EngineFunction]: UpdateOrDraw<K>[];
};

type UpdateOrDraw<T extends keyof EngineFunction> = {
    // type: T;
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

// export type EngineSet = <T extends keyof EngineFunctionMap>(updateOrDraw: UpdateOrDraw<T>, set?: boolean) => void;

export type EngineSet = <
    T extends keyof EngineFunction,
    U extends EngineFunction[T],
    V extends Omit<UpdateOrDraw<T>, 'id'> & {id?: BaseID},
>(
    type: T,
    fn: U | V,
) => BaseID;

export type EngineUnset = (id: BaseID, type?: keyof EngineFunction) => void;

export interface Engine {
    run: () => void;
    runOnce: () => void;
    halt: () => void;
    // handle: EngineSet;
    set: EngineSet;
    unset: EngineUnset;
    setUpdate: (update: EngineUpdate) => BaseID;
    setBaseUpdate: (update: EngineUpdate['fn']) => symbol;
    setDraw: (draw: EngineDraw) => BaseID;
    setBaseDraw: (draw: EngineDraw['fn']) => symbol;
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
