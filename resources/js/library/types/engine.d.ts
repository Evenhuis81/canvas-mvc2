import {PhaserUpdateEvent} from 'games/phaser/types';

export type UpdateEngine = {
    id: number | string;
    name: string;
    event: 'updateEvent' | 'phaserEvent';
    fn: <K extends keyof UpdateEvents>(evt: UpdateEvents[K]) => void;
};

export type EngineUpdate = Partial<UpdateEngine>;

export type UpdateEvents = {
    engine: EngineUpdateEvent;
    phaser: PhaserUpdateEvent;
};

export type EngineUpdateEvent = {
    timePassed: number;
    lastTime: number;
};

export type EngineDraw = Omit<UpdateEngine, 'fn' | 'event'> & {fn: (deltaTime: DOMHighResTimeStamp) => void};

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
    updates: UpdateEngine[];
    updateEvent: EngineUpdateEvent;
    phaserEvent: PhaserUpdateEvent;
    draws: EngineDraw[];
    requestID: number;
    stop: boolean;
    stats: boolean;
    statsActive: boolean;
};
