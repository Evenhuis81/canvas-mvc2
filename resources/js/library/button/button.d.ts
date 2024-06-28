import type {Show} from '../types/engine';

export type Button = {
    show: Show;
    getTextProperties: () => {width: number};
};
