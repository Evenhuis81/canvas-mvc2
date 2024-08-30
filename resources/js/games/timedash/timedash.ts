import {initialize, resources} from 'library/index';
import {testRectangle} from './levels/test-objects';

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

        // const {paint} = resources.timedash.sv;

        // paint('rectangle', testRectangle);

        addEventListener('keyup', ({code}) => {
            if (code === 'KeyZ') {
                window.open('/', '', 'popup');
            }
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
