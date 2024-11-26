export type Phaser = {
    time: number;
    number: number;
    id: number;
    // end: number;
    // shifts: number[];
    // phases: Record<number, [string, () => void]>;
    // start: () => void;
    // setPhase: SetPhase;
};

// [name, startTime, optional update, optional draw], id = auto-set;
export type SetPhase = (phase: [string, number, Update['fn']?, Draw['fn']?]) => void;

export type PhaserPhases = Record<number, [string, number, Update['fn']?, Draw['fn']?]>;

export type CircySketch = {
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
