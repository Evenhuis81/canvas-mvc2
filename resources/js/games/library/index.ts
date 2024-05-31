import {Engine} from './types/engine';
import {getCanvas, getContext2D} from './canvas';
import {getEngine} from './engine';
import {getTV} from './transformedView';

export const getDefaultResource = () => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();
    const tv = getTV(context);

    tv.setDefaults(context);

    const setClear = () => clearOn(engine, context);
    const setDot = () => dotOn(engine, context);
    const removeClear = () => clearOff(engine);
    const removeDot = () => dotOff(engine);
    const setGrid = () => {};
    const removeGrid = () => {};

    return {
        canvas,
        context,
        engine,
        tv,
        options: {
            setClear,
            setDot,
            removeClear,
            removeDot,
            setGrid,
            removeGrid,
        },
    };
};

const clearOn = (engine: Engine, context: CanvasRenderingContext2D) => {
    engine.setShow(clear(context));
};

const clearOff = (engine: Engine) => {
    engine.removeShow(0); // clear show id = 0
};

const dotOn = (engine: Engine, context: CanvasRenderingContext2D) => {
    engine.setShow(dotMiddle(context));
};

const dotOff = (engine: Engine) => {
    engine.removeShow(99); // dot show id = 99
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
