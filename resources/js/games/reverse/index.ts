import {initialize} from 'library/index';
import {createCharacter} from './character';
import {createLevel} from './level';

const libraryID = 'reverse';

const libraryOptions = {
    containerID: `${libraryID}-container`,
    full: true,
    clear: true,
    backgroundColor: '#000',
};

export type ScreenProperties = {
    unitScale: number; // unitLength & unitHeight
};

const screen = {
    unitScale: 0,
};

export default () => {
    const library = initialize(libraryID, libraryOptions);
    const {canvas, context, engine} = library;

    screen.unitScale = canvas.width / 16; //

    const character = createCharacter(libraryID, screen, context, canvas);

    const level = createLevel(context, screen.unitScale);

    engine.setDraw({fn: level.draw});

    engine.setUpdate(character.update);
    engine.setDraw(character.draw);

    library.runEngine();
};
