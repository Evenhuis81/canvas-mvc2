import {EntityText, ShapeDefaults, ShapesConfig} from 'library/types/shapes';

export const createSketch = (shape?: ShapesConfig) => {
    if (!shape) return {...shapeDefaults.rect, ...textDefault};

    return {
        ...shapeDefaults[shape.type],
        ...textDefault,
        ...Object.fromEntries(Object.entries(shape).filter(item => Boolean(item[1]))),
    };
};

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
};

const textDefault: Omit<EntityText, 'type'> = {
    text: 'Entity',
    textFill: '#fff',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};
