import button from 'library/button/button';
import {initialize, resources} from 'library/index';
import {calculatedButton, startButton} from './menu/menu';

export default {
    setup: async () => {
        initialize('survival', {
            containerID: 'container',
            full: true,
            clear: true,
            bg: '#000',
            // statistics: true,
            // setShowStatistics: true,
        });

        startLevel();
    },
    run: () => resources.survival.engine.run(),
    runOnce: () => resources.survival.engine.runOnce(),
};

const startLevel = () => {
    button.create('survival', startButton, calculatedButton);
};
