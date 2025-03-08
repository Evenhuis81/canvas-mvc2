// type Rect = {
//     x: number;
//     y: number;
//     w: number;
//     h: number;
//     fill: string;
// };

// type Circle = {
//     x: number;
//     y: number;
//     r: number;
//     fill: string;
// };

// export type Shapes = {
//     circle: Circle;
//     rect: Rect;
// };

export const defaultShapes = {
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
};

// type Drawings = {[K in keyof Shapes]: () => () => void};

// export type CreateDrawings<Shapes extends object> = (ctx: CanvasRenderingContext2D, shapes: Shapes) => Drawings;

// This uses reference to shapes created by createSketch, check for reference keep
export const createSketch = (ctx: CanvasRenderingContext2D) => ({
    rect: () => {
        const shape = {...defaultShapes['rect']};

        const draw = () => {
            ctx.fillStyle = shape.fill;

            ctx.rect(shape.x, shape.y, shape.w, shape.h);
            ctx.fill();
        };

        return {shape, draw};
    },
    circle: () => {
        const shape = {...defaultShapes['circle']};

        const draw = () => {
            ctx.fillStyle = shape.fill;

            ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            ctx.fill();
        };

        return {shape, draw};
    },
});
