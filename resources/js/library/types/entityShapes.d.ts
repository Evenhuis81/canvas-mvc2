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
    textFill?: string;
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

export type Shapes = Rect | Circle | Line | Text;

// export type Sketch = Shapes & {text: string};

// export type FillShapes = Shapes & Fill;

export type ShapeMap = {
    rect: Rect;
    circle: Circle;
    line: Line;
    text: Text;
};

// export type ConfigShape<T extends BaseShape> = Partial<Omit<T, 'type'>> & {type: T['type']};

// export type ConfigSketch = {
//     []: ConfigShape<Sketch>;
// };

// export type ShapeTypes = keyof ShapeMap;

// export type ConfigShape<S extends {type: Shapes['type']}> = Omit<Partial<S>, 'type'> & Pick<S, 'type'>;

// export type ConfigShapes = {
//     [K in ShapeMap]
// }

// export type MS<Type> = {
//     [Property in keyof Type extends 'type' ? ]: Property extends 'type' ? Type[Property] : Type[Property];
// };

export type Sketch = {
    // Shape
    type: keyof ShapeMap;
    x: number;
    y: number;
    w: number;
    h: number;
    lw: number;
    r: number;
    stroke: string;
    fill: string;
    // Text
    textFill: string;
    text: string;
    font: string;
    fontsize: string;
    textAlign: string; // check what type these are
    textBaseLine: string;
};
