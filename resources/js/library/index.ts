import {createContainer, getCanvas, getContainer, getContext2D, setCanvas} from './canvas';
import {getEngine} from './engine';
// import {getTV} from './views/tv';
import {getInput} from 'library/input';
import {getSV} from './views/sv';
import {uid} from './helpers';
import type {LibraryOptions, LibraryResources} from './types';

export const resources: Record<string | number, LibraryResources> = {};

export const initialize = (id?: string | number, options?: Partial<LibraryOptions>) => {
    const libraryID = id ?? uid();

    const canvas = getCanvas(options);
    const context = getContext2D(canvas);
    const engine = getEngine();

    // Always first draw in engine setDraw
    if (options?.clear) clearOn(engine, context);

    const container = options?.containerID ? getContainer(options.containerID) : createContainer(libraryID);

    setCanvas(canvas, container, options);

    const input = getInput(canvas);

    // const input = getInput(canvas, options?.dualView);
    // const tv = getTV(context, input);
    const sv = getSV(context, engine);

    resources[libraryID] = {id: libraryID, canvas, context, engine, container, sv, input};
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
    engine.setDraw(clear(context));
};

const clearOff = (engine: Engine) => {
    engine.removeDraw(0); // clear show id = 0
};

const dotOn = (engine: Engine, context: CanvasRenderingContext2D) => {
    engine.setDraw(dotMiddle(context));
};

const dotOff = (engine: Engine) => {
    engine.removeDraw(99); // dot show id = 99
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
    id: 'library-clearRect',
    name: 'clearRect',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});
