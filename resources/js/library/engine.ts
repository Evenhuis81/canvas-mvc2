import statistics from './statistics';
import type {
    EngineDraw,
    EngineDrawConfig,
    EngineInfo,
    EngineProperties,
    EngineUpdate,
    EngineUpdateConfig,
    EngineUpdateCustomEvent,
    EngineUpdateEvent,
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
    const updates: EngineUpdateConfig[] = [];

    const events = {
        engine: {
            timePassed: 0,
            lastTime: 0,
        },
    };

    const loop = createLoop(properties, updates, draws, events);

    const run = () => loop(0);

    const runOnce = () => {
        properties.stop = true;

        loop(0);
    };

    const halt = () => {
        properties.stop = true;
    };

    const {setUpdate, setDraw, removeUpdate, removeDraw} = createSetAndRemoveUpdatesAndDraws(updates, draws);

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
    updates: EngineUpdateConfig[],
    draws: EngineDrawConfig[],
    events: {engine: EngineUpdateEvent},
) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        events.engine.timePassed = timeStamp - events.engine.lastTime;

        events.engine.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of updates) update.fn(events.engine);

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

// prevents id 0 getting noID
// if (!update.id) update.id = 'noUpdateID';
// if (!update.name) update.name = 'noUpdateName';
// if (!update.event) update.event = 'updateEvent';
const transformUpdate = (update: EngineUpdate): EngineUpdateConfig => ({
    id: update.id ?? 'noUpdateID',
    name: update.name ?? 'noUpdateName',
    // eventType: update.eventType ?? 'engine',
    fn: update.fn,
});

// TODO::Create a set/remove update/draw that orders according to id number (lower = first, higher = last)
const createSetAndRemoveUpdatesAndDraws = (updates: EngineUpdateConfig[], draws: EngineDrawConfig[]) => {
    const setUpdate = (update: EngineUpdate) => {
        const updateEngine = transformUpdate(update);

        updates.push(updateEngine);
    };

    const setDraw = (draw: EngineDraw) => {
        if (draw.id === undefined) draw.id = 'noDrawID';
        if (!draw.name) draw.name = 'noDrawName';

        draws.push(draw);
    };

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

const createInfo = (updates: EngineUpdateConfig[], draws: EngineDrawConfig[], event: EngineUpdateEvent) => ({
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
        statistics.create(libraryID, context, setDraw, removeDraw); // This uses libraryID for resources, refactor to use unique-stat-ID ?
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
