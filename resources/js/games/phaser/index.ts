import {initialize, resources} from 'library/index';
import {getCircy} from './circy';

const libraryID = 'phaser';

export default {
    setup: () => {
        initialize(libraryID, {
            containerID: 'phaser-container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        const circy = getCircy(libraryID);

        circy.run();
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),
};
