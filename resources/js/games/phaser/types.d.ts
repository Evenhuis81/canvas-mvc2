import {EngineDraw} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    phase: number;
    timer: number;
    totalTime: number;
    active: boolean;
    atEnd: PhaserAtEnd;
};

export type PhaserUpdateEvent = {
    phasePercentage: number;
    phasePercentageReverse: number;
};

export type PhaserMethods = {
    startDraw: () => void;
    stopDraw: () => void;
    stopPhase: (phase: number) => void;
    startPhase: (phase: number) => void;
    phaserEnd: () => void;
    resetPhaseProperties: () => void;
};

export type PhaserAtEnd = 'stop' | 'destroy' | 'repeat';

export type PhaserUpdate = (evt: PhaserUpdateEvent) => void;

export type PhaserDraw = {
    draw: EngineDraw['fn'];
    pre?: () => void;
    post?: () => void;
    remove?: boolean;
};

export type PhaserPhase = {
    id: number;
    duration: number;
    update?: PhaserUpdate;
    pre?: () => void;
    post?: () => void;
    // startAt? : number;
};

// export type PhaserEvent = {
// destroyPhaser: () => void;
// startPhaser: () => void;
// repeatPhaser: () => void;
// startFromPhase: (phase: number) => void;
// stopPhaser: () => void;
// };
