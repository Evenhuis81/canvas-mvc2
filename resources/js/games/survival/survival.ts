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
    click: {
        down: evt => {
            // console.log('down', evt);
        },
        up: evt => {
            // console.log('up', evt);
            evt.disable();
            console.log('disabled');

            setTimeout(() => {
                evt.activate();
                console.log('activated');
            }, 1200);
        },
        end: evt => {
            evt.selfDestruct();

            startSurvival();
        },
    },
};

const startSurvival = () => {
    console.log('start game');
};
