import {initialize, resources} from 'library/index';
// import {startLevel} from './levels';

export default {
    setup: async () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            bg: '#000',
            statistics: {
                overlay: true,
                toggleKey: 'KeyH',
            },
        });

        const {paint} = resources.timedash.sv;

        paint('circle', testCircle2);
        paint('rectangle', testRectangle);
        paint('line', testLine);
        paint('text', testText);

        // startLevel(1);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};

const testCircle2 = {
    x: 50,
    y: 50,
    r: 50,
    fill: 'red',
};

const testLine = {
    x1: 400,
    y1: 200,
    x2: 200,
    y2: 250,
    lw: 5,
};

const testRectangle = {
    x: 100,
    y: 100,
    w: 80,
    h: 40,
};

const testText = {
    x: 300,
    y: 200,
    txt: 'Test Text',
};
