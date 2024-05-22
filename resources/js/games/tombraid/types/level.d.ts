import type {TransformedView} from 'games/library/types/tv';
import type {Vector} from './game';

export type MapElement = 'X' | '.' | 'S' | 'C';

export type LevelMap = MapElement[][];

export type Levels = {[key: number]: LevelMap};

type CoinMap = number[][];

export interface LevelResource {
    map: LevelMap;
    coins: CoinMap;
    width: number;
    height: number;
    playerStart: Vector;
    createShow: (levelMap: LevelMap, coins: CoinMap, tv: TransformedView) => () => void;
}
