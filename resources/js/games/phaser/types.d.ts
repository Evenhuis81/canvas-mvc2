import {EngineDraw, EngineUpdate} from 'library/types/engine';

type PhaserProperties = {
    currentPhase: number;
    phaseID: string;
    defaultSet: boolean;
    timer: number;
    active: string[];
    draw: EngineDraw;
    removeDraw?: RemoveDraw;
    postDraw?: Function;
    statistics?: boolean;
};

type PreDraw = Function;
type PostDraw = Function;
type RemoveDraw = boolean;
type PrePhase = Function;
type PostPhase = Function;

// [duration, update fn, prepare fn?, postpare fn?]
export type Phase = [number, EngineUpdate['fn'], PrePhase?, PostPhase?];

export type UpdatePhases = {[K in keyof Phase]: Phase[K]}[];

export type DrawPhase = [EngineDraw, PreDraw?, PostDraw?, RemoveDraw?];

// export type PhaseConfig = [Draw, PhasePrepare?, PhasePostpare?, RemoveDraw?, ...UpdatePhases];

// type PhaseBase = {
//     name?: string;
//     timeStart: number;
// };

// type PhaseUpdate = {
//     type: 'update';
//     fn: Update['fn'];
// } & PhaseBase;

// type PhaseDraw = {
//     type: 'draw';
//     fn: Draw['fn'];
// } & PhaseBase;

// type PhaseUpdateTuple = [];
// type PhaseDrawTuple = [];

// type PhaseConfigTuple = PhaseUpdateTuple | PhaseDrawTuple;

// type PhaseConfig = PhaseUpdate | PhaseDraw;
