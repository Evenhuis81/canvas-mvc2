import {EngineDraw, EngineUpdate} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    timer: number;
    active: boolean;
    atEnd: PhaserAtEnd;
    draw: PhaserDraw;
    phase: number;
    phases: PhaserPhases;
    startDraw: (id: string, draw: PhaserDraw) => void;
    stopDraw: (id: string, draw: PhaserDraw, evt: PhaserEvent) => void;
    stopPhase: (phaseNr: number, phase: PhaserPhase) => void;
    startPhase: (phaseNr: number, phase: PhaserPhase) => void;
    // Remove self-reference
    phaserEnd: (
        id: string,
        atEnd: PhaserAtEnd,
        draw: PhaserDraw,
        stopDraw: PhaserProperties['stopDraw'],
        evt: PhaserEvent,
    ) => void;
};

export type PhaserAtEnd = 'stop' | 'destroy' | 'repeat';

export type PhaserDraw = [EngineDraw['fn'], PreDraw?, PostDraw?, RemoveDraw?];

export type PhaserPhase = [PhaseDuration, EngineUpdate['fn']?, PrePhase?, PostPhase?];

export type PhaserPhases = {[K in keyof PhaserPhase]: PhaserPhase[K]}[];

export type PhaserEvent = {destroyPhaser: () => void};

export type PreDraw = Function;
export type PostDraw = (evt: PhaserEvent) => void;
export type RemoveDraw = boolean;
export type PrePhase = Function;
export type PostPhase = Function;

export type PhaseDuration = number;
