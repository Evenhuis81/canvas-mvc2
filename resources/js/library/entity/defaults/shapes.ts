export const defaultShapes: ShapeMap = {
    rect: {
        x: 200,
        y: 200,
        w: 50,
        h: 25,
        fill: '#c22',
    },
    circle: {
        x: 300,
        y: 150,
        r: 30,
        fill: '#c90',
    },
    text: {
        x: 10,
        y: 10,
        text: 'Entity Text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
        textBaseLine: 'middle',
    },
    'circle-pointer': {
        x: 200,
        y: 100,
        r: 10,
        fill: '#f00',
        text: 'Entity Circle Pointer',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'start',
        textBaseLine: 'middle',
    },
    'arrow-pointer': {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        r: 5,
        fill: '#0f0',
        text: 'Entity Arrow Pointer',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'center',
        textBaseLine: 'middle',
    },
};

type Pos = {
    x: number;
    y: number;
};

export type ShapeMap = {
    rect: Rect & Pos;
    circle: Circle & Pos;
    text: Text & Pos;
    'circle-pointer': Circle & Text & Pos;
    'arrow-pointer': Triangle & Circle & Text;
};

type Triangle = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
};

type Rect = {
    w: number;
    h: number;
    fill: string;
};

type Circle = {
    r: number;
    fill: string;
};

type Text = {
    text: string;
    textFill: string;
    // textStroke: string;
    font: string;
    fontSize: number; // becomes part of font (string literal)
    fontWeight: 'normal' | 'bold';
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
};
