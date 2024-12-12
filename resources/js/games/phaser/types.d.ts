type CircySketch = {
    x: number;
    y: number;
    lineWidth: number;
    fillStyle: string;
    strokeStyle: string;
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: boolean;
};

type PhaserProperties = {
    currentPhase: number;
    currentPhaseID: string;
    timer: number;
    active: string[];
    draw: Draw;
    removeDraw: boolean;
    postDraw: Function | undefined;
};

type PreDraw = Function;
type PostDraw = Function;
type RemoveDraw = boolean;
type PrePhase = Function;
type PostPhase = Function;

// [duration, update fn, prepare fn?, postpare fn?]
type Phase = [number, Update['fn'], PrePhase?, PostPhase?];

export type UpdatePhases = {[K in keyof Phase]: Phase[K]}[];

export type DrawPhase = [Draw, PreDraw?, PostDraw?, RemoveDraw?];

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
