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

    const run = () => loop(0);

    const runOnce = () => {
        stop = true;

        loop(0);
    };

    const halt = () => {
        stop = true;
    };

    return {setUpdate, setShow, run, runOnce, halt};
};

let timePassed = 0;
let lastTime = 0;

const loop = (timestamp: DOMHighResTimeStamp) => {
    timePassed += timestamp - lastTime;
    lastTime = timestamp;

    // console.log(timePassed);

    for (const update of updates) update();

    for (const show of shows) show();

    requestID = requestAnimationFrame(loop);

    if (stop) {
        cancelAnimationFrame(requestID);

        stop = false;
    }
};
