import {initialize} from 'library/index';
import {mainMenu} from './menu';
import type {LibraryOptions} from 'library/types';

const libraryID = 'tr';

export default () => {
    const library = initialize(libraryID, libraryOptions);

    library.runEngine();

    mainMenu(library);
};

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};
