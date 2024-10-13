import {initialize, resources} from 'library/index';
import {mainMenu} from './menu';

export default {
    setup: async () => {
        initialize('tr', {
            containerID: 'container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        mainMenu();
    },
    run: () => resources.tr.engine.run(),
    runOnce: () => resources.tr.engine.runOnce(),
};
