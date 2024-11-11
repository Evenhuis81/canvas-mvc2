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

export type Fill = {fill: string};

export type Stroke = {stroke: string};

export type TextFill = {textFill: string};

export type Circle = {
    type: 'circle';
    r?: number;
} & Partial<Position>;
// startAngle: number;
// endAngle: number;
// counterclockwise: number;

export type Rect = {
    type: 'rect';
    w?: number;
    h?: number;
} & Partial<Position>;

export type Text = {
    type: 'text';
    text?: string;
    font?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseLine?: CanvasTextBaseline;
} & Partial<Position>;
// textStroke?

export type Line = {
    type: 'line';
} & Partial<Position2>;

export type ShapesBase = Rect | Circle | Line | Text;

export type Shapes = ShapesBase & Partial<Fill> & Partial<Stroke> & Partial<TextFill>;

export type SketchShapes = Required<ShapesBase> & Fill & Stroke & TextFill;

export type ShapeMap = {
    rect: Rect;
    circle: Circle;
    line: Line;
    text: Text;
};

export type Sketch = {
    type: keyof ShapeMap;
    lineWeight: number;
    round: number;
} & Required<Omit<Rect, 'type'>> &
    Required<Omit<Text, 'type'>> &
    Fill &
    Stroke &
    TextFill;
