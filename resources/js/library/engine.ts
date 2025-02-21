import statistics from './statistics';
import type {
    EngineDraw,
    EngineFunctionMap,
    EngineHandle,
    EngineInfo,
    EngineProperties,
    EngineUpdate,
    EngineUpdateEvent,
    UpdateOrDraw,
} from './types/engine';

const engineUpdateEvent = {
    timePassed: 0,
    lastTime: 0,
};

const engineProperties = {
    requestID: 0,
    stop: false,
    stats: false,
    statsActive: false,
};

export const createEngine = (libraryID: number | string) => {
    const updateEvent = {...engineUpdateEvent};
    const properties = {...engineProperties};
    const functions: EngineFunctionMap = {
        draw: [],
        update: [],
    };

    const loop = createLoop(properties, functions, updateEvent);

    const run = () => loop(0);

    const runOnce = () => {
        properties.stop = true;

        loop(0);
    };

    const halt = () => (properties.stop = true);

    const {handle, setUpdate, setDraw, removeUpdate, removeDraw} = createSetAndRemoveUpdatesAndDraws(functions);

    const info = createInfo(functions, updateEvent);

    const createStats = (context: CanvasRenderingContext2D) =>
        createEngineStats(libraryID, info, properties, context, setDraw, removeDraw);

    return {
        run,
        runOnce,
        halt,
        info,
        setUpdate,
        setDraw,
        removeUpdate,
        removeDraw,
        createStats,
    };
};

// TODO::Fix this with updateloop from https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#starting-stopping
let frame = 0;

const createLoop = (properties: EngineProperties, functions: EngineFunctionMap, event: EngineUpdateEvent) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        event.timePassed = timeStamp - event.lastTime;

        event.lastTime = timeStamp;

        // Swap these with other functions in the loop
        if (frame++ > 2) {
            for (const update of functions.update) update.fn(event);

            for (const draw of functions.draw) draw.fn(timeStamp);
        }

        properties.requestID = requestAnimationFrame(loop);

        if (properties.stop) {
            cancelAnimationFrame(properties.requestID);

            properties.stop = false;
        }
    };

    return loop;
};

const defaultUpdate: Omit<UpdateOrDraw<'update'>, 'fn'> = {
    type: 'update',
    id: 'noUpdateID',
    name: 'noUpdateName',
};

const defaultDraw: Omit<UpdateOrDraw<'draw'>, 'fn'> = {
    type: 'draw',
    id: 'noDrawID',
    name: 'noDrawName',
};

const createSetAndRemoveUpdatesAndDraws = (functions: EngineFunctionMap) => {
    const setDraw = (draw: EngineDraw) => functions.draw.push({...defaultDraw, ...draw});

    const setUpdate = (update: EngineUpdate) => functions.update.push({...defaultUpdate, ...update});

    const handle: EngineHandle = (updateOrDraw, set = true) => {
        if (set) return functions[updateOrDraw.type].push(updateOrDraw);

        removeUpdate(updateOrDraw.id);

        return;
    };

    const removeUpdate = (id: number | string) => {
        const index = functions.update.findIndex(update => update.id === id);

        if (index === -1) throw Error(`update with id '${id}' not found, nothing to remove`);

        functions.update.splice(index, 1);
    };

    const removeDraw = (id: number | string) => {
        const index = functions.draw.findIndex(draw => draw.id === id);

        if (index === -1) throw Error(`draw with id '${id}' not found, nothing to remove`);

        functions.draw.splice(index, 1);
    };

    return {
        setUpdate,
        setDraw,
        handle,
        removeUpdate,
        removeDraw,
    };
};

const createInfo = (functions: EngineFunctionMap, updateEvent: EngineUpdateEvent) => ({
    updates: {
        length: () => functions.update.length,
        ids: () => functions.update.map(update => update.id),
    },
    draws: {
        length: () => functions.draw.length,
        ids: () => functions.draw.map(draw => draw.id),
    },
    time: {
        passed: () => updateEvent.timePassed,
        last: () => updateEvent.lastTime,
    },
});

export const createEngineStats = (
    libraryID: string | number,
    {draws, updates}: EngineInfo,
    props: EngineProperties,
    context: CanvasRenderingContext2D,
    setDraw: (draw: EngineDraw) => void,
    removeDraw: (id: number | string) => void,
) => {
    const setStatistics = () => {
        statistics.create(libraryID, context, setDraw, removeDraw);
        statistics.setFn(libraryID, () => `Engine draws: ${draws.length()}`);
        statistics.setFn(libraryID, () => `Engine updates: ${updates.length()}`);
        statistics.setFn(libraryID, () => `Engine draw IDs: ${draws.ids()}`);
        statistics.setFn(libraryID, () => `Engine update IDs: ${updates.ids()}`);
    };

    const on = () => {
        if (props.statsActive) return console.log('Engine statistics are already on.');

        setStatistics();

        statistics.run(libraryID);

        props.statsActive = true;
    };

    const off = () => {
        if (props.statsActive) return console.log('Engine statistics are already off.');

        props.statsActive = false;

        statistics.destroy(libraryID);
    };

    return {on, off};
};
