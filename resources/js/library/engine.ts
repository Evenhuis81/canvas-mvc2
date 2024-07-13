import type {EngineProperties, Show, Update} from './types/engine';

const createProperties: () => EngineProperties = () => ({
    updates: [],
    shows: [],
    requestID: 0,
    stop: false,
});

export const getEngine = () => {
    const properties = createProperties();

    const loop = createLoop(properties);

    const run = () => loop();

    const runOnce = () => {
        properties.stop = true;

        loop();
    };

    const halt = () => {
        properties.stop = true;
    };

    const showAndUpdateMethods = createSetAndRemoveUpdatesAndShows(properties);

    return {
        run,
        runOnce,
        halt,
        ...showAndUpdateMethods,
    };
};

const createLoop = (properties: EngineProperties) => {
    const loop = () => {
        for (const update of properties.updates) update.fn();

        for (const show of properties.shows) show.fn();

        properties.requestID = requestAnimationFrame(loop);

        if (properties.stop) {
            cancelAnimationFrame(properties.requestID);

            properties.stop = false;
        }
    };

    return loop;
};

// TODO::Create a set/remove update/show that orders according to id number (lower = first, higher = last)
const createSetAndRemoveUpdatesAndShows = (properties: EngineProperties) => {
    const setUpdate = (update: Update) => {
        if (!update.id) update.id = 'noID';
        if (!update.name) update.name = 'noName';

        properties.updates.push(update);
    };

    const setShow = (show: Show) => {
        if (!show.id) show.id = 'noID';
        if (!show.name) show.name = 'noName';

        properties.shows.push(show);
    };

    const removeUpdate = (id: number | string) => {
        const index = properties.updates.findIndex(update => update.id === id);

        if (index === -1) throw Error(`update with id '${id}' not found, nothing to remove`);

        properties.updates.splice(index, 1);
    };

    const removeShow = (id: number | string) => {
        const index = properties.shows.findIndex(show => show.id === id);

        if (index === -1) throw Error(`show with id '${id}' not found, nothing to remove`);

        properties.shows.splice(index, 1);
    };

    return {setUpdate, setShow, removeUpdate, removeShow};
};
