import {EngineDraw, EngineUpdate} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    phase: number;
    timer: number;
    totalTime: number;
    active: boolean;
    atEnd: PhaserAtEnd;
};

export type PhaserMethods = {
    startDraw: () => void;
    stopDraw: (evt: PhaserEvent) => void;
    stopPhase: (phase: number) => void;
    startPhase: (phase: number) => void;
    // Remove self-reference
    phaserEnd: (
        id: string,
        // phase: number,
        atEnd: PhaserAtEnd,
        draw: PhaserDraw,
        // stopDraw: PhaserProperties['stopDraw'],
        evt: PhaserEvent,
    ) => void;
};

export type PhaserInternal = {
    draw: PhaserDraw;
    phase: PhaserPhase[];
};

export type PhaserAtEnd = 'stop' | 'destroy' | 'repeat';

export type PhaserDraw = [EngineDraw['fn'], PreDraw?, PostDraw?, RemoveDraw?];

export type PhaserPhase = [PhaseDuration, EngineUpdate['fn']?, PrePhase?, PostPhase?, StartAt?];

export type PhaserPhases = {[K in keyof PhaserPhase]: PhaserPhase[K]}[];

export type PhaserEvent = {destroyPhaser: () => void};

export type StartAt = number;
export type PreDraw = Function;
export type PostDraw = (evt: PhaserEvent) => void;
export type RemoveDraw = boolean;
export type PrePhase = Function;
export type PostPhase = Function;

export type PhaseDuration = number;
