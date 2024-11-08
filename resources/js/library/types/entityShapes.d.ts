type Position = {
    x: number;
    y: number;
};

type Fill = {
    fill: string;
};

type Stroke = {
    lw: number;
    stroke: string;
};

// TODO::Create abbreviations for some of these properties
type BaseCircle = {
    radius: number;
    startAngle: number;
    endAngle: number;
    counterclockwise: number;
};

type BaseRect = {
    w: number;
    h: number;
    round: number;
};

type BaseSketch<T, U> = {
    [K in keyof T]?: T[K];
} & {
    type: U;
};

type BaseText = {
    // textStroke?
    textFill: string;
    text: string;
    font: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
};

type Shape = {
    rect: Rect;
    circle: Circle;
};

type Shapes = {
    [K in keyof Shape]: Position & BaseSketch<Shape[K], K>;
};

type Sketches = Rect | Circle;
