import {getCanvas, getContext2D, setCanvas} from './canvas';
import {getEngine} from './engine';
import {getSV, getTV} from './transformedView/tv';
import {getInput} from 'library/input';
import type {CanvasOptions, Resources} from './types';
import type {Engine} from './types/engine';
import {setStatistics} from '../statistics';

export const resources: Record<string | number, Resources> = {};

export const initialize = (id: string | number, options?: CanvasOptions) => {
    const canvas = getCanvas(false);
    const context = getContext2D(canvas);
    const engine = getEngine();

    setCanvas(canvas, options);

    const input = getInput(canvas, options?.dualView);
    const tv = getTV(context, input);
    const sv = getSV(context);

    if (options?.clear) clearOn(engine, context);

    if (options?.statistics) setStatistics;

    resources[id] = {canvas, context, engine, sv, tv, input};

    return resources[id];
};

export const getLibraryOptions = (context: CanvasRenderingContext2D, engine: Engine) => {
    const setClear = () => clearOn(engine, context);
    const setDot = () => dotOn(engine, context);
    const removeClear = () => clearOff(engine);
    const removeDot = () => dotOff(engine);

    return {
        setClear,
        setDot,
        removeClear,
        removeDot,
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
    name: 'clearRect',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});
