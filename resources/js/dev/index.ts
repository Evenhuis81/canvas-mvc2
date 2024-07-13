import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import type {ResourcesAndTV} from 'library/types';

export const devResources = createStore<ResourcesAndTV>();

const options = {
    full: true,
    backgroundColor: '#000',
};

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', options);

        devResources.set({canvas, context, engine, tv, input});

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        libOptions.setDot();
    },
    run: () => devResources.state.engine.run(),
    runOnce: () => devResources.state.engine.runOnce(),
};
