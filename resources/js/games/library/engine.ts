import {Show, Update} from 'games/tombraid/types/game';

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

    return {setUpdate, setShow, run, runOnce, halt, showOverview, updateOverview};
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

const showOverview = () => {
    console.log(shows);
};

const updateOverview = () => {
    console.log(updates);
};
