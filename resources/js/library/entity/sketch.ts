// import {hexToRgb} from 'library/colors';
import type {EntityColorStrings, EntityColors, EntityShapeMap, SketchColor} from 'library/types/entitySketch';

const storedColorStrings = {
    fill: '',
    stroke: '',
    textFill: '',
};

// const storedColors = {
//     fill: {a: 1, r: 50, g: 0, b: 0},
//     stroke: {a: 1, r: 0, g: 50, b: 0},
//     textFill: {a: 1, r: 255, g: 155, b: 255},
// };

// const createColorsFromType () => ({

// })

const colorsFromType = <T extends keyof EntityShapeMap>(type: T): EntityColors[T] => ({
    // button1: {fill: storedColors.fill, stroke: storedColors.stroke, textFill: storedColors.textFill},
    // rect1: {fill: storedColors.fill, stroke: storedColors.stroke},
    // circle1: {fill: storedColors.fill, stroke: storedColors.stroke},
});

export const setSketchRGBAColorsFromHexString = <T extends keyof EntityShapeMap>(
    type: T,
    shape: Partial<EntityColorStrings[T]>,
    colorStrings: Partial<EntityColorStrings[T]>,
): {colors: EntityColors[T]} => {
    for (const key in colorStrings) colorStrings[key] = shape[key];

    const colors = createColorsFromType(type);

    return {
        // ...defaultSketch[type],
        colors: colorsFromType[type](),
    };
};

export const createSketch = <K extends keyof EntityShapeMap>(
    type: K,
    shape: Partial<EntityShapeMap[K]>,
): EntityShapeMap[K] & {colors: EntityColors[K]} => {
    const colors = colorsFromType[type];

    const rr = {
        fill: '',
        stroke: '',
        textFill: '',
    };

    setSketchRGBAColorsFromHexString(type, shape, rr);

    // setSketchRGBAColorsFromHexString(type, shape);

    return {
        ...defaultSketch[type],
        ...shape,
        colors,
    };
};

const button1: EntityShapeMap['button1'] = {
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

const rect1: EntityShapeMap['rect1'] = {
    type: 'rect',
    x: 100,
    y: 50,
    w: 80,
    h: 40,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
};

const circle1: EntityShapeMap['circle1'] = {
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
    button1,
    rect1,
    circle1,
    // line,
    // text,
};
