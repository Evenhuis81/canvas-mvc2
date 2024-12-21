import statistics from './statistics';
import type {EngineDraw, EngineInfo, EngineProperties, EngineUpdate} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    updates: [],
    updateEvent: {
        timePassed: 0,
        lastTime: 0,
        phasePercentage: 0, // Linear
        phasePercentageReverse: 1,
    },
    draws: [],
    requestID: 0,
    stop: false,
    stats: false,
    statsActive: false,
});

export const createEngine = (libraryID: number | string) => {
    const properties = createProperties();

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

const createLoop = (properties: EngineProperties) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        properties.updateEvent.timePassed = timeStamp - properties.updateEvent.lastTime;

        properties.updateEvent.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of properties.updates) update.fn(properties.updateEvent);

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

// TODO::Create a set/remove update/draw that orders according to id number (lower = first, higher = last)
const createSetAndRemoveUpdatesAndDraws = (properties: EngineProperties) => {
    const setUpdate = (update: EngineUpdate) => {
        // prevents id 0 getting noID
        if (update.id === undefined) update.id = 'noUpdateID';
        if (!update.name) update.name = 'noUpdateName';

        properties.updates.push(update);
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

const createInfo = (props: EngineProperties) => ({
    updates: {
        length: () => props.updates.length,
        ids: () => props.updates.map(update => update.id),
    },
    draws: {
        length: () => props.draws.length,
        ids: () => props.draws.map(draw => draw.id),
    },
    time: {
        passed: () => props.updateEvent.timePassed,
        last: () => props.updateEvent.lastTime,
        phasePercentage: () => props.updateEvent.phasePercentage,
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
