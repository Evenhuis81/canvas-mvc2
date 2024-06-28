import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';
import {loadFont} from 'library/font';

type FontsLoaded = FontFace[];

export const resources = createStore<ResourcesAndTV>();

export const fontsLoaded = createStore<FontsLoaded>();

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
