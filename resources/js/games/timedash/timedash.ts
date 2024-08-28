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

        // const testCircle = {
        //     x: 50,
        //     y: 50,
        //     r: 50,
        // };

        const testCircle2 = {
            x: 50,
            y: 50,
            r: 50,
            fill: 'red',
        };

        paint('circle', testCircle2);

        // resources.timedash.engine.setShow({
        //     id: 0,
        //     name: '0',
        //     fn: paintShowCircle,
        // });

        // paint('rectangle', testRectangle);

        // paint('line', {x1: 0, x2: 0, y1: 10, y2: 10, lw: 2});

        // paint('text', {x: 0, y: 0, txt: 'blah'});

        // startLevel(1);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
