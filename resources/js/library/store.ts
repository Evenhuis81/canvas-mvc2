import {Resources} from './types';

export const createStore = <T extends object>() => {
    const state = <T>{};

    const set = (items: T) => Object.assign(state, items);

    return {set, state};
};

export const resources = createStore<Resources>();
