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
    radius: number;
} & Pos;
export type Rect = {
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
    roundRect: RoundRect &
        Fill &
        Stroke & {
            type: 'roundrect';
        };
    rect: Rect &
        Fill &
        Stroke & {
            type: 'rect';
        };
    circle: Circle &
        Fill &
        Stroke & {
            type: 'circle';
        };
    line: Line &
        Stroke & {
            type: 'line';
        };
    text: Text & {
        type: 'text';
    };
};
