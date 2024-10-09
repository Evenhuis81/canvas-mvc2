import {initialize, resources} from 'library/index';
import {runDemo} from '.';

// const canvasOptions = {full: true, clear: true, containerID: 'container', backg: '#000'};

export default {
    setup: () => {
        initialize('train', {
            full: true,
            clear: true,
            containerID: 'container',
            backgroundColor: '#000',
        });

        runDemo(resources.train);
        // const map = createMap();
    },
    run: () => resources.train.engine.run(),
    runOnce: () => resources.train.engine.runOnce(),
};
