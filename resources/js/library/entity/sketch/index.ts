import {initialize} from 'library/index';

const createShapes = () => ({
    rect: {
        x: 200,
        y: 200,
        w: 50,
        h: 25,
        fill: '#c22',
    },
    circle: {
        x: 300,
        y: 150,
        r: 30,
        fill: '#c90',
    },
});

const createDraws = (c: CanvasRenderingContext2D, s: Shapes) => ({
    rect: () => {
        const shape = s['rect'];

        const draw = () => {
            c.fillStyle = shape.fill;

            // c.beginPath();
            c.rect(shape.x, shape.y, shape.w, shape.h);
            c.fill();
        };

        return draw;
    },
    circle: () => {
        const shape = s['circle'];

        const draw = () => {
            c.fillStyle = shape.fill;

            // c.beginPath();
            c.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            c.fill();
        };

        return draw;
    },
});

type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
};

type Circle = {
    x: number;
    y: number;
    r: number;
    fill: string;
};

type EntitySketch<S extends keyof Shapes> = {
    draw: (c: CanvasRenderingContext2D, dT: DOMHighResTimeStamp) => void;
    shape: Shapes[S];
};

type Shapes = {
    circle: Circle;
    rect: Rect;
};

const createSketch = <T extends keyof Shapes>(type: T, c: CanvasRenderingContext2D): EntitySketch<T> => {
    const shapes = createShapes();
    const draws = createDraws(c, shapes);

    return {
        draw: draws[type],
        shape: shapes[type],
    };
};

const library = initialize();

const rr = createSketch('rect', library.context);

const cc = createSketch('circle', library.context);
