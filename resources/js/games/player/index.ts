import {TransformedView} from 'games/library/types/tv';
import {createStore} from 'games/library/store';
import {getPlayer} from './player';
import {getResources} from 'games/library';
import {getTV} from 'games/library/transformedView';
import {initializeMenu} from 'library/dualview';
// import {setMouseInput} from 'games/library/input';
import type {Resources} from 'games/library/types';

export default {
    setup: (container: HTMLDivElement) => {
        const {canvas, context, engine, options} = getResources();
        const tv = getTV(context);

        resources.set({canvas, context, engine, tv});

        initializeMenu(canvas, container);

        tv.setDefaults(context);

        // setMouseInput(canvas);

        // Each of these also has a remove[name] method, TODO:: refactor to make unique use (?) + import from store
        // Make list of extended use of modules from library (prefer = no interchange)
        const {setClear, setDot} = options;
        setClear();
        setDot();

        const player = getPlayer();

        const playerUpdate = player.createUpdate();
        const playerShow = player.createShow(tv);

        engine.setUpdate(playerUpdate);
        engine.setShow(playerShow);

        const testObject = test(tv);

        engine.setShow(testObject.show);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

const test = (tv: TransformedView) => {
    const show = {
        id: 65,
        name: 'test object',
        fn: () => {
            tv.fillRect({x: 1, y: 1, w: 1, h: 1, fill: 'purple'});
        },
    };

    const update = () => {
        //
    };

    return {show, update};
};

export const resources = createStore<Resources>();
