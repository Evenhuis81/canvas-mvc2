import statistics from './statistics';
import type {
    EngineDraw,
    EngineDrawConfig,
    EngineInfo,
    EngineProperties,
    EngineUpdate,
    EngineUpdateConfig,
    EngineUpdateEvent,
    EngineUpdateEvents,
} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    requestID: 0,
    stop: false,
    stats: false,
    statsActive: false,
});

export const createEngine = (libraryID: number | string) => {
    const properties = createProperties();
    const draws: EngineDrawConfig[] = [];
    const updates: EngineUpdateConfig<keyof EngineUpdateEvents>[] = [];

    const events = {
        engine: {
            timePassed: 0,
            lastTime: 0,
        },
        custom: {
            phasePercentage: 0,
            phasePercentageReverse: 1,
        },
    };

    const loop = createLoop(properties, updates, draws, events);

    const run = () => loop(0);

    const runOnce = () => {
        properties.stop = true;

        loop(0);
    };

    const halt = () => (properties.stop = true);

    const setUpdate = <K extends keyof EngineUpdateEvents>(update: EngineUpdate<K>) => {
        const newUpdate = {...defaultUpdate, ...update};

        updates.push(newUpdate);

        // return newUpdate;
    };

    const {setDraw, removeUpdate, removeDraw} = createSetAndRemoveUpdatesAndDraws(updates, draws);

    const info = createInfo(updates, draws, events.engine);

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

const createLoop = (
    properties: EngineProperties,
    updates: EngineUpdateConfig<keyof EngineUpdateEvents>[],
    draws: EngineDrawConfig[],
    events: EngineUpdateEvents,
) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        events.engine.timePassed = timeStamp - events.engine.lastTime;

        events.engine.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of updates) update.fn(events[update.type]);

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
const createSetAndRemoveUpdatesAndDraws = (
    updates: EngineUpdateConfig<keyof EngineUpdateEvents>[],
    draws: EngineDrawConfig[],
) => {
    const setDraw = (draw: EngineDraw) => draws.push({...defaultDraw, ...draw});

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
        // setUpdate,
        setDraw,
        removeUpdate,
        removeDraw,
    };
};

const createInfo = (
    updates: EngineUpdateConfig<keyof EngineUpdateEvents>[],
    draws: EngineDrawConfig[],
    event: EngineUpdateEvent,
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
        passed: () => event.timePassed,
        last: () => event.lastTime,
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
