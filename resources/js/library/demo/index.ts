import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';

export const resources = createStore<ResourcesAndTV>();

export default {
    setup: () => {
        const {canvas, context, engine, tv} = initialize('demo-container');

        resources.set({canvas, context, engine, tv});

        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        options.setClear();
        options.setDot();
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const startDemo = () => {
    // tv.setScale(vector(scale, scale));
    // tv.setScaleFactor(0.99);
    // tv.setScreenSize(vector(canvas.width, canvas.height));
};
