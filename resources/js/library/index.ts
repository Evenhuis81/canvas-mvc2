import {createStore} from './store';
import {getCanvas, getContext2D, setDefaults} from './canvas';
import {getEngine} from './engine';
import {getTV} from './transformedView';
import type {Engine} from './types/engine';
import type {Resources} from './types';

export const resources: Resources = {};
let id = 0;

const getResources: <T extends {withTV: boolean}>(items: LibraryResources, opt?: T) => Resources<T> = (items, opt) => {
    if (!opt) return items;

    const tv = getTV(items.context);

    return {...items, tv};
};

const properties = {
    idCount: 0,
};

export const initialize = <T extends string>(containerID?: string, resourceName?: T, tvOn?: boolean) => {
    const canvas = getCanvas();
    const context = getContext2D(canvas);
    const engine = getEngine();

    if (containerID) {
        const container = getContainer(containerID);

        setDefaults(canvas, container);
    }

    // setResources({canvas, context, engine}, );
    // const returnObj = setResources<T>({canvas, context, engine}, resourceName, tvOn);
    // if (resourceName) {
    //     const resource = store.new(resourceName, {canvas, context, engine});
    // }

    const res = getResources();
};

const setResources = <T extends string>(resource: Resource, resourceName?: T, tvOn?: boolean) => {
    const {canvas, context, engine} = resource;

    if (resourceName) {
        if (tvOn) {
            const tv = getTV(resources.context);

            const resource = createStore<T, ResourcesAndTV>();

            resource.set(resourceName, {canvas, context, engine, tv});

            return resource;
        }

        const resource = createStore<T, Resources>();

        resource.set(resourceName, {canvas, context, engine});

        return resource;
    }

    const resource = createStore<number, Resources>();

    resource.set(id++, {canvas, context, engine});

    return resource;
};

// export const runDemo = () => {
//     const {engine, context} = resources[id - 1];

//     clearOn(engine, context);

//     engine.run();

//     const update = demo.createDemoUpdate(context);
//     const show = demo.createDemoShow(context);

//     engine.setUpdate(update);
//     engine.setShow(show);

//     // New option
//     addEventListener('keydown', ({code}) => {
//         if (code === 'KeyQ') engine.halt();
//         if (code === 'KeyE') engine.run();
//         if (code === 'KeyR') engine.runOnce();
//     });
// };

export const getLibraryOptions = (resourceID: string) => {
    const {context, engine} = resources[resourceID];
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

const getContainer = (containerID: string) => {
    const container = document.getElementById(containerID);

    if (!(container instanceof HTMLDivElement)) throw new Error(`can't find div with id '${containerID}'`);

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
    name: 'clearRect',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});
