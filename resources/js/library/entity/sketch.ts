import {ShapeDefaults, ShapesConfig} from 'library/types/entityShapes';

export const createSketch = (shape?: ShapesConfig) => {
    if (!shape) return {...shapeDefaults.text, ...shapeDefaults.rect};

    const sketch = {...shapeDefaults[shape.type], ...shapeDefaults.text, ...shape};

    return sketch;
};

// Combine in 1 object or several?
const shapeDefaults: ShapeDefaults = {
    rect: {
        type: 'rect',
        x: 300,
        y: 200,
        w: 100,
        h: 50,
        fill: '#000',
        stroke: '#f00',
        radii: 5,
        lineWidth: 2,
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
};
