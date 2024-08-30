import {PaintShapes} from 'library/types/paint';

export const getSV = (context: CanvasRenderingContext2D, engine: Engine) => {
    const paintMethods = createPaintMethods(context);

    const paint = <K extends keyof PaintShapes>(type: K, shape: PaintShapes[K]) => {
        console.log(type);
        const fn = paintMethods[type](shape);

        engine.setShow({fn});
    };

    return {paint};
};

const createPaintMethods: (context: CanvasRenderingContext2D) => {
    [K in keyof PaintShapes]: (obj: PaintShapes[K]) => () => void;
} = ctx => ({
    // use all possible attributes for shapes, with conditional for stroke or fill
    circle: circle => () => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.fill();
    },
    rectangle: rectangle => () => {
        ctx.fillStyle = rectangle.fill;

        // console.log(rectangle.fillStyle);

        ctx.beginPath();
        ctx.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        ctx.fill();
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
});
