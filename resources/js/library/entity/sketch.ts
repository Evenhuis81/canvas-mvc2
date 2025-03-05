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

export type BaseSketchWithType = {[K in keyof BaseSketch]: BaseSketch[K] & {type: K}};

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

const baseSketchWithType: BaseSketchWithType = {
    text: {...baseSketch.text, type: 'text'},
    textPointer: {...baseSketch.textPointer, type: 'textPointer'},
};

let textAdjust = 1.5;
export const createBaseSketchDraw = <T extends keyof BaseSketch>(
    context: CanvasRenderingContext2D,
    sketchType: T,
): {fn: () => void; sketch: BaseSketchWithType[T]} => {
    const {draw, sketch: newSketch} = baseSketches[sketchType](context, sketchType);

    return {
        fn: draw,
        sketch: newSketch,
    };
};

const baseSketches = {
    text: <T extends keyof BaseSketch>(c: CanvasRenderingContext2D, type: T): BaseSketchWithType[T] => {
        const sketch = {...baseSketchWithType[type]};

        const draw = () => {
            c.fillStyle = sketch.textFill;
            c.font = `${sketch.fontSize}px ${sketch.font}`;
            c.textAlign = sketch.textAlign;
            c.textBaseline = sketch.textBaseLine;

            c.beginPath();
            c.fillText(sketch.text, sketch.x, sketch.y + textAdjust);
        };

        return {draw, sketch};
    },
    textPointer: <T extends keyof BaseSketch>(c: CanvasRenderingContext2D, type: T) => {
        const sketch = {...baseSketchWithType[type]};

        const draw = () => {
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
        };

        return {draw, sketch};
    },
};
