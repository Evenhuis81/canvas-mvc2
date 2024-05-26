import {getCanvas, getContext2D} from './canvas';
import {getEngine} from './engine';
import {getTV} from './transformedView';

export const setDefaultResource = () => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();
    const tv = getTV(context);

    tv.setDefaults(context);

    const grid = tv.getGrid(context);
    const dotInMiddle = dotMiddle(context);
    const clearScreen = clear(context);

    engine.setUpdate(clearScreen);
    engine.setShow(grid.show);
    engine.setShow(dotInMiddle);

    return {canvas, context, engine, tv};
};

const dotMiddle = (context: CanvasRenderingContext2D) => ({
    id: 99,
    name: 'dot in middle',
    fn: () => {
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(context.canvas.width / 2, context.canvas.height / 2, 2, 0, Math.PI * 2);
        context.fill();
    },
});

const clear = (context: CanvasRenderingContext2D) => ({
    id: 0,
    name: 'clear screen',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});
