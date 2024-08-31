import type {Show} from 'library/types/engine';
import type {TransformedView} from 'library/types/views';
import type {Vector} from 'library/types/vector';

export type MapElement = 'X' | '.' | 'S' | 'C' | 'T';

export type LevelMap = MapElement[][];

export type Levels = {[key: number]: LevelMap};

type CoinMap = number[][];

type BlockType = 'text';

type Block = {
    type: BlockType;
    x: number;
    y: number;
};

interface TextBlock extends Block {
    //
}

export interface LevelResource {
    map: LevelMap;
    // blocks: Block[][];
    coins: CoinMap;
    width: number;
    height: number;
    playerStart: Vector;
    createShow: (levelMap: LevelMap, coins: CoinMap, tv: TransformedView, width: number, height: number) => Show;
}
