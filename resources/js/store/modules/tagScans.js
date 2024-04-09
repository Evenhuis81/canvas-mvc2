import {storeModuleFactory} from '../factory/factory';
import axios from 'axios';

// Create and export stores based on storeModuleFactory
export const tagScanStore = storeModuleFactory('/tag_scans');

tagScanStore.actions.getAllByWeek = async date => {
    tagScanStore.setters.deleteAll();
    const {data} = await axios.get(`date/${date}/tag_scans`);
    if (!data) return;
    tagScanStore.setters.all(data);
};
