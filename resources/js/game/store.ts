// import { ControllerResource, Level, Player } from './types/index.';
import {GameResource} from './types';

const createStore = <T extends object>() => {
    const state = <T>{};

    const set = (items: T) => Object.assign(state, items);

    return {set, state};
};

export const gameStore = createStore<GameResource>();

// export const levelStore = createStore<Level>();

// export const playerStore = createStore<Player>();

// export default null;
