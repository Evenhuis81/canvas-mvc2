import {Card} from 'types/index';
import {storeModuleFactory} from '../factory/factory';
import axios from 'axios';

// Create and export stores based on storeModuleFactory
const baseCardStore = storeModuleFactory<Card>('cards');

export const cardStore = {
    getters: baseCardStore.getters,
    setters: baseCardStore.setters,
    actions: {
        ...baseCardStore.actions,

        getAllByUserId: async (userId: number) => {
            const {data} = await axios.get(`users/${userId}/cards`);
            if (!data) return;
            cardStore.setters.all(data);
        },

        delete: async (cardNum: number) => {
            const {data} = await axios.delete(`cards/${cardNum}`);
            cardStore.setters.deleteById(data.id);
        },
    },
};
