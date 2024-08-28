export const getSV = (context: CanvasRenderingContext2D) => {
    const paintMethods = createPaintMethods(context);

    const paint = <K extends keyof PaintShapes>(type: K, shape: PaintShapes[K]) => paintMethods[type](shape);

    return {paint};
};

const createPaintMethods = (context: CanvasRenderingContext2D) => {
    const paintMethods: {[K in keyof PaintShapes]: (obj: PaintShapes[K]) => void} = {
        circle: (circle: Circle) => {
            console.log('circle', circle);
            console.log(context);
        },
        rectangle: (rectangle: Rectangle) => {
            console.log('rectangle', rectangle);
        },
        line: (line: Line) => {
            console.log('line', line);
        },
        text: (text: Txt) => {
            console.log('text', text);
        },
    };

    return paintMethods;
};
