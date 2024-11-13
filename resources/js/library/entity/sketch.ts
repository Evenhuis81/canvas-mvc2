import {ShapeMap, Shapes, ShapesConfig, Sketch} from 'library/types/entityShapes';

// export type CreateSketch = <K extends keyof ShapeMap>(type: K, shape?: ShapeMap[K]) => Sketch;

// export const createSketch: CreateSketch = (type, shape) => {
export const createSketch = (shape?: ShapesConfig) => {
    if (!shape) return {...defaultSketch};

    // const shapeCreator = createShapeCreator(shape.type, shape);

    // const sketch = {...shapeDefaults[shape.type], ...shape};

    // return sketch;
    return {...defaultSketch};
};

// Combine in 1 object or several?
const shapeDefaults: Record<keyof ShapeMap, ShapeMap[keyof ShapeMap]> = {
    rect: {
        type: 'rect',
        fill: '#000',
        stroke: '#f00',
        // textFill: '#000',
        x: 50,
        y: 50,
        w: 60,
        h: 30,
    },
    circle: {
        type: 'circle',
        fill: '#000',
        stroke: '#f00',
        // textFill: '#000',
        x: 50,
        y: 50,
        r: 25,
    },
    line: {
        type: 'line',
        // fill: '#000',
        stroke: '#f00',
        // textFill: '#000',
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100,
    },
    // text: {
    //     x: 50,
    //     y: 50,
    //     fill: '#000', // no fill = no part of Shape
    //     stroke: '#f00',
    //     type: 'text',
    //     textFill: '#f51',
    //     text: 'Default Text Text',
    //     font: 'monospace',
    //     fontSize: 16,
    //     textAlign: 'center',
    //     textBaseLine: 'middle',
    // },
};

const defaultSketch: Sketch = {
    // Shape
    type: 'rect',
    x: 300,
    y: 200,
    w: 100,
    h: 50,
    lw: 2,
    r: 5,
    stroke: '#f00',
    fill: '#000',
    // Text
    textFill: '#fff',
    text: 'Entity',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};
