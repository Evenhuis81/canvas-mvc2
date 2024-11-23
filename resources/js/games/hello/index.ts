import {initialize, resources} from 'library/index';
import {initiatePhase} from './phase';

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

    start: () => initiatePhase(phase),
};
