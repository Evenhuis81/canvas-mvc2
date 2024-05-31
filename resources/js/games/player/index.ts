import {createStore} from 'games/library/store';
import {getDefaultResource} from 'games/library';
import {getPlayer} from './player';
import {setMouseInput} from 'games/library/input';
import type {Resources} from 'games/library/types';

export default {
    setup: () => {
        const {canvas, context, engine, tv} = getDefaultResource();

        engine.clearOn(context);
        tv.gridOn(engine, context);
        engine.dotOn(context);

        resources.set({canvas, context, engine, tv});
        setMouseInput(canvas);

        const player = getPlayer();

        const playerShow = player.createShow(tv);
        const playerUpdate = player.createUpdate();

        engine.setUpdate(playerUpdate);
        engine.setShow(playerShow);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

export const resources = createStore<Resources>();
