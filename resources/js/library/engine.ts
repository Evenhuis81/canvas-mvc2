import {Show, Update} from 'types/game';

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
        loop();

        stop = true;
    };

    const halt = () => {
        stop = true;
    };

    return {setUpdate, setShow, run, runOnce, halt};
};

const loop = () => {
    for (const update of updates) update();

    for (const show of shows) show();

    requestID = requestAnimationFrame(loop);

    if (stop) {
        cancelAnimationFrame(requestID);

        stop = false;
    }
};
