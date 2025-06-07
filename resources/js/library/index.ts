import {createContainer, getCanvas, getContainer, getContext2D, setCanvas} from './canvas';
import {createEngine} from './engine';
import {getCanvasInput} from 'library/input';
import {getCreatePhaser} from 'games/phaser/phaser'; // refactor to default export in style of 'createEntity'
import {uid} from './helpers';
import type {Engine, UpdateOrDraw} from './types/engine';
import type {BaseID, ImageProperties, LibraryOptions, LibraryResources} from './types';
import {entity} from './entity';
import {createDefaultSketch} from './entity/defaults/sketch';
import {createViews} from './views';

// TODO::setImages
const setImage = async (image: ImageProperties) => {
    const imagesLoaded: ImageProperties[] = [];

    image.container.src = `assets/${image.filename}`;

    await image.container.decode();

    console.log(`image ${image.id.toString()} loaded`);

    imagesLoaded.push(image);

    return imagesLoaded;
};

export const initialize = async (
    id?: string | number,
    options?: Partial<LibraryOptions>,
): Promise<LibraryResources> => {
    const libraryID = id ?? uid();
    let demoRunning = false;

    const canvas = getCanvas(options);
    const context = getContext2D(canvas);

    const engine = createEngine(libraryID);

    // Always first draw in engine draw
    if (options?.clear) clearOn(engine, context);
    if (options?.dotMiddle) dotOn(engine, context);

    let imagesLoaded: ImageProperties[] = [];
    if (options?.images) imagesLoaded = await setImage(options.images[0]);

    const container = options?.containerID ? getContainer(options.containerID) : createContainer(libraryID);

    setCanvas(canvas, container, options);

    const input = getCanvasInput(canvas, engine);

    const createElement = entity(context, engine, createDefaultSketch).create;

    const views = createViews(context, input, engine);

    // TODO::Make this an option
    views.tv.mouseInput.activate();
    views.tv.keyboardInput.activate();

    const demoUpdate = createDemoUpdate();
    const demoDraw = createDemoDraw(context);

    const demo = {
        start: (type: '2d' | '3d') => {
            if (type === '3d') {
                console.log('3d not yet implemented');

                return;
            }

            if (demoRunning) {
                console.log('2d demo is already running');

                return;
            }

            engine.set('update', demoUpdate);
            engine.set('draw', demoDraw);

            engine.run();

            demoRunning = true;
        },
        stop: () => {
            if (!demoRunning) {
                console.log('2d demo is not running');

                return;
            }

            demoRunning = false;

            engine.unset(demoDraw.id);
            engine.unset(demoUpdate.id);

            engine.halt();
        },
    };

    return {
        canvas,
        context,
        engine,
        input,
        runEngine: () => engine.run(),
        runEngineOnce: () => engine.runOnce(),
        createPhaser: () => getCreatePhaser(engine),
        createElement,
        views,
        images: imagesLoaded,
        demo,
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

const createDemoUpdate = (): Omit<UpdateOrDraw<'update'>, 'type'> => ({
    id: 'lib-2d-demo-update',
    name: 'Library 2D Demo Update',
    fn: () => {
        demoObject.x++;
    },
});

const createDemoDraw = (ctx: CanvasRenderingContext2D): Omit<UpdateOrDraw<'draw'>, 'type'> => ({
    id: 'lib-2d-demo-draw',
    name: 'Library 2D Demo Draw',
    fn: () => {
        const dob = {...demoObject};

        ctx.fillStyle = dob.fill;
        ctx.strokeStyle = dob.stroke;
        ctx.lineWidth = dob.lineWidth;

        ctx.beginPath();

        ctx.arc(dob.x, dob.y, dob.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },
});

const demoObject = {
    x: 200,
    y: 150,
    r: 20,
    stroke: '#f00',
    fill: '#00f',
    lineWidth: 1,
};
