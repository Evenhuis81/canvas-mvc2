import {initialize} from 'library/index';
import {createCharacter} from './character';

const libraryID = 'reverse';

const libraryOptions = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

export default () => {
    const library = initialize(libraryID, libraryOptions);

    const {canvas, context, engine} = library;

    const character = createCharacter(libraryID, context, canvas);

    engine.setDraw(character.draw);
    engine.setUpdate(character.update);

    library.runEngine();
};
