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

const createLoop = (properties: EngineProperties) => {
    const loop = (time: DOMHighResTimeStamp) => {
        properties.timePassed = time - properties.lastTime;

        properties.lastTime = time;

        // if (properties.lastTime < 2000) {
        for (const update of properties.updates)
            update.fn({timePassed: properties.timePassed, lastTime: properties.lastTime});

        for (const draw of properties.draws) draw.fn();
        // }

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
    const setUpdate = (update: Update) => {
        if (!update.id) update.id = 'noID';
        if (!update.name) update.name = 'noName';

        properties.updates.push(update);
    };

    const setDraw = (draw: Draw) => {
        if (!draw.id) draw.id = 'noID';
        if (!draw.name) draw.name = 'noName';

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
        ids: () => props.draws.map(draw => draw.id),
    },
    draws: {
        length: () => props.draws.length,
        ids: () => props.updates.map(update => update.id),
    },
    time: {
        passed: () => props.timePassed,
        last: () => props.lastTime,
    },
});
