import {Show, Update, Vector} from './game';

export interface PlayerResource {
    player: {
        update: Update;
        show: Show;
        addForce: (force: Vector) => void;
    };
}
