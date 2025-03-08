export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
};

export type Circle = {
    x: number;
    y: number;
    r: number;
    fill: string;
};

export type EntitySketch<S extends keyof Shapes> = {
    draw: (c: CanvasRenderingContext2D, dT: DOMHighResTimeStamp) => void;
    shape: Shapes[S];
};

export type Shapes = {
    circle: Circle;
    rect: Rect;
};
