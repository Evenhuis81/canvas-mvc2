import {initialize, resources} from 'library/index';
import {getCircy} from './circy';

const libraryID = 'phaser';

export default {
    setup: () => {
        initialize(libraryID, {
            containerID: 'phaser-container',
            full: true,
            clear: true, // Display draw in statistics
            backgroundColor: '#000',
        });

        // Demo module for Phaser
        const circy = getCircy(libraryID);

        circy.run();
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),
};
