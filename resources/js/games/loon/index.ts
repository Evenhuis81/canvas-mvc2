import {createStore} from 'games/library/store';
import {getPlayer} from './player';
import {setDefaultResource} from 'games/library';
import {setMouseInput} from 'games/library/input';
import type {Resources} from 'games/library/types';

export default {
    setup: () => {
        const {canvas, context, engine, tv} = setDefaultResource();

        resources.set({canvas, context, engine, tv});
        setMouseInput(canvas);

        const player = getPlayer(tv);

        engine.setUpdate(player.update);
        engine.setShow(player.show);
    },
    run: () => resources.state.engine.run(),
    runOnce: () => resources.state.engine.runOnce(),
};

// find a better place to store the store (?!)
export const resources = createStore<Resources>();

// abstract and seperate
// enableStatistics();
// setStatistic(() => `elements drawn: ${elementsDrawn.nr}`);
// setStatistic(() => `offsetX: ${properties.offset.x.toFixed(2)}, Y: ${properties.offset.y.toFixed(2)}`);
// setStatistic(() => `scale: ${properties.scale.x.toFixed(2)}`);
// setStatistic(() => `playerX: ${player.pos.x.toFixed(2)}, playerY: ${player.pos.y.toFixed(2)}`);
// setStatistic(() => `velX: ${player.vel.x.toFixed(2)}, velY: ${player.vel.y.toFixed(2)}`);
