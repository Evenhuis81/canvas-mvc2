import {BaseModel} from 'types/index';
import {New, State, Updatable} from './types';
import {computed, ref} from 'vue';
import axios from 'axios';

/**
 * Creates a store module for the given module name.
 */
// eslint-disable-next-line max-lines-per-function
export const storeModuleFactory = <T extends BaseModel>(
    moduleName: string,
    initialState: Map<number, T> = new Map<number, T>(),
) => {
    // @ts-ignore fix state
    const state: State<T> = ref(initialState);

    const getters = {
        /** Get all items from the store */
        all: computed(() => Array.from(state.value.values())),
        /**
         * Get an item from the state by id
         */
        byId: (id: number) => computed(() => state.value.get(id)),
    };
    const setters = {
        /**
         * Set items in the state.
         */
        all: (items: T[]) => {
            for (const item of items) state.value.set(item.id, Object.freeze(item));
        },
        /**
         * Set one specific item in the storage
         */
        byId: (item: T) => {
            state.value.set(item.id, Object.freeze(item));
        },
        by: (by: number, item: T) => {
            state.value.set(by, Object.freeze(item));
        },
        /**
         * Delete one specific item in the storage by id
         */
        deleteById: (id: number) => {
            state.value.delete(id);
        },
        deleteAll: () => {
            state.value.clear();
        },
    };
    const actions = {
        getAll: async () => {
            const {data} = await axios.get(moduleName);
            if (!data) return;
            setters.all(data);
        },
        getById: async (id: number) => {
            const {data} = await axios.get(`${moduleName}/${id}`);
            if (!data) return;
            setters.byId(data);
        },
        create: async (newItem: New<T>) => {
            const {data} = await axios.post(moduleName, newItem);
            if (!data) return;
            setters.byId(data);
        },
        update: async (id: number, item: Updatable<T>) => {
            const {data} = await axios.put(`${moduleName}/${id}`, item);
            if (!data) return;
            setters.byId(data);
        },
        delete: async (id: number) => {
            await axios.delete(`${moduleName}/${id}`);
            setters.deleteById(id);
        },
    };

    return {
        getters,
        setters,
        actions,
    };
};
