import type {GameResource, PlayerResource} from 'games/tombraid/types/game';
import type {LevelResource} from './types/level';

const createStore = <T extends object>() => {
    const state = <T>{};

    const set = (items: T) => Object.assign(state, items);

    return {set, state};
};

export const gameStore = createStore<GameResource>();

export const playerStore = createStore<PlayerResource>();

export const levelStore = createStore<LevelResource>();
