import {createContainer, getCanvas, getContainer, getContext2D, setCanvas} from './canvas';
import {createEngine} from './engine';
import {getCanvasInput} from 'library/input';
import {getCreatePhaser} from 'games/phaser/phaser'; // refactor to default export in style of 'createEntity'
import {uid} from './helpers';
import type {Engine} from './types/engine';
import type {LibraryOptions} from './types';
import {createEntity} from './entity/sketch/index';
import {createDrawings, shapes} from './entity/sketch/incoming';

export const initialize = (id?: string | number, options?: Partial<LibraryOptions>) => {
    const libraryID = id ?? uid();

    const canvas = getCanvas(options);
    const context = getContext2D(canvas);

    const engine = createEngine(libraryID);

    // Always first draw in engine setDraw
    if (options?.clear) clearOn(engine, context);
    if (options?.dotMiddle) dotOn(engine, context);

    const container = options?.containerID ? getContainer(options.containerID) : createContainer(libraryID);

    setCanvas(canvas, container, options);

    const input = getCanvasInput(canvas);

    const stats = createLibraryStatistics(engine, context, options?.engineStats);

    return {
        stats,
        canvas,
        context,
        engine,
        input,
        runEngine: () => engine.run(),
        runEngineOnce: () => engine.runOnce(),
        createPhaser: () => getCreatePhaser(engine),
        entity: createEntity(context, engine, shapes, createDrawings),
    };
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

const createLibraryStatistics = (engine: Engine, context: CanvasRenderingContext2D, activate?: boolean) => {
    const engineStatistics = activate
        ? engine.createStats(context)
        : {
              on: () => {},
              off: () => {},
          };

    // wether activate is true or false, always run on, if activate it will run the createStats on, else NOOP on
    engineStatistics.on();

    return {engine: engineStatistics};
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
