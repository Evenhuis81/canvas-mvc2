export type Pos = {
    x: number;
    y: number;
};

export type Pos2 = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type Fill = {fill: string};
export type Stroke = {stroke: string};

export type Circle = {
    type: 'circle';
    r: number;
} & Pos;

export type Rect = {
    type: 'rect';
    w: number;
    h: number;
} & Pos;

export type EntityText = {
    type: 'text'; // usless?
    text: string;
    textFill: string;
    // textStroke?
    font: string;
    fontSize: number; // part of font (string literal)
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
} & Pos;

export type Line = {
    type: 'line';
} & Pos2;

export type Shapes = Rect | Circle | Line;

export type ShapesConfig = Partial<Shapes & Fill & Stroke>;

export type ShapeMap = {
    rect: Rect;
    circle: Circle;
    line: Line;
    // text: Text;
};

// export type SketchShapes = Required<ShapesBase> & Fill & Stroke & TextFill;

// export type Sketch = {
//     type: keyof ShapeMap;
//     lineWeight: number;
//     round: number;
// } & Required<Omit<Rect, 'type'>> &
//     Required<Omit<Text, 'type'>> &
//     Fill &
//     Stroke &
//     TextFill;
