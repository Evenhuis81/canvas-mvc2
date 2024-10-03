type MapElement = 'X' | '.' | 'S' | 'C' | 'T';

type LevelMap = MapElement[][];

type Levels = {[key: number]: LevelMap};

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

interface LevelResource {
    map: LevelMap;
    // blocks: Block[][];
    coins: CoinMap;
    width: number;
    height: number;
    playerStart: Vector;
    createShow: (levelMap: LevelMap, coins: CoinMap, tv: TransformedView, width: number, height: number) => Draw;
}
