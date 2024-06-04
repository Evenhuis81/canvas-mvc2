import {Show, Update} from './types';

const updates: Update[] = [];
const shows: Show[] = [];
let requestID: number = 0;
let stop = false;

export const getEngine = () => {
    const run = () => loop();

    const runOnce = () => {
        stop = true;

        loop();
    };

    const halt = () => {
        stop = true;
    };

    return {
        setUpdate,
        setShow,
        run,
        runOnce,
        halt,
        showsOverview,
        updatesOverview,
        removeUpdate,
        removeShow,
    };
};

const loop = () => {
    for (const update of updates) update.fn();

    for (const show of shows) show.fn();

    requestID = requestAnimationFrame(loop);

    if (stop) {
        cancelAnimationFrame(requestID);

        stop = false;
    }
};

// Create a set/remove update/show that orders according to id number (lower = first, higher = last)
const setUpdate = (update: Update) => {
    updates.push(update);
};

const setShow = (show: Show) => {
    shows.push(show);
};

const removeUpdate = (id: number) => {
    const index = updates.findIndex(update => update.id === id);

    if (index === -1) throw Error(`update with id '${id}' not found, nothing to remove`);

    updates.splice(index, 1);
};

const removeShow = (id: number) => {
    const index = shows.findIndex(show => show.id === id);

    if (index === -1) throw Error(`show with id '${id}' not found, nothing to remove`);

    shows.splice(index, 1);
};

const showsOverview = () => {
    // eslint-disable-next-line no-console
    console.log(shows);
};

const updatesOverview = () => {
    // eslint-disable-next-line no-console
    console.log(updates);
};
