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
    circle: circle => () => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    },
    circleFill: circle => () => {
        ctx.fillStyle = circle.fill;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    },
    circleStroke: circle => () => {
        ctx.strokeStyle = circle.stroke;
        ctx.lineWidth = circle.lw;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.stroke();
    },
    circleFillStroke: circle => () => {
        ctx.fillStyle = circle.fill;
        ctx.strokeStyle = circle.stroke;
        ctx.lineWidth = circle.lw;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },
    rectangle: rectangle => () => {
        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.fill();
    },
    rectangleFill: rectangle => () => {
        ctx.fillStyle = rectangle.fill;

        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.fill();
    },
    rectangleStroke: rectangle => () => {
        ctx.strokeStyle = rectangle.stroke;
        ctx.lineWidth = rectangle.lw;

        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.stroke();
    },
    rectangleFillStroke: rectangle => () => {
        ctx.fillStyle = rectangle.fill;
        ctx.strokeStyle = rectangle.stroke;
        ctx.lineWidth = rectangle.lw;

        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.fill();
        ctx.stroke();
    },
    line: line => () => {
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = line.lw;

        ctx.beginPath();
        ctx.moveTo(line.x1, line.x2);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    },
    text: text => () => {
        ctx.fillStyle = 'orange';

        ctx.fillText(text.txt, text.x, text.y);
    },
    textFill: text => () => {},
    textStroke: text => () => {},
    textFillStroke: text => () => {
        const font = `${text.fontSize}px ${text.font}`;

        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = text.fill;
        ctx.strokeStyle = text.stroke;
        ctx.lineWidth = text.lw;

        ctx.fillText(text.txt, text.x, text.y);
        ctx.strokeText(text.txt, text.x, text.y);
    },
});
