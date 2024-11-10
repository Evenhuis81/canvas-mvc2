export type Position = {
    x: number;
    y: number;
};

export type Position2 = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type Fill = {
    fill: string;
};

export type Stroke = {
    stroke: string;
};

export type Circle = {
    type: 'circle';
    r: number;
    // startAngle: number;
    // endAngle: number;
    // counterclockwise: number;
} & Position;

type BaseShape = {type: string};

export type ConfigShape<T extends BaseShape> = Partial<Omit<T, 'type'>> & {type: T['type']};

export type ConfigSketch = {
    []: ConfigShape<Sketch>;
};

export type Rect = {
    type: 'rect';
    w: number;
    h: number;
} & Position;

export type Text = {
    type: 'text';
    // textStroke?
    textFill: string;
    text: string;
    font: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
} & Position;

export type Line = {
    type: 'line';
} & Position2;

export type Shapes = Rect | Circle | Text;

export type Sketch = Shapes & {text: string};

// export type ConfigShapes = Partial<Shapes>;

export type FillShapes = Shapes & Fill;
// export type ShapeMap = {
//     rect: Rect;
//     circle: Circle;
//     line: Line;
// };

// export type Shapes = {
//     [K in keyof ShapeMap]: Sketch<ShapeMap[K], K>;
// };
