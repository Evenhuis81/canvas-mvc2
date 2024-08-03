import {initialize, resources} from 'library/index';
import {CanvasOptions} from 'library/types';
import {createMap} from './map';

const canvasOptions: CanvasOptions = {full: true, clear: true, containerID: 'container', bg: '#000'};

export default {
    setup: () => {
        initialize('train', canvasOptions);

        const map = createMap();
    },
    run: () => resources.train.engine.run(),
    runOnce: () => resources.train.engine.runOnce(),
};
