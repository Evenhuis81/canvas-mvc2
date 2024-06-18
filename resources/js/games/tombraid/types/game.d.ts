import {Show, Update} from 'library/types/engine';
import {Vector} from 'library/types/vector';

export interface PlayerResource {
    update: Update;
    show: Show;
    setPosition: (pos: Vector) => void;
}
