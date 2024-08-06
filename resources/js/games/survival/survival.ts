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
    text: 'Start Level #',
    onClickEffect: 'shrinkFadeText',
    // Optional to have onclick and on transition end etc. Different hooks for different purposes
    click: () => {
        console.log('click function on start button properties');
    },
};
