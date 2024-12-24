import {EngineDraw, EngineUpdate} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    phase: number;
    timer: number;
    totalTime: number;
    active: boolean;
    atEnd: PhaserAtEnd;
    phasePercentage: number;
    phasePercentageReverse: number;
};

export type PhaserUpdateEvent = {
    phasePercentage: number;
    phasePercentageReverse: number;
};

// const phaserAtEnd = {
//     stop: () => {},
//     repeat: () => {},
//     destroy: () => {},
// };

export type PhaserMethods = {
    startDraw: () => void;
    stopDraw: () => void;
    stopPhase: (phase: number) => void;
    startPhase: (phase: number) => void;
    phaserEnd: () => void;
    resetPhaseProperties: () => void;
};

export type PhaserAtEnd = 'stop' | 'destroy' | 'repeat';

export type PhaserDraw = {
    type: 'draw';
    draw: EngineDraw['fn'];
    pre?: () => void;
    post?: () => void;
    remove?: boolean;
};

export type PhaserPhase = {
    id: number;
    type: 'phase';
    duration: number;
    update?: EngineUpdate['fn'];
    pre?: () => void;
    post?: () => void;
    // startAt? : number;
};

export type PhaserEvent = {
    destroyPhaser: () => void;
    repeatPhaser: () => void;
    startFromPhase: (phase: number) => void;
    stopPhaser: () => void;
};
