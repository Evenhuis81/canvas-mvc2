import {initialize, resources} from 'library/index';
import {CanvasOptions} from 'library/types';

const canvasOptions: CanvasOptions = {full: true, clear: true, containerID: 'container', bg: '#000'};

export default {
    setup: () => {
        initialize('train', canvasOptions);
    },
    run: () => resources.train.engine.run(),
    runOnce: () => resources.train.engine.runOnce(),
};
