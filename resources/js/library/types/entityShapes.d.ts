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
    type: 'circle';
    radius: number;
} & Pos;

export type BaseRect = {
    w: number;
    h: number;
} & Pos;

export type Rect = {
    type: 'rect';
    radii: number; // border-radius
} & BaseRect;

export type EntityText = {
    type: 'text';
    text: string;
    textFill: string;
    // textStroke?
    font: string;
    fontSize: number; // part of font (string literal)
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
};

export type Line = {
    type: 'line';
} & Pos2;

export type Shapes = ShapeMap[keyof ShapeMap] & Omit<EntityText, 'type'>;

export type WithRequired<T, K extends keyof T> = T & {[Key in K]-?: T[Key]};

export type ShapesConfig = WithRequired<Partial<Shapes & Omit<EntityText, 'type'>>, 'type'>;

export type ShapeMap = {
    rect: Rect & Fill & Stroke;
    circle: Circle & Fill & Stroke;
    line: Line & Stroke;
    // text: EntityText;
};

// Create base Shapes completely naked and all required props, add type with type property in seperate Type
// Use ShapeConfig for incoming entityOptions (to create Sketch)
// Convert ShapeConfig to defaultSketches and userInput sketch
// Add seperate input for text 'entity' (?), use this entity to put on top of existing default and user input sketches

type ShapeDefaults = {[Key in keyof ShapeMap]: ShapeMap[Key]} & {text: EntityText};

// export type Sketch = Omit<EntityText, 'type'> & Rect & Fill & Stroke;
