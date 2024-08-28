export const getSV = (context: CanvasRenderingContext2D, engine: Engine) => {
    const paintMethods = createPaintMethods(context);

    const paint = <K extends keyof PaintShapes>(type: K, shape: PaintShapes[K]) => {
        const fn = paintMethods[type](shape);

        engine.setShow({fn});
    };

    return {paint};
};

const createPaintMethods: (context: CanvasRenderingContext2D) => {
    [K in keyof PaintShapes]: (obj: PaintShapes[K]) => () => void;
} = ctx => ({
    circle: (circle: Circle) => () => {
        ctx.beginPath();

        // Remove this and make Shapes more dynamic with fill or stroke properties and handle them accordingly
        ctx.fillStyle = 'green';

        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    },
    rectangle: (rectangle: Rectangle) => () => {},
    line: (line: Line) => () => {},
    text: (text: Txt) => () => {},
});
