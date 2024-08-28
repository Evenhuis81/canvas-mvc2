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

        startLevel(1);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
