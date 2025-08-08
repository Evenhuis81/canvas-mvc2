/* eslint-disable max-lines-per-function */
import statistics from './stats/statistics';
import type {BaseID} from './types';
import type {
    Engine,
    EngineDraw,
    EngineFunctionMap,
    EngineInfo,
    EngineProperties,
    EngineSet,
    EngineUpdate,
    EngineUpdateEvent,
} from './types/engine';

const engineUpdateEvent = {
    timePassed: 0,
    lastTime: 0,
};

const engineProperties = {
    requestID: 0,
    active: false,
    stop: false,
    stats: false,
    statsActive: false,
};

export const createEngine = (libraryID: BaseID): Engine => {
    const updateEvent = {...engineUpdateEvent};
    const properties = {...engineProperties};
    const functions: EngineFunctionMap = {
        draw: [],
        update: [],
    };

    const mainLoop = createMainLoop(properties, functions, updateEvent);

    const afterPreLoop = () => {
        console.log('after pre loop');

        mainLoop(0);
    };

    const preLoop = createPreLoop(afterPreLoop);

    const run = () => {
        if (properties.active) return console.log('engine already running');

        properties.active = true;

        preLoop();
    };

    const runOnce = () => {
        properties.stop = true;

        //
    };

    const halt = () => {
        // TODO::Make this an actual halt. (now its 'stop', alternative properties to make this work, probablyy)
        if (properties.stop) {
            console.log('engine already has properties.stop = true');

            return;
        }

        properties.stop = true;
    };

    const {set, unset, setUpdate, setBaseUpdate, setDraw, setBaseDraw, removeUpdate, removeDraw} =
        createSetAndRemoveUpdatesAndDraws(functions);

    // TODO::Complete overhaul, temporarily disable this to start from most simply/simplified status
    const info = createInfo(functions, updateEvent);
    const createStats = (context: CanvasRenderingContext2D) =>
        createEngineStats(libraryID, info, properties, context, setDraw, removeDraw);

    return {
        run,
        runOnce,
        halt,
        set,
        unset,
        info,
        setUpdate,
        setBaseUpdate,
        setDraw,
        setBaseDraw,
        removeUpdate,
        removeDraw,
        createStats,
    };
};

const createPreLoop = (after: () => void) => {
    let frame = 0;

    const loop = () => {
        if (frame++ > 2) {
            after();

            return;
        }

        frame++;

        requestAnimationFrame(loop);
    };

    return loop;
};

const createMainLoop = (properties: EngineProperties, functions: EngineFunctionMap, event: EngineUpdateEvent) => {
    const loop = (timeStamp: DOMHighResTimeStamp) => {
        console.log('main loop runing');
        event.timePassed = timeStamp - event.lastTime;

        event.lastTime = timeStamp;

        for (const update of functions.update) update.fn(event);

        for (const draw of functions.draw) draw.fn(timeStamp);

        properties.requestID = requestAnimationFrame(loop);

        if (properties.stop) {
            cancelAnimationFrame(properties.requestID);

            properties.stop = false;
        }
    };

    return loop;
};

const createSetAndRemoveUpdatesAndDraws = (functions: EngineFunctionMap) => {
    const set: EngineSet = (type, fn) => {
        if (typeof fn === 'function') {
            const id = Symbol();

            functions[type].push({
                id,
                name: `${type}-${id.toString()}`,
                fn,
            });

            return id;
        }

        const id = fn.id ?? Symbol();
        functions[type].push({id, ...fn});

        return id;
    };

    const unset = (id: BaseID, type?: keyof EngineFunctionMap) => remove(id, type);

    const setDraw = (draw: EngineDraw): BaseID => {
        const id = draw.id ?? Symbol();

        functions.draw.push({name: 'noDrawName', ...draw, id});

        return id;
    };

    const setBaseDraw = (drawFn: EngineDraw['fn']) => {
        const id = Symbol();

        setDraw({
            id,
            name: 'noDrawName',
            fn: drawFn,
        });

        return id;
    };

    const setUpdate = (update: EngineUpdate): BaseID => {
        const id = update.id ?? Symbol();

        functions.update.push({name: 'noUpdateName', ...update, id});

        return id;
    };

    const setBaseUpdate = (updateFn: EngineUpdate['fn']) => {
        const id = Symbol();

        setUpdate({
            id,
            name: 'noUpdateName',
            fn: updateFn,
        });

        return id;
    };

    const removeUpdate = (id: BaseID) => remove(id, 'update');
    const removeDraw = (id: BaseID) => remove(id, 'draw');

    const remove = (id: BaseID, type?: keyof EngineFunctionMap) => {
        if (type) {
            const index = functions[type].findIndex(drawOrUpdate => drawOrUpdate.id === id);

            if (index === -1) throw Error(`${type} with id '${id.toString()}' not found, nothing removed from engine`);

            functions[type].splice(index, 1);

            return;
        }

        let index = functions.update.findIndex(update => update.id === id);
        let removeType: keyof EngineFunctionMap = 'update';

        if (index === -1) {
            removeType = 'draw';

            index = functions.draw.findIndex(dtraw => dtraw.id === id);

            if (index === -1)
                throw Error(`Update or Draw with ID '${id.toString()}' not found, nothing removed from engine`);
        }

        functions[removeType].splice(index, 1);
    };

    return {
        set,
        unset,
        setUpdate,
        setBaseUpdate,
        setDraw,
        setBaseDraw,
        // handle,
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
    libraryID: BaseID,
    {draws, updates}: EngineInfo,
    props: EngineProperties,
    context: CanvasRenderingContext2D,
    setDraw: (draw: EngineDraw) => void,
    removeDraw: (id: BaseID) => void,
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
