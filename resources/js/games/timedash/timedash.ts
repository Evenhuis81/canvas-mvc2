import {initialize, resources} from 'library/index';
import getEntity from 'library/entity';

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

        const entity = getEntity('timedash');

        const example1 = entity.create();

        // example1.show();
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
