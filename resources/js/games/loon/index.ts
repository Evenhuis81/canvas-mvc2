import {createStore} from 'games/library/store';
import {setDefaultResource} from 'games/library';
import {setMouseInput} from 'games/library/input';
import type {Resources} from 'games/library/types';

export default {
    setup: () => {
        const {canvas, context, engine, tv} = setDefaultResource();

        resources.set({canvas, context, engine, tv});
        setMouseInput(canvas);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

// find a better place to store the store (?!)
export const resources = createStore<Resources>();
