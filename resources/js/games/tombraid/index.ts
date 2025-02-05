import {initialize} from 'library/index';
// import {mainMenu} from './menu';
import {LibraryOptions} from 'library/types';
import {mainMenu} from './menuT';

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
