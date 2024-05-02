import {GameResource} from '../types/game';

const createStore = <T extends object>() => {
    const state = <T>{};

    const set = (items: T) => Object.assign(state, items);

    return {set, state};
};

export const gameStore = createStore<GameResource>();
