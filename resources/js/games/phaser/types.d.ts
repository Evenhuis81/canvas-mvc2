import {EngineDraw, EngineUpdate} from 'library/types/engine';

type PhaserProperties = {
    currentPhase: number;
    phaseID: string;
    defaultSet: boolean;
    timer: number;
    active: string[];
    draw: EngineDraw;
    removeDraw?: RemoveDraw;
    postDraw?: PostDraw;
    statistics?: boolean;
};

// export type PhaserUpdateEvent = {
//     perc: number;
// };

type PreDraw = Function;
type PostDraw = Function;
type RemoveDraw = boolean;
type PrePhase = Function;
type PostPhase = Function;

// [duration, update fn, prepare fn?, postpare fn?]
export type Phase = [number, EngineUpdate['fn'], PrePhase?, PostPhase?];

export type UpdatePhases = {[K in keyof Phase]: Phase[K]}[];

export type DrawPhase = [EngineDraw, PreDraw?, PostDraw?, RemoveDraw?];
