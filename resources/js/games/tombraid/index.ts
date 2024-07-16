import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import {getPlayer} from './player';
import type {LevelResource} from './types/level';
import type {PlayerResource} from './types/game';
import type {ResourcesAndTV} from 'library/types';
import type {StatisticsResource} from 'library/types/statistics';
import {goToMenu} from './menu';

export const Resources = createStore<ResourcesAndTV>();
export const levelStore = createStore<LevelResource>();
export const playerStore = createStore<PlayerResource>();
export const statistics = createStore<StatisticsResource>();

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', {full: true, clear: true, bg: '#000'});

        Resources.set({canvas, context, engine, tv, input});

        // const player = getPlayer();
        // playerStore.set(player);

        goToMenu();
    },
    run: () => Resources.state.engine.run(),
    runOnce: () => Resources.state.engine.runOnce(),
};
