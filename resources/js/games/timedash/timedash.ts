import {initialize, resources} from 'library/index';
import {startLevel} from './levels';

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

        // console.log(paint);

        const testCircle = {
            x: 10,
            y: 10,
            r: 50,
        };

        const testRectangle = {
            x: 20,
            y: 20,
            w: 100,
            h: 40,
        };

        paint('circle', testCircle);

        paint('rectangle', testRectangle);

        paint('line', {x1: 0, x2: 0, y1: 10, y2: 10, lw: 2});

        paint('text', {x: 0, y: 0, txt: 'blah'});

        // startLevel(1);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
