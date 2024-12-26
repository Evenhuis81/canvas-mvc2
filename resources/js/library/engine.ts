import statistics from './statistics';
import type {
    EngineDraw,
    EngineEvents,
    EngineInfo,
    EngineProperties,
    EngineUpdate,
    EngineUpdateConfig,
} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    updates: [],
    draws: [],
    requestID: 0,
    stop: false,
    stats: false,
    statsActive: false,
});

export const createEngine = <T extends object>(libraryID: number | string, customEvent: T) => {
    const properties = createProperties();

    const events = {
        engine: {
            timePassed: 0,
            lastTime: 0,
        },
        custom: customEvent,
    };

    const loop = createLoop(properties);

    const run = () => loop(0);

    const runOnce = () => {
        properties.stop = true;

        loop(0);
    };

    const halt = () => {
        properties.stop = true;
    };

    const {setUpdate, setDraw, removeUpdate, removeDraw} = createSetAndRemoveUpdatesAndDraws(properties);

    const info = createInfo(properties);

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

const createLoop = <T extends object>(properties: EngineProperties, events: EngineEvents<T>) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        events.engine.timePassed = timeStamp - events.engine.lastTime;

        events.engine.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of properties.updates) update.fn(events[update.eventType]);

            for (const draw of properties.draws) draw.fn(timeStamp);
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
    eventType: update.eventType ?? 'engine',
    fn: update.fn,
});

// TODO::Create a set/remove update/draw that orders according to id number (lower = first, higher = last)
const createSetAndRemoveUpdatesAndDraws = (properties: EngineProperties) => {
    const setUpdate = (update: EngineUpdate) => {
        const updateEngine = transformUpdate(update);

        properties.updates.push(updateEngine);
    };

    const setDraw = (draw: EngineDraw) => {
        if (draw.id === undefined) draw.id = 'noDrawID';
        if (!draw.name) draw.name = 'noDrawName';

        properties.draws.push(draw);
    };

    const removeUpdate = (id: number | string) => {
        const index = properties.updates.findIndex(update => update.id === id);

        if (index === -1) throw Error(`update with id '${id}' not found, nothing to remove`);

        properties.updates.splice(index, 1);
    };

    const removeDraw = (id: number | string) => {
        const index = properties.draws.findIndex(draw => draw.id === id);

        if (index === -1) throw Error(`draw with id '${id}' not found, nothing to remove`);

        properties.draws.splice(index, 1);
    };

    return {
        setUpdate,
        setDraw,
        removeUpdate,
        removeDraw,
    };
};

const createInfo = <T extends object>(props: EngineProperties, events: EngineEvents<T>) => ({
    updates: {
        length: () => props.updates.length,
        ids: () => props.updates.map(update => update.id),
    },
    draws: {
        length: () => props.draws.length,
        ids: () => props.draws.map(draw => draw.id),
    },
    time: {
        passed: () => props.events.engine.timePassed,
        last: () => props.events.engine.lastTime,
    },
});

export const createEngineStats = (
    libraryID: string | number,
    {draws, updates}: EngineInfo,
    props: EngineProperties<object>,
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
