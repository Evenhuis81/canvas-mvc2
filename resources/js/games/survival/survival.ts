// import button from 'library/button/button';
import {initialize, resources} from 'library/index';
// import {calculatedStartButton, startButton} from './menu/menu';
import {levelScreen} from './level/level-select';

export default {
    setup: async () => {
        initialize('survival', {
            containerID: 'survival-container',
            full: true,
            clear: true,
            bg: '#000',
            dualView: true,
            statistics: true,
        });

        goToMenu();
    },
    run: () => resources.survival.engine.run(),
    runOnce: () => resources.survival.engine.runOnce(),
};

const goToMenu = () => {
    // Go Straight To LevelScreen (temporary)
    levelScreen();

    // button.create('survival', startButton, calculatedStartButton);
};
