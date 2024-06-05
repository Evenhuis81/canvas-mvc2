import {Engine} from './types/engine';
import {getCanvas, getContext2D, setDefaults} from './canvas';
import {getEngine} from './engine';
import {resources} from './store';
import demo from './demo';

export default {
    initialize: (containerID?: string) => {
        const canvas = getCanvas();
        const context = getContext2D(canvas);
        const engine = getEngine();

        resources.set({canvas, context, engine});

        if (containerID) {
            const container = getContainer(containerID);

            setDefaults(canvas, container);
        }
    },
    runDemo: () => {
        const {engine, context} = resources.state;

        clearOn(engine, context);

        engine.run();

        const update = demo.createDemoUpdate();
        const show = demo.createDemoShow();

        engine.setUpdate(update);
        engine.setShow(show);

        // New option
        addEventListener('keydown', ({code}) => {
            if (code === 'KeyQ') engine.halt();
            if (code === 'KeyE') engine.run();
            if (code === 'KeyR') engine.runOnce();
        });
    },
};

export const getResources = () => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();

    const setClear = () => clearOn(engine, context);
    const setDot = () => dotOn(engine, context);
    const removeClear = () => clearOff(engine);
    const removeDot = () => dotOff(engine);

    return {
        canvas,
        context,
        engine,
        options: {
            setClear,
            setDot,
            removeClear,
            removeDot,
        },
    };
};

export const getContainer = (id: string) => {
    const container = document.getElementById(id);

    if (!(container instanceof HTMLDivElement)) throw new Error(`can't find div with id '${id}'`);

    return container;
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
