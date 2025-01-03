import statistics from './statistics';
import type {
    EngineDraw,
    EngineDrawConfig,
    EngineInfo,
    EngineProperties,
    EngineUpdate,
    EngineUpdateConfig,
    EngineUpdateEvent,
    InternalEngineUpdateEvent,
} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    requestID: 0,
    stop: false,
    stats: false,
    statsActive: false,
});

export const createEngine = <C extends object>(libraryID: number | string, customEvent: C) => {
    const properties = createProperties();
    const draws: EngineDrawConfig[] = [];
    const updates: EngineUpdateConfig<C>[] = [];

    const engineEvent = {
        timePassed: 0,
        lastTime: 0,
    };

    const engineUpdateEvent = Object.assign(engineEvent, customEvent);

    const loop = createLoop(properties, updates, draws, engineUpdateEvent);

    const run = () => loop(0);

    const runOnce = () => {
        properties.stop = true;

        loop(0);
    };

    const halt = () => (properties.stop = true);

    const {setUpdate, setDraw, removeUpdate, removeDraw} = createSetAndRemoveUpdatesAndDraws(updates, draws);

    const info = createInfo(updates, draws, engineUpdateEvent);

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

const createLoop = <C extends object>(
    properties: EngineProperties,
    updates: EngineUpdateConfig<C>[],
    draws: EngineDrawConfig[],
    event: EngineUpdateEvent<C>,
) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        event.timePassed = timeStamp - event.lastTime;

        event.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of updates) update.fn(event);

            for (const draw of draws) draw.fn(timeStamp);
        }

        properties.requestID = requestAnimationFrame(loop);

        if (properties.stop) {
            cancelAnimationFrame(properties.requestID);

            properties.stop = false;
        }
    };

    return loop;
};

const defaultUpdate = {
    id: 'noUpdateID',
    name: 'noUpdateName',
};

const defaultDraw = {
    id: 'noDrawID',
    name: 'noDrawName',
};

// TODO::Create a set/remove update/draw that orders according to id number (lower = first, higher = last)
const createSetAndRemoveUpdatesAndDraws = <C extends object>(
    updates: EngineUpdateConfig<C>[],
    draws: EngineDrawConfig[],
) => {
    const setDraw = (draw: EngineDraw) => draws.push({...defaultDraw, ...draw});

    const setUpdate = (update: EngineUpdate<C>) => updates.push({...defaultUpdate, ...update});

    const removeUpdate = (id: number | string) => {
        const index = updates.findIndex(update => update.id === id);

        if (index === -1) throw Error(`update with id '${id}' not found, nothing to remove`);

        updates.splice(index, 1);
    };

    const removeDraw = (id: number | string) => {
        const index = draws.findIndex(draw => draw.id === id);

        if (index === -1) throw Error(`draw with id '${id}' not found, nothing to remove`);

        draws.splice(index, 1);
    };

    return {
        setUpdate,
        setDraw,
        removeUpdate,
        removeDraw,
    };
};

const createInfo = <C extends object>(
    updates: EngineUpdateConfig<C>[],
    draws: EngineDrawConfig[],
    engineUpdateEvent: InternalEngineUpdateEvent,
) => ({
    updates: {
        length: () => updates.length,
        ids: () => updates.map(update => update.id),
    },
    draws: {
        length: () => draws.length,
        ids: () => draws.map(draw => draw.id),
    },
    time: {
        passed: () => engineUpdateEvent.timePassed,
        last: () => engineUpdateEvent.lastTime,
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
