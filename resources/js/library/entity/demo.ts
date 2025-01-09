import {LibraryOptions} from 'library/types';
import {initialize} from '..';

const libraryID = 'entity-demo';

export default () => {
    const library = initialize(libraryID, libraryOptions);

    const entity = library.createEntity();

    // const demoEntity = entity.

    return library;
};

const libraryOptions: Partial<LibraryOptions> = {
    containerID: `${libraryID}-container`,
    clear: true,
    full: true,
    backgroundColor: '#000',
    engineStats: true,
};
