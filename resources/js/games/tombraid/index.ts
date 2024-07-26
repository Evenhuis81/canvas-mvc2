import {initialize, resources} from 'library/index';
import {goToMenu} from './menu';

export default {
    setup: async () => {
        const reso = initialize('tr', {containerID: 'container', full: true, clear: true, bg: '#000'});

        goToMenu();
    },
    run: () => resources.tr.engine.run(),
    runOnce: () => resources.tr.engine.runOnce(),
};
