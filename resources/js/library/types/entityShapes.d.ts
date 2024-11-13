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
    // type: 'text'; // usless?
    text: string;
    textFill: string;
    // textStroke?
    font: string;
    fontSize: number; // part of font (string literal)
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
    // Additional non-text properties
    lw: number;
    r: number; // for roundRect
};

export type Line = {
    type: 'line';
} & Pos2;

export type Shapes = Rect | Circle | Line;

export type WithRequired<T, K extends keyof T> = T & {[Key in K]-?: T[Key]};

export type ShapesConfig = WithRequired<Partial<Shapes & Fill & Stroke>, 'type'>;

export type ShapeMap = {
    rect: Rect & Fill & Stroke;
    circle: Circle & Fill & Stroke;
    line: Line & Stroke;
    // text: Text;
};

export type Sketch = Rect & EntityText & Fill & Stroke;

// export type Sketch = {
//     type: keyof ShapeMap;
//     lineWeight: number;
//     round: number;
// } & Required<Omit<Rect, 'type'>> &
//     Required<Omit<Text, 'type'>> &
//     Fill &
//     Stroke &
//     TextFill;
