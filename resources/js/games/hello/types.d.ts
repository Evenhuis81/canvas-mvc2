export type Phaser = {
    // timer: {
    //     last: number;
    //     passed: number;
    //     distance: number;
    // };
    time: number;
    number: number;
    end: number;
    shifts: number[];
    phases: Record<number, [string, () => void]>;
    start: () => void;
};

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
