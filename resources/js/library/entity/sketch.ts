import {ShapeMap} from 'library/types/shapes';

type Shaper<K extends 'circle' | 'rect'> = {
    [T in K]: Shapers[T];
};

type Shapers = {
    circle: Cc;
    rect: Rr;
};

type Rr = {
    w: string;
};

type Cc = {
    r: number;
};

const shaperDef = {
    circle: {
        r: 0,
    },
    rect: {
        w: '',
    },
};

const crSk = <K extends 'circle' | 'rect'>(typer: K, shaper?: Partial<Shaper<K>>): Shaper<K>[K] => {
    if (!shaper) return {...shaperDef[typer]};

    return {...shaperDef[typer], ...shaper[typer]};
};
// w: 0,
// if (!shaper) return;

// const t = 11;

// console.log(t);

// shaperDef[typer];

const dk = crSk('circle', {circle: {r: 1}});

export const createSketch = <K extends keyof ShapeMap>(type: K, shape?: Partial<ShapeMap[K]>): ShapeMap[K] => {
    if (type === 'rect' && !shape) return {...shapeDefaults.rect, ...shapeDefaults.text};

    return {
        ...shapeDefaults[type],
        ...textDefault,
        ...Object.fromEntries(Object.entries(shape).filter(item => Boolean(item[1]))),
    };
};

const shapeDefaults: ShapeMap = {
    rect: {
        type: 'rect',
        x: 300,
        y: 200,
        w: 100,
        h: 50,
        fill: '#000',
        stroke: '#f00',
        lineWidth: 2,
    },
    roundRect: {
        type: 'roundrect',
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

// const textDefault: Text = {
//     text: 'Entity',
//     textFill: '#fff',
//     font: 'monospace',
//     fontSize: 16,
//     textAlign: 'center',
//     textBaseLine: 'middle',
// };
