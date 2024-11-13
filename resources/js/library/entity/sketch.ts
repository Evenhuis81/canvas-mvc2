import {EntityText, ShapeMap, ShapesConfig, Sketch} from 'library/types/entityShapes';

export const createSketch = (shape?: ShapesConfig) => {
    if (!shape) return {...shapeDefaults.text, ...shapeDefaults.rect};

    // const shapeCreator = createShapeCreator(shape.type, shape);

    const sketch = {...shapeDefaults[shape.type], ...shapeDefaults.text, ...shape};

    return sketch;
    // return {...shapeDefaults.text, ...shapeDefaults.rect};
};

type ShapeDefaults = {[Key in keyof ShapeMap]: ShapeMap[Key]} & {text: EntityText};

// Combine in 1 object or several?
const shapeDefaults: ShapeDefaults = {
    rect: {
        type: 'rect',
        fill: '#000',
        stroke: '#f00',
        radii: 5,
        lineWidth: 2,
        x: 50,
        y: 50,
        w: 60,
        h: 30,
    },
    circle: {
        type: 'circle',
        fill: '#000',
        stroke: '#f00',
        x: 50,
        y: 50,
        radius: 25,
        lineWidth: 2,
    },
    line: {
        type: 'line',
        stroke: '#f00',
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100,
        lineWidth: 2,
    },
    text: {
        type: 'text',
        text: 'Entity',
        textFill: '#fff',
        font: 'monospace',
        fontSize: 16,
        textAlign: 'center',
        textBaseLine: 'middle',
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
    lineWidth: 2,
    radii: 5,
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
