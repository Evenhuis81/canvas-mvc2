import {Resources} from './types';

export const createStore = <T extends string, U extends object>() => {
    const state = <Record<T, U>>{};

    const set = (id: T, items: U) => {
        state[id] = items;
        // Object.assign(state, {key: items});
    };

    return {set, state};
};

export const resources = createStore<string, Resources>();
// export const resources = <ID extends string>() => createStore<ID, Resources>();
