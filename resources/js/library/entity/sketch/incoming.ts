import type {Shapes} from './types';

export const createShape = () => ({
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

// This uses reference to shapes created by createSketch, check for reference keep
export const createDraw = (c: CanvasRenderingContext2D, shapes: Shapes) => ({
    rect: () => {
        const shape = shapes['rect'];

        const draw = () => {
            c.fillStyle = shape.fill;

            c.rect(shape.x, shape.y, shape.w, shape.h);
            c.fill();
        };

        return draw;
    },
    circle: () => {
        const shape = shapes['circle'];

        const draw = () => {
            c.fillStyle = shape.fill;

            c.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            c.fill();
        };

        return draw;
    },
});
