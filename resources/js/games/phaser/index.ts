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
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),

    start: () => {
        const circy = getCircy();

        circy.start();
    },
};
