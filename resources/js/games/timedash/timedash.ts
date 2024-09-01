import {initialize, resources} from 'library/index';
import {testRectangle} from './levels/test-objects';

export default {
    setup: async () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            contextMenu: true,
            backgroundColor: '#000',
            statistics: {
                toggleKey: 'KeyH',
            },
        });
        const {paint} = resources.timedash.sv;
        paint('rectangle', testRectangle);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
