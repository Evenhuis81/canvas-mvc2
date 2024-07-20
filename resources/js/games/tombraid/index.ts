import {createStore} from 'library/store';
import {initialize} from 'library/index';
import type {ResourcesAndTV} from 'library/types';
// import type {LevelResource} from './types/level';
// import type {PlayerResource} from './types/game';
// import type {StatisticsResource} from 'library/types/statistics';
// import {getPlayer} from './player';
import {goToMenu} from './menu';
import {getDetector, loadFont} from 'library/font/font';

export const Resources = createStore<ResourcesAndTV>();
// export const PlayerStore = createStore<PlayerResource>();
// export const LevelStore = createStore<LevelResource>();
// export const Statistics = createStore<StatisticsResource>();

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', {full: true, clear: true, bg: '#000'});

        Resources.set({canvas, context, engine, tv, input});

        goToMenu();
    },
    run: () => Resources.state.engine.run(),
    runOnce: () => Resources.state.engine.runOnce(),
};
