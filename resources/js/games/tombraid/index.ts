import {initialize, resources} from 'library/index';
import {goToMenu} from './menu';

export default {
    setup: async () => {
        const ress = initialize('tr', {
            containerID: 'container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        goToMenu();
    },
    run: () => resources.tr.engine.run(),
    runOnce: () => resources.tr.engine.runOnce(),
};
