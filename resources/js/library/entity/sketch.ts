import {hexToRgba} from 'library/colors';
import type {EntityColorString, EntityColor, EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';
import {Rect} from 'library/types/shapes';

const colorString = {
    fill: '#650',
    stroke: '#050',
    textFill: '#f8f',
};

const colorFromType = {
    button1: {
        fill: hexToRgba(colorString.fill),
        stroke: hexToRgba(colorString.stroke),
        textFill: hexToRgba(colorString.textFill),
    },
    rect: {fill: hexToRgba(colorString.fill), stroke: hexToRgba(colorString.stroke)},
    circle: {fill: hexToRgba(colorString.fill), stroke: hexToRgba(colorString.stroke)},
    line: {stroke: hexToRgba(colorString.stroke)},
    text: {textFill: hexToRgba(colorString.textFill)},
};

const createColorFromType = (): {[K in keyof EntityShapeMap]: EntityColor[K]} => ({
    button: {
        fill: hexToRgba(colorString.fill),
        stroke: hexToRgba(colorString.stroke),
        textFill: hexToRgba(colorString.textFill),
    },
    rect: {fill: hexToRgba(colorString.fill), stroke: hexToRgba(colorString.stroke)},
    circle: {fill: hexToRgba(colorString.fill), stroke: hexToRgba(colorString.stroke)},
    line: {stroke: hexToRgba(colorString.stroke)},
    text: {textFill: hexToRgba(colorString.textFill)},
});

export const getSketchRGBAColorsFromHexString = <T extends keyof EntityShapeMap>(
    type: T,
    colorStrings: Partial<EntityColorString[T]>,
    shape?: Partial<EntityColorString[T]>,
): EntityColor[T] => {
    if (shape) for (const key in colorStrings) colorStrings[key] = shape[key] ?? colorStrings[key];

    return createColorFromType()[type];
};

export const createSketch = <T extends keyof BaseSketch>(
    type: T,
    sketchConfig?: Partial<BaseSketch[T]>,
): BaseSketch[T] & {type: T} => ({
    ...baseSketch[type],
    ...sketchConfig,
    type,
});

export const createSketch2 = <K extends keyof EntityShapeMap>(
    type: K,
    shape?: Partial<EntityShapeMap[K]>,
): EntitySketchMap[K] => {
    const sketch = {
        ...defaultSketch[type],
        ...shape,
        color: getSketchRGBAColorsFromHexString(type, colorString, shape),
    };

    return sketch;
};

export const defaultSketch: EntitySketchMap = {
    button: {
        type: 'button',
        inputType: 'rect',
        x: 100,
        y: 50,
        w: 80,
        h: 40,
        radii: 5,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 4,
        // Text Part
        text: 'Entity B1',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
        color: colorFromType['button1'],
    },
    rect: {
        type: 'rect',
        inputType: 'rect',
        x: 100,
        y: 50,
        w: 80,
        h: 40,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 2,
        color: colorFromType['rect'],
    },
    circle: {
        type: 'circle',
        inputType: 'circle',
        x: 100,
        y: 50,
        radius: 255,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 2,
        color: colorFromType['circle'],
    },
    line: {
        type: 'line',
        inputType: 'none',
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100,
        stroke: '#f00',
        lineWidth: 2,
        color: colorFromType['line'],
    },
    text: {
        type: 'text',
        inputType: 'none',
        text: 'entity text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
        color: colorFromType['text'],
    },
};

export type BaseSketch = {
    text: {
        x: number;
        y: number;
        text: string;
        textFill: string;
        font: string;
        fontSize: number;
        textAlign: CanvasTextAlign;
        textBaseLine: CanvasTextBaseline;
    };
    textPointer: BaseSketch['text'] & {
        fill: string;
        radius: number;
        position: 'left' | 'center' | 'right';
    };
};

type BaseSketchWithType = {
    text: BaseSketch['text'] & {type: 'text'};
    textPointer: BaseSketch['textPointer'] & {type: 'textPointer'};
};

const baseSketch: BaseSketch = {
    text: {
        x: 0,
        y: 0,
        text: 'entity text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
    },
    textPointer: {
        x: 0,
        y: 0,
        text: 'entity text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
        // Pointer:
        fill: '#0f0',
        radius: 0.2,
        position: 'center',
    },
};

const baseSketchWithType = {
    text: {...baseSketch.text, type: 'text'},
    textPointer: {...baseSketch.textPointer, type: 'textPointer'},
};

type EntityRect = Rect & {type: 'rect'};
type EntityRectFill = Rect & {fill: string; type: 'rectF'};
type EntityRectStroke = Rect & {stroke: string; type: 'rectS'};
type EntityRectFillStroke = Rect & {fill: string; stroke: string; type: 'rectFS'};
type EntityRectStrokeFill = Rect & {stroke: string; fill: string; type: 'rectSF'};
type EntityRectTextFill = Rect & Text & {textFill: string; fill: string; type: 'rectTF'};
type EntityRectTextStroke = Rect & Text & {textFill: string; stroke: string; type: 'rectTS'};
type EntityRectTextFillStroke = Rect & Text & {textFill: string; fill: string; stroke: string; type: 'rectTFS'};
type EntityRectTextStrokeFill = Rect & Text & {textFill: string; stroke: string; fill: string; type: 'rectTSF'};

type EntityShapMap = {
    rect: EntityRect;
    rectF: EntityRectFill;
    rectS: EntityRectStroke;
    rectFS: EntityRectFillStroke;
    rectSF: EntityRectStrokeFill;
    rectTF: EntityRectTextFill;
    rectTS: EntityRectTextStroke;
    rectTFS: EntityRectTextFillStroke;
    rectTSF: EntityRectTextStrokeFill;
};

const rectangle = {
    x: 100,
    y: 50,
    w: 30,
    h: 15,
};

let textAdjust = 1.5;
export const createBaseSketchDraw = <T extends keyof BaseSketch>(
    context: CanvasRenderingContext2D,
    sketch: BaseSketchWithType[T],
) => {
    // if (sketch.type === 'text') {
    //     sketch.fill
    // }

    const fn = () => {};

    return fn;
};

const baseSketches = {
    text: (c: CanvasRenderingContext2D, sketch: BaseSketch['text']) => {
        c.fillStyle = sketch.textFill;
        c.font = `${sketch.fontSize}px ${sketch.font}`;
        c.textAlign = sketch.textAlign;
        c.textBaseline = sketch.textBaseLine;

        c.beginPath();
        c.fillText(sketch.text, sketch.x, sketch.y + textAdjust);
    },
    textPointer: (c: CanvasRenderingContext2D, sketch: BaseSketch['textPointer']) => {
        c.fillStyle = sketch.textFill;
        c.font = `${sketch.fontSize}px ${sketch.font}`;
        c.textAlign = sketch.textAlign;
        c.textBaseline = sketch.textBaseLine;

        c.beginPath();
        c.fillText(sketch.text, sketch.x, sketch.y + textAdjust);

        // (if sketch.position === 'left') etc...
        c.beginPath();
        c.fillStyle = sketch.fill;
        c.arc(sketch.x, sketch.y, sketch.radius, 0, Math.PI * 2);
        c.fill();
    },
};
