import {EntityShapeMap} from 'library/types/entitySketch';

export const createSketch = <K extends keyof EntityShapeMap>(type: K) => ({
    ...defaultSketch[type],
    ...text,
});

const entityB1: EntityShapeMap['b1'] = {
    type: 'b1',
    radii: 5,
    x: 100,
    y: 50,
    w: 80,
    h: 40,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
    // Text Part
    text: 'Entity B1',
    textFill: '#fff',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};

const entityRect: EntityShapeMap['entityRect'] = {
    type: 'entityRect',
    x: 100,
    y: 50,
    w: 80,
    h: 40,
    fill: '#000',
    stroke: '#f00',
    lineWidth: 2,
};

const entityCircle: EntityShapeMap['entityCircle'] = {
    type: 'entityCircle',
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
    // line,
    // text,
};

// export const createSketch = (shape?: EntityShape) => {
//     // if (!shape) return {...defaultSketch.rect, ...textDefault};
//     if (!shape) return {...defaultSketch.rect};

//     return {
//         ...defaultSketch[shape.type],
//         // ...textDefault,
// import {ShapeMap} from 'library/types/shapes';

// const crSk = <K extends 'circle' | 'rect'>(typer: K, shaper?: Partial<Shaper<K>>): Shaper<K>[K] => {
//     if (!shaper) return {...shaperDef[typer]};

//     return {...shaperDef[typer], ...shaper[typer]};
// };

// const dk = crSk('circle', {circle: {r: 1}});

// export const createSketch = <K extends keyof ShapeMap>(type: K, shape?: Partial<ShapeMap[K]>): ShapeMap[K] => {
//     if (type === 'rect' && !shape) return {...shapeDefaults.rect, ...shapeDefaults.text};

//     return {
//         ...shapeDefaults[type],
//         ...textDefault,
//         // ...Object.fromEntries(Object.entries(shape).filter(item => Boolean(item[1]))),
//     };
// };
