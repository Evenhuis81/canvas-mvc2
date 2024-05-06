import {Vector} from './game';

type MapElement = 'X' | '.' | 'S' | 'T';

export type Level = MapElement[][];

export type Levels = {[key: number]: Level};

export interface LevelResource {
    map: Level;
    width: number;
    height: number;
    playerStart: Vector;
    show: () => void;
}
