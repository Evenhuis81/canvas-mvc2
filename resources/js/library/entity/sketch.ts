import {EntityShapeMap} from 'library/types/entitySketch';

// const createDefaultSketch = <K extends keyof EntityShapeMap>(type: K) => ({...defaultSketch[type]});

// type ShapeInc<K extends keyof EntityShapeMap> = WithRequired<Partial<EntityShapeMap[K]>, 'type'>;

export const createSketch = <K extends keyof EntityShapeMap>(
    type: K,
    shape?: Partial<EntityShapeMap[K]>,
): EntityShapeMap[K] => ({
    ...defaultSketch[type],
    ...shape,
    type,
});

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
