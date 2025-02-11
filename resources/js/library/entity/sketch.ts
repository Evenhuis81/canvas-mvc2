import {hexToRgb} from 'library/colors';
import type {EntityColors, EntityShapeMap} from 'library/types/entitySketch';

const storedColors = {
    fill: {a: 1, r: 50, g: 0, b: 0},
    stroke: {a: 1, r: 0, g: 50, b: 0},
    textFill: {a: 1, r: 255, g: 155, b: 255},
};

const colorsFromType = {
    entityRect: {fill: storedColors.fill, stroke: storedColors.stroke},
    entityCircle: {fill: storedColors.fill, stroke: storedColors.stroke},
    b1: {fill: storedColors.fill, stroke: storedColors.stroke, textFill: storedColors.textFill},
};

type SketchColor = 'fill' | 'stroke' | 'textFill';

type IncSketchC = Partial<SketchColorMap<SketchColor>>;

type SketchColorMap<T extends SketchColor> = {
    [K in T]: string;
};

export const getSketchRGBAColorsFromHexString = <K extends keyof EntityShapeMap, T extends SketchColor>(
    type: K,
    colors: SketchColorMap<T>,
): EntityColors[K] => {
    for (const key in colors) storedColors[key] = {a: 1, ...hexToRgb(colors[key])};

    return colorsFromType[type];
};

export const createSketch = <K extends keyof EntityShapeMap>(type: K, shape: EntityShapeMap[K]): void => {
    // ): EntityShapeMap[K] & {colors: EntityColors[K]} => {
    // const colors = getSketchRGBAColorsFromHexString(type, shape);

    const sketch = {
        ...defaultSketch[type],
        ...shape,
        type,
        // colors,
    };

    // return sketch;
};

const entityB1: EntityShapeMap['b1'] = {
    type: 'rect',
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
};

const entityRect: EntityShapeMap['entityRect'] = {
    type: 'rect',
    x: 100,
    y: 50,
    w: 80,
    h: 40,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
};

const entityCircle: EntityShapeMap['entityCircle'] = {
    type: 'circle',
    x: 100,
    y: 50,
    radius: 255,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
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

export const defaultSketch = {
    b1: entityB1,
    entityRect,
    entityCircle,
    line,
    text,
};
