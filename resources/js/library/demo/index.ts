import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';
import {loadFont} from 'library/font';

type FontsLoaded = FontFace[];

type Buttons = Button[];

export const resources = createStore<ResourcesAndTV>();

export const fontsLoaded = createStore<FontsLoaded>();

export const buttonResources = createStore<Buttons>();

// Create seperate store module, items to add:
// 1. All show/updates (so it's easy for other modules to add/remove those when needed)
// 2. All items related to the current page/game/project

export default {
    setup: async () => {
        const {canvas, context, engine, tv} = initialize('demo-container', {
            full: true,
            center: true, // used to remove scrollbar with scaled screen
            backgroundColor: '#000',
        });

        resources.set({canvas, context, engine, tv});

        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        options.setClear();

        await loadFont('Open Sans', 'OpenSans-VariableFont_wdth,wght.ttf');

        const {default: button} = await import('./buttons');

        button.demo();
    },
    run: () => {
        resources.state.engine.run();
    },
};
