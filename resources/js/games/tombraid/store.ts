import type {GameResource} from 'games/tombraid/types/game';
// import type {LevelResource} from 'types/level';
import type {PlayerResource} from 'types/tombraid';

const createStore = <T extends object>() => {
    const state = <T>{};

    const set = (items: T) => Object.assign(state, items);

    return {set, state};
};

export const gameStore = createStore<GameResource>();

export const playerStore = createStore<PlayerResource>();

// export const levelStore = createStore<LevelResource>();
