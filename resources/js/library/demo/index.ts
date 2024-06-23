import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {setMouseInput} from 'library/input';
import type {ResourcesAndTV} from 'library/types';
import {getButton} from 'library/button/button';

export const resources = createStore<ResourcesAndTV>();

export default {
    setup: () => {
        const {canvas, context, engine, tv} = initialize('demo-container', {
            full: true,
            center: true, // used to remove scrollbar with scaled screen
            backgroundColor: '#000',
        });

        resources.set({canvas, context, engine, tv});

        setMouseInput(canvas);

        const options = getLibraryOptions(context, engine);

        const demoUpdate = {
            id: 666,
            name: 'demo update',
            fn: () => {
                //
            },
        };

        engine.setUpdate(demoUpdate);

        options.setClear();
        // options.setDot();

        const buttonListener = (ev: MouseEvent) => {
            console.log(ev);
        };

        // create seperate module for next part
        const button = getButton(context, {click: buttonListener});

        engine.setShow(button.show);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const startDemo = () => {
    // tv.setScale(vector(scale, scale));
    // tv.setScaleFactor(0.99);
    // tv.setScreenSize(vector(canvas.width, canvas.height));
};
