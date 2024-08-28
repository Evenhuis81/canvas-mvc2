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
        // Remove this and make Shapes more dynamic with fill or stroke properties and handle them accordingly
        ctx.fillStyle = 'green';

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    },
    rectangle: (rectangle: Rectangle) => () => {
        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.fill();
    },
    line: (line: Line) => () => {
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = line.lw;

        ctx.beginPath();
        ctx.moveTo(line.x1, line.x2);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    },
    text: (text: Txt) => () => {
        ctx.fillStyle = 'orange';

        ctx.fillText(text.txt, text.x, text.y);
    },
});
