import {getCanvas, getContext2D, setCanvas} from './canvas';
import {getEngine} from './engine';
import {getStaticView, getTV} from './transformedView/tv';
import {getInput} from 'library/input';
import type {CanvasOptions, Resources} from './types';
import type {Engine} from './types/engine';
import {StatisticsResource} from './types/statistics';
import {getStatistics} from './statistics';

export const resources: Record<string | number, Resources> = {};
export const statisticsResource: Record<string | number, StatisticsResource> = {};

export const initialize = (id: string | number, options?: CanvasOptions) => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();

    if (options?.statistics) statisticsResource[id] = getStatistics(context, canvas);

    setCanvas(canvas, options, options?.containerID ? getContainer(options.containerID) : undefined);

    const input = getInput(canvas);
    const tv = getTV(context, input);
    const sv = getStaticView(context);

    // This HAS to be the 1st show in the engine show array
    if (options?.clear) clearOn(engine, context);

    if (options?.setShowStatistics) engine.setShow(statisticsResource.survival.show);

    resources[id] = {canvas, context, engine, sv, tv, input};

    return resources[id];
};

export const getContainer = (containerID: string) => {
    const container = document.getElementById(containerID);

    if (!(container instanceof HTMLDivElement)) throw new Error(`can't find div with id '${containerID}'`);

    return container;
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
