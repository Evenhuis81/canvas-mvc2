import {hexToRgba} from 'library/colors';
import type {EntityColorString, EntityColor, EntityShapeMap, EntitySketchMap} from 'library/types/entitySketch';

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
    button1: {
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

export const createSketch = <K extends keyof EntityShapeMap>(
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
    button1: {
        type: 'button1',
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
        text: 'entity text',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
        color: colorFromType['text'],
    },
};
