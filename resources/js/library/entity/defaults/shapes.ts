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
};

export type ShapeMap = {
    rect: Rect;
    circle: Circle;
    text: Text;
};

type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
};

type Circle = {
    x: number;
    y: number;
    r: number;
    fill: string;
};

type Text = {
    x: number;
    y: number;
    text: string;
    textFill: string;
    // textStroke: string;
    font: string;
    fontSize: number; // becomes part of font (string literal)
    fontWeight: 'normal' | 'bold';
    textAlign: CanvasTextAlign;
    textBaseLine: CanvasTextBaseline;
};
