import {User} from 'types/index';
import {storeModuleFactory} from '../factory/factory';

// Create and export stores based on storeModuleFactory
export const userStore = storeModuleFactory<User>('users');
