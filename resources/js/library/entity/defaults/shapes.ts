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
    pointer: {
        x: 200,
        y: 100,
        r: 10,
        fill: '#f00',
        text: 'Entity Pointer',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'start',
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
    pointer: Circle & Text & Pos;
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
