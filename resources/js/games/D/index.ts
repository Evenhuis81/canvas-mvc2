import {initialize} from 'library/index';
import type {LibraryOptions} from 'library/types';

const libraryID = 'dam';

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

export default async () => {
    const library = await initialize(libraryID, libraryOptions);

    const {demo} = library;

    demo.start('2d');
    console.log('demo started');

    const stopTimer = 5000;

    setTimeout(() => {
        demo.stop();
        console.log('demo stopped');
    }, stopTimer);
};
