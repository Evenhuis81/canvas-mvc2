import {Show, Shows, Update, Updates} from './types';

const updates: Updates = [];
const shows: Shows = [];
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

    const halt = () => {
        stop = true;
    };

    return {setUpdate, setShow, run, halt};
};

const loop = () => {
    for (const update of updates) update();

    for (const show of shows) show();

    // gameStore.state.context.clearRect(0, 0, 640, 480);

    // gameStore.state.player.update();

    // collisions(gameStore.state.player, gameStore.state.platform);

    // gameStore.state.platform.show();
    // gameStore.state.player.show();

    requestID = requestAnimationFrame(loop);

    if (stop) {
        cancelAnimationFrame(requestID);

        stop = false;
    }
};
