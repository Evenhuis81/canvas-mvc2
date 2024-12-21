import {EngineDraw, EngineUpdate} from 'library/types/engine';

export type PhaserProperties = {
    id: string;
    currentPhase: number;
    timer: number;
    active: boolean;
    atEnd: PhaserAtEnd;
    draw: PhaserDraw;
    phases: PhaserPhases;
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
