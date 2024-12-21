import {EngineDraw, EngineUpdate} from 'library/types/engine';

type PhaserProperties = {
    currentPhase: number;
    phaserID: string;
    defaultSet: boolean;
    timer: number;
    active: string[];
    draw: EngineDraw;
    removeDraw?: RemoveDraw;
    postDraw?: PostDraw;
    statistics?: boolean;
};

type PreDraw = Function;
type PostDraw = Function;
type RemoveDraw = boolean;
type PrePhase = Function;
type PostPhase = Function;

type Duration = number;

export type Phase = [Duration, EngineUpdate['fn'], PrePhase?, PostPhase?];

export type UpdatePhases = {[K in keyof Phase]: Phase[K]}[];

export type DrawPhase = [EngineDraw, PreDraw?, PostDraw?, RemoveDraw?];
