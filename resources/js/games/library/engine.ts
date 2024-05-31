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
        clearOn,
        clearOff,
        dotOn,
        dotOff,
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
    console.log(shows);
};

const updatesOverview = () => {
    console.log(updates);
};

const dotMiddle = (context: CanvasRenderingContext2D) => ({
    id: 99,
    name: 'dot in middle',
    fn: () => {
        context.beginPath();
        context.fillStyle = 'white';
        context.arc(context.canvas.width / 2, context.canvas.height / 2, 2, 0, Math.PI * 2);
        context.fill();
    },
});

const clear = (context: CanvasRenderingContext2D) => ({
    id: 0,
    name: 'clear screen',
    fn: () => context.clearRect(0, 0, context.canvas.width, context.canvas.height),
});

const clearOn = (context: CanvasRenderingContext2D) => {
    updates.push(clear(context));
};

const clearOff = () => {
    removeShow(0); // clear show id = 89
};

const dotOn = (context: CanvasRenderingContext2D) => {
    shows.push(dotMiddle(context));
};

const dotOff = () => {
    removeShow(99); // dot show id = 99
};
