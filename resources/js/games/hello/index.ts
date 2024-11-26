import {initialize, resources} from 'library/index';
import {getCircy} from './circy';

const libraryID = 'hello';
const phase = 1;

export default {
    setup: () => {
        initialize(libraryID, {
            containerID: 'hello-container',
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
