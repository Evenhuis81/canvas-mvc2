import {initialize, resources} from 'library/index';
import createEntity from '../entity/';

export default {
    setup: async () => {
        initialize('test', {
            containerID: 'test-container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        const entity = createEntity('test');

        console.log(entity);
    },
    run: () => resources.test.engine.run(),
    runOnce: () => resources.test.engine.runOnce(),
};
