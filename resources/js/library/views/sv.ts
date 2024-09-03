export const getSV = (context: CanvasRenderingContext2D, engine: Engine) => {
    const paintMethods = createPaintMethods(context);

    const paint: Paint = (type, shape) => {
        const fn = paintMethods[type](shape);

        engine.setShow({fn});
    };

    return {paint};
};

const createPaintMethods: (context: CanvasRenderingContext2D) => {
    [K in keyof Shapes]: (obj: FullShape<Shapes[K]>) => () => void;
} = ctx => ({
    circle: circle => () => {
        if (circle.lw) ctx.lineWidth = circle.lw;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
        if (circle.fill) {
            ctx.fillStyle = circle.fill;
            ctx.fill();
        }
        if (circle.stroke) {
            ctx.strokeStyle = circle.stroke;
            ctx.stroke();
        }
    },
    rectangle: rectangle => () => {
        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        if (rectangle.fill) {
            ctx.fillStyle = rectangle.fill;
            ctx.fill();
        }
        if (rectangle.stroke) {
            ctx.strokeStyle = rectangle.stroke;
            ctx.stroke();
        }
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
        if (text.font || text.fontSize) ctx.font = `${text.fontSize ?? 16}px ${text.font ?? 'monospace arial'}`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (text.fill) {
            ctx.fillStyle = text.fill;
            ctx.fillText(text.txt, text.x, text.y);
        }
        if (text.stroke) {
            ctx.strokeStyle = text.stroke;
            ctx.strokeText(text.txt, text.x, text.y);
        }
    },
});
