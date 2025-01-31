// import {WithRequired} from '.';

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
export type Stroke = {
    stroke: string;
    lineWidth: number;
};

export type Circle = {
    // type: 'circle';
    radius: number;
} & Pos;
export type Rect = {
    // type: 'rect';
    w: number;
    h: number;
} & Pos;

export type Text = {
    text: string;
    textFill: string;
    // textStroke: string;
    font: string;
    fontSize: number; // becomes part of font (string literal)
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
};

export type Line = Pos2;

export type RoundRect = {
    radii: number;
} & Rect;

export type ShapeMap = {
    roundRect: RoundRect & Fill & Stroke;
    rect: Rect & Fill & Stroke;
    circle: Circle & Fill & Stroke;
    line: Line;
    text: Text;
};

// export type BaseLine = Omit<Line, 'type'>;

// export type BaseRect = {
// w: number;
// h: number;
// } & Pos;

// export type BaseCircle = Omit<Circle, 'type'>;

// export type Shape = ShapeMap[keyof ShapeMap] & EntityText;

// Convert ShapeConfig to defaultSketches and userInput sketch
// Add seperate input for text 'entity' (?), use this entity to put on top of existing default and user input sketches
// export type ShapesConfig = WithRequired<Partial<Shape>, 'type'>;

// export type ShapeMap = {
//     rectroundfillstroke: Rect & Round & Fill & Stroke;
//     circlefillstroke: Circle & Fill & Stroke;
//     rect: Rect;
//     circle: Circle;
//     line: Line & Stroke;
// };

// export type ShapeDefaults = {[Key in keyof ShapeMap]: ShapeMap[Key]};
