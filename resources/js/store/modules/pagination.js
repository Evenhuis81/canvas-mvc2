import {computed, ref} from 'vue';
import {storeModuleFactory} from '../factory/factory';

// Create and export stores based on storeModuleFactory
const basePaginationStore = storeModuleFactory('pagination');

export const paginationStore = {
    state: ref(
        new Map([
            ['perPage', 0],
            ['lastPage', 0],
        ]),
    ),
    getters: {
        ...basePaginationStore.getters,
        byId: id => computed(() => paginationStore.state.value.get(id)),
    },
    setters: {
        ...basePaginationStore.setters,
        by: (by, item) => {
            paginationStore.state.value.set(by, Object.freeze(item));
        },
    },
    actions: basePaginationStore.actions,
};
