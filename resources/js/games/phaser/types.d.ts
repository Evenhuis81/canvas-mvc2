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

// [name, timeStart, optional update, optional draw]

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
