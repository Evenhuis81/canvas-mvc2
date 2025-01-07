import {initialize} from 'library/index';
// import {startDotDemoPhaser} from './demo/dot';
import {startDotDemoPhaser2} from './demo/dot2';
import {LibraryOptions} from 'library/types';

const libraryID = 'phaser';

export default () => {
    const library = initialize(libraryID, libraryOptions);

    startDotDemoPhaser2(library);

    return library;
};

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
    engineStats: true,
};
