import button from 'library/button/button';
import {initialize, resources} from 'library/index';

export default {
    setup: async () => {
        initialize('surv', {containerID: 'container', full: true, clear: true, bg: '#000'});

        startLevel();
    },
    run: () => resources.surv.engine.run(),
    runOnce: () => resources.surv.engine.runOnce(),
};

const startLevel = () => {
    button.create('surv');
};
