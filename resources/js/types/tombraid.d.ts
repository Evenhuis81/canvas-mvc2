import {Show, Update} from './game';

export interface PlayerResource {
    player: {
        update: Update;
        show: Show;
    };
}
