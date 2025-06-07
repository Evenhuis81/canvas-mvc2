/* eslint-disable max-lines-per-function */
import statistics from './stats/statistics';
import {BaseID} from './types';
import type {
    Engine,
    EngineDraw,
    EngineFunctionMap,
    EngineInfo,
    EngineProperties,
    EngineSet,
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

export const createEngine = (libraryID: BaseID): Engine => {
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

    const {set, unset, setUpdate, setBaseUpdate, setDraw, setBaseDraw, removeUpdate, removeDraw} =
        createSetAndRemoveUpdatesAndDraws(functions);

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

// TODO::Fix this with updateloop:
// https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#starting-stopping
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

        if (properties.stop && frame > 3) {
            cancelAnimationFrame(properties.requestID);

            properties.stop = false;
        }
    };

    return loop;
};

const defaultUpdate: Omit<UpdateOrDraw<'update'>, 'fn' | 'id'> = {
    // type: 'update',
    name: 'noUpdateName',
};

const defaultDraw: Omit<UpdateOrDraw<'draw'>, 'fn' | 'id'> = {
    // type: 'draw',
    name: 'noDrawName',
};

const createSetAndRemoveUpdatesAndDraws = (functions: EngineFunctionMap) => {
    const set: EngineSet = (type, fn) => {
        if (typeof fn === 'function') {
            const id = Symbol();

            functions[type].push({
                // type,
                id,
                name: `${type}-${id.toString()}`,
                fn,
            });

            return id;
        }

        const id = fn.id ?? Symbol();

        functions[type].push(Object.assign({id}, fn));

        return id;
    };

    const unset = (id: BaseID, type?: keyof EngineFunctionMap) => remove(id, type);

    const setDraw = (draw: EngineDraw): BaseID => {
        const id = draw.id ?? Symbol();

        functions.draw.push({...defaultDraw, ...draw, id});

        return id;
    };

    const setBaseDraw = (drawFn: EngineDraw['fn']) => {
        const id = Symbol();

        setDraw({
            id,
            name: defaultDraw.name,
            fn: drawFn,
        });

        return id;
    };

    const setUpdate = (update: EngineUpdate): BaseID => {
        const id = update.id ?? Symbol();

        functions.update.push({...defaultUpdate, ...update, id});

        return id;
    };

    const setBaseUpdate = (updateFn: EngineUpdate['fn']) => {
        const id = Symbol();

        setUpdate({
            id,
            name: defaultUpdate.name,
            fn: updateFn,
        });

        return id;
    };

    // const handle: EngineSet = (updateOrDraw, set = true) => {
    //     // TODO::Check for doubles
    //     if (set) return functions[updateOrDraw.type].push(updateOrDraw);

    //     return remove(updateOrDraw.id, updateOrDraw.type);
    // };

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
