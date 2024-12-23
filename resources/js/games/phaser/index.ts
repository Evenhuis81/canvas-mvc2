import {initialize, resources} from 'library/index';
// import {startDotDemoPhaser} from './demo/dot';
import {startDotDemoPhaser2} from './demo/dot2';

const libraryID = 'phaser';

export default {
    setup: () => {
        initialize(libraryID, {
            containerID: 'phaser-container',
            full: true,
            clear: true,
            backgroundColor: '#000',
            // dotMiddle: true,
            engineStats: false,
        });

        startDotDemoPhaser2(libraryID);
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),
};
