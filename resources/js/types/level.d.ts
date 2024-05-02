import {Vector} from './game';

export type Level = string[][];

export type Levels = {[key: number]: Level};

export interface LevelResource {
    map: Level;
    width: number;
    height: number;
    playerStart: Vector;
    show: () => void;
}
