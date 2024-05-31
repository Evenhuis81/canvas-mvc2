import {createStore} from 'games/library/store';
import {getDefaultResource} from 'games/library';
import {getPlayer} from './player';
import {setMouseInput} from 'games/library/input';
import type {Resources} from 'games/library/types';

export default {
    setup: () => {
        const {canvas, context, engine, tv, options} = getDefaultResource();
        resources.set({canvas, context, engine, tv});
        setMouseInput(canvas);

        const {setClear, setDot, setGrid} = options;
        setClear();
        setDot();
        setGrid();

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
