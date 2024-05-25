import {Show, Update} from './types';

const updates: Update[] = [];
const shows: Show[] = [];
let requestID: number = 0;
let stop = false;

export const getEngine = () => {
    const setUpdate = (update: Update) => {
        updates.push(update);
    };

    const setShow = (show: Show) => {
        shows.push(show);
    };

    const run = () => loop();

    const runOnce = () => {
        stop = true;

        loop();
    };

    const halt = () => {
        stop = true;
    };

    return {setUpdate, setShow, run, runOnce, halt, showsOverview, updatesOverview};
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

const showsOverview = () => {
    console.log(shows);
};

const updatesOverview = () => {
    console.log(updates);
};