import {hexToRgba} from 'library/colors';
import type {EntityColorStrings, EntityColors, EntityShapeMap, EntityShapeMapReturn} from 'library/types/entitySketch';

const colorStrings = {
    fill: '#650',
    stroke: '#050',
    textFill: '#f8f',
};

const colorsFromType2 = {
    button1: {
        fill: hexToRgba(colorStrings.fill),
        stroke: hexToRgba(colorStrings.stroke),
        textFill: hexToRgba(colorStrings.textFill),
    },
    rect1: {fill: hexToRgba(colorStrings.fill), stroke: hexToRgba(colorStrings.stroke)},
    circle1: {fill: hexToRgba(colorStrings.fill), stroke: hexToRgba(colorStrings.stroke)},
};

const colorsFromType = (): {[K in keyof EntityShapeMap]: EntityColors[K]} => ({
    button1: {
        fill: hexToRgba(colorStrings.fill),
        stroke: hexToRgba(colorStrings.stroke),
        textFill: hexToRgba(colorStrings.textFill),
    },
    rect1: {fill: hexToRgba(colorStrings.fill), stroke: hexToRgba(colorStrings.stroke)},
    circle1: {fill: hexToRgba(colorStrings.fill), stroke: hexToRgba(colorStrings.stroke)},
});

export const getSketchRGBAColorsFromHexString = <T extends keyof EntityShapeMap>(
    type: T,
    colorStrings: Partial<EntityColorStrings[T]>,
    shape?: Partial<EntityColorStrings[T]>,
): EntityColors[T] => {
    if (shape) for (const key in colorStrings) colorStrings[key] = shape[key] ?? colorStrings[key];

    return colorsFromType()[type];
};

export const createSketch = <K extends keyof EntityShapeMap>(
    type: K,
    shape?: Partial<EntityShapeMap[K]>,
): EntityShapeMapReturn<K>[K] => {
    const sketch = {
        ...defaultSketch[type],
        ...shape,
        colors: getSketchRGBAColorsFromHexString(type, colorStrings, shape),
    };

    return sketch;
};

const button1: EntityShapeMapReturn<'button1'>['button1'] = {
    type: 'button1',
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
    colors: colorsFromType2['button1'],
};

const rect1: EntityShapeMapReturn<'rect1'>['rect1'] = {
    type: 'rect1',
    x: 100,
    y: 50,
    w: 80,
    h: 40,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
    colors: colorsFromType2['rect1'],
};

const circle1 = {
    type: 'circle1',
    x: 100,
    y: 50,
    radius: 255,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
    colors: colorsFromType2['circle1'],
};

const line = {
    x1: 50,
    y1: 50,
    x2: 100,
    y2: 100,
    stroke: '#f00',
    lineWidth: 2,
};

const text = {
    textFill: '#fff',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};

export const defaultSketch: EntityShapeMapReturn<keyof EntityShapeMap> = {
    button1: {...button1},
    rect1: {...circle1},
    circle1: {...circle1},
    // line,
    // text,
};
