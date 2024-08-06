import button from 'library/button/button';
import {initialize, resources} from 'library/index';
import {ButtonOptions} from 'library/types/button';

export default {
    setup: async () => {
        initialize('survival', {containerID: 'container', full: true, clear: true, bg: '#000'});

        startLevel();
    },
    run: () => resources.survival.engine.run(),
    runOnce: () => resources.survival.engine.runOnce(),
};

const startLevel = () => {
    button.create('survival', startButton);
};

const startButton: ButtonOptions = {
    id: 'start',
    name: 'Start Button',
    w: innerWidth * 0.1,
    text: 'Start #',
    // onClickEffect: 'shrinkFadeText',
    click: {
        down: () => {
            console.log('down');
        },
        up: () => {
            console.log('up');
        },
        end: () => {
            console.log('end');
        },
    },
};
