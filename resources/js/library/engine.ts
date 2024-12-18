import {Engine, EngineDraw, EngineProperties, EngineUpdate} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    updates: [],
    draws: [],
    requestID: 0,
    stop: false,
    timePassed: 0,
    lastTime: 0,
});

export const getEngine = () => {
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

    const drawAndUpdateMethods = createSetAndRemoveUpdatesAndDraws(properties);

    return {
        run,
        runOnce,
        halt,
        ...drawAndUpdateMethods,
    };
};

// TODO::Fix this with updateloop from https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#starting-stopping
let frame = 0;

const createLoop = (properties: EngineProperties) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        properties.timePassed = timeStamp - properties.lastTime;

        properties.lastTime = timeStamp;

        if (frame++ > 2) {
            for (const update of properties.updates)
                update.fn({timePassed: properties.timePassed, lastTime: properties.lastTime});

            for (const draw of properties.draws) draw.fn();
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
        info: createInfo(properties),
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
        passed: () => props.timePassed,
        last: () => props.lastTime,
    },
});

export const createEngineStats = (libraryID: string | number, info: Engine['info']) => {
    // const setStatistics = () => {
    //     statistics.create(libraryID);
    //     statistics.setFn(libraryID, () => `Engine draws: ${engine.info.draws.length()}`);
    //     statistics.setFn(libraryID, () => `Engine updates: ${engine.info.updates.length()}`);
    //     statistics.setFn(libraryID, () => `Engine draw IDs: ${engine.info.draws.ids()}`);
    //     statistics.setFn(libraryID, () => `Engine update IDs: ${engine.info.updates.ids()}`);
    // };

    // const statsOn = () => {
    //     if (props.statistics) return console.log('stats already ON!');

    //     props.statistics = true;

    //     setStatistics();

    //     statistics.run(libraryID);
    // };

    // const statsOff = () => {
    //     if (!props.statistics) return console.log('stats already OFF!');

    //     props.statistics = false;

    //     statistics.destroy(libraryID);
    // };

    return {
        engineOn: () => {
            //
        },
        engineOff: () => {
            //
        },
    };
};
