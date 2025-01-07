import {initialize, resources} from 'library/index';
// import {startDotDemoPhaser} from './demo/dot';
import {startDotDemoPhaser2} from './demo/dot2';
import {LibraryOptions} from 'library/types';

const libraryID = 'phaser';

export default {
    setup: () => {
        initialize(libraryID, libraryOptions);

        startDotDemoPhaser2(libraryID);
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),
};

const libraryOptions: Partial<LibraryOptions> = {
    containerID: 'phaser-container',
    full: true,
    clear: true,
    backgroundColor: '#000',
    // engineStats: true,
};
