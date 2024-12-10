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
