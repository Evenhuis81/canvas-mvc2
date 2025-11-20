import {EngineUpdate} from 'library/types/engine';
import {initialize} from 'library/index';
import type {LibraryOptions} from 'library/types';

const libraryID = 'dam';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

export default () => {
    // const library = await initialize(libraryID, libraryOptions);
    const library = initialize(libraryID, libraryOptions);

    // const {sv} = library.views;

    const {engine} = library;

    const damUpdate: EngineUpdate = {
        id: Symbol(),
        fn: () => {
            console.log('d');
        },
    };

    engine.setUpdate(damUpdate);

    engine.runOnce();
};

// const {demo2d} = library;

// demo2d.start();

// console.log('demo started');

// const stopTimer = 5000;

// setTimeout(() => {
//     demo.stop();
//     console.log('demo stopped');
// }, stopTimer);
