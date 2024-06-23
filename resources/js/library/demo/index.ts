import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';
import buttonModule from './buttonModule';

export const resources = createStore<ResourcesAndTV>();

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

        // const demoUpdate = {
        //     id: 666,
        //     name: 'demo update',
        //     fn: () => {
        //         //
        //     },
        // };

        // engine.setUpdate(demoUpdate);

        options.setClear();
        // options.setDot();

        const buttonModule = await import('./buttonModule');

        console.log(buttonModule);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const startDemo = () => {
    // tv.setScale(vector(scale, scale));
    // tv.setScaleFactor(0.99);
    // tv.setScreenSize(vector(canvas.width, canvas.height));
};
